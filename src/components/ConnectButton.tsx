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

  ${(props) => props.style && { ...props.style }}// Apply custom styles
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
      console.log("chainIdNumber", chainIdNumber);
      console.log("chainInfo.id", chainInfo.id);
      // Find the chain configuration using the chainId
      if (chainInfo.id === chainIdNumber) {
        onConnect && onConnect(wallet);
      } else {
        try {
          await connector.connect(wallet);
          await connector.switchChain(chainInfo.id);
          onConnect && onConnect(wallet);
        } catch (error) {
          throw error;
        }
      }
      closeModal();
    } catch (error: any) {
      closeModal();
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

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
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
        wallets={providerDetails}
        sponsorWallets={sponsorWallets}
        connectWallet={connectWallet}
      />
    </div>
  );
};

export default ConnectButton;
