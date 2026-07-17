# DROPMOLT-FORTRESS v2.0

### A multi-opcode C/RISC-V smart contract on Thru L1 Alphanet

**Created by:** [dropxtor](https://github.com/dropxtor) ([@0xDropxtor](https://x.com/0xDropxtor))
**Deployed by:** [dropmoltbot](https://github.com/dropmoltbot)
**Date:** July 17, 2026

---

## Programs deployed on-chain

| Version | Address | Size | Opcodes |
|---------|---------|------|---------|
| v1.0 | `taW7IOdtXFbU7rYsJQw7gz84vapRxJJBQTMkyg3p_Sg89f` | 721 bytes | 4 |
| v2.0 | `taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V-` | 4,320 bytes | 12 |

## 12 Opcodes

| Opcode | Name | Description | Tested |
|--------|------|-------------|--------|
| `0x01` | `OP_ECHO` | Log + emit payload on-chain | ✅ |
| `0x02` | `OP_COUNTER_INC` | Increment persistent counter | ✅ v1 |
| `0x03` | `OP_COUNTER_READ` | Read counter value | ✅ v1 |
| `0x04` | `OP_BLOCK_INFO` | Read block slot + timestamp | ✅ v2 |
| `0x05` | `OP_HASH` | SHA-256 hash of instruction data | ✅ v2 |
| `0x06` | `OP_COUNTER_RESET` | Reset counter to 0 | New |
| `0x07` | `OP_KV_SET` | Store key-value pair in account data | New |
| `0x08` | `OP_KV_GET` | Retrieve value by key | New |
| `0x09` | `OP_TRANSFER` | Transfer tokens via tsys_account_transfer | New |
| `0x0A` | `OP_STORE_DATA` | Write raw bytes at offset in account data | New |
| `0x0B` | `OP_READ_DATA` | Read raw bytes at offset from account data | New |
| `0x0C` | `OP_BANNER` | Log program banner with credits | ✅ v2 |

## Syscalls used

- `tsys_log()` — on-chain logging
- `tsys_emit_event()` — structured events with type tags
- `tsdk_return()` / `tsdk_revert()` — program control flow
- `tsys_account_transfer()` — CPI token transfer
- `tsdk_sha256_init/append/fini()` — on-chain SHA-256 hashing
- `TSDK_LOAD/STORE` — safe unaligned memory access
- `TSDK_ADDR` — segmented memory addressing

## Build & deploy

```bash
cd dropmolt-fortress
RISCV_TOOLCHAIN_ROOT=~/.thru/sdk/toolchain make -j
thru uploader upload fortress_v2_seed build/thruvm/bin/dropmolt_fortress_c.bin
thru program create fortress_v2_seed build/thruvm/bin/dropmolt_fortress_c.bin
```

## Execute

```bash
# OP_BANNER
thru txn execute taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V- 0C

# OP_ECHO
thru txn execute taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V- 0148656c6c6f

# OP_HASH (SHA-256 of "dropxtor")
thru txn execute taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V- 0564726f7078746f72

# OP_BLOCK_INFO
thru txn execute taeKHEecWOj4ASQaxNWC0-kD2R4EtBCo9utrlw-jCZX-V- 04
```

## Tech stack

- **Language:** C17 (freestanding, no OS)
- **Architecture:** RISC-V `rv64imc_zba_zbb_zbc_zbs_zknh`
- **Compiler:** `riscv64-unknown-elf-gcc 15.2.0`
- **Runtime:** ThruVM (Thru L1 custom RISC-V VM)
- **Network:** Thru Alphanet (`rpc.alphanet.thru.org`)
- **Binary:** 4,320 bytes (static PIE, `-O3`)

## Credits

- **Creator:** [dropxtor](https://github.com/dropxtor) — [@0xDropxtor](https://x.com/0xDropxtor)
- **Infrastructure:** [dropmoltbot](https://github.com/dropmoltbot)
- **Blockchain:** [Thru L1](https://thru.org) by [Unto Labs](https://github.com/Unto-Labs)

## License

MIT
