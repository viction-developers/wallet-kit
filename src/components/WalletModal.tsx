import React from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { EIP6963ProviderDetail } from "../utils/types";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "8px",
    padding: "0",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
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

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const WalletIcon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

interface WalletModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  wallets: EIP6963ProviderDetail[];
  sponsorWallets: EIP6963ProviderDetail[];
  connectWallet: (wallet: EIP6963ProviderDetail) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onRequestClose,
  wallets,
  sponsorWallets,
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

          <h4> Sponsor Wallet</h4>
          {sponsorWallets.length > 0 ? (
            sponsorWallets.map((wallet) => (
              <WalletItem key={wallet.info.uuid}>
                <WalletIcon src={wallet.info.icon} alt={wallet.info.name} />
                <Button onClick={() => connectWallet(wallet)}>
                  Connect {wallet.info.name}
                </Button>
              </WalletItem>
            ))
          ) : (
            <p>No wallets detected</p>
          )}
          <h4> Another Wallet</h4>
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <WalletItem key={wallet.info.uuid}>
                <WalletIcon src={wallet.info.icon} alt={wallet.info.name} />
                <Button onClick={() => connectWallet(wallet)}>
                  Connect {wallet.info.name}
                </Button>
              </WalletItem>
            ))
          ) : (
            <p>No wallets detected</p>
          )}
          <Button onClick={onRequestClose}>Cancel</Button>
        </Container>
      </motion.div>
    </Modal>
  );
};

export default WalletModal;
