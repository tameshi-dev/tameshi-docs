# Tameshi Documentation

Documentation for Tameshi - Real-time vulnerability scanner for Solidity smart contracts.

**Live Site**: [https://tameshi.dev](https://tameshi.dev)

## Quick Start

```bash
# Install VSCode extension
# Search "Tameshi Security Scanner" in Extensions

# Or build CLI from source
cd ../tameshi
cargo build --release -p tameshi-cli
./target/release/tameshi scan run -i contracts/
```

## Development

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run preview
```

Deploys automatically to `https://tameshi.dev` via GitHub Actions on push to `main`.

## Documentation

```
docs/
├── index.md              # Landing page
├── install.md            # Installation (CLI + VSCode + LSP)
├── quick-start.md        # 5-minute tutorial
├── cli.md                # CLI reference
├── vscode.md             # VSCode extension
├── scanners.md           # 25 vulnerability scanners
├── scan-modes.md         # Source/IR/LLM analysis
├── thalir.md             # ThalIR intermediate representation
└── reference/
    ├── configuration.md  # Configuration options
    └── sarif.md          # SARIF export
```

## Features

- **25 vulnerability scanners**: Reentrancy, access control, integer overflows, DoS, dangerous operations
- **Multi-tier analysis**: 14 source + 10 IR + 1 LLM scanner
- **Works on incomplete code**: Tree-sitter parser, no compilation required, <1s scans
- **VSCode integration**: Real-time inline diagnostics, findings triage panel
- **SARIF export**: GitHub Code Scanning, Azure DevOps, SonarQube

Performance: <1s for source scanning, ~3-5s for IR analysis

## Tech Stack

- VitePress 1.6.4 + vitepress-plugin-mermaid
- GitHub Actions + GitHub Pages
- Custom domain: tameshi.dev

## Links

- [Production](https://tameshi.dev)
- [GitHub](https://github.com/tameshi-dev/tameshi)
- [Issues](https://github.com/tameshi-dev/tameshi/issues)

MIT License
