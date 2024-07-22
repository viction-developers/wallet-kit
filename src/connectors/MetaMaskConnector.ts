import { createPublicClient, createWalletClient, custom, http } from 'viem';
// src/connectors/MetaMaskConnector.ts
import { formatEther } from 'viem';
import { networks } from '../chains';

interface WalletConnector {
  connect(): Promise<void>;
  disconnect(): void;
  getAccount(): Promise<string>;
  getBalance(account: string): Promise<string>;
  sendTransaction(tx: any): Promise<any>;
}

class MetaMaskConnector implements WalletConnector {
  private client: any;
  private walletClient: any;

  constructor() {
    this.client = createPublicClient({
      chain: networks.MAINNET,
      transport: http()
    });
    this.walletClient = createWalletClient({
      chain: networks.MAINNET,
      transport: custom(window.ethereum!)
    })
  }

  async connect(): Promise<void> {
    if (this.client) {
      try {
        await  this.walletClient.requestAddresses() 
      } catch (error) {
        console.log(`${error}`)
        throw new Error('User rejected the request.');
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  }

  disconnect(): void {
    this.client = null;
  }

  async getAccount(): Promise<string> {
    if (!this.client) {
      throw new Error('Wallet not connected');
    }
    const accounts = await this.client.request({ method: 'eth_accounts' });
    return accounts[0];
  }

  async getBalance(account: string): Promise<string> {
    if (!this.client) {
      throw new Error('Wallet not connected');
    }
    const balance = await this.client.getBalance({
      address: account,
    })
    const balanceAsEther = formatEther(balance) 
    return formatEther(balance);
  }

  async sendTransaction(tx: any): Promise<any> {
    if (!this.client) {
      throw new Error('Wallet not connected');
    }
    return this.client.request({
      method: 'eth_sendTransaction',
      params: [tx],
    });
  }
}

export default MetaMaskConnector;