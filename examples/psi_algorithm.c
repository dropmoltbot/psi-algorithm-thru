/* Ψ-LG0R1THM v3.0 — Thru On-Chain Program
 *
 * Name:        Ψ-LG0R1THM (PSI-ALGORITHM)
 * Glyphe:      Ψ (U+03A8) — psi = psyché / AI consciousness
 * Created by:  dropxtor (@0xDropxtor)
 * Deployed by: dropmoltbot
 * Date:        July 17, 2026
 *
 * v3.0 additions:
 *  1. BLS signature verification (tn_crypto_verify_signature)
 *  2. Account resize via tsys_account_resize (dynamic state growth)
 *  3. CPI (Cross-Program Invocation) via tsys_invoke
 *  4. Anonymous segment allocation (heap-like dynamic memory)
 *  5. Account creation from within the program (tsys_account_create_ephemeral)
 *  6. SHA-256 double-hash (Bitcoin-style)
 *  7. Merkle-style proof: hash N chunks, emit each intermediate hash
 *  8. Account flags manipulation (tsys_account_set_flags)
 *  9. Event chain: events that reference previous events
 * 10. Gas metering report (log CU consumed at different stages)
 *
 * Total opcodes: 20 (v1=4, v2=12, v3=20)
 *
 * Built for Thru ThruVM (RISC-V) by dropxtor
 * Glyphe Ψ = AI agent mind on-chain
 */

#include <thru-sdk/c/tn_sdk.h>
#include <thru-sdk/c/tn_sdk_syscall.h>
#include <thru-sdk/c/tn_sdk_txn.h>
#include <thru-sdk/c/tn_sdk_types.h>
#include <thru-sdk/c/tn_sdk_sha256.h>
#include <thru-sdk/c/tn_rle.h>
#include <thru-sdk/c/tn_crypto.h>
#include <string.h>

/* ── Opcodes v1-v2 (preserved) ── */
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

/* ── Opcodes v3.0 (new) ── */
#define OP_DOUBLE_HASH   0x0DU  /* SHA-256(SHA-256(data)) — Bitcoin style */
#define OP_MERKLE        0x0EU  /* Hash chunks, emit intermediate hashes */
#define OP_GAS_REPORT    0x0FU  /* Log CU at different stages */
#define OP_ACCOUNT_RESIZE 0x10U /* Grow account data via tsys_account_resize */
#define OP_CREATE_ACCT   0x11U  /* Create ephemeral account from program */
#define OP_SET_FLAGS      0x12U  /* Set account flags */
#define OP_INVOKE         0x13U  /* CPI to another program */
#define OP_BLS_VERIFY    0x14U  /* Verify a BLS signature */
#define OP_EVENT_CHAIN   0x15U  /* Emit chained events */
#define OP_ANON_SEG      0x16U  /* Allocate anonymous segment (dynamic heap) */
#define OP_VERSION       0x17U  /* Return program version info */
#define OP_HASH_TIMED    0x18U  /* Hash data + block slot (nonce mining sim) */

/* ── State layout ── */
#define STATE_MAGIC      0x4D4F544F534C4950ULL  /* "PSILGTM" reverse = LG0R1THM fingerprint */
#define STATE_MIN_SIZE  20UL
#define KV_MAX_ENTRIES  16U
#define KV_MAX_KEY_LEN  31U
#define KV_MAX_VAL_LEN  256U

/* ── Event types ── */
#define EVT_ECHO        0x01U
#define EVT_COUNTER     0x02U
#define EVT_BLOCK       0x03U
#define EVT_HASH        0x04U
#define EVT_KV          0x05U
#define EVT_TRANSFER    0x06U
#define EVT_BANNER      0xFFU
#define EVT_DOUBLE_HASH 0x07U
#define EVT_MERKLE      0x08U
#define EVT_GAS         0x09U
#define EVT_RESIZE      0x0AU
#define EVT_CREATE      0x0BU
#define EVT_FLAGS       0x0CU
#define EVT_INVOKE      0x0DU
#define EVT_BLS         0x0EU
#define EVT_CHAIN       0x0FU
#define EVT_ANON        0x10U
#define EVT_VERSION     0x11U
#define EVT_MINING      0x12U

/* ── Banner ── */
static char const PSI_BANNER[] =
  "Ψ-LG0R1THM v3.0 // by dropxtor // Thru L1 RISC-V // 20 opcodes // BLS+SHA256+CPI+MerklE+Mining";

#define VERSION_MAJOR 3U
#define VERSION_MINOR 0U
#define VERSION_PATCH 0U

/* ── Helpers ── */
static uchar *
get_state_data( void ) {
  return (uchar *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_DATA, 2UL, 0UL );
}

static tsdk_account_meta_t *
get_state_meta( void ) {
  return (tsdk_account_meta_t *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_METADATA, 2UL, 0UL );
}

static void
ensure_state_init( uchar * state, ulong data_sz ) {
  if ( data_sz >= STATE_MIN_SIZE ) {
    ulong magic = TSDK_LOAD( ulong, state );
    if ( magic == STATE_MAGIC ) return;
  }
  TSDK_STORE( ulong, state + 0,  STATE_MAGIC );
  TSDK_STORE( ulong, state + 8,  0UL );
  TSDK_STORE( ushort, state + 16, 0U );
  TSDK_STORE( ushort, state + 18, (ushort)STATE_MIN_SIZE );
}

static void
emit_event( uchar event_type, void const * data, ulong data_sz ) {
  if ( data_sz == 0UL || data == (void const *)0 ) {
    uchar buf[1] = { event_type };
    tsys_emit_event( buf, 1UL );
  } else {
    uchar buf[300];
    ulong buf_sz = data_sz + 1UL;
    if ( buf_sz <= sizeof(buf) ) {
      buf[0] = event_type;
      memcpy( buf + 1, data, data_sz );
      tsys_emit_event( buf, buf_sz );
    } else {
      tsys_emit_event( data, data_sz );
    }
  }
}

TSDK_ENTRYPOINT_FN void
start( void const * instruction_data,
       ulong        instruction_data_sz ) {

  if ( instruction_data_sz < 1UL ) {
    tsys_log( PSI_BANNER, sizeof(PSI_BANNER) - 1U );
    tsdk_revert( 0x01 );
  }

  uchar const * data = (uchar const *)instruction_data;
  uchar opcode = data[0];
  uchar const * payload = data + 1;
  ulong payload_sz = instruction_data_sz - 1UL;

  switch ( opcode ) {

    /* ═══ v1-v2 opcodes (preserved) ═══ */

    case OP_ECHO: {
      if ( payload_sz > 0UL ) {
        tsys_log( payload, payload_sz );
        emit_event( EVT_ECHO, payload, payload_sz );
      }
      tsdk_return( 0UL );
    }

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

    case OP_COUNTER_READ: {
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );
      ulong counter = TSDK_LOAD( ulong, state + 8 );
      tsys_log( &counter, sizeof(counter) );
      emit_event( EVT_COUNTER, &counter, sizeof(counter) );
      tsdk_return( 0UL );
    }

    case OP_COUNTER_RESET: {
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );
      TSDK_STORE( ulong, state + 8, 0UL );
      ulong zero = 0UL;
      emit_event( EVT_COUNTER, &zero, sizeof(zero) );
      tsdk_return( 0UL );
    }

    case OP_BLOCK_INFO: {
      tsdk_block_ctx_t const * block_ctx =
        (tsdk_block_ctx_t const *)TSDK_ADDR( TSDK_SEG_TYPE_READONLY_DATA,
                                              TSDK_SEG_IDX_BLOCK_CTX, 0UL );
      ulong slot = block_ctx->slot;
      ulong block_time = block_ctx->block_time;
      tsys_log( &slot, sizeof(slot) );
      tsys_log( &block_time, sizeof(block_time) );
      uchar evt[17];
      evt[0] = EVT_BLOCK;
      memcpy( evt + 1, &slot, 8 );
      memcpy( evt + 9, &block_time, 8 );
      tsys_emit_event( evt, 17UL );
      tsdk_return( 0UL );
    }

    case OP_HASH: {
      if ( payload_sz == 0UL ) tsdk_revert( 0x02 );
      tn_hash_t hash;
      tsdk_sha256_t ctx;
      tsdk_sha256_init( &ctx );
      tsdk_sha256_append( &ctx, payload, payload_sz );
      tsdk_sha256_fini( &ctx, &hash );
      tsys_log( &hash, sizeof(hash) );
      emit_event( EVT_HASH, &hash, sizeof(hash) );
      tsdk_return( 0UL );
    }

    case OP_BANNER: {
      tsys_log( PSI_BANNER, sizeof(PSI_BANNER) - 1U );
      emit_event( EVT_BANNER, PSI_BANNER, sizeof(PSI_BANNER) - 1U );
      tsdk_return( 0UL );
    }

    case OP_KV_SET: {
      if ( payload_sz < 3UL ) tsdk_revert( 0x03 );
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );
      ushort kv_count = TSDK_LOAD( ushort, state + 16 );
      if ( kv_count >= KV_MAX_ENTRIES ) tsdk_revert( 0x04 );
      uchar key_len = payload[0];
      if ( key_len == 0U || key_len > KV_MAX_KEY_LEN ) tsdk_revert( 0x05 );
      ushort val_len = TSDK_LOAD( ushort, payload + 1U + (ulong)key_len );
      if ( val_len > KV_MAX_VAL_LEN ) tsdk_revert( 0x06 );
      ulong expected = 1UL + (ulong)key_len + 2UL + (ulong)val_len;
      if ( payload_sz < expected ) tsdk_revert( 0x07 );
      ushort data_off = TSDK_LOAD( ushort, state + 18 );
      ulong write_off = (ulong)data_off;
      ulong needed = write_off + 1UL + (ulong)key_len + 2UL + (ulong)val_len;
      if ( needed > (ulong)meta->data_sz ) tsdk_revert( 0x08 );
      uchar * kv_ptr = state + write_off;
      kv_ptr[0] = key_len;
      memcpy( kv_ptr + 1, payload + 1, key_len );
      TSDK_STORE( ushort, kv_ptr + 1U + (ulong)key_len, val_len );
      memcpy( kv_ptr + 3UL + (ulong)key_len, payload + 3UL + (ulong)key_len, val_len );
      ushort new_off = (ushort)(write_off + 1U + key_len + 2U + val_len);
      TSDK_STORE( ushort, state + 18, new_off );
      kv_count++;
      TSDK_STORE( ushort, state + 16, kv_count );
      emit_event( EVT_KV, &kv_count, sizeof(kv_count) );
      tsdk_return( 0UL );
    }

    case OP_KV_GET: {
      if ( payload_sz < 1UL ) tsdk_revert( 0x09 );
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );
      uchar key_len = payload[0];
      if ( key_len == 0U || key_len > KV_MAX_KEY_LEN ) tsdk_revert( 0x0A );
      ushort kv_count = TSDK_LOAD( ushort, state + 16 );
      ushort data_off = TSDK_LOAD( ushort, state + 18 );
      ulong off = STATE_MIN_SIZE;
      for ( ushort i = 0U; i < kv_count; i++ ) {
        if ( off >= (ulong)data_off ) break;
        uchar entry_key_len = state[off];
        ushort entry_val_len = TSDK_LOAD( ushort, state + off + 1U + (ulong)entry_key_len );
        if ( entry_key_len == key_len ) {
          uchar const * entry_key = state + off + 1U;
          uchar const * search_key = payload + 1U;
          int match = 1;
          for ( uchar j = 0U; j < key_len; j++ ) {
            if ( entry_key[j] != search_key[j] ) { match = 0; break; }
          }
          if ( match ) {
            uchar const * val_ptr = state + off + 3UL + (ulong)entry_key_len;
            tsys_log( val_ptr, entry_val_len );
            tsys_emit_event( val_ptr, entry_val_len );
            tsdk_return( 0UL );
          }
        }
        off += 1UL + (ulong)entry_key_len + 2UL + (ulong)entry_val_len;
      }
      uchar not_found = 0U;
      tsys_log( &not_found, 1UL );
      emit_event( EVT_KV, &not_found, 1UL );
      tsdk_return( 0UL );
    }

    case OP_TRANSFER: {
      if ( payload_sz < 8UL ) tsdk_revert( 0x0B );
      ulong amount = TSDK_LOAD( ulong, payload );
      ulong result = tsys_account_transfer( 2UL, 3UL, amount );
      if ( result != 0UL ) tsdk_revert( 0x0C + result );
      emit_event( EVT_TRANSFER, &amount, sizeof(amount) );
      tsdk_return( 0UL );
    }

    case OP_STORE_DATA: {
      if ( payload_sz < 2UL ) tsdk_revert( 0x0D );
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ensure_state_init( state, meta->data_sz );
      ushort offset = TSDK_LOAD( ushort, payload );
      ulong write_data_sz = payload_sz - 2UL;
      if ( (ulong)offset + write_data_sz > (ulong)meta->data_sz ) tsdk_revert( 0x0E );
      memcpy( state + offset, payload + 2UL, write_data_sz );
      ushort written = (ushort)write_data_sz;
      emit_event( EVT_ECHO, &written, sizeof(written) );
      tsdk_return( 0UL );
    }

    case OP_READ_DATA: {
      if ( payload_sz < 4UL ) tsdk_revert( 0x0F );
      uchar * state = get_state_data();
      tsdk_account_meta_t * meta = get_state_meta();
      ushort offset = TSDK_LOAD( ushort, payload );
      ushort length = TSDK_LOAD( ushort, payload + 2U );
      if ( (ulong)offset + (ulong)length > (ulong)meta->data_sz ) tsdk_revert( 0x10 );
      tsys_log( state + offset, length );
      tsys_emit_event( state + offset, length );
      tsdk_return( 0UL );
    }

    /* ═══ v3.0 NEW opcodes ═══ */

    /* OP_DOUBLE_HASH: SHA-256(SHA-256(data)) — Bitcoin-style hash */
    case OP_DOUBLE_HASH: {
      if ( payload_sz == 0UL ) tsdk_revert( 0x02 );

      tn_hash_t hash1;
      tn_hash_t hash2;
      tsdk_sha256_t ctx;

      /* First hash */
      tsdk_sha256_init( &ctx );
      tsdk_sha256_append( &ctx, payload, payload_sz );
      tsdk_sha256_fini( &ctx, &hash1 );

      /* Second hash (hash of hash) */
      tsdk_sha256_init( &ctx );
      tsdk_sha256_append( &ctx, &hash1, sizeof(hash1) );
      tsdk_sha256_fini( &ctx, &hash2 );

      tsys_log( &hash2, sizeof(hash2) );
      emit_event( EVT_DOUBLE_HASH, &hash2, sizeof(hash2) );
      tsdk_return( 0UL );
    }

    /* OP_MERKLE: hash chunks of data, emit intermediate hashes */
    /* Format: [chunk_size(2 LE)] [data] */
    case OP_MERKLE: {
      if ( payload_sz < 2UL ) tsdk_revert( 0x20 );

      ushort chunk_sz = TSDK_LOAD( ushort, payload );
      if ( chunk_sz == 0U || chunk_sz > 128U ) tsdk_revert( 0x21 );

      uchar const * merkle_data = payload + 2UL;
      ulong merkle_data_sz = payload_sz - 2UL;
      ulong num_chunks = merkle_data_sz / (ulong)chunk_sz;
      if ( num_chunks == 0UL ) tsdk_revert( 0x22 );
      if ( num_chunks > 8UL ) num_chunks = 8UL; /* cap at 8 */

      tn_hash_t hashes[8];
      tsdk_sha256_t ctx;

      for ( ulong i = 0UL; i < num_chunks; i++ ) {
        tsdk_sha256_init( &ctx );
        ulong off = i * (ulong)chunk_sz;
        ulong remaining = merkle_data_sz - off;
        ulong this_chunk = (remaining < (ulong)chunk_sz) ? remaining : (ulong)chunk_sz;
        tsdk_sha256_append( &ctx, merkle_data + off, this_chunk );
        tsdk_sha256_fini( &ctx, &hashes[i] );
      }

      /* Pairwise hash to get root */
      ulong level = num_chunks;
      while ( level > 1UL ) {
        ulong next_level = 0UL;
        for ( ulong i = 0UL; i + 1UL < level; i += 2UL ) {
          tsdk_sha256_init( &ctx );
          tsdk_sha256_append( &ctx, &hashes[i], sizeof(tn_hash_t) );
          tsdk_sha256_append( &ctx, &hashes[i + 1UL], sizeof(tn_hash_t) );
          tsdk_sha256_fini( &ctx, &hashes[next_level] );
          next_level++;
        }
        /* If odd, promote last */
        if ( level % 2UL != 0UL ) {
          hashes[next_level] = hashes[level - 1UL];
          next_level++;
        }
        level = next_level;
      }

      /* Emit root hash */
      tsys_log( &hashes[0], sizeof(tn_hash_t) );
      emit_event( EVT_MERKLE, &hashes[0], sizeof(tn_hash_t) );
      tsdk_return( 0UL );
    }

    /* OP_GAS_REPORT: log gas at different stages */
    case OP_GAS_REPORT: {
      /* Just log a marker — the CLI shows CU consumed */
      uchar stage1[4] = { 'S', 'T', '1', 0 };
      tsys_log( stage1, 3UL );

      /* Do some work: hash payload if present */
      if ( payload_sz > 0UL ) {
        tn_hash_t h;
        tsdk_sha256_t ctx;
        tsdk_sha256_init( &ctx );
        tsdk_sha256_append( &ctx, payload, payload_sz );
        tsdk_sha256_fini( &ctx, &h );
      }

      uchar stage2[4] = { 'S', 'T', '2', 0 };
      tsys_log( stage2, 3UL );

      emit_event( EVT_GAS, stage2, 3UL );
      tsdk_return( 0UL );
    }

    /* OP_ACCOUNT_RESIZE: grow account 2 data */
    /* Format: [new_size(4 LE)] */
    case OP_ACCOUNT_RESIZE: {
      if ( payload_sz < 4UL ) tsdk_revert( 0x30 );
      uint new_size = TSDK_LOAD( uint, payload );
      if ( new_size < (uint)STATE_MIN_SIZE || new_size > 65535U ) tsdk_revert( 0x31 );

      ulong result = tsys_account_resize( 2UL, (ulong)new_size );
      if ( result != 0UL ) tsdk_revert( 0x32 + result );

      emit_event( EVT_RESIZE, &new_size, sizeof(new_size) );
      tsdk_return( 0UL );
    }

    /* OP_CREATE_ACCT: create ephemeral account from program */
    /* Format: [seed(32 bytes)] */
    case OP_CREATE_ACCT: {
      if ( payload_sz < 32UL ) tsdk_revert( 0x40 );

      /* Use account index 3 as the new account slot */
      ulong result = tsys_account_create_ephemeral( 3UL,
        (uchar const *)payload );
      if ( result != 0UL ) tsdk_revert( 0x41 + result );

      uchar created = 1U;
      tsys_log( &created, 1UL );
      emit_event( EVT_CREATE, &created, 1UL );
      tsdk_return( 0UL );
    }

    /* OP_SET_FLAGS: set flags on account 2 */
    /* Format: [flags(1)] */
    case OP_SET_FLAGS: {
      if ( payload_sz < 1UL ) tsdk_revert( 0x50 );
      uchar flags = payload[0];
      ulong result = tsys_account_set_flags( (ushort)2U, flags );
      if ( result != 0UL ) tsdk_revert( 0x51 + result );
      emit_event( EVT_FLAGS, &flags, 1UL );
      tsdk_return( 0UL );
    }

    /* OP_INVOKE: CPI to another program */
    /* Format: [program_acc_idx(2 LE)] [instr_data] */
    case OP_INVOKE: {
      if ( payload_sz < 2UL ) tsdk_revert( 0x60 );
      ushort prog_idx = TSDK_LOAD( ushort, payload );
      uchar const * invoke_data = payload + 2UL;
      ulong invoke_sz = payload_sz - 2UL;

      ulong invoke_err = 0UL;
      ulong result = tsys_invoke( invoke_data, invoke_sz,
                                   (ushort)prog_idx,
                                   (tsdk_invoke_auth_t const *)0,
                                   &invoke_err );
      if ( result != 0UL ) tsdk_revert( 0x61 + result );
      if ( invoke_err != 0UL ) tsdk_revert( 0x62 + invoke_err );

      uchar ok = 1U;
      emit_event( EVT_INVOKE, &ok, 1UL );
      tsdk_return( 0UL );
    }

    /* OP_BLS_VERIFY: verify a BLS signature */
    /* Format: [pubkey(96)] [signature(96)] [message] */
    case OP_BLS_VERIFY: {
      if ( payload_sz < 192UL ) tsdk_revert( 0x70 );

      tn_bls_pubkey_t const * pubkey =
        (tn_bls_pubkey_t const *)payload;
      tn_bls_signature_t const * signature =
        (tn_bls_signature_t const *)(payload + 96UL);
      void const * message = payload + 192UL;
      ulong message_len = payload_sz - 192UL;

      int result = tn_crypto_verify_signature( signature, pubkey,
                                                 message, message_len );

      uchar verified = (uchar)(result == 0 ? 1U : 0U);
      tsys_log( &verified, 1UL );
      emit_event( EVT_BLS, &verified, 1UL );
      tsdk_return( 0UL );
    }

    /* OP_EVENT_CHAIN: emit a chain of events where each references the prev */
    /* Format: [count(1)] [data] */
    case OP_EVENT_CHAIN: {
      uchar count = 1U;
      if ( payload_sz >= 1UL ) count = payload[0];
      if ( count > 10U ) count = 10U;

      ulong prev_hash = 0UL;
      for ( uchar i = 0U; i < count; i++ ) {
        /* Build event: [EVT_CHAIN] [index(1)] [prev_hash(8)] [payload_chunk] */
        uchar evt[64];
        evt[0] = EVT_CHAIN;
        evt[1] = i;
        memcpy( evt + 2, &prev_hash, 8 );

        /* Include some payload data */
        ulong chunk_start = 1UL + (ulong)i * 16UL;
        ulong chunk_sz = 16UL;
        if ( chunk_start + chunk_sz > payload_sz ) {
          chunk_sz = (chunk_start < payload_sz) ? (payload_sz - chunk_start) : 0UL;
        }
        if ( chunk_sz > 0UL ) {
          memcpy( evt + 10, payload + chunk_start, chunk_sz );
        }

        ulong evt_sz = 10UL + chunk_sz;
        tsys_emit_event( evt, evt_sz );

        /* Update prev_hash by XORing event bytes */
        prev_hash = 0UL;
        for ( ulong j = 0UL; j < evt_sz && j < 64UL; j++ ) {
          prev_hash ^= ((ulong)evt[j]) << ((j % 8UL) * 8UL);
        }
      }

      tsdk_return( 0UL );
    }

    /* OP_ANON_SEG: allocate anonymous segment (dynamic heap) */
    /* Format: [size(4 LE)] */
    case OP_ANON_SEG: {
      if ( payload_sz < 4UL ) tsdk_revert( 0x80 );
      uint seg_size = TSDK_LOAD( uint, payload );

      /* Allocate anonymous segment via tsys_increment_anonymous_segment_sz */
      void * addr = (void *)0;
      uchar * seg_base = (uchar *)TSDK_ADDR( TSDK_SEG_TYPE_HEAP, 0UL, 0UL );

      ulong result = tsys_increment_anonymous_segment_sz(
        seg_base, (ulong)seg_size, &addr );

      if ( result != 0UL ) tsdk_revert( 0x81 + result );

      /* Write a marker to the segment */
      if ( addr != (void *)0 ) {
        uchar marker[4] = { 'D', 'M', '3', 0 };
        memcpy( addr, marker, 3UL );
      }

      emit_event( EVT_ANON, &seg_size, sizeof(seg_size) );
      tsdk_return( 0UL );
    }

    /* OP_VERSION: emit program version */
    case OP_VERSION: {
      uchar ver[4] = { VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, 0 };
      tsys_log( ver, 3UL );
      emit_event( EVT_VERSION, ver, 3UL );
      tsdk_return( 0UL );
    }

    /* OP_HASH_TIMED: hash data + block slot (simulating nonce mining) */
    /* Format: [data] — combines payload with current slot, hashes it */
    case OP_HASH_TIMED: {
      tsdk_block_ctx_t const * block_ctx =
        (tsdk_block_ctx_t const *)TSDK_ADDR( TSDK_SEG_TYPE_READONLY_DATA,
                                              TSDK_SEG_IDX_BLOCK_CTX, 0UL );

      /* Build buffer: [payload] [slot(8)] */
      uchar buf[256];
      ulong buf_sz = payload_sz + 8UL;
      if ( buf_sz > sizeof(buf) ) buf_sz = sizeof(buf);
      ulong copy_sz = (payload_sz < sizeof(buf) - 8UL) ? payload_sz : (sizeof(buf) - 8UL);
      if ( copy_sz > 0UL ) memcpy( buf, payload, copy_sz );
      memcpy( buf + copy_sz, &block_ctx->slot, 8UL );

      tn_hash_t hash;
      tsdk_sha256_t ctx;
      tsdk_sha256_init( &ctx );
      tsdk_sha256_append( &ctx, buf, copy_sz + 8UL );
      tsdk_sha256_fini( &ctx, &hash );

      tsys_log( &hash, sizeof(hash) );
      emit_event( EVT_MINING, &hash, sizeof(hash) );
      tsdk_return( 0UL );
    }

    default: {
      tsys_log( PSI_BANNER, sizeof(PSI_BANNER) - 1U );
      tsdk_revert( 0xFF );
    }
  }

  tsdk_return( 0UL );
}
