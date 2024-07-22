// src/components/ConnectButton.tsx
import React, { useState } from 'react';
import MetaMaskConnector from '../connectors/MetaMaskConnector';
import WalletModal from './WalletModal';
import styled from '@emotion/styled';

const ConnectButtonStyled = styled.button`
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

const AccountInfo = styled.div`
  text-align: center;

  p {
    margin: 5px 0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const ConnectButton: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const connector = new MetaMaskConnector();

  const connectWallet = async () => {
    try {
      await connector.connect();
      const acc = await connector.getAccount();
      setAccount(acc);
      const bal = await connector.getBalance(acc);
      setBalance(bal);
      closeModal();
    } catch (error: any) {
      if (error.message === 'User rejected the request.') {
        setError('Connection request was rejected by the user.');
      } else {
        setError(error.message);
      }
    }
  };

  const disconnectWallet = () => {
    connector.disconnect();
    setAccount(null);
    setBalance(null);
  };

  const openModal = () => {
    setError(null); // Clear previous errors
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      {account ? (
        <AccountInfo>
          <p>Account: {account}</p>
          <p>Balance: {balance} ETH</p>
          <ConnectButtonStyled onClick={disconnectWallet}>
            Disconnect
          </ConnectButtonStyled>
        </AccountInfo>
      ) : (
        <div>
          <ConnectButtonStyled onClick={openModal}>
            Connect Wallet
          </ConnectButtonStyled>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      )}
      <WalletModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        connectWallet={connectWallet}
      />
    </div>
  );
};

export default ConnectButton;