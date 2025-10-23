# Installation

Get Tameshi up and running in minutes with VSCode integration.

## Install VSCode Extension (Recommended)

The VSCode extension is the primary way to use Tameshi for real-time security analysis as you code.

### From Marketplace

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=tameshi.tameshi-vscode) or search "Tameshi Security Scanner" in the Extensions view.

**First Run:**

The extension automatically downloads the LSP server binary on first activation. Supported platforms:
- macOS (Intel & Apple Silicon)
- Linux (x64 & ARM64)
- Windows (x64)

Manual download: Command Palette → `Tameshi: Download Language Server`

### From VSIX (Development)

For development or pre-release versions:

```bash
code --install-extension tameshi-vscode-0.1.8.vsix
```

### Verify Installation

1. Open a `.sol` file in VSCode
2. Look for the Tameshi shield icon in the activity bar (left sidebar)
3. Run `Tameshi: Scan Current File` from the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
4. Findings should appear inline and in the Vulnerability Triage panel

### Configuration (Optional)

The extension works with default settings. To customize:

**Basic Settings** (`.vscode/settings.json`):
```json
{
  "tameshi.scan.onSave": "file",
  "tameshi.llm.enabled": false
}
```

**Custom LSP Server Path** (for development):
```json
{
  "tameshi.server.path": "/custom/path/to/tameshi-lsp"
}
```

## Install CLI (Optional)

The CLI is useful for CI/CD pipelines and command-line workflows.

### Prerequisites

- **Rust toolchain** (1.70+) - [Install via rustup](https://rustup.rs/)
- **Git** - For cloning repositories

Verify Rust installation:

```bash
rustc --version
cargo --version
```

### Build from Source

Clone and build the Tameshi CLI:

```bash
cd ../tameshi
cargo build --release -p tameshi-cli
```

The binary will be at `target/release/tameshi`.

Add it to your PATH or create a symlink:

```bash
# Option 1: Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$PATH:/path/to/tameshi/target/release"

# Option 2: Create symlink
sudo ln -s /path/to/tameshi/target/release/tameshi /usr/local/bin/tameshi
```

### Verify CLI Installation

Run a quick scan on a sample contract:

```bash
echo 'contract Test { function send(address to) public { to.call{value: 1 ether}(""); } }' > test.sol
tameshi scan run -i test.sol
```

You should see vulnerability findings related to unchecked external calls.

## Next Steps

- [Quick Start](/quick-start) - Run your first scan in VSCode
- [VSCode Guide](/vscode) - Explore all VSCode features
- [CLI Reference](/cli) - Learn CLI commands for CI/CD
