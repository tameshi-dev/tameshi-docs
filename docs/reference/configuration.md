# Configuration

Configure Tameshi behavior for CLI and VSCode integration.

## VSCode Configuration

Configure Tameshi in VSCode Settings (`Cmd+,` or `Ctrl+,`) or `.vscode/settings.json`.

### Essential Settings

```json
{
  "tameshi.server.path": "/path/to/tameshi-lsp/target/release/tameshi-lsp",
  "tameshi.scan.onSave": "file",
  "tameshi.scan.include": ["**/*.sol"],
  "tameshi.scan.exclude": ["**/node_modules/**", "**/test/**"],
  "tameshi.llm.enabled": false
}
```

### Server Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `tameshi.server.path` | string | - | Path to Tameshi LSP server binary |
| `tameshi.server.args` | string[] | `[]` | Additional LSP server arguments |
| `tameshi.server.env` | object | `{}` | Environment variables for server |

### Scan Behavior

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `tameshi.scan.onSave` | string | `"file"` | When to scan: `"none"`, `"file"`, `"workspace"` |
| `tameshi.scan.onSave.debounce` | number | `1000` | Debounce delay in milliseconds |
| `tameshi.scan.include` | string[] | `["**/*.sol"]` | Files to scan (glob patterns) |
| `tameshi.scan.exclude` | string[] | `["**/node_modules/**"]` | Files to exclude |
| `tameshi.scan.onIdle.enabled` | boolean | `true` | Scan when editor is idle |
| `tameshi.scan.onIdle.idleSeconds` | number | `30` | Idle threshold in seconds |

### LLM Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `tameshi.llm.enabled` | boolean | `false` | Enable LLM scanning |
| `tameshi.llm.provider` | string | `"openai"` | Provider: `"openai"` (only OpenAI supported currently) |
| `tameshi.llm.apiKey` | string | - | API key (use `${env:VAR_NAME}` for env vars) |
| `tameshi.llm.model` | string | `"gpt-4"` | Model name |
| `tameshi.llm.temperature` | number | `0.2` | Response creativity (0.0-2.0) |
| `tameshi.llm.maxTokens` | number | `4000` | Maximum response tokens |
| `tameshi.llm.confidenceThreshold` | number | `0.5` | Minimum confidence (0.0-1.0) |
| `tameshi.llm.timeoutSeconds` | number | `120` | Request timeout |
| `tameshi.llm.useIrScanning` | boolean | `false` | Send ThalIR instead of source |

### Findings Display

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `tameshi.findings.view.groupBy` | string | `"severity"` | Group by: `"severity"`, `"file"`, `"rule"` |
| `tameshi.findings.minCorrelationScore` | number | `0.5` | Minimum correlation score (0.0-1.0) |
| `tameshi.findings.mergeMode` | string | `"merged"` | Display: `"raw"` or `"merged"` |

### Editor Features

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `tameshi.editor.hovers.enabled` | boolean | `true` | Show hover information |
| `tameshi.editor.gutterIcons.enabled` | boolean | `true` | Show gutter icons |
| `tameshi.editor.codeLens.enabled` | boolean | `true` | Show CodeLens summaries |
| `tameshi.editor.statusBar.enabled` | boolean | `true` | Show status bar item |

## CLI Configuration

### Environment Variables

Set defaults via environment variables:

```bash
export TAMESHI_MIN_SEVERITY=medium
export TAMESHI_OUTPUT_FORMAT=json
export OPENAI_API_KEY=sk-...
```

### LLM Configuration File

Create `.tameshi/llm-config.yaml` in your project:

```yaml
provider:
  type: openai
  model: gpt-4
  api_key: ${OPENAI_API_KEY}

enabled_scanners:
  - reentrancy
  - access_control
  - integer_overflow

global:
  default_temperature: 0.2
  default_max_tokens: 4000
  retry_attempts: 3
  timeout_seconds: 60
  use_ir_scanning: false
```

## Example Configurations

### Development Workflow

Fast feedback with on-save file scanning:

```json
{
  "tameshi.scan.onSave": "file",
  "tameshi.scan.onSave.debounce": 500,
  "tameshi.scan.include": ["contracts/**/*.sol"],
  "tameshi.scan.exclude": [
    "**/node_modules/**",
    "**/test/**",
    "**/mocks/**"
  ],
  "tameshi.findings.view.groupBy": "severity",
  "tameshi.editor.codeLens.enabled": true,
  "tameshi.llm.enabled": false
}
```

### Security Audit

Comprehensive scanning with LLM:

```json
{
  "tameshi.scan.onSave": "none",
  "tameshi.llm.enabled": true,
  "tameshi.llm.provider": "openai",
  "tameshi.llm.model": "gpt-4",
  "tameshi.llm.apiKey": "${env:OPENAI_API_KEY}",
  "tameshi.llm.useIrScanning": true,
  "tameshi.findings.minCorrelationScore": 0.7,
  "tameshi.findings.mergeMode": "merged"
}
```

### Team Workspace

Shared settings for consistency:

```json
{
  "tameshi.server.path": "${workspaceFolder}/../tameshi-lsp/target/release/tameshi-lsp",
  "tameshi.scan.onSave": "file",
  "tameshi.scan.include": ["src/**/*.sol"],
  "tameshi.scan.exclude": [
    "**/node_modules/**",
    "**/.deps/**",
    "**/artifacts/**"
  ],
  "tameshi.findings.view.groupBy": "file",
  "tameshi.editor.hovers.enabled": true,
  "tameshi.editor.gutterIcons.enabled": true
}
```

### CI/CD Pipeline

Bash script with environment variables:

```bash
#!/bin/bash

export TAMESHI_MIN_SEVERITY=critical
export TAMESHI_OUTPUT_FORMAT=json

tameshi scan run -i src/ --format json > findings.json

# Fail if critical findings exist
if grep -q '"severity":"Critical"' findings.json; then
  echo "Critical vulnerabilities found"
  exit 1
fi
```

## Workspace vs User Settings

**User Settings** (global, all projects):
- Server path
- Editor preferences
- UI customization

**Workspace Settings** (project-specific, committed to git):
- Scan patterns
- Excluded directories
- LLM configuration
- Minimum thresholds

Commit `.vscode/settings.json` for team consistency.

## Smart AI Rescan Configuration

```json
{
  "tameshi.scan.ai.smartRescan": "file",
  "tameshi.scan.ai.smartRescan.debounce": 3000,
  "tameshi.scan.ai.smartRescan.contextLines": 2,
  "tameshi.scan.ai.smartRescan.batchThreshold": 5,
  "tameshi.scan.ai.smartRescan.minSeverity": "medium"
}
```

Options:
- `off` - Disabled
- `file` - Rescan individual files as they change
- `batch` - Batch multiple changed files for efficiency

## API Key Management

### Environment Variable (Recommended)

```bash
# In ~/.bashrc or ~/.zshrc
export OPENAI_API_KEY=sk-...
```

Then reference in settings:

```json
{
  "tameshi.llm.apiKey": "${env:OPENAI_API_KEY}"
}
```

### Direct (Not Recommended)

Avoid committing API keys to git:

```json
{
  "tameshi.llm.apiKey": "sk-..."
}
```

Add to `.gitignore`:
```
.vscode/settings.json
```

### Configuration File

Store in `.tameshi/llm-config.yaml` (add to `.gitignore`):

```yaml
provider:
  api_key: ${OPENAI_API_KEY}
```

## Next Steps

- [CLI Reference](/cli) - Command-line options
- [VSCode Guide](/vscode) - Using the extension
- [SARIF Export](/reference/sarif) - Reporting integration
