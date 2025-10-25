# Scan Modes

Tameshi offers four complementary analysis modes that can be used independently or combined.

## Overview

| Mode | Speed | Precision | Works on Incomplete Code | Use Case |
|------|-------|-----------|--------------------------|----------|
| Source | <1s | Medium | ✅ Yes | Real-time feedback, CI/CD |
| IR | ~3-5s | High | ⚠️ Requires valid syntax | Pre-deployment audits |
| Call Graph | ~2-3s | High | ✅ Yes | Cross-function flow analysis |
| Combined | ~10-20s | Highest | ⚠️ Depends on LLM input | Comprehensive reviews |

## Source-Level Scanning

Fast analysis (<1s) on incomplete, under-construction code.

### Key Advantage: Works on Invalid Code

Critical for active development:
- Scans syntactically invalid Solidity
- No compilation required
- Tree-sitter parser is error-tolerant
- Get feedback while typing, not just on complete code

### Features

- Security feedback in <1 second
- Scans code as you type in VSCode
- Runs on every save automatically
- Catches vulnerabilities in incomplete functions

### How It Works

Source scanners use tree-sitter to parse Solidity into an error-tolerant AST, then match vulnerability patterns. **Works even with syntax errors**. Perfect for active development.

**14 source-level scanners** across all vulnerability categories.

### When to Use

**Good for:**
- Real-time feedback during coding
- CI/CD pipelines where speed is critical
- Pre-commit hooks
- Incomplete code under construction

### Example

```bash
tameshi scan run -i MyContract.sol  # <1s even on invalid syntax
```

VSCode: Automatically scans on save (default behavior).

---

## IR-Level Scanning

Precise semantic analysis through ThalIR intermediate representation.

### Features

- Detects vulnerabilities that source scanning misses
- Analyzes cross-function vulnerability chains
- Provides high-confidence findings with low false positives
- Performs data flow and control flow analysis

### How It Works

Tameshi transforms Solidity to ThalIR (intermediate representation), then runs scanners on the IR. This enables semantic analysis: understanding what the code does, not just how it's written.

ThalIR provides:
- SSA (Static Single Assignment) form for precise data flow
- Control flow graphs for path analysis
- Type information for safety checks
- Normalized representation that's easier to analyze

### When to Use

**Good for:**
- Pre-deployment security audits
- Critical smart contracts handling value
- Contracts with complex logic
- When precision matters more than speed

**Trade-offs:**
- Approximately 10x slower than source scanning
- Requires Solidity compilation to succeed
- More resource-intensive

### Example

```bash
# IR scanners run automatically with deterministic suite
tameshi scan run -i MyContract.sol --suite deterministic
```

The transformation to IR happens transparently.

---

## Call Graph Analysis

Control flow and cross-function vulnerability detection via Traverse.

### Features

- Analyzes function call relationships and control flow
- Detects cross-function reentrancy patterns
- Identifies unreachable code and dead paths
- Tracks state modifications across function boundaries
- Works on syntactically valid Solidity (no compilation required)

### How It Works

Tameshi uses [Traverse](https://github.com/calltrace/traverse) to generate call graphs from Solidity source. This enables:
- Function-to-function dependency analysis
- Call chain pattern detection
- Cross-contract call flow tracking
- Vulnerability propagation across functions

Call graphs provide a complementary view to AST and IR, focusing on inter-procedural analysis.

### When to Use

**Good for:**
- Cross-function reentrancy detection
- Complex multi-contract interactions
- Understanding call flow and dependencies
- Identifying indirect vulnerabilities

**Trade-offs:**
- Requires valid Solidity syntax (but no compilation)
- Analysis time ~2-3 seconds per contract
- Most effective on complete codebases

### Example

```bash
# Call graph scanners run with deterministic suite
tameshi scan run -i MyContract.sol --suite deterministic
```

Call graphs are generated transparently alongside AST and IR.

---

## Combined Analysis (Deterministic + LLM)

Runs all scanners together with optional LLM validation.

### How It Works

1. **14 source scanners** run on AST (fast, works on incomplete code)
2. **10 IR scanners** run on ThalIR (semantic, requires valid syntax)
3. **Call graph scanners** run on Traverse representation (cross-function analysis)
4. **1 LLM scanner** (optional) analyzes code for all vulnerability types
5. **Correlation engine** links related findings across scanners

### Benefits

- **Complete coverage** - Different scanners catch different issues across multiple representations
- **Higher confidence** - Findings confirmed by multiple scanners get higher scores
- **Cross-function detection** - Call graphs reveal vulnerabilities spanning multiple functions
- **Novel patterns** - LLM finds issues deterministic scanners miss
- **Reproducible baseline** - Deterministic scanners (14+10+graph) produce consistent results

### When to Use

**Best for:**
- Pre-deployment comprehensive audits
- High-value contracts requiring maximum confidence
- Second opinions on critical code
- Discovering both known and novel vulnerabilities

**Works on incomplete code**: Yes (source-level scanning is error-tolerant)

### Example

```bash
export OPENAI_API_KEY="sk-..."
tameshi analyze MyContract.sol \
  --correlation-threshold 0.7 \
  --cross-validated-only
```

**VSCode**: Run `Tameshi: Run All Scans` from Command Palette

This shows only findings confirmed by multiple scanners (highest confidence).

---

## Choosing the Right Mode

### Decision Tree

**Active development (incomplete code)?** → Use source scanning
- Real-time feedback as you type (<1s)
- Works on syntactically invalid code
- On-save in VSCode (default)
- Pre-commit hooks

**Need semantic precision?** → Use IR scanning
- Complete, compilable code required
- Cross-function analysis
- Pre-deployment audits

**Need maximum coverage?** → Use combined mode
- Run all 25 scanners together
- High-value contracts
- Combine all three modes
- Cross-validate findings
- Compliance documentation

---

## Scan Mode Configuration

### CLI

Choose mode with flags:

```bash
# Source + IR (deterministic)
tameshi scan run -i MyContract.sol --suite deterministic

# All modes including LLM
tameshi analyze MyContract.sol

# LLM only
tameshi analyze MyContract.sol --llm-only
```

### VSCode

Configure automatic scanning mode in settings:

```json
{
  "tameshi.scan.onSave": "file",
  "tameshi.llm.enabled": true,
  "tameshi.llm.useIrScanning": false
}
```

Set `useIrScanning: true` to send ThalIR to LLMs instead of raw source.

---

## Analysis Pipeline Details

### Source Scanning Pipeline

1. Parse Solidity with tree-sitter
2. Build AST
3. Pattern match against vulnerability signatures
4. Generate findings

### IR Scanning Pipeline

1. Parse Solidity
2. Transform to ThalIR
3. Build control flow graphs
4. Run data flow analysis
5. Pattern match on IR
6. Map findings back to source

### LLM Scanning Pipeline

1. Extract code representation (source or IR)
2. Build security-focused prompt
3. Send to LLM API
4. Parse structured response
5. Generate findings with explanations

---

## Next Steps

- [ThalIR](/thalir) - Learn about the intermediate representation
- [Scanners](/scanners) - See what each mode detects
- [CLI Reference](/cli) - Command options for each mode
