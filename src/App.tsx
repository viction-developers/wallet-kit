import React, { useEffect, useState } from "react";
import ConnectButton from "./components/ConnectButton";
import styled from "@emotion/styled";
import { WalletProvider } from "./connectors/WalletProviders";
import { EIP6963ProviderDetail } from "./utils/types";
import { NETWORK } from "./chains";
import WalletConnector from "./connectors/WalletConnector";
import { Chain } from "viem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
`;

const AccountInfo = styled.div`
  text-align: center;

  p {
    margin: 5px 0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  margin-bot: 10px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #555;
`;

const ButtonSign = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chain, setChain] = useState<Chain | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<EIP6963ProviderDetail | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [connector] = useState<WalletConnector>(
    new WalletConnector(NETWORK.MAINNET)
  );

  useEffect(() => {
    // Simulate a loading effect for 3 seconds
    const setSupportChains = async () => {
      try {
        setTimeout(() => {
          setLoading(false);
        }, 3000); // 3-second delay
      } catch (err) {
        setTimeout(() => {
          setError("Failed to load supported chains");
          setLoading(false);
        }, 3000); // 3-second delay
      }
    };

    setSupportChains();
  }, []);

  useEffect(() => {
    // get account information after changing chains
    const loadData = async () => {
      try {
        if (chain && wallet) {
          await handleConnect(wallet);
        }
      } catch (error) {
        setError(JSON.stringify(error));
      }
    };
    loadData();
  }, [chain, wallet, account, balance]);

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
      console.log("handleConnectError", error);
      await handleError(JSON.stringify(error));
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setBalance(null);
    console.log("Disconnected from wallet");
  };

  const handleAccountChanged = async (account: string) => {
    try {
      const bal = await connector.getBalance(account);
      console.log("changeAccount", {
        account: account,
        balance: bal,
      });
      setAccount(account);
      setBalance(bal);
    } catch (error) {
      setError(JSON.stringify(error));
    }
  };

  const handleChainChanged = (chain: Chain) => {
    setChain(chain);
    setError(null);
    setLoading(false);
  };

  const handleError = (error: string) => {
    setError(error);
    if (error === "Unknown chain ID or configuration not found.") {
      handleDisconnect();
    }
  };

  const signMessage = async () => {
    try {
      const signature_1 = await connector.walletClient.signMessage({
        account,
        message: "hello world",
      });
      console.log("signature_1", signature_1);
    } catch (error) {
      setError("User rejected the request");
    }
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    color: "white",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <LoadingContainer>
          <div>
            <Spinner />
            <LoadingText>Loading...</LoadingText>
          </div>
        </LoadingContainer>
      ) : (
        <Container>
          <Title>Wallet Connector Example</Title>
          {account ? (
            <AccountInfo>
              <p>Account: {account}</p>
              <p>
                Balance: {balance} {chain?.nativeCurrency.symbol}
              </p>
              <p>Network: {chain?.name}</p>
              <ButtonSign onClick={signMessage}>Sign Hello World</ButtonSign>
            </AccountInfo>
          ) : (
            <div />
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <WalletProvider>
            <ConnectButton
              connector={connector}
              connectedAccount={account}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onAccountChanged={handleAccountChanged}
              onChainChanged={handleChainChanged}
              onError={handleError}
              // style={buttonStyle} // Active if modifier button style.
            />
          </WalletProvider>
        </Container>
      )}
    </div>
  );
};

export default App;
