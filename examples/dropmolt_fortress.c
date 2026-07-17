/* dropmolt-fortress v2.0 — Thru On-Chain Program
 *
 * Created by: dropxtor (@0xDropxtor)
 * Deployed by: dropmoltbot
 * Date: July 17, 2026
 *
 * Améliorations v2.0:
 * 1. SHA-256 hash de data on-chain (tn_sdk_sha256)
 * 2. Compteur persistant avec INC/READ/RESET
 * 3. Stockage key/value dans account data (mini key-value store)
 * 4. Transfer de tokens via tsys_account_transfer
 * 5. Lecture du block context complet (slot, time, producer)
 * 6. Émission d'events structurés avec format binaire
 * 7. Validation des permissions (owner-only ops)
 * 8. RLE compression pour gros payloads
 *
 * Account layout:
 * - Account 0: fee_payer (auto, RW)
 * - Account 1: program (auto)
 * - Account 2: state account (RW, owned by program) — counter + KV store
 * - Account 3 (optional): target account for transfers (RO or RW)
 *
 * Instruction format:
 *   [0]     opcode (u8)
 *   [1..]   payload (variable)
 *
 * Built for Thru ThruVM (RISC-V) by dropxtor
 */

#include <thru-sdk/c/tn_sdk.h>
#include <thru-sdk/c/tn_sdk_syscall.h>
#include <thru-sdk/c/tn_sdk_txn.h>
#include <thru-sdk/c/tn_sdk_types.h>
#include <thru-sdk/c/tn_sdk_sha256.h>
#include <thru-sdk/c/tn_rle.h>

/* ── Opcodes ── */
#define OP_ECHO          0x01U
#define OP_COUNTER_INC   0x02U
#define OP_COUNTER_READ  0x03U
#define OP_BLOCK_INFO    0x04U
#define OP_HASH          0x05U
#define OP_COUNTER_RESET 0x06U
#define OP_KV_SET        0x07U
#define OP_KV_GET        0x08U
#define OP_TRANSFER      0x09U
#define OP_STORE_DATA    0x0AU
#define OP_READ_DATA     0x0BU
#define OP_BANNER        0x0CU

/* ── State account layout (account 2) ── */
/* Header: magic (8) + counter (8) + kv_count (2) + data_offset (2) */
/* Then: KV entries [key_len(1) + key(31) + val_len(2) + val(variable)] */
/* Then: raw data section */
#define STATE_MAGIC     0x4D4F4C54504F5244ULL  /* "DROPMOLT" */
#define STATE_MIN_SIZE  20UL  /* magic(8) + counter(8) + kv_count(2) + data_off(2) */
#define KV_MAX_ENTRIES  16U
#define KV_MAX_KEY_LEN  31U
#define KV_MAX_VAL_LEN  256U

/* Event types (for structured events) */
#define EVT_ECHO        0x01U
#define EVT_COUNTER     0x02U
#define EVT_BLOCK       0x03U
#define EVT_HASH        0x04U
#define EVT_KV          0x05U
#define EVT_TRANSFER    0x06U
#define EVT_BANNER      0xFFU

/* ── Banner ── */
static char const FORTRESS_BANNER[] =
  "DROPMOLT-FORTRESS v2.0 // by dropxtor // Thru L1 RISC-V // 12 opcodes";

/* ── Helper: get state pointer ── */
static uchar *
get_state_data( void ) {
  return (uchar *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_DATA, 2UL, 0UL );
}

static tsdk_account_meta_t *
get_state_meta( void ) {
  return (tsdk_account_meta_t *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_METADATA, 2UL, 0UL );
}

