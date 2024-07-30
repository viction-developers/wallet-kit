import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { WalletModalProps } from "../utils/types";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "16px",
    padding: "0",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "450px",
    background: "#fff",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
};

const Container = styled.div`
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
`;

const SectionTitle = styled.h4`
  margin-bottom: 15px;
  color: #8e8e93;
  font-size: 18px;
  font-weight: 500;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  margin: 10px 0;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: linear-gradient(135deg, #ff5f6d, #ffc371);
  color: white;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #ff4b5c, #ffa836);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CancelButton = styled(Button)`
  background-color: #f2f2f7;
  color: #333;
  margin-top: 20px;

  &:hover {
    background-color: #e2e2e7;
  }
`;

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const WalletIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #333;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: 20px auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onRequestClose,
  wallets,
  sponsorWallets,
  connectWallet,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching wallet information
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Replace with actual data fetching logic
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Container>
          <Header>Connect Your Wallet</Header>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <SectionTitle>Sponsor Wallets</SectionTitle>
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
                <p style={{ color: "#8e8e93" }}>No sponsor wallets detected</p>
              )}

              <SectionTitle>Other Wallets</SectionTitle>
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
                <p style={{ color: "#8e8e93" }}>No wallets detected</p>
              )}
              <CancelButton onClick={onRequestClose}>Cancel</CancelButton>
            </>
          )}
        </Container>
      </motion.div>
    </Modal>
  );
};

export default WalletModal;
