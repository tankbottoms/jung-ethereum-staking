# StakeWise Exit Queue Transaction Analysis

**TX:** [`0x7f6de35b604eb62b5db79a9c0b7944e75efc64821b74c08cb4dd0a6ab2122cbc`](https://etherscan.io/tx/0x7f6de35b604eb62b5db79a9c0b7944e75efc64821b74c08cb4dd0a6ab2122cbc)

**Contract:** [StakeWise: Chorus One Max Vault](https://etherscan.io/address/0xe6d8d8ac54461b1c5ed15740eee322043f696c08) (ERC1967 Proxy -> EthVault implementation at `0x927a83c679a5e1a6435d6bfaef7f20d4db23e2cc`)

**Method Called:** `enterExitQueue(uint256 shares, address receiver)` (selector `0x8ceab9aa`)

**Status:** Success, block 24,614,821 at 2026-03-08 19:25:11 UTC

---

## Decoded Parameters

| Parameter | Value |
|-----------|-------|
| `shares` | 1,479,328,247,112,265,996 (~1.4793 ETH worth of vault shares) |
| `receiver` | `0x12be23fe58132ce4128503fa22be93c72de5cbdb` (same as sender) |

## Event Emitted: `ExitQueueEntered`

| Field | Value |
|-------|-------|
| `owner` | `0x12be23fe58132ce4128503fa22be93c72de5cbdb` |
| `receiver` | `0x12be23fe58132ce4128503fa22be93c72de5cbdb` |
| `positionTicket` | `102566688116739847095594` |
| `shares` | `1479328247112265996` |

---

## Claiming Funds

### Step 1 -- Wait for the vault to process the exit

The vault must create a checkpoint that covers the position ticket. This happens when the vault's oracle updates state (via `updateState()`). Check readiness by calling:

```solidity
getExitQueueIndex(102566688116739847095594)
```

- Returns **-1**: Not yet processed, keep waiting
- Returns **>= 0**: Checkpoint index found, proceed to step 2

### Step 2 -- Wait for the claim delay

After the checkpoint exists, the contract enforces `_exitingAssetsClaimDelay`. The `claimExitedAssets` function reverts if `block.timestamp < timestamp + _exitingAssetsClaimDelay`. This delay is typically 24 hours for StakeWise V3 vaults.

### Step 3 -- Call `claimExitedAssets`

Once the delay has passed, call:

```solidity
claimExitedAssets(
    positionTicket: 102566688116739847095594,
    timestamp:      1772997911,
    exitQueueIndex: <value from getExitQueueIndex>
)
```

Preview what you'll receive first by calling (read-only):

```solidity
calculateExitedAssets(
    receiver:       0x12be23fe58132ce4128503fa22be93c72de5cbdb,
    positionTicket: 102566688116739847095594,
    timestamp:      1772997911,
    exitQueueIndex: <value from getExitQueueIndex>
)
// Returns: (leftTickets, exitedTickets, exitedAssets)
```

---

## Timeline Summary

1. **Now** -- Shares are locked in exit queue (done, this tx)
2. **~hours to days** -- Vault processes exits during next oracle update / validator withdrawal
3. **+ claim delay** (typically 24h after checkpoint) -- Call `claimExitedAssets` to receive ETH

No other actions are needed by the address besides monitoring `getExitQueueIndex` and calling `claimExitedAssets` when ready.

## Monitoring

- [Vault Read Contract (Etherscan)](https://etherscan.io/address/0xe6d8d8ac54461b1c5ed15740eee322043f696c08#readProxyContract) -- use `getExitQueueIndex` with position ticket
- [StakeWise App](https://app.stakewise.io/vaults) -- GUI for tracking withdrawal status

---

*Analysis date: 2026-03-08*
