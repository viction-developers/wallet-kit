import React, { createContext, useContext, useEffect, useState } from "react";
import { NETWORK } from "../chains";
import { EIP6963ProviderDetail } from "../utils/types";
import WalletConnector from "./WalletConnector";

interface WalletProviderContextType {
  providerDetails: EIP6963ProviderDetail[];
  sponsorWallets: EIP6963ProviderDetail[];
  detectProviders: () => Promise<void>;
}

const WalletProviderContext = createContext<
  WalletProviderContextType | undefined
>(undefined);

const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [providerDetails, setProviderDetails] = useState<
    EIP6963ProviderDetail[]
  >([]);

  const [sponsorWallets, setSponsorWallets] = useState<EIP6963ProviderDetail[]>(
    []
  );

  const connector = new WalletConnector(NETWORK.MAINNET);

  const detectProviders = async () => {
    try {
      await connector.detectEIP6963();
      setProviderDetails(connector.getProviderDetails());
      setSponsorWallets(connector.getSponsorProviders());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    detectProviders();
  }, []);

  return (
    <WalletProviderContext.Provider
      value={{ providerDetails, sponsorWallets, detectProviders }}
    >
      {children}
    </WalletProviderContext.Provider>
  );
};

const useWalletProviders = () => {
  const context = useContext(WalletProviderContext);
  if (!context) {
    throw new Error("useWalletProviders must be used within a WalletProvider");
  }
  return context;
};

export { WalletProvider, useWalletProviders };