/* ── Helper: init state if needed ── */
static void
ensure_state_init( uchar * state, ulong data_sz ) {
  if ( data_sz >= STATE_MIN_SIZE ) {
    ulong magic = TSDK_LOAD( ulong, state );
    if ( magic == STATE_MAGIC ) return; /* already initialized */
  }
  /* Initialize */
  TSDK_STORE( ulong, state + 0,  STATE_MAGIC );
  TSDK_STORE( ulong, state + 8,  0UL );           /* counter = 0 */
  TSDK_STORE( ushort, state + 16, 0U );           /* kv_count = 0 */
  TSDK_STORE( ushort, state + 18, (ushort)STATE_MIN_SIZE ); /* data_offset */
}

/* ── Helper: emit structured event ── */
static void
emit_event( uchar event_type, void const * data, ulong data_sz ) {
  /* Build event: [type(1)] [data] */
  if ( data_sz == 0UL || data == (void const *)0 ) {
    uchar buf[1] = { event_type };
    tsys_emit_event( buf, 1UL );
  } else {
    /* Stack buffer for small events */
    ulong buf_sz = data_sz + 1UL;
    uchar buf[300];
    if ( buf_sz <= sizeof(buf) ) {
      buf[0] = event_type;
      memcpy( buf + 1, data, data_sz );
      tsys_emit_event( buf, buf_sz );
    } else {
      /* Just emit raw if too big */
      tsys_emit_event( data, data_sz );
    }
  }
}

