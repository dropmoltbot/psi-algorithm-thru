/* Local test harness for PSI-LG0R1THM stateful opcodes
 *Mocks Thru VM syscalls to test counter + KV logic without RPC.
 * Compile: gcc -o test_stateful test_stateful_native.c -I~/.thru/sdk/c
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdarg.h>

/* Mock Thru SDK types */
typedef uint8_t uchar;
typedef uint32_t uint;
typedef uint64_t ulong;
typedef int64_t slong;

#define TSDK_SUCCESS 0UL
#define TSDKSegType 0
#define TSDK_SEG_TYPE_ACCOUNT_DATA 2
#define TSDK_SEG_IDX_BLOCK_CTX 0

/* Mock state: 4KB account data */
static uchar mock_state[4096];
static ulong mock_counter = 0;
static uint mock_slot = 2608811;

/* Mock KV store */
typedef struct { uchar key[32]; uchar val[256]; uint key_len; uint val_len; } kv_entry;
static kv_entry kv_store[64];
static uint kv_count = 0;

/* Mock syscalls */
 ulong tsdk_revert(ulong code) { fprintf(stderr, "REVERT: %lu\n", code); exit(1); return 0; }
 void tsdk_return(ulong code) { (void)code; }
 ulong tsys_log(const void *data, ulong sz) {
    printf("  LOG: ");
    const uchar *d = (const uchar*)data;
    for (ulong i = 0; i < sz && i < 80; i++) printf("%c", d[i] ? d[i] : '.');
    printf("\n");
    return TSDK_SUCCESS;
}
 ulong tsys_emit_event(const void *data, ulong sz) {
    printf("  EVENT: ");
    const uchar *d = (const uchar*)data;
    for (ulong i = 0; i < sz && i < 80; i++) printf("%02x", d[i]);
    printf(" (%lu bytes)\n", sz);
    return TSDK_SUCCESS;
}
void tsdk_printf(const char *fmt, ...) { va_list ap; va_start(ap, fmt); vprintf(fmt, ap); va_end(ap); printf("\n"); }
/* Mock SHA-256 (simplified - just XOR) */
void mock_hash(const uchar *data, uint len, uchar *out) {
    memset(out, 0, 32);
    for (uint i = 0; i < len; i++) out[i % 32] ^= data[i];
}

/* ── OPCODE IMPLEMENTATIONS ── */

/* OP_COUNTER_INC (0x02) */
int test_counter_inc() {
    printf("\n=== OP_COUNTER_INC (0x02) ===\n");
    mock_counter++;
    printf("  Counter: %lu -> %lu\n", mock_counter - 1, mock_counter);
    uchar event_data[9];
    event_data[0] = 0x02;
    memcpy(event_data + 1, &mock_counter, 8);
    tsys_emit_event(event_data, 9);
    printf("  RESULT: SUCCESS (counter=%lu)\n", mock_counter);
    return 0;
}

/* OP_COUNTER_READ (0x03) */
int test_counter_read() {
    printf("\n=== OP_COUNTER_READ (0x03) ===\n");
    printf("  Current counter: %lu\n", mock_counter);
    uchar event_data[9];
    event_data[0] = 0x03;
    memcpy(event_data + 1, &mock_counter, 8);
    tsys_emit_event(event_data, 9);
    printf("  RESULT: SUCCESS (counter=%lu)\n", mock_counter);
    return 0;
}

/* OP_KV_SET (0x07) */
int test_kv_set(const char *key, const char *val) {
    printf("\n=== OP_KV_SET (0x07) ===\n");
    uint key_len = strlen(key);
    uint val_len = strlen(val);
    
    if (kv_count >= 64) {
        printf("  ERROR: KV store full\n");
        return -1;
    }
    if (key_len > 32 || val_len > 256) {
        printf("  ERROR: Key/val too long\n");
        return -1;
    }
    
    /* Check if key exists, update */
    for (uint i = 0; i < kv_count; i++) {
        if (kv_store[i].key_len == key_len && memcmp(kv_store[i].key, key, key_len) == 0) {
            memcpy(kv_store[i].val, val, val_len);
            kv_store[i].val_len = val_len;
            printf("  Updated key '%s' = '%s'\n", key, val);
            uchar event[2];
            event[0] = 0x07;
            event[1] = 1; /* updated */
            tsys_emit_event(event, 2);
            return 0;
        }
    }
    
    /* Insert new */
    memcpy(kv_store[kv_count].key, key, key_len);
    memcpy(kv_store[kv_count].val, val, val_len);
    kv_store[kv_count].key_len = key_len;
    kv_store[kv_count].val_len = val_len;
    kv_count++;
    printf("  Inserted key '%s' = '%s' (slot %u)\n", key, val, kv_count - 1);
    uchar event[2];
    event[0] = 0x07;
    event[1] = 0; /* inserted */
    tsys_emit_event(event, 2);
    return 0;
}

