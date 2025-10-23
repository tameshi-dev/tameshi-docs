# SARIF Export

Export Tameshi findings in SARIF format for integration with security toolchains.

## What is SARIF?

SARIF (Static Analysis Results Interchange Format) is a standard JSON format for static analysis results. It's supported by:

- GitHub Code Scanning
- Azure DevOps
- VSCode SARIF Viewer extension
- Many security and compliance tools

## Exporting from CLI

### Basic Export

```bash
tameshi analyze MyContract.sol --format json > results.sarif
```

This creates a SARIF 2.1.0 compatible file.

### With Filters

Export only high-severity findings:

```bash
tameshi analyze MyContract.sol \
  --format json \
  --min-severity high \
  --min-confidence medium > critical.sarif
```

### Cross-Validated Only

Export findings confirmed by multiple scanners:

```bash
tameshi analyze MyContract.sol \
  --format json \
  --cross-validated-only \
  --correlation-threshold 0.7 > validated.sarif
```

## Exporting from VSCode

1. Run a scan (workspace or file)
2. Open command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Run `Tameshi: Export SARIF Report to Workspace`
4. Choose output location

Or right-click in the Findings panel and select "Export to SARIF".

## SARIF Structure

Tameshi SARIF files include:

```json
{
  "version": "2.1.0",
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "Tameshi",
          "version": "0.1.0",
          "informationUri": "https://github.com/tameshi-dev/tameshi"
        }
      },
      "results": [
        {
          "ruleId": "reentrancy",
          "level": "error",
          "message": {
            "text": "Reentrancy vulnerability detected"
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "file:///path/to/Contract.sol"
                },
                "region": {
                  "startLine": 14,
                  "startColumn": 5
                }
              }
            }
          ],
          "properties": {
            "severity": "Critical",
            "confidence": 0.95,
            "scanner_id": "ir_reentrancy"
          }
        }
      ]
    }
  ]
}
```

### Severity Mapping

Tameshi severity maps to SARIF levels:

| Tameshi | SARIF | Description |
|---------|-------|-------------|
| Critical | `error` | Must fix |
| High | `error` | Should fix |
| Medium | `warning` | Consider fixing |
| Low | `note` | Optional fix |
| Informational | `note` | Information only |

## GitHub Code Scanning Integration

### Upload to GitHub

Push SARIF results to GitHub:

```bash
# Generate SARIF
tameshi analyze contracts/ --format json > tameshi.sarif

# Upload using GitHub CLI
gh api repos/{owner}/{repo}/code-scanning/sarifs \
  -F commit_sha=$(git rev-parse HEAD) \
  -F ref=refs/heads/main \
  -F sarif=@tameshi.sarif
```

### GitHub Actions Workflow

Add to `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Build Tameshi
        run: |
          cd ../tameshi
          cargo build --release -p tameshi-cli

      - name: Run Security Scan
        run: |
          ../tameshi/target/release/tameshi analyze contracts/ \
            --format json \
            --min-severity medium > tameshi.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: tameshi.sarif
```

Findings will appear in the Security tab of your repository.

## VSCode SARIF Viewer

View SARIF files in VSCode:

1. Install "SARIF Viewer" extension
2. Open the SARIF file
3. Browse findings with source navigation

## CI/CD Integration

### Fail Build on Findings

```bash
#!/bin/bash

tameshi analyze contracts/ --format json > results.sarif

# Count critical findings
CRITICAL=$(jq '[.runs[0].results[] | select(.properties.severity == "Critical")] | length' results.sarif)

if [ "$CRITICAL" -gt 0 ]; then
  echo "Found $CRITICAL critical vulnerabilities"
  exit 1
fi
```

### Generate HTML Report

Convert SARIF to HTML using external tools:

```bash
# Using sarif-tools (pip install sarif-tools)
sarif html results.sarif -o report.html
```

## Filtering SARIF Output

### By Scanner

Export only findings from specific scanners:

```bash
tameshi analyze MyContract.sol --format json | \
  jq '.runs[0].results |= map(select(.properties.scanner_id == "ir_reentrancy"))' \
  > reentrancy-only.sarif
```

### By Confidence

Filter low-confidence findings:

```bash
tameshi analyze MyContract.sol --format json | \
  jq '.runs[0].results |= map(select(.properties.confidence >= 0.7))' \
  > high-confidence.sarif
```

## Tool Integration Examples

### SonarQube

Convert SARIF to SonarQube format:

```bash
# Use sarif-to-sonar converter
sarif-to-sonar results.sarif > sonar-report.json
```

### Jenkins

Archive SARIF as build artifact:

```groovy
pipeline {
  stages {
    stage('Security Scan') {
      steps {
        sh 'tameshi analyze contracts/ --format json > tameshi.sarif'
        archiveArtifacts artifacts: 'tameshi.sarif'
      }
    }
  }
}
```

### Azure DevOps

Publish SARIF results:

```yaml
- task: PublishSecurityAnalysisLogs@3
  inputs:
    artifactName: 'CodeAnalysisLogs'
    allTools: false
    toolLogsNotFoundAction: 'Standard'
```

## SARIF Limitations

### v0.1.0 Notes

- SARIF format is SARIF 2.1.0 (some tools may require conversion)
- Related locations are included for multi-location vulnerabilities
- Code flows are not yet included
- Fix suggestions are in message text, not structured fixes

## Validating SARIF Files

Validate SARIF format:

```bash
# Using sarif-tools
sarif validate results.sarif

# Using jq (check schema compliance)
jq -e '.version == "2.1.0"' results.sarif
```

## Example SARIF Output

Full example with finding details:

```json
{
  "version": "2.1.0",
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "Tameshi",
          "version": "0.1.0",
          "rules": [
            {
              "id": "reentrancy",
              "name": "Reentrancy Vulnerability",
              "shortDescription": {
                "text": "Detects reentrancy vulnerabilities"
              },
              "helpUri": "https://github.com/tameshi-dev/tameshi"
            }
          ]
        }
      },
      "results": [
        {
          "ruleId": "reentrancy",
          "level": "error",
          "message": {
            "text": "External call at line 14 before state modification at line 17. An attacker can re-enter the withdraw function before the balance is updated."
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "file:///Users/you/contracts/Bank.sol"
                },
                "region": {
                  "startLine": 14,
                  "startColumn": 5,
                  "endLine": 14,
                  "endColumn": 55,
                  "snippet": {
                    "text": "(bool success, ) = msg.sender.call{value: amount}(\"\");"
                  }
                }
              }
            }
          ],
          "relatedLocations": [
            {
              "id": 1,
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "file:///Users/you/contracts/Bank.sol"
                },
                "region": {
                  "startLine": 17,
                  "startColumn": 5
                }
              },
              "message": {
                "text": "State modification after external call"
              }
            }
          ],
          "properties": {
            "severity": "Critical",
            "confidence": 0.95,
            "scanner_id": "ir_reentrancy",
            "finding_type": "reentrancy"
          }
        }
      ]
    }
  ]
}
```

## Next Steps

- [Configuration](/reference/configuration) - Configure export settings
- [CLI Reference](/cli) - Export command options
- [VSCode Guide](/vscode) - Export from VSCode
