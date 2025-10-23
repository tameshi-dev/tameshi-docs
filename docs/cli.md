# CLI Reference

Complete reference for Tameshi command-line interface.

## Commands Overview

| Command | Purpose |
|---------|---------|
| `scan run` | Run vulnerability scanners on Solidity files |
| `transform sol2ir` | Convert Solidity to ThalIR intermediate representation |
| `analyze` | Run combined deterministic + LLM analysis |
| `pipeline` | Full Solidity → ThalIR transformation pipeline |
| `debug` | Debug IR dump for analysis |
| `validate` | Validate ThalIR syntax |

## scan run

Run deterministic vulnerability scanners on Solidity source files.

### Basic Usage

```bash
tameshi scan run -i <file-or-directory>
```

### Examples

Scan a single file:

```bash
tameshi scan run -i MyContract.sol
```

Scan all contracts in a directory:

```bash
tameshi scan run -i contracts/
```

Scan with JSON output:

```bash
tameshi scan run -i MyContract.sol --format json > findings.json
```

### Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--input`, `-i` | path | - | Input file or directory to scan |
| `--suite` | `deterministic`, `all` | `deterministic` | Scanner suite to use |
| `--format` | `console`, `json`, `markdown` | `console` | Output format |
| `--min-confidence` | `low`, `medium`, `high` | `medium` | Minimum confidence threshold |
| `--verbose`, `-v` | - | false | Show detailed scanning progress |

### Output Formats

**Console** (default):
```
[CRITICAL] Reentrancy Vulnerability
  Location: Bank.sol:14
  Confidence: High (0.95)
  ...
```

**JSON**:
```json
{
  "findings": [
    {
      "severity": "Critical",
      "confidence": 0.95,
      "title": "Reentrancy Vulnerability",
      "location": { "file": "Bank.sol", "line": 14 }
    }
  ]
}
```

**Markdown**:
```markdown
## Critical Findings

### Reentrancy Vulnerability
- **Location**: Bank.sol:14
- **Confidence**: High (0.95)
```

## transform sol2ir

Convert Solidity source code to ThalIR intermediate representation.

### Basic Usage

```bash
tameshi transform sol2ir -i <input-file>
```

### Examples

Transform to text format:

```bash
tameshi transform sol2ir -i MyContract.sol --format text
```

Transform to JSON:

```bash
tameshi transform sol2ir -i MyContract.sol --format json -o output.json
```

### Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--input`, `-i` | path | - | Input Solidity file |
| `--format`, `-f` | `text`, `json`, `json-pretty` | `json` | Output format |
| `--output`, `-o` | path | stdout | Output file path |
| `--verbose`, `-v` | - | false | Show transformation details |

### When to Use

Transform Solidity to ThalIR to:
- Inspect the IR representation
- Debug IR-level scanner behavior
- Develop custom IR-based scanners
- Submit IR to external analysis tools

## analyze

Run comprehensive analysis combining deterministic scanners and LLM-powered detection.

### Basic Usage

```bash
tameshi analyze <file-or-directory>
```

### Examples

Run hybrid analysis with default settings:

```bash
export OPENAI_API_KEY="your-key"
tameshi analyze MyContract.sol
```

Analyze with custom model:

```bash
tameshi analyze MyContract.sol --model gpt-4 --format json
```

Filter correlated findings only:

```bash
tameshi analyze MyContract.sol --cross-validated-only
```

### Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--format`, `-f` | `text`, `json`, `markdown` | `text` | Output format |
| `--min-severity`, `-s` | `low`, `medium`, `high`, `critical` | `low` | Minimum severity |
| `--min-confidence`, `-c` | `low`, `medium`, `high` | `low` | Minimum confidence |
| `--cross-validated-only` | - | false | Show only correlated findings |
| `--correlation-threshold` | 0.0-1.0 | 0.7 | Correlation score threshold |
| `--model` | model name | `gpt-4o` | LLM model to use |
| `--output`, `-o` | path | stdout | Output file path |
| `--no-llm` | - | false | Skip LLM analysis |
| `--llm-only` | - | false | Only run LLM scanners |
| `--verbose`, `-v` | - | false | Enable verbose output |

### LLM Configuration

Set your API key via environment variable:

```bash
export OPENAI_API_KEY="sk-..."
```

Or use a configuration file at `.tameshi/llm-config.yaml`:

```yaml
provider:
  type: openai
  model: gpt-4
  api_key: ${OPENAI_API_KEY}
```

## Common Workflows

### CI/CD Pipeline

Fail builds on critical vulnerabilities:

```bash
tameshi scan run -i src/ --min-severity critical --format json
if [ $? -ne 0 ]; then
  echo "Critical vulnerabilities found"
  exit 1
fi
```

### Pre-Commit Hook

Quick scan before committing:

```bash
#!/bin/bash
# .git/hooks/pre-commit
git diff --cached --name-only | grep ".sol$" | while read file; do
  tameshi scan run -i "$file" --min-confidence high
done
```

### Security Audit Report

Generate comprehensive markdown report:

```bash
tameshi analyze contracts/ \
  --format markdown \
  --min-confidence medium \
  --cross-validated-only > audit-report.md
```

### Fast Feedback Loop

Scan only changed files with high confidence:

```bash
tameshi scan run -i MyContract.sol --min-confidence high --verbose
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success, no critical findings |
| 1 | Critical or high severity findings detected |
| 2 | Scan failed due to error |

## Configuration

Configure default behavior in `.vscode/settings.json` (for VSCode integration) or via environment variables:

```bash
# Set default minimum severity
export TAMESHI_MIN_SEVERITY=medium

# Set default output format
export TAMESHI_OUTPUT_FORMAT=json
```

## Debug and Validation Commands

### debug

Dump IR structure for debugging:

```bash
tameshi debug -i MyContract.sol --verbose
```

### validate

Validate ThalIR syntax:

```bash
tameshi validate -i output.thalir
```

### pipeline

Run full transformation pipeline:

```bash
tameshi pipeline -i MyContract.sol
```

## Next Steps

- [VSCode Extension](/vscode) - Use Tameshi in your editor
- [Scanners](/scanners) - Learn about vulnerability detectors
- [Configuration](/reference/configuration) - Customize Tameshi behavior