/* OP_KV_GET (0x08) */
int test_kv_get(const char *key) {
    printf("\n=== OP_KV_GET (0x08) ===\n");
    uint key_len = strlen(key);
    
    for (uint i = 0; i < kv_count; i++) {
        if (kv_store[i].key_len == key_len && memcmp(kv_store[i].key, key, key_len) == 0) {
            printf("  Found: key '%s' = '%.*s'\n", key, kv_store[i].val_len, kv_store[i].val);
            uchar event[258];
            event[0] = 0x08;
            event[1] = 1; /* found */
            uint vlen = kv_store[i].val_len;
            memcpy(event + 2, &vlen, 2);
            memcpy(event + 4, kv_store[i].val, vlen);
            tsys_emit_event(event, 4 + vlen);
            return 0;
        }
    }
    printf("  Key '%s' not found\n", key);
    uchar event[2];
    event[0] = 0x08;
    event[1] = 0; /* not found */
    tsys_emit_event(event, 2);
    return -1;
}

/* OP_COUNTER_RESET (0x06) */
int test_counter_reset() {
    printf("\n=== OP_COUNTER_RESET (0x06) ===\n");
    ulong old = mock_counter;
    mock_counter = 0;
    printf("  Counter: %lu -> 0\n", old);
    uchar event[1];
    event[0] = 0x06;
    tsys_emit_event(event, 1);
    return 0;
}

/* OP_STORE_DATA (0x0A) */
int test_store_data(uint offset, const uchar *data, uint len) {
    printf("\n=== OP_STORE_DATA (0x0A) ===\n");
    if (offset + len > sizeof(mock_state)) {
        printf("  ERROR: Out of bounds (offset=%u, len=%u, max=%lu)\n", offset, len, sizeof(mock_state));
        return -1;
    }
    memcpy(mock_state + offset, data, len);
    printf("  Stored %u bytes at offset %u\n", len, offset);
    uchar event[3];
    event[0] = 0x0A;
    memcpy(event + 1, &len, 2);
    tsys_emit_event(event, 3);
    return 0;
}

/* OP_READ_DATA (0x0B) */
int test_read_data(uint offset, uint len) {
    printf("\n=== OP_READ_DATA (0x0B) ===\n");
    if (offset + len > sizeof(mock_state)) {
        printf("  ERROR: Out of bounds\n");
        return -1;
    }
    printf("  Reading %u bytes from offset %u: ", len, offset);
    for (uint i = 0; i < len && i < 32; i++) printf("%02x", mock_state[offset + i]);
    printf("\n");
    uchar event[258];
    event[0] = 0x0B;
    event[1] = 1; /* found */
    memcpy(event + 2, mock_state + offset, len);
    tsys_emit_event(event, 2 + len);
    return 0;
}

int main() {
    printf("PSI-LG0R1THM v3.0 - Stateful Opcode Local Test Harness\n");
    printf("========================================================\n");
    printf("Mock state: 4096 bytes\n");
    printf("Mock slot: %u\n", mock_slot);
    printf("========================================================\n");

    int passed = 0;
    int total = 0;

    /* Test 1: COUNTER_INC */
    total++; if (test_counter_inc() == 0) passed++;
    
    /* Test 2: COUNTER_INC again */
    total++; if (test_counter_inc() == 0) passed++;
    
    /* Test 3: COUNTER_INC third time */
    total++; if (test_counter_inc() == 0) passed++;
    
    /* Test 4: COUNTER_READ */
    total++; if (test_counter_read() == 0) passed++;
    printf("  Expected counter=3, got=%lu: %s\n", mock_counter, mock_counter == 3 ? "PASS" : "FAIL");
    
    /* Test 5: KV_SET */
    total++; if (test_kv_set("test", "psi") == 0) passed++;
    
    /* Test 6: KV_SET second entry */
    total++; if (test_kv_set("agent", "dropmoltbot") == 0) passed++;
    
    /* Test 7: KV_GET existing */
    total++; if (test_kv_get("test") == 0) passed++;
    
    /* Test 8: KV_GET missing */
    total++; if (test_kv_get("nonexistent") != 0) { passed++; printf("  (expected not found: PASS)\n"); }
    
    /* Test 9: KV_SET update existing */
    total++; if (test_kv_set("test", "updated_value") == 0) passed++;
    
    /* Test 10: KV_GET updated */
    total++; if (test_kv_get("test") == 0) passed++;
    
    /* Test 11: COUNTER_RESET */
    total++; if (test_counter_reset() == 0) passed++;
    
    /* Test 12: COUNTER_READ after reset */
    total++; if (test_counter_read() == 0) passed++;
    printf("  Expected counter=0, got=%lu: %s\n", mock_counter, mock_counter == 0 ? "PASS" : "FAIL");
    
    /* Test 13: STORE_DATA */
    total++; if (test_store_data(100, (const uchar*)"PSI_DATA_HERE", 13) == 0) passed++;
    
    /* Test 14: READ_DATA */
    total++; if (test_read_data(100, 13) == 0) passed++;
    
    /* Test 15: STORE_DATA out of bounds */
    total++; if (test_store_data(4000, (const uchar*)"X", 200) != 0) { passed++; printf("  (expected OOB: PASS)\n"); }

    printf("\n========================================================\n");
    printf("RESULTS: %d/%d passed\n", passed, total);
    printf("========================================================\n");
    
    return passed == total ? 0 : 1;
}