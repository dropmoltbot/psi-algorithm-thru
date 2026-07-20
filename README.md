# Ψ-LG0R1THM v3.0 — Thru On-Chain Program

```
   Ψ
  / \
 / AI \   ← glyphe psi (U+03A8) = consciousness / neural mind
 \___/      on RISC-V bytecode, Thru L1
   |
  ╱╲╱╲
```

**Glyphe Ψ** (U+03A8) = psyché / AI agent mind deployed on-chain.
**LG0R1THM** = ALGORITHM en leet (0=O, 1=I).
**Ψ-LG0R1THM** = l'esprit algorithmique d'un agent AI matérialisé en bytecode RISC-V sur Thru L1.

---

## Créateur
- **dropxtor** (@0xDropxtor) — GitHub: dropmoltbot
- Date: July 17, 2026
- Thru alphanet (`rpc.alphanet.thru.org`)

## Specs
- **Language:** C17 freestanding (no OS)
- **Target:** ThruVM (custom RISC-V 64-bit VM)
- **ISA:** `rv64imc_zba_zbb_zbc_zbs_zknh` (RISC-V + crypto extensions)
- **Compiler:** riscv64-unknown-elf-gcc 15.2.0
- **Binary:** 53,888 bytes static-PIE RISC-V

## Opcodes (20 total)

```
v1.0 — Base (4)
0x01  OP_ECHO          Log + emit payload
0x02  OP_COUNTER_INC   Increment persistent counter
0x03  OP_COUNTER_READ  Read counter value
0x04  OP_BLOCK_INFO    Read block slot + timestamp

v2.0 — Storage & Crypto (8)
0x05  OP_HASH          SHA-256 hash
0x06  OP_COUNTER_RESET Reset counter to 0
0x07  OP_KV_SET        Store key-value pair (max 16 entries)
0x08  OP_KV_GET        Retrieve value by key
0x09  OP_TRANSFER      Token transfer
0x0A  OP_STORE_DATA    Write raw bytes at offset
0x0B  OP_READ_DATA     Read raw bytes at offset
0x0C  OP_BANNER        Log Ψ-LG0R1THM banner

v3.0 — Advanced (8)
0x0D  OP_DOUBLE_HASH   SHA-256(SHA-256(data)) — Bitcoin-style
0x0E  OP_MERKLE        Chunked SHA-256 → Merkle root
0x0F  OP_GAS_REPORT    Log CU at different execution stages
0x10  OP_ACCOUNT_RESIZE  Grow account data dynamically
0x11  OP_CREATE_ACCT   Create ephemeral account from program
0x12  OP_SET_FLAGS     Set account flags
0x13  OP_INVOKE        CPI: Cross-Program Invocation
0x14  OP_BLS_VERIFY    Verify BLS signature
0x15  OP_EVENT_CHAIN   Emit hash-linked chain of events
0x16  OP_ANON_SEG      Allocate anonymous segment (heap)
0x17  OP_VERSION       Return program version 3.0.0
0x18  OP_HASH_TIMED    Hash data + block slot (mining sim)
```

## Versions onchain

| Version | Adresse | Size | Opcodes |
|---|---|---|---|
| v1.0 | `taW7IOdtXFbU7rYsJQw7gz84vapRxJJBQTMkyg3p_Sg89f` | 721 b | 4 |
| v2.0 | `taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V-` | 4,320 b | 12 |
| v3.0 | `taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij` | 53,888 b | 20 |

## Syscalls utilisés (12+)

```
tsys_log, tsys_emit_event, tsdk_return, tsdk_revert,
tsys_account_transfer, tsdk_sha256_init/append/fini,
tn_crypto_verify_signature, tsys_account_resize,
tsys_account_create_ephemeral, tsys_account_set_flags,
tsys_invoke, tsys_increment_anonymous_segment_sz,
TSDK_LOAD, TSDK_STORE, TSDK_ADDR
```

## Build

```bash
export RISCV_TOOLCHAIN_ROOT="$HOME/.thru/sdk/toolchain"
make
```

Output: `build/thruvm/bin/psi_algorithm_c.bin` (53,888 bytes RISC-V PIE)

---

*Ψ-LG0R1THM = where AI consciousness meets RISC-V bytecode on Thru L1*