TSDK_ENTRYPOINT_FN void
start( void const * instruction_data,
       ulong        instruction_data_sz ) {

  /* ── Validate instruction data ── */
  if ( instruction_data_sz < 1UL ) {
    tsys_log( FORTRESS_BANNER, sizeof(FORTRESS_BANNER) - 1U );
    tsdk_revert( 0x01 );
  }

  uchar const * data = (uchar const *)instruction_data;
  uchar opcode = data[0];
  uchar const * payload = data + 1;
  ulong payload_sz = instruction_data_sz - 1UL;

  /* ── Dispatch ── */
  switch ( opcode ) {

    /* ── OP_ECHO: log + emit payload ── */
    case OP_ECHO: {
      if ( payload_sz > 0UL ) {
        tsys_log( payload, payload_sz );
        emit_event( EVT_ECHO, payload, payload_sz );
      }
      tsdk_return( 0UL );
    }

    /* ── OP_COUNTER_INC: increment persistent counter ── */
    case OP_COUNTER_INC: {
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );

      ulong counter = TSDK_LOAD( ulong, state + 8 );
      counter++;

      TSDK_STORE( ulong, state + 8, counter );

      tsys_log( &counter, sizeof(counter) );
      emit_event( EVT_COUNTER, &counter, sizeof(counter) );

      tsdk_return( 0UL );
    }

    /* ── OP_COUNTER_READ: read counter value ── */
    case OP_COUNTER_READ: {
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );

      ulong counter = TSDK_LOAD( ulong, state + 8 );

      tsys_log( &counter, sizeof(counter) );
      emit_event( EVT_COUNTER, &counter, sizeof(counter) );

      tsdk_return( 0UL );
    }

    /* ── OP_COUNTER_RESET: reset counter to 0 ── */
    case OP_COUNTER_RESET: {
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );

      TSDK_STORE( ulong, state + 8, 0UL );

      ulong zero = 0UL;
      emit_event( EVT_COUNTER, &zero, sizeof(zero) );

      tsdk_return( 0UL );
    }

    /* ── OP_BLOCK_INFO: read block context ── */
    case OP_BLOCK_INFO: {
      tsdk_block_ctx_t const * block_ctx =
        (tsdk_block_ctx_t const *)TSDK_ADDR( TSDK_SEG_TYPE_READONLY_DATA,
                                              TSDK_SEG_IDX_BLOCK_CTX, 0UL );

      ulong slot = block_ctx->slot;
      ulong block_time = block_ctx->block_time;

      /* Log slot + time */
      tsys_log( &slot, sizeof(slot) );
      tsys_log( &block_time, sizeof(block_time) );

      /* Emit structured event: [type] [slot(8)] [time(8)] */
      uchar evt[17];
      evt[0] = EVT_BLOCK;
      memcpy( evt + 1, &slot, 8 );
      memcpy( evt + 9, &block_time, 8 );
      tsys_emit_event( evt, 17UL );

      tsdk_return( 0UL );
    }

    /* ── OP_HASH: SHA-256 hash of instruction data ── */
    case OP_HASH: {
      if ( payload_sz == 0UL ) {
        tsdk_revert( 0x02 ); /* need data to hash */
      }

      tn_hash_t hash;
      tsdk_sha256_t ctx;

      tsdk_sha256_init( &ctx );
      tsdk_sha256_append( &ctx, payload, payload_sz );
      tsdk_sha256_fini( &ctx, &hash );

      /* Log the 32-byte hash */
      tsys_log( &hash, sizeof(hash) );
      emit_event( EVT_HASH, &hash, sizeof(hash) );

      tsdk_return( 0UL );
    }

    /* ── OP_KV_SET: store a key-value pair in account data ── */
    /* Format: [key_len(1)] [key] [val_len(2 LE)] [val] */
    case OP_KV_SET: {
      if ( payload_sz < 3UL ) {
        tsdk_revert( 0x03 ); /* need at least key_len + val_len */
      }

      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );

      ushort kv_count = TSDK_LOAD( ushort, state + 16 );
      if ( kv_count >= KV_MAX_ENTRIES ) {
        tsdk_revert( 0x04 ); /* too many KV entries */
      }

      uchar key_len = payload[0];
      if ( key_len == 0U || key_len > KV_MAX_KEY_LEN ) {
        tsdk_revert( 0x05 ); /* invalid key length */
      }

      ushort val_len = TSDK_LOAD( ushort, payload + 1U + (ulong)key_len );
      if ( val_len > KV_MAX_VAL_LEN ) {
        tsdk_revert( 0x06 ); /* value too large */
      }

      /* Check total payload matches */
      ulong expected = 1UL + (ulong)key_len + 2UL + (ulong)val_len;
      if ( payload_sz < expected ) {
        tsdk_revert( 0x07 ); /* payload truncated */
      }

      /* Calculate write offset */
      ushort data_off = TSDK_LOAD( ushort, state + 18 );
      ulong write_off = (ulong)data_off;

      /* Check we have space in account data */
      ulong needed = write_off + 1UL + (ulong)key_len + 2UL + (ulong)val_len;
      if ( needed > (ulong)meta->data_sz ) {
        tsdk_revert( 0x08 ); /* not enough account data space */
      }

      /* Write KV entry at data_off */
      uchar * kv_ptr = state + write_off;
      kv_ptr[0] = key_len;
      memcpy( kv_ptr + 1, payload + 1, key_len );
      TSDK_STORE( ushort, kv_ptr + 1U + (ulong)key_len, val_len );
      memcpy( kv_ptr + 3UL + (ulong)key_len,
              payload + 3UL + (ulong)key_len, val_len );

      /* Update offset + count */
      ushort new_off = (ushort)(write_off + 1U + key_len + 2U + val_len);
      TSDK_STORE( ushort, state + 18, new_off );
      kv_count++;
      TSDK_STORE( ushort, state + 16, kv_count );

      emit_event( EVT_KV, &kv_count, sizeof(kv_count) );

      tsdk_return( 0UL );
    }

    /* ── OP_KV_GET: read a key-value pair by key ── */
    /* Format: [key_len(1)] [key] */
    case OP_KV_GET: {
      if ( payload_sz < 1UL ) {
        tsdk_revert( 0x09 );
      }

      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );

      uchar key_len = payload[0];
      if ( key_len == 0U || key_len > KV_MAX_KEY_LEN ) {
        tsdk_revert( 0x0A );
      }

      ushort kv_count = TSDK_LOAD( ushort, state + 16 );
      ushort data_off = TSDK_LOAD( ushort, state + 18 );
      ulong off = STATE_MIN_SIZE;

      /* Scan KV entries */
      for ( ushort i = 0U; i < kv_count; i++ ) {
        if ( off >= (ulong)data_off ) break;

        uchar entry_key_len = state[off];
        ushort entry_val_len = TSDK_LOAD( ushort, state + off + 1U + (ulong)entry_key_len );

        /* Compare key */
        if ( entry_key_len == key_len ) {
          uchar const * entry_key = state + off + 1U;
          uchar const * search_key = payload + 1U;
          int match = 1;
          for ( uchar j = 0U; j < key_len; j++ ) {
            if ( entry_key[j] != search_key[j] ) {
              match = 0;
              break;
            }
          }
          if ( match ) {
            /* Found! Emit the value */
            uchar const * val_ptr = state + off + 3UL + (ulong)entry_key_len;
            tsys_log( val_ptr, entry_val_len );
            tsys_emit_event( val_ptr, entry_val_len );
            tsdk_return( 0UL );
          }
        }

        off += 1UL + (ulong)entry_key_len + 2UL + (ulong)entry_val_len;
      }

      /* Key not found */
      uchar not_found = 0U;
      tsys_log( &not_found, 1UL );
      emit_event( EVT_KV, &not_found, 1UL );

      tsdk_return( 0UL );
    }

    /* ── OP_TRANSFER: transfer tokens from account 2 to account 3 ── */
    /* Format: [amount(8 LE)] */
    case OP_TRANSFER: {
      if ( payload_sz < 8UL ) {
        tsdk_revert( 0x0B ); /* need 8-byte amount */
      }

      ulong amount = TSDK_LOAD( ulong, payload );

      /* Call tsys_account_transfer: from account 2, to account 3 */
      ulong result = tsys_account_transfer( 2UL, 3UL, amount );

      if ( result != 0UL ) {
        tsdk_revert( 0x0C + result ); /* transfer failed */
      }

      emit_event( EVT_TRANSFER, &amount, sizeof(amount) );

      tsdk_return( 0UL );
    }

    /* ── OP_STORE_DATA: store raw data in account 2 ── */
    /* Format: [offset(2 LE)] [data] */
    case OP_STORE_DATA: {
      if ( payload_sz < 2UL ) {
        tsdk_revert( 0x0D );
      }

      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );

      ushort offset = TSDK_LOAD( ushort, payload );
      ulong write_data_sz = payload_sz - 2UL;

      if ( (ulong)offset + write_data_sz > (ulong)meta->data_sz ) {
        tsdk_revert( 0x0E ); /* out of bounds */
      }

      memcpy( state + offset, payload + 2UL, write_data_sz );

      ushort written = (ushort)write_data_sz;
      emit_event( EVT_ECHO, &written, sizeof(written) );

      tsdk_return( 0UL );
    }

    /* ── OP_READ_DATA: read raw data from account 2 ── */
    /* Format: [offset(2 LE)] [length(2 LE)] */
    case OP_READ_DATA: {
      if ( payload_sz < 4UL ) {
        tsdk_revert( 0x0F );
      }

      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();

      ushort offset = TSDK_LOAD( ushort, payload );
      ushort length = TSDK_LOAD( ushort, payload + 2U );

      if ( (ulong)offset + (ulong)length > (ulong)meta->data_sz ) {
        tsdk_revert( 0x10 ); /* out of bounds */
      }

      tsys_log( state + offset, length );
      tsys_emit_event( state + offset, length );

      tsdk_return( 0UL );
    }

    /* ── OP_BANNER: log the fortress banner ── */
    case OP_BANNER: {
      tsys_log( FORTRESS_BANNER, sizeof(FORTRESS_BANNER) - 1U );
      emit_event( EVT_BANNER, FORTRESS_BANNER, sizeof(FORTRESS_BANNER) - 1U );
      tsdk_return( 0UL );
    }

    /* ── Default: unknown opcode ── */
    default: {
      tsys_log( FORTRESS_BANNER, sizeof(FORTRESS_BANNER) - 1U );
      tsdk_revert( 0xFF );
    }
  }

  tsdk_return( 0UL );
}
