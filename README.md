# DROPMOLT-FORTRESS v3.0

### 20-opcode C/RISC-V smart contract on Thru L1 Alphanet — BLS, Merkle, CPI, SHA-256, KV store

**Created by:** [dropxtor](https://github.com/dropxtor) ([@0xDropxtor](https://x.com/0xDropxtor))
**Deployed by:** [dropmoltbot](https://github.com/dropmoltbot)
**Date:** July 17, 2026

---

## Programs deployed on-chain

| Version | Address | Size | Opcodes |
|---------|---------|------|---------|
| v1.0 | `taW7IOdtXFbU7rYsJQw7gz84vapRxJJBQTMkyg3p_Sg89f` | 721 b | 4 |
| v2.0 | `taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V-` | 4,320 b | 12 |
| **v3.0** | **`taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij`** | **53,888 b** | **20** |

---

## 20 Opcodes

### v1.0 — Base (4)

| Opcode | Name | Description | Tested |
|--------|------|-------------|--------|
| `0x01` | `OP_ECHO` | Log + emit payload on-chain | ✅ |
| `0x02` | `OP_COUNTER_INC` | Increment persistent counter | ✅ |
| `0x03` | `OP_COUNTER_READ` | Read counter value | ✅ |
| `0x04` | `OP_BLOCK_INFO` | Read block slot + timestamp | ✅ |

### v2.0 — Storage & Crypto (8)

| Opcode | Name | Description | Tested |
|--------|------|-------------|--------|
| `0x05` | `OP_HASH` | SHA-256 hash of instruction data | ✅ |
| `0x06` | `OP_COUNTER_RESET` | Reset counter to 0 | New |
| `0x07` | `OP_KV_SET` | Store key-value pair in account data | New |
| `0x08` | `OP_KV_GET` | Retrieve value by key | New |
| `0x09` | `OP_TRANSFER` | Transfer tokens via `tsys_account_transfer` | New |
| `0x0A` | `OP_STORE_DATA` | Write raw bytes at offset in account data | New |
| `0x0B` | `OP_READ_DATA` | Read raw bytes at offset from account data | New |
| `0x0C` | `OP_BANNER` | Log program banner with credits | ✅ |

### v3.0 — Advanced (8)

| Opcode | Name | Description | Tested | CU |
|--------|------|-------------|--------|----|
| `0x0D` | `OP_DOUBLE_HASH` | SHA-256(SHA-256(data)) — Bitcoin-style | ✅ | 32,148 |
| `0x0E` | `OP_MERKLE` | Chunked SHA-256 → pairwise reduce → Merkle root | ✅ | 56,772 |
| `0x0F` | `OP_GAS_REPORT` | Log CU at different execution stages | ✅ | 19,577 |
| `0x10` | `OP_ACCOUNT_RESIZE` | Grow account data via `tsys_account_resize` | New | — |
| `0x11` | `OP_CREATE_ACCT` | Create ephemeral account from within program | New | — |
| `0x12` | `OP_SET_FLAGS` | Set account flags via `tsys_account_set_flags` | New | — |
| `0x13` | `OP_INVOKE` | CPI: Cross-Program Invocation via `tsys_invoke` | New | — |
| `0x14` | `OP_BLS_VERIFY` | Verify BLS signature (`tn_crypto_verify_signature`) | New | — |
| `0x15` | `OP_EVENT_CHAIN` | Emit hash-linked chain of events | ✅ | 12,807 (5 events) |
| `0x16` | `OP_ANON_SEG` | Allocate anonymous segment (dynamic heap) | New | — |
| `0x17` | `OP_VERSION` | Return program version 3.0.0 | ✅ | 6,158 |
| `0x18` | `OP_HASH_TIMED` | hash(data + block slot) — nonce mining sim | ✅ | 19,976 |

---

## Syscalls used (10+)

| Syscall | Purpose |
|---------|---------|
| `tsys_log()` | On-chain logging |
| `tsys_emit_event()` | Structured events with type tags |
| `tsdk_return()` / `tsdk_revert()` | Program control flow |
| `tsys_account_transfer()` | CPI token transfer |
| `tsdk_sha256_init/append/fini()` | On-chain SHA-256 hashing |
| `tn_crypto_verify_signature()` | BLS signature verification |
| `tsys_account_resize()` | Dynamic account data growth |
| `tsys_account_create_ephemeral()` | Create accounts from within program |
| `tsys_account_set_flags()` | Account flag manipulation |
| `tsys_invoke()` | Cross-Program Invocation (CPI) |
| `tsys_increment_anonymous_segment_sz()` | Dynamic heap allocation |
| `TSDK_LOAD/STORE` | Safe unaligned memory access |
| `TSDK_ADDR` | Segmented memory addressing |

---

## Build & deploy

```bash
cd dropmolt-fortress
RISCV_TOOLCHAIN_ROOT=~/.thru/sdk/toolchain make -j
thru uploader upload fortress_v3_seed build/thruvm/bin/dropmolt_fortress_c.bin
thru program create fortress_v3_seed build/thruvm/bin/dropmolt_fortress_c.bin
```

## Execute

```bash
# OP_VERSION
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 17

# OP_BANNER
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 0C

# OP_ECHO "Hello"
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 0148656c6c6f

# OP_DOUBLE_HASH (SHA-256 of SHA-256 of "dropxtor")
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 0D64726F7078746F72

# OP_MERKLE (chunk_size=8, data="AAAABBBBCCCCDDDD")
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 0E080041414141424242424343434344444444

# OP_HASH_TIMED (mining sim)
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 186D696E696E675F6E6F6E63655F3132333435

# OP_EVENT_CHAIN (5 chained events)
thru txn execute taIs9ORffqHQUD-ljeZjCrPMkaidG49ohvmrv_nb27eaij 1505636861696E5F646174615F666F725F6576656E745F70726F7061676174696F6E5F74657374
```

---

## Tech stack

- **Language:** C17 (freestanding, no OS)
- **Architecture:** RISC-V `rv64imc_zba_zbb_zbc_zbs_zknh`
- **Compiler:** `riscv64-unknown-elf-gcc 15.2.0`
- **Runtime:** ThruVM (Thru L1 custom RISC-V VM)
- **Network:** Thru Alphanet (`rpc.alphanet.thru.org`)
- **Binary:** 53,888 bytes (static PIE, `-O3`)

---

## Evolution

| | v1.0 | v2.0 | v3.0 |
|---|---|---|---|
| **Opcodes** | 4 | 12 | 20 |
| **Binary** | 721 b | 4,320 b | 53,888 b |
| **SHA-256** | ❌ | ✅ | ✅ + double hash |
| **BLS crypto** | ❌ | ❌ | ✅ |
| **Merkle tree** | ❌ | ❌ | ✅ |
| **KV store** | ❌ | ✅ | ✅ |
| **CPI** | ❌ | ❌ | ✅ |
| **Account resize** | ❌ | ❌ | ✅ |
| **Dynamic heap** | ❌ | ❌ | ✅ |
| **Event chain** | ❌ | ❌ | ✅ |
| **Mining sim** | ❌ | ❌ | ✅ |

---

## Credits

- **Creator:** [dropxtor](https://github.com/dropxtor) — [@0xDropxtor](https://x.com/0xDropxtor)
- **Infrastructure:** [dropmoltbot](https://github.com/dropmoltbot)
- **Blockchain:** [Thru L1](https://thru.org) by [Unto Labs](https://github.com/Unto-Labs)

## License

MIT
