# Digital Last Will

## Inspired by
- Alchemy University Certification Project

**Digital Last Will** is a decentralized application that allows individuals to create a smart contract-powered digital will. The system ensures that assets (ETH or ERC20 tokens) are securely distributed to designated beneficiaries if the original owner becomes inactive for a specified period.

>  Secure your assets. Automate your legacy. Trust code, not courts.

## Features

### Core Features
- **Create a Digital Will** with multiple beneficiaries and custom distribution percentages
- **Deposit ETH or ERC20 Tokens** directly into your will
- **Ping Mechanism** to prove you’re still active ("alive")
- **Automated Will Execution** after a configurable period of inactivity
- **Manual Executor Access**: Any user can trigger the will once it's eligible
- **View, Update or Cancel** your will at any time (optional)
<!-- - **Chainlink Keepers (Optional)** for automation of dead-man switch -->


## Tech Stack

| Layer       | Tech                     |
|-------------|--------------------------|
| Smart Contract | Solidity, OpenZeppelin |
| Framework   | Hardhat                  |
| Frontend    | React.js, Tailwind CSS   |
| Blockchain  | Ethereum Sepolia Testnet |
| Wallet      | MetaMask                 |
| Automation  | Chainlink Keepers (opt.) |

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/last-will-dao.git
cd last-will-dao
