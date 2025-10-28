# VSCode Extension

Real-time security analysis as you write Solidity code.

## Overview

The Tameshi VSCode extension provides:

- **Inline diagnostics** - See vulnerabilities directly in your code
- **Findings triage panel** - Organize and prioritize security issues
- **Smart AI rescan** - Track code changes and rescan affected findings
- **One-click SARIF export** - Generate reports for compliance

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GianlucaBrigandi.tameshi-vscode) or search "Tameshi Security Scanner" in the Extensions view.

The LSP server is automatically downloaded on first activation. See the [Installation Guide](/install#install-vscode-extension-recommended) for details.

## Running Scans

### Command Palette

Open the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) and run:

- `Tameshi: Scan Current File` - Scan the active file
- `Tameshi: Scan Workspace` - Scan all Solidity files in workspace
- `Tameshi: Run LLM Scan on Current File` - AI-powered analysis of current file
- `Tameshi: Run LLM Scan on Workspace` - AI analysis of entire workspace
- `Tameshi: Run All Scans` - Execute deterministic + LLM scans

### Automatic Scanning

Enable automatic scanning when you save files:

1. Open Settings (`Cmd+,` or `Ctrl+,`)
2. Search for `tameshi.scan.onSave`
3. Choose:
   - `none` - Manual scanning only
   - `file` - Scan current file on save
   - `workspace` - Scan entire workspace on save

Add to `.vscode/settings.json`:

```json
{
  "tameshi.scan.onSave": "file"
}
```

### Idle Scanning

Tameshi can scan automatically when your editor is idle:

```json
{
  "tameshi.scan.onIdle.enabled": true,
  "tameshi.scan.onIdle.idleSeconds": 30
}
```

## Viewing Findings

### Inline Diagnostics

Vulnerable code is highlighted with squiggly underlines:

- Red: Critical or High severity
- Yellow: Medium severity
- Blue: Low or Informational

Hover over the underline to see:
- Finding title and description
- Severity and confidence score
- Scanner that detected it
- Remediation guidance

### Findings Panel

Click the Tameshi shield icon in the activity bar to open the Vulnerability Triage panel.

**Group findings by:**
- Severity (default)
- File
- Scanner/Rule

**Filter findings:**
- Minimum severity threshold
- Minimum confidence level
- Correlation score

**Actions:**
- Click a finding to jump to the code
- Right-click for quick actions
- Export all findings to SARIF

### CodeLens

Enable inline summary lenses above functions:

```json
{
  "tameshi.editor.codeLens.enabled": true,
  "tameshi.editor.codeLens.showFunctionSummary": true
}
```

Summaries appear as:

```solidity
// 2 vulnerabilities: 1 Critical, 1 High
function withdraw(uint256 amount) public {
  ...
}
```

## Smart AI Rescan

Smart AI rescan tracks your code changes and automatically rescans only the affected findings.

### How It Works

1. You run an initial LLM scan
2. Tameshi tracks which lines have findings
3. As you edit code, Tameshi monitors changes
4. When you modify a line with a finding, it's rescanned automatically
5. Findings are updated with new analysis

### Configuration

```json
{
  "tameshi.scan.ai.smartRescan": "file",
  "tameshi.scan.ai.smartRescan.debounce": 3000,
  "tameshi.scan.ai.smartRescan.contextLines": 2
}
```

Options:
- `off` - Disabled
- `file` - Rescan individual files
- `batch` - Batch multiple files for efficiency

### When to Use

Smart AI rescan is useful when:
- Iterating on fixes for LLM-detected issues
- Verifying remediation without full rescans
- Working on code that previously had findings

## Configuration Options

### Essential Settings

```json
{
  "tameshi.server.path": "/path/to/tameshi-lsp/target/release/tameshi-lsp",

  "tameshi.scan.onSave": "file",
  "tameshi.scan.include": ["**/*.sol"],
  "tameshi.scan.exclude": ["**/node_modules/**", "**/test/**"],

  "tameshi.llm.enabled": true,
  "tameshi.llm.provider": "openai",
  "tameshi.llm.model": "gpt-4",

  "tameshi.findings.minCorrelationScore": 0.5,
  "tameshi.findings.view.groupBy": "severity"
}
```

### UI Customization

Control what you see in the editor:

```json
{
  "tameshi.editor.hovers.enabled": true,
  "tameshi.editor.gutterIcons.enabled": true,
  "tameshi.editor.codeLens.enabled": true,
  "tameshi.editor.statusBar.enabled": true
}
```

### LLM Configuration

Configure AI scanning:

```json
{
  "tameshi.llm.enabled": true,
  "tameshi.llm.provider": "openai",
  "tameshi.llm.model": "gpt-4",
  "tameshi.llm.temperature": 0.2,
  "tameshi.llm.maxTokens": 4000,
  "tameshi.llm.confidenceThreshold": 0.5,
  "tameshi.llm.useIrScanning": false
}
```

Store your API key securely:

```json
{
  "tameshi.llm.apiKey": "${env:OPENAI_API_KEY}"
}
```

Or set it as an environment variable:

```bash
export OPENAI_API_KEY="sk-..."
```

## Exporting Findings

### SARIF Export

Export findings in SARIF format for GitHub Code Scanning or other tools:

1. Run a scan
2. Open command palette
3. Run `Tameshi: Export SARIF Report to Workspace`
4. Select output location

Or right-click in the Findings panel and select "Export to SARIF".

### JSON Export

For programmatic processing, export as JSON using the CLI:

```bash
tameshi scan run -i MyContract.sol --format json > findings.json
```

## Keyboard Shortcuts

You can add custom shortcuts in VSCode:

```json
{
  "key": "cmd+shift+s",
  "command": "tameshi.scanFile.client",
  "when": "editorLangId == solidity"
}
```

## Best Practices

### Development Workflow

1. Enable on-save file scanning for fast feedback
2. Run workspace scans before commits
3. Use LLM scans for comprehensive pre-deployment audits
4. Export SARIF reports for compliance documentation

### Team Collaboration

Share workspace settings in `.vscode/settings.json`:

```json
{
  "tameshi.scan.include": ["contracts/**/*.sol"],
  "tameshi.scan.exclude": ["contracts/mocks/**", "contracts/test/**"],
  "tameshi.findings.minCorrelationScore": 0.7
}
```

Commit this file so the team has consistent configuration.

### CI/CD Integration

Use VSCode for development and CLI for CI/CD:

- **Local**: VSCode extension for real-time feedback
- **CI**: CLI scans with `--min-severity critical`
- **Pre-deploy**: CLI hybrid analysis with SARIF export

## Next Steps

- [Configuration Reference](/reference/configuration) - All configuration options
- [Scanners](/scanners) - What vulnerabilities are detected
- [SARIF Export](/reference/sarif) - Integration with other tools
