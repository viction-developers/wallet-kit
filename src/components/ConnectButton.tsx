import React, { useState, useEffect, useCallback } from "react";
import WalletModal from "./WalletModal";
import styled from "@emotion/styled";
import WalletConnector from "../connectors/WalletConnector";
import { useWalletProviders } from "../connectors/WalletProviders";
import { EIP6963ProviderDetail } from "../utils/types";
import { Chain } from "viem";

interface ConnectButtonProps {
  connector: WalletConnector;
  connectedAccount?: string | null;
  supportedChains?: Record<number, Chain> | undefined;
  onConnect?: (provider: EIP6963ProviderDetail | undefined) => void;
  onDisconnect?: () => void;
  onAccountChanged?: (account: string) => void;
  onChainChanged?: (chainInfo: Chain) => void;
  onError?: (error: string) => void;
  style?: React.CSSProperties; // Add style prop for custom styles
}

const ConnectButtonStyled = styled.button<React.CSSProperties>`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: linear-gradient(135deg, #ff5f6d, #ffc371); /* Vibrant gradient */
  color: white;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #ff4b5c, #ffa836);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${(props) => props.style && { ...props.style }}// Allow custom styles
`;

const ConnectButton: React.FC<ConnectButtonProps> = ({
  connector,
  connectedAccount,
  supportedChains,
  onConnect,
  onDisconnect,
  onAccountChanged,
  onChainChanged,
  onError,
  style,
}) => {
  const { providerDetails } = useWalletProviders();
  const { sponsorWallets } = useWalletProviders();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const modifyProviders = useCallback(
    (provider: EIP6963ProviderDetail) => {
      const updatedProviders = providerDetails.map((p) =>
        p.info.uuid === provider.info.uuid ? provider : p
      );
      console.log("updateProviders", updatedProviders);
      // You may want to update the state with the modified providers if necessary
      // setProviderDetails(updatedProviders);
    },
    [providerDetails]
  );

  const connectWallet = async (wallet: EIP6963ProviderDetail) => {
    try {
      const chainInfo = connector.getChainInfo();
      const chainID = (await wallet.provider.request({
        method: "eth_chainId",
      })) as string;

      const chainIdNumber = parseInt(chainID, 16);
      // Find the chain configuration using the chainId
      if (chainInfo.id === chainIdNumber) {
        onConnect && onConnect(wallet);
      } else {
        await connector.connect(wallet);
        await connector.switchChain(chainInfo.id);
        onConnect && onConnect(wallet);
      }
      setModalIsOpen(false); // Ensure this state update is wrapped in act in tests
    } catch (error: any) {
      setModalIsOpen(false);
      if (error.code === 4001) {
        onError && onError(error.message);
      } else {
        onError && onError(error);
      }
    }
  };

  const disconnectWallet = () => {
    connector.disconnect();
    onDisconnect && onDisconnect();
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    if (!providerDetails) return;
    try {
      providerDetails.forEach((provider) => {
        if (!provider.provider) return;
        const currentProvider = provider.provider;
        currentProvider.on("accountsChanged", (accounts: string[]) => {
          modifyProviders(provider);
          if (accounts.length > 0) {
            onAccountChanged && onAccountChanged(accounts[0]);
          } else {
            disconnectWallet();
          }
        });

        currentProvider.on("chainChanged", async (chainID: string) => {
          const chainIdNumber = parseInt(chainID, 16);
          const chainInfo = connector.getChainInfo();
          if (chainInfo.id === chainIdNumber) {
            onChainChanged && onChainChanged(chainInfo);
          } else {
            onError && onError("Unknown chain ID or configuration not found.");
          }
        });
        currentProvider.on("disconnect", (error: Error) => {
          onError && onError("Wallet disconnected.");
          disconnectWallet();
        });
      });
    } catch (error) {
      throw error;
    }
  }, [providerDetails, modifyProviders, supportedChains]);

  return (
    <div>
      {connectedAccount ? (
        <ConnectButtonStyled style={style} onClick={disconnectWallet}>
          Disconnect
        </ConnectButtonStyled>
      ) : (
        <div>
          <ConnectButtonStyled style={style} onClick={openModal}>
            Connect Wallet
          </ConnectButtonStyled>
        </div>
      )}
      <WalletModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        wallets={providerDetails || []}
        sponsorWallets={sponsorWallets || []}
        connectWallet={connectWallet}
      />
    </div>
  );
};

export default ConnectButton;
