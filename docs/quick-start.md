# Quick Start

Scan your first smart contract in 5 minutes using the VSCode extension.

## Prerequisites

Install the [Tameshi VSCode Extension](https://marketplace.visualstudio.com/items?itemName=GianlucaBrigandi.tameshi-vscode) from the marketplace.

## 1. Create a Sample Contract

Open VSCode and create a file named `VulnerableBank.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Vulnerable: external call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}
```

This contract has a classic reentrancy vulnerability.

## 2. Scan in VSCode

With the file open in VSCode:

1. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
2. Type "Tameshi: Scan Current File"
3. Press Enter

The extension displays:
- **Red squiggles** under vulnerable code
- **Inline diagnostics** when hovering over issues
- **Vulnerability Triage panel** (opens automatically or click the shield icon)

## 3. Explore the Findings

### Inline Diagnostics

Hover over the red squiggly line at line 24 to see:

```
[CRITICAL] Reentrancy Vulnerability
Confidence: High (0.95)

External call at line 24 before state modification at line 27.
An attacker can re-enter the withdraw function before the balance
is updated, draining the contract.

Recommendation: Follow the Checks-Effects-Interactions pattern.
Update state before making external calls.
```

### Vulnerability Triage Panel

Click the shield icon in the activity bar to open the panel showing:
- Findings grouped by severity (Critical, High, Medium, Low)
- Click any finding to jump to the code
- Filter by confidence level
- Export to SARIF

## 4. Enable On-Save Scanning

For continuous analysis as you code:

1. Open VSCode Settings (`Cmd+,` or `Ctrl+,`)
2. Search for "tameshi.scan.onSave"
3. Confirm it's set to "file" (default)

Now Tameshi scans automatically whenever you save!

## 5. Export Results (Optional)

From VSCode Command Palette:

1. Run `Tameshi: Export SARIF Report to Workspace`
2. SARIF file is automatically saved to your workspace
3. Use it with GitHub Code Scanning, SonarQube, or other tools

Or use the CLI:

```bash
# SARIF format (for GitHub Code Scanning)
tameshi analyze VulnerableBank.sol --format json > results.sarif

# JSON format
tameshi scan run -i VulnerableBank.sol --format json > findings.json

# Markdown report
tameshi scan run -i VulnerableBank.sol --format markdown > report.md
```

## 6. Run AI-Powered Analysis (Optional)

For deeper analysis using LLM scanners:

**In VSCode:**

1. Configure API key in Settings:
   ```json
   {
     "tameshi.llm.enabled": true,
     "tameshi.llm.apiKey": "${env:OPENAI_API_KEY}"
   }
   ```

2. Set environment variable:
   ```bash
   export OPENAI_API_KEY="your-api-key"
   ```

3. Run `Tameshi: Run LLM Scan on Current File` from Command Palette

**Or use CLI:**

```bash
export OPENAI_API_KEY="your-api-key"
tameshi analyze VulnerableBank.sol --format markdown
```

This runs both deterministic scanners and LLM-powered analysis, correlating findings for higher confidence.

## Common VSCode Workflows

### Workspace Scanning

Scan all Solidity files in your project:

1. Run `Tameshi: Scan Workspace` from Command Palette
2. View all findings in the Vulnerability Triage panel
3. Group by severity, file, or rule

### Smart AI Rescan

When LLM scanning is enabled, Tameshi automatically rescans modified lines:

1. Make a code change on a line with an AI finding
2. Save the file
3. Tameshi rescans only that finding (saves API costs!)

### Filter Findings

In the Vulnerability Triage panel:
- Group by severity, file, or scanner
- Filter by minimum confidence level
- Show only correlated (cross-validated) findings

## Understanding Findings

Each finding includes:

- **Severity**: Critical, High, Medium, Low, or Informational
- **Confidence**: High (90%+), Medium (60-90%), or Low (<60%)
- **Location**: File, line number, and code snippet
- **Description**: What the vulnerability is and why it's dangerous
- **Recommendation**: How to fix it

Prioritize findings with:
- Critical or High severity
- High confidence scores
- Impact on contract value or user funds

## Next Steps

- [VSCode Guide](/vscode) - Explore all VSCode extension features
- [Scanners](/scanners) - See what vulnerabilities Tameshi detects
- [Scan Modes](/scan-modes) - Understand source vs IR vs LLM scanning
- [CLI Reference](/cli) - Use Tameshi in CI/CD pipelines
