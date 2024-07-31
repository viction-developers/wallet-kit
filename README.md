# @viction-developers/wallet-kit

**Version:** 0.0.1  
**Author:** @viction-developers  
**License:** ISC

A wallet kit for Viction-based applications, providing an easy way to integrate wallet functionalities into your React applications.

## Features

- **Wallet Connection:** Easily connect to wallets using the `ConnectButton` component.
- **Chain Support:** Built-in support for Viction Mainnet and Testnet.
- **Account and Balance Management:** Display account information and balances.
- **Error Handling:** Graceful handling of errors and chain changes.

## Installation

Install the package using npm:

```shell
npm install @viction-developers/wallet-kit
```

## Usage

Basic Example

Here’s a basic example of how to use the wallet kit in your React application:
```ts
import React, { useEffect, useState } from "react";
import { ConnectButton, WalletProvider, WalletConnector, NETWORK } from "@viction-developers/wallet-kit";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6;
`;

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connector] = useState<WalletConnector>(
    new WalletConnector(NETWORK.MAINNET)
  );

  useEffect(() => {
    // Simulate loading effect
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const handleConnect = async (wallet: EIP6963ProviderDetail | undefined) => {
    try {
      if (!connector.isConnected()) {
        await connector.connect(wallet!);
      }
      const account = await connector.getAccount();
      const balance = await connector.getBalance(account);
      setAccount(account);
      setBalance(balance);
      setChain(connector.network);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to connect");
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setBalance(null);
    console.log("Disconnected from wallet");
  };

  return (
    <Container>
      <WalletProvider>
        <ConnectButton
          connector={connector}
          connectedAccount={account}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onAccountChanged={(account) => console.log(`Account changed: ${account}`)}
          onChainChanged={(chain) => console.log(`Chain changed: ${chain.name}`)}
          onError={(error) => console.error(`Error: ${error}`)}
        />
      </WalletProvider>
    </Container>
  );
};

export default App;
```

