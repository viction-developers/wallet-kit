import { Chain } from "viem";

export interface WalletConnectorInterface {
  detectChain(): Promise<Chain | undefined>;
  connect(wallet: EIP6963ProviderDetail): Promise<void>;
  disconnect(): void;
  getAccount(): Promise<string>;
  getBalance(account: string): Promise<string>;
  sendTransaction(tx: any): Promise<any>;
  getProviderDetails(): EIP6963ProviderDetail[];
  // getCurrentChain(): Chain | null;
}

export interface WalletModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  wallets: EIP6963ProviderDetail[];
  sponsorWallets: EIP6963ProviderDetail[];
  connectWallet: (wallet: EIP6963ProviderDetail) => void;
}

export interface EIP1193Provider {
  request: (payload: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
  on(eventName: string, callback: (...args: any[]) => void): void;
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns?: string;
}

export interface EIP6963ProviderDetail {
  accounts: string[];
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

export interface EVMProviderDetected extends EIP6963ProviderDetail {
  accounts: string[];
  request?: EIP1193Provider["request"];
}

export interface EIP6963AnnounceProviderEvent extends Event {
  detail: EIP6963ProviderDetail;
}
