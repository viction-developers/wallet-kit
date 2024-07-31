
# @viction-developers/wallet-kit

## Description

A wallet kit for Viction-based applications, providing an easy-to-use interface for connecting to Web3 wallets in React applications.

## Installation

```bash
npm install @viction-developers/wallet-kit
```

## Usage

To use the Wallet Kit, wrap your component tree with the `WalletProvider` and include the `ConnectButton` component.

```tsx
import React, { useState, useEffect } from "react";
import { WalletProvider, ConnectButton, WalletConnector } from "@viction-developers/wallet-kit";
import { NETWORK } from "@viction-developers/wallet-kit/chains";

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [connector] = useState<WalletConnector>(new WalletConnector(NETWORK.MAINNET));

  const handleConnect = async (wallet: any) => {
    try {
      await connector.connect(wallet);
      setAccount(await connector.getAccount());
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
  };

  return (
    <WalletProvider>
      <div>
        {account ? <p>Connected Account: {account}</p> : <p>No account connected</p>}
        <ConnectButton
          connector={connector}
          connectedAccount={account}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>
    </WalletProvider>
  );
};

export default App;
```

## Props

The `ConnectButton` component accepts the following props:

- **`connector`**: `WalletConnector` instance.
  - An instance of the WalletConnector, which handles the connection logic.

- **`connectedAccount`**: `string | null` (Optional)
  - The currently connected account address. If provided, it will display the connected state.

- **`onConnect`**: `function`
  - A function that is called when a wallet is successfully connected. The function receives the connected wallet as an argument.

- **`onDisconnect`**: `function`
  - A function that is called when the wallet is disconnected.

- **`onAccountChanged`**: `function`
  - A function that is called when the connected account changes. The new account address is passed as an argument.

- **`onChainChanged`**: `function`
  - A function that is called when the blockchain network (chain) changes. The new chain information is passed as an argument.

- **`onError`**: `function`
  - A function that is called when an error occurs during the connection process. The error message is passed as an argument.

- **`style`**: `React.CSSProperties` (Optional)
  - Custom styles for the connect button. This allows overriding the default button styles.

## License

ISC

## Author

Endale Dinh
