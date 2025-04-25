# Solana Wallet App using Reown AppKit

This project demonstrates a seamless integration with the Solana blockchain using Reown's AppKit. It provides a modern web interface for connecting to Solana wallets (like Phantom) and handling transactions for both SOL and USDT tokens.

## Features

- Solana wallet integration (Phantom)
- SOL token transactions
- USDT token transactions

## Prerequisites

Before you begin, ensure you have the following installed:
- [Task](https://taskfile.dev/) - Task runner for build automation
- A Solana wallet (e.g., [Phantom](https://phantom.app/))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Build the application:
```bash
task gen
```

2. Start the development server:
```bash
task serve
```

3. Open your browser and navigate to the local server address (typically shown in the console output).

4. Connect your Solana wallet when prompted.

## Console Commands

After loading the application, you can use the following commands in your browser's console:

### Connect to Wallet
```javascript
// Open the wallet connection modal
window.wallet.connect();

// Check if wallet is connected
window.wallet.isConnected();
```

### Send Transactions
```javascript
// Send SOL to an address
// Parameters: toAddress (string), token type ("SOL"), amount (number)
window.wallet.sendTransaction("RECIPIENT_ADDRESS", "SOL", 0.1);

// Send USDT to an address
// Parameters: toAddress (string), token type ("USDT"), amount (number)
window.wallet.sendTransaction("RECIPIENT_ADDRESS", "USDT", 10);
```

Note: 
- Always verify the recipient address before sending

## Development

The project uses Webpack for bundling and Task for build automation. The main configuration files are:
- `webpack.config.js` - Webpack configuration
- `Taskfile.yaml` - Task runner configuration

To modify the build process, you can edit these configuration files according to your needs.