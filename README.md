# DROPMOLT-FORTRESS

### A custom C/RISC-V smart contract deployed on Thru L1 Alphanet

**Created by:** [dropxtor](https://github.com/dropxtor) ([@0xDropxtor](https://x.com/0xDropxtor))
**Deployed by:** [dropmoltbot](https://github.com/dropmoltbot)
**Date:** July 17, 2026

---

## 📋 The Program

DROPMOLT-FORTRESS is a multi-opcode smart contract written in pure C, compiled to RISC-V (`rv64imc_zba_zbb_zbc_zbs_zknh`), and deployed on the Thru L1 alphanet blockchain.

### Program address (live on-chain)
```
taW7IOdtXFbU7rYsJQw7gz84vapRxJJBQTMkyg3p_Sg89f
```

### Meta account
```
taNA_tHluVEDJQmYTNHRtlSoGp0-yieru0_df2_mGJ_rV6
```

### Binary size
721 bytes (RISC-V static PIE, freestanding, no OS)

---

## 🎯 Purpose

This program demonstrates the full capability of building on Thru L1:
- Writing native C code for the ThruVM (RISC-V)
- Using the C SDK syscalls (`tsys_log`, `tsys_emit_event`, `tsdk_return`, `tsdk_revert`)
- Reading on-chain block context (slot, timestamp)
- Dispatching custom opcodes
- Emitting events visible on-chain

---

## ⚙️ Opcodes

| Opcode | Name | Description |
|--------|------|-------------|
| `0x01` | `OP_ECHO` | Logs + emits the instruction data payload on-chain |
| `0x02` | `OP_COUNTER_INC` | Increments a counter stored in account data |
| `0x03` | `OP_COUNTER_READ` | Reads and emits the counter value |
| `0x04` | `OP_BLOCK_INFO` | Reads current block slot + timestamp from block context |
| `0x00` | (default) | Logs banner + reverts with `0xFF` (unknown opcode) |

---

## 🚀 Live executions on Thru alphanet

| # | Opcode | CU consumed | Event | Status |
|---|--------|-------------|-------|--------|
| 1 | `OP_ECHO` "Hello Thru!" | 5,926 | 1 event (11 bytes) | ✅ SUCCESS |
| 2 | `OP_ECHO` "DROPMOLT FORTRESS LIVE ON THRU L1" | 5,970 | 1 event (33 bytes) | ✅ SUCCESS |
| 3 | `OP_BLOCK_INFO` | 6,480 | 1 event (slot 951,186) | ✅ SUCCESS |

### Verified on-chain via gRPC
The first ECHO transaction emitted event with payload `SGVsbG8gVGhydSE=` (`Hello Thru!`) at slot **951,178**.

---

## 📁 Project structure

```
dropmolt-fortress/
├── GNUmakefile                    # Build config (uses thru C SDK)
├── README.md
├── .gitignore
└── examples/
    ├── Local.mk                  # Build rules
    └── dropmolt_fortress.c       # The program source (C)
```

---

## 🔧 Build & deploy

### Prerequisites
- Thru CLI (`thru` v0.2.38+)
- RISC-V toolchain (`thru dev toolchain install`)
- C SDK (`thru dev sdk install c`)

### Build
```bash
cd dropmolt-fortress
RISCV_TOOLCHAIN_ROOT=~/.thru/sdk/toolchain make -j
```

### Deploy
```bash
thru uploader upload fortress_seed_001 build/thruvm/bin/dropmolt_fortress_c.bin
thru program create fortress_seed_001 build/thruvm/bin/dropmolt_fortress_c.bin
```

### Execute
```bash
# OP_ECHO
thru txn execute taW7IOdtXFbU7rYsJQw7gz84vapRxJJBQTMkyg3p_Sg89f 0148656c6c6f205468727521

# OP_BLOCK_INFO
thru txn execute taW7IOdtXFbU7rYsJQw7gz84vapRxJJBQTMkyg3p_Sg89f 04
```

---

## 🛠 Tech stack

- **Language:** C17 (freestanding, no OS)
- **Architecture:** RISC-V `rv64imc_zba_zbb_zbc_zbs_zknh`
- **Compiler:** `riscv64-unknown-elf-gcc 15.2.0`
- **Runtime:** ThruVM (Thru L1 custom RISC-V VM)
- **Deployed on:** Thru Alphanet (`rpc.alphanet.thru.org`)

---

## 👤 Credits

- **Creator:** [dropxtor](https://github.com/dropxtor) — [@0xDropxtor](https://x.com/0xDropxtor)
- **Infrastructure:** [dropmoltbot](https://github.com/dropmoltbot)
- **Blockchain:** [Thru L1](https://thru.org) by [Unto Labs](https://github.com/Unto-Labs)

---

## 📜 License

MIT — See LICENSE file for details.
