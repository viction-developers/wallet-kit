import { useState, useEffect } from 'react';
import MetaMaskConnector from '../connectors/MetaMaskConnector';

const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const connector = new MetaMaskConnector();

  useEffect(() => {
    const init = async () => {
      await connector.connect();
      const acc = await connector.getAccount();
      setAccount(acc);
      const bal = await connector.getBalance(acc);
      setBalance(bal);
    };

    init();
  }, []);

  return { account, balance };
};

export default useWallet;
