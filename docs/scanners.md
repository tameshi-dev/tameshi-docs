# Scanners

Tameshi includes 25 vulnerability scanners across 9 security categories.

## Overview

Each scanner detects specific vulnerability patterns and provides:

- Severity rating (Critical to Informational)
- Confidence score (0.0 to 1.0)
- Location in source code
- Evidence and explanation
- Remediation guidance

## Vulnerability Categories

### Reentrancy

Detects reentrancy vulnerabilities where external calls can re-enter functions before state updates complete.

**Scanners:**
- **IRReentrancyScanner** - Classic reentrancy via IR analysis
- **IRCrossFunctionReentrancyScanner** - Cross-function reentrancy chains
- **SourceLoopReentrancyScanner** - Reentrancy in loops
- **SourceClassicReentrancyScanner** - Fast source-level detection

**Example vulnerability:**
```solidity
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    msg.sender.call{value: amount}("");  // External call
    balances[msg.sender] -= amount;      // State update after call
}
```

**Severity:** Critical

Detects classic reentrancy, cross-function attacks, and read-only reentrancy patterns.

---

### Access Control

Detects missing or weak access control mechanisms that allow unauthorized actions.

**Scanners:**
- **IRAccessControlScanner** - Semantic access control analysis
- **SourceAccessControlScanner** - Fast source-level checks
- **SourceMissingAccessControlScanner** - Missing authorization checks

**Example vulnerability:**
```solidity
function setOwner(address newOwner) public {
    owner = newOwner;  // No access control
}
```

**Severity:** High to Critical

Finds functions that modify state without proper authorization checks.

---

### Integer Arithmetic

Detects integer overflow, underflow, and unchecked arithmetic operations.

**Scanners:**
- **IRIntegerOverflowScanner** - IR-level arithmetic analysis
- **SourceIntegerOverflowScanner** - Source-level detection
- **SourceUncheckedOverflowScanner** - Unchecked blocks

**Example vulnerability:**
```solidity
function mint(uint amount) public {
    totalSupply += amount;  // Can overflow in Solidity < 0.8
}
```

**Severity:** High

Detects unsafe arithmetic in unchecked blocks and older Solidity versions.

---

### Dangerous Operations

Detects use of dangerous low-level operations.

**Scanners:**
- **IRDangerousFunctionsScanner** - IR-level detection
- **SourceDangerousFunctionsScanner** - Source-level patterns
- **SourceDelegatecallScanner** - Delegatecall-specific analysis

**Dangerous operations:**
- `delegatecall` - Can modify caller's storage
- `selfdestruct` - Permanently destroys contract
- Inline assembly - Bypasses safety checks

**Example vulnerability:**
```solidity
function execute(address target, bytes memory data) public {
    target.delegatecall(data);  // Dangerous: no access control
}
```

**Severity:** High to Critical

Identifies risky low-level operations that need extra scrutiny.

---

### Denial of Service

Detects patterns that can cause denial of service.

**Scanners:**
- **IRDoSVulnerabilityScanner** - IR-level DoS analysis
- **SourceDoSVulnerabilitiesScanner** - Source patterns
- **ASTDoSVulnerabilitiesScanner** - AST-based detection
- **SourceGasLimitDoSScanner** - Gas limit DoS

**DoS patterns:**
- Unbounded loops over dynamic arrays
- State changes after external calls
- Gas griefing attacks

**Example vulnerability:**
```solidity
function distributeRewards(address[] memory users) public {
    for (uint i = 0; i < users.length; i++) {  // Unbounded loop
        users[i].call{value: rewards[users[i]]}("");
    }
}
```

**Severity:** Medium to High

Detects operations that can be blocked or made prohibitively expensive by attackers.

---

### Unchecked Operations

Detects unchecked return values from external calls.

**Scanners:**
- **IRUncheckedReturnScanner** - IR-level analysis
- **SourceUncheckedReturnScanner** - Source-level detection

**Example vulnerability:**
```solidity
function sendEther(address to, uint amount) public {
    to.call{value: amount}("");  // Return value not checked
}
```

**Severity:** Medium to High

Identifies external calls where failure is silently ignored.

---

### Time Dependencies

Detects reliance on block timestamp or block number for critical logic.

**Scanners:**
- **IRTimeVulnerabilityScanner** - IR-level timestamp analysis
- **SourceTimeVulnerabilitiesScanner** - Source patterns
- **SimpleTimestampScanner** - Fast timestamp detection

**Example vulnerability:**
```solidity
function claim() public {
    require(block.timestamp > deadline);  // Miner can manipulate
    // ...
}
```

**Severity:** Medium

Detects timestamp dependencies that miners can manipulate.

---

### Price Manipulation

Detects oracle manipulation and flash loan attack vectors.

**Scanners:**
- **IRPriceManipulationScanner** - Price oracle analysis

**Example vulnerability:**
```solidity
function liquidate(address user) public {
    uint price = getPriceFromDEX();  // Can be manipulated
    // Liquidation logic
}
```

**Severity:** High to Critical

Identifies price oracle usage vulnerable to flash loan attacks.

---

### State Modifications

Detects improper state management patterns.

**Scanners:**
- **IRStateModificationScanner** - State change analysis

**Example patterns:**
- State changes after external calls
- Missing validation before state updates
- Incorrect state transition logic

**Severity:** Medium to High

Tracks state modifications and detects unsafe ordering.

---

## LLM-Powered Scanners

When LLM scanning is enabled, Tameshi also runs AI-powered scanners:

- **LLMReentrancyScanner** - Novel reentrancy patterns
- **LLMAccessControlScanner** - Complex authorization logic
- **LLMIntegerOverflowScanner** - Arithmetic in business logic

Discovers vulnerabilities that don't match predefined patterns but exhibit suspicious characteristics.

---

## Confidence Scores

Scanners assign confidence scores based on:

- Pattern strength and clarity
- Presence of safe coding patterns (ReentrancyGuard, etc.)
- Context (function visibility, modifiers)
- Data flow certainty

**High confidence (0.9+):** Clear vulnerability pattern with strong evidence

**Medium confidence (0.6-0.9):** Likely vulnerability but may have false positives

**Low confidence (<0.6):** Suspicious pattern requiring manual review

---

## Coverage by Scanner Type

| Scanner Type | Speed | Precision | False Positives |
|--------------|-------|-----------|-----------------|
| Source | Fast | Medium | Higher |
| IR | Slower | High | Lower |
| LLM | Slowest | Variable | Requires review |

**Recommended usage:**
- Source scanners: Fast CI/CD feedback
- IR scanners: Precise pre-deployment audits
- LLM scanners: Comprehensive security reviews

---

## Severity Levels

**Critical:** Immediate risk of fund loss or contract compromise
- Reentrancy with value transfer
- Access control bypass on critical functions
- Dangerous delegatecall without restrictions

**High:** Significant security risk requiring prompt attention
- Integer overflow in token operations
- Unchecked external calls handling value
- DoS in critical functions

**Medium:** Moderate risk that should be addressed
- Timestamp dependencies
- Missing input validation
- Gas optimization issues with security implications

**Low:** Minor issues or potential improvements
- Code quality concerns
- Gas inefficiencies
- Best practice violations

**Informational:** No direct security risk
- Style recommendations
- Optimization suggestions

---

## Next Steps

- [Scan Modes](/scan-modes) - Choose the right scanning approach
- [CLI Reference](/cli) - Run scanners from command line
- [Configuration](/reference/configuration) - Enable/disable specific scanners
