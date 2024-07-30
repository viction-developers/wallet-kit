import { EIP6963ProviderDetail } from "./../utils/types";
import {
  createClient,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatEther,
  Chain,
} from "viem";
import { WalletConnectorInterface } from "../utils/types";
import { supportNetworks, NETWORK } from "../chains";
import { initAbstractionWallet } from "@abstraction-hq/wallet-sdk";

initAbstractionWallet();

class WalletConnector implements WalletConnectorInterface {
  private providerDetails: EIP6963ProviderDetail[] = [];
  private sponsorProviders: EIP6963ProviderDetail[] = [];

  public network: Chain;
  public provider: any;
  public client: any;
  public walletClient: any;
  public publicClient: any;

  constructor(chain: NETWORK) {
    this.network = supportNetworks[chain];

    this.client = createClient({
      chain: this.network!,
      transport: http(),
    });
  }

  existsProviderDetail(newProviderDetail: EIP6963ProviderDetail): boolean {
    const sponsorExist = !!this.sponsorProviders.find(
      (providerDetail) =>
        providerDetail.info &&
        newProviderDetail.info &&
        providerDetail.info.uuid === newProviderDetail.info.uuid
    );

    const anotherExist = !!this.providerDetails.find(
      (providerDetail) =>
        providerDetail.info &&
        newProviderDetail.info &&
        providerDetail.info.uuid === newProviderDetail.info.uuid
    );

    return sponsorExist && anotherExist;
  }

  existsSponsorDetail(newProviderDetail: EIP6963ProviderDetail): boolean {
    return !!this.providerDetails.find(
      (providerDetail) =>
        providerDetail.info &&
        newProviderDetail.info &&
        providerDetail.info.uuid === newProviderDetail.info.uuid
    );
  }

  handleNewProviderDetail(newProviderDetail: EIP6963ProviderDetail) {
    if (!this.existsProviderDetail(newProviderDetail)) {
      if (newProviderDetail?.info?.rdns == "world.abstraction.wallet") {
        this.sponsorProviders.push(newProviderDetail);
      } else {
        this.providerDetails.push(newProviderDetail);
      }
    }
  }

  async detectEIP6963() {
    window.addEventListener("eip6963:announceProvider", (event: any) => {
      if (event.detail.info.uuid) {
        this.handleNewProviderDetail(event.detail);
      }
    });

    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  async switchChain(chainID: number) {
    if (!this.walletClient) {
      throw new Error("Wallet not connected");
    }
    try {
      await this.walletClient.addChain({ chain: this.network });
      await this.walletClient.switchChain({ id: chainID });
    } catch (error) {
      throw new Error("Cant switch chain ID");
    }
  }

  async detectChain(): Promise<Chain | undefined> {
    if (!this.provider) {
      console.error("Provider not set");
      return undefined;
    }
    try {
      const chainID = await this.provider.request({ method: "eth_chainId" });
      const chainIdNumber = parseInt(chainID, 16);
      const chainInfo = this.network;
      if (chainInfo.id === chainIdNumber) {
        return chainInfo;
      } else {
        console.error("Unknown chain ID or configuration not found.");
        return undefined;
      }
    } catch (error) {
      console.error("Error detecting chain:", error);
      return undefined;
    }
  }

  async connect(wallet: EIP6963ProviderDetail): Promise<void> {
    try {
      this.provider = wallet?.provider;
      if (!this.provider) {
        throw new Error("Provider not found");
      }

      if ((this.provider as any).isAbstractionWallet) {
        if (this.network?.id != 88) {
          throw "Abstraction wallet only support mainnet";
        }
      }

      this.walletClient = createWalletClient({
        chain: this.network,
        transport: custom(this.provider),
      });

      this.publicClient = createPublicClient({
        chain: this.network,
        transport: http(),
      });

      await this.walletClient.requestAddresses();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.provider = undefined;
      this.walletClient = undefined;
    } catch (error) {
      throw error;
    }
  }

  async getAccount(): Promise<string> {
    if (!this.walletClient) {
      throw new Error("Wallet not connected");
    }
    const accounts = await this.walletClient.requestAddresses();
    return accounts[0];
  }

  async getBalance(account: string): Promise<string> {
    if (!this.publicClient) {
      throw new Error("Wallet not connected");
    }
    const balance = await this.publicClient.getBalance({ address: account });
    return formatEther(balance);
  }

  async sendTransaction(tx: any): Promise<any> {
    if (!this.walletClient) {
      throw new Error("Wallet not connected");
    }
    return this.walletClient.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
  }

  getProviderDetails(): EIP6963ProviderDetail[] {
    return this.providerDetails;
  }

  getSponsorProviders(): EIP6963ProviderDetail[] {
    return this.sponsorProviders;
  }

  getChainInfo(): Chain {
    return this.network;
  }

  isConnected(): boolean {
    return this.provider && this.walletClient ? true : false;
  }
}

export default WalletConnector;
