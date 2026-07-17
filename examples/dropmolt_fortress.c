/* dropmolt-fortress — Thru On-Chain Program
 *
 * Un programme C/RISC-V custom pour Thru L1 qui:
 * 1. Lit l'instruction data (custom opcode dispatch)
 * 2. Log un message on-chain via tsys_log
 * 3. Émet un event avec les data reçues
 * 4. Compte le nombre d'appels (counter stocké dans l'account data)
 * 5. Dispatch: opcode 0x01 = ECHO, 0x02 = COUNTER_INC, 0x03 = COUNTER_READ, 0x04 = BLOCK_INFO
 *
 * Account layout:
 * - Account 0: fee_payer (auto)
 * - Account 1: program (auto)
 * - Account 2: counter account (RW, owned by program)
 *
 * Instruction data format:
 *   [0]    opcode (u8)
 *   [1..]  payload (variable)
 *
 * Built for Thru ThruVM (RISC-V) by dropmoltbot
 */

#include <thru-sdk/c/tn_sdk.h>
#include <thru-sdk/c/tn_sdk_syscall.h>
#include <thru-sdk/c/tn_sdk_txn.h>
#include <thru-sdk/c/tn_sdk_types.h>

/* Opcodes */
#define OP_ECHO         0x01U
#define OP_COUNTER_INC  0x02U
#define OP_COUNTER_READ 0x03U
#define OP_BLOCK_INFO   0x04U

/* Our log buffer — on-chain visible via debug trace */
static char const FORTRESS_BANNER[] =
  "DROPMOLT-FORTRESS v1.0 // Built by dropmoltbot // Thru L1 RISC-V";

TSDK_ENTRYPOINT_FN void
start( void const * instruction_data,
       ulong        instruction_data_sz ) {

  /* --- Validate instruction data --- */
  if ( instruction_data_sz < 1UL ) {
    tsys_log( FORTRESS_BANNER, sizeof(FORTRESS_BANNER) - 1U );
    tsdk_revert( 0x01 ); /* Need at least opcode byte */
  }

  /* --- Read opcode --- */
  uchar const * data = (uchar const *)instruction_data;
  uchar opcode = data[0];

  /* --- Dispatch on opcode --- */
  switch ( opcode ) {

    case OP_ECHO: {
      /* Echo: log the instruction data payload back on-chain */
      uchar const * payload = data + 1;
      ulong payload_sz = instruction_data_sz - 1UL;

      if ( payload_sz > 0UL ) {
        tsys_log( payload, payload_sz );
        tsys_emit_event( payload, payload_sz );
      }

      tsdk_return( 0UL );
    }

    case OP_COUNTER_INC: {
      /* Increment counter in account 2 (RW) */
      tsdk_account_meta_t * meta =
        (tsdk_account_meta_t *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_METADATA, 2UL, 0UL );

      uchar * account_data =
        (uchar *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_DATA, 2UL, 0UL );

      /* Read current counter value */
      ulong current = 0UL;
      if ( meta->data_sz >= (uint)sizeof(ulong) ) {
        current = TSDK_LOAD( ulong, account_data );
      }

      /* Increment */
      current++;

      /* Write back */
      TSDK_STORE( ulong, account_data, current );

      /* Log and emit event */
      tsys_log( &current, sizeof(current) );
      tsys_emit_event( &current, sizeof(current) );

      tsdk_return( 0UL );
    }

    case OP_COUNTER_READ: {
      /* Read counter value from account 2 */
      uchar * account_data =
        (uchar *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_DATA, 2UL, 0UL );

      tsdk_account_meta_t * meta =
        (tsdk_account_meta_t *)TSDK_ADDR( TSDK_SEG_TYPE_ACCOUNT_METADATA, 2UL, 0UL );

      if ( meta->data_sz >= (uint)sizeof(ulong) ) {
        ulong value = TSDK_LOAD( ulong, account_data );
        tsys_log( &value, sizeof(value) );
        tsys_emit_event( &value, sizeof(value) );
      } else {
        ulong zero = 0UL;
        tsys_log( &zero, sizeof(zero) );
        tsys_emit_event( &zero, sizeof(zero) );
      }

      tsdk_return( 0UL );
    }

    case OP_BLOCK_INFO: {
      /* Read the current block context */
      tsdk_block_ctx_t const * block_ctx =
        (tsdk_block_ctx_t const *)TSDK_ADDR( TSDK_SEG_TYPE_READONLY_DATA,
                                              TSDK_SEG_IDX_BLOCK_CTX, 0UL );

      ulong slot = block_ctx->slot;
      ulong block_time = block_ctx->block_time;

      tsys_log( &slot, sizeof(slot) );
      tsys_log( &block_time, sizeof(block_time) );
      tsys_emit_event( &slot, sizeof(slot) );

      tsdk_return( 0UL );
    }

    default: {
      /* Unknown opcode — log banner and revert */
      tsys_log( FORTRESS_BANNER, sizeof(FORTRESS_BANNER) - 1U );
      tsdk_revert( 0xFF ); /* Unknown opcode */
    }
  }

  /* Should never reach here */
  tsdk_return( 0UL );
}
