// Exporting components
export { default as ConnectButton } from "./components/ConnectButton";
export { default as WalletModal } from "./components/WalletModal";

// Exporting connectors and utilities
export {
  WalletProvider,
  useWalletProviders,
} from "./connectors/WalletProviders";
export { default as WalletConnector } from "./connectors/WalletConnector";
export { NETWORK } from "./chains";
export { EIP6963ProviderDetail } from "./utils/types";
