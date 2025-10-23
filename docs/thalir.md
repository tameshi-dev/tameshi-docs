# ThalIR

ThalIR (Tameshi Intermediate Representation) is a specialized IR for Solidity security analysis.

## What is ThalIR?

ThalIR is an intermediate representation based on Cranelift IR, optimized for:

- **Security analysis** - Normalized form makes vulnerabilities easier to detect
- **Semantic understanding** - Goes beyond syntax to understand what code does
- **Data flow analysis** - SSA form enables precise tracking of values

Tameshi automatically transforms Solidity to ThalIR when running IR-level scanners.

## Why ThalIR Helps

### Semantic Understanding

Source-level scanners see syntax. IR-level scanners understand semantics.

**Source code:**
```solidity
function withdraw(uint amount) public {
    balances[msg.sender] -= amount;
    msg.sender.call{value: amount}("");
}
```

**ThalIR representation:**
```
function %withdraw(i256) public {
block0(v0: i256):
  v1 = get_context msg.sender
  v2 = mapping_load balances, v1
  v3 = isub.i256 v2, v0
  mapping_store balances, v1, v3
  v4 = call v1, v0
  ret
}
```

In ThalIR, you can see:
- Exact operation ordering (state update, then call)
- Data flow (v0, v1, v2, v3 values)
- Type information (i256)
- Control flow (explicit blocks)

This makes vulnerabilities like reentrancy obvious.

### Normalized Form

ThalIR converts complex Solidity patterns into simple, consistent operations:

- All expressions become individual instructions
- Control flow is explicit (if/loop → conditional branches)
- State access is normalized (storage reads/writes)
- Each value is defined exactly once (SSA form)

Vulnerabilities are detected by matching instruction sequences rather than parsing complex Solidity syntax.

### SSA Form

ThalIR uses Single Static Assignment (SSA) for precise analysis:

**Example:**
```
function %transfer(i160, i256) public {
block0(v0: i160, v1: i256):
  v2 = get_context msg.sender
  v3 = mapping_load balances, v2
  v4 = isub.i256 v3, v1
  mapping_store balances, v2, v4
  v5 = call v0, v1
  ret
}
```

**SSA properties:**
- Each value (`v0`, `v1`, `v2`, etc.) is defined exactly once
- Data flow is explicit and unambiguous
- Makes dependency analysis straightforward
- Enables precise tracking of tainted values

## When ThalIR is Used

### Automatic Transformation

ThalIR transformation happens automatically when you:

```bash
# Run IR-level scanners
tameshi scan run -i MyContract.sol --suite deterministic

# Run hybrid analysis
tameshi analyze MyContract.sol
```

You don't need to manually transform contracts.

### Manual Transformation

You can transform Solidity to ThalIR explicitly:

```bash
# Text format
tameshi transform sol2ir -i MyContract.sol --format text

# JSON format
tameshi transform sol2ir -i MyContract.sol --format json

# Save to file
tameshi transform sol2ir -i MyContract.sol -o output.thalir
```

Use cases:
- Debug IR scanner behavior
- Understand how Tameshi sees your code
- Develop custom IR-based scanners
- Submit IR to external analysis tools

### Optional LLM Input Format

The optional LLM scanner can analyze either source or IR:

```json
{
  "tameshi.llm.useIrScanning": false
}
```

- `false` - LLM receives raw Solidity (default)
- `true` - LLM receives ThalIR representation

**Note**: This is an experimental feature. The primary use of ThalIR is for deterministic IR-level scanners.

## ThalIR Instruction Set

ThalIR extends Cranelift IR with blockchain-specific operations:

### Storage Operations
- `mapping_load` - Read from contract storage mapping
- `mapping_store` - Write to contract storage mapping
- `array_load` / `array_store` - Array access

### External Calls
- `call` - Regular external call
- `delegatecall` - Delegated context execution
- `staticcall` - Read-only external call

### Context Reads
- `get_context` - Read blockchain context (msg.sender, msg.value, block.timestamp, etc.)

### Arithmetic
- Standard operations: `add`, `sub`, `mul`, `div`, `mod`
- Checked variants: `add.trap`, `sub.trap` (Solidity 0.8+)
- Wrapping variants: `add.wrap`, `sub.wrap` (unchecked blocks)

### Control Flow
- `br` - Unconditional branch
- `br_if` - Conditional branch
- `ret` - Return from function

## Technical Details

### SSA Form

Static Single Assignment means each value is defined exactly once:

```
v1 = get_context msg.sender
v2 = mapping_load balances, v1
v3 = isub.i256 v2, amount
```

Not:
```
sender = msg.sender
balance = balances[sender]
balance = balance - amount  // Redefines balance
```

SSA makes data flow analysis precise and enables better optimization.

### Control Flow Graphs

ThalIR represents control flow explicitly:

```
function %complexFunction() {
block0:
  v0 = get_context msg.sender
  v1 = ...
  br_if v1, block1, block2

block1:
  v2 = ...
  br block3

block2:
  v3 = ...
  br block3

block3:
  ret
}
```

Scanners can analyze all possible execution paths.

## Privacy and Obfuscation

ThalIR supports privacy-preserving analysis:

- SSA value numbering (v0, v1) abstracts variable names
- Optional name stripping for confidential audits
- Focus on security patterns, not business logic details

This enables third-party security analysis without revealing proprietary algorithms.

## ThalIR vs Other IRs

| IR | Purpose | Security Focus |
|----|---------|----------------|
| ThalIR | Smart contract security | High |
| Yul | EVM compilation | Low |
| LLVM IR | General compilation | Low |
| Cranelift IR | Fast compilation | Low |

ThalIR is purpose-built for security analysis, not compilation efficiency.

## Example Transformation

**Solidity:**
```solidity
function transfer(address to, uint amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[to] += amount;
}
```

**ThalIR:**
```
function %transfer(i160, i256) public {
block0(v0: i160, v1: i256):
  v2 = get_context msg.sender
  v3 = mapping_load balances, v2
  v4 = icmp.uge v3, v1
  br_if v4, block1, block2

block1:
  v5 = isub.i256 v3, v1
  mapping_store balances, v2, v5
  v6 = mapping_load balances, v0
  v7 = iadd.i256 v6, v1
  mapping_store balances, v0, v7
  ret

block2:
  revert
}
```

The IR makes the control flow and data dependencies explicit.

## Next Steps

- [Scan Modes](/scan-modes) - When IR scanning is used
- [Scanners](/scanners) - What IR-level scanners detect
- [Configuration](/reference/configuration) - Configure IR analysis options
