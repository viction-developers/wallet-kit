// src/components/WalletModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '8px',
    padding: '0',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const Container = styled.div`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
`;

const Header = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
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

interface WalletModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  connectWallet: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onRequestClose,
  connectWallet,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Container>
          <Header>Connect Your Wallet</Header>
          <Button onClick={connectWallet}>Connect MetaMask</Button>
          <Button onClick={onRequestClose}>Cancel</Button>
        </Container>
      </motion.div>
    </Modal>
  );
};

export default WalletModal;
