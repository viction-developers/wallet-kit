import { Chain } from "viem/chains";

const VictionMainnet: Chain = {
  id: 88,
  name: "Viction Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Viction",
    symbol: "VIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.viction.xyz"],
      webSocket: ["wss://ws.viction.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://vicscan.xyz" },
  },
  testnet: true,
};

const VictionTestnet: Chain = {
  id: 89,
  name: "Viction Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Viction",
    symbol: "VIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.viction.xyz"],
      webSocket: ["wss://ws-testnet.viction.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.vicscan.xyz" },
  },
  testnet: true,
};

export const supportNetworks: Record<NETWORK, Chain> = {
  MAINNET: VictionMainnet,
  TESTNET: VictionTestnet,
};

export enum NETWORK {
  MAINNET = "MAINNET",
  TESTNET = "TESTNET",
}
