// __tests__/ConnectButton.test.tsx

import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ConnectButton from "../src/components/ConnectButton";
import {
  WalletProvider,
  useWalletProviders,
} from "../src/connectors/WalletProviders";
import WalletConnector from "../src/connectors/WalletConnector";
import { NETWORK, supportNetworks } from "../src/chains";
import { EIP6963ProviderDetail } from "../src/utils/types";

jest.mock("../src/connectors/WalletConnector");
jest.mock("../src/connectors/WalletProviders", () => ({
  useWalletProviders: jest.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.useFakeTimers();

const mockChainInfo = supportNetworks[NETWORK.MAINNET];

// Mock provider with necessary methods
const mockProvider = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
};

const mockProviderDetails: EIP6963ProviderDetail[] = [
  {
    info: { uuid: "mock-uuid", name: "Mock Wallet", icon: "" },
    provider: mockProvider,
    accounts: [],
  },
];

(mockProvider.request as jest.Mock).mockResolvedValueOnce(
  "0x" + mockChainInfo.id.toString(16)
); // Mock chain ID response

(useWalletProviders as jest.Mock).mockReturnValue({
  providerDetails: mockProviderDetails,
  sponsorWallets: [],
  detectProviders: jest.fn(),
});

describe("ConnectButton", () => {
  let mockConnector: WalletConnector;

  beforeEach(() => {
    mockConnector = new WalletConnector(NETWORK.MAINNET);
    jest
      .spyOn(mockConnector, "connect")
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(mockConnector, "disconnect")
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(mockConnector, "getChainInfo")
      .mockImplementation(() => mockChainInfo);
    jest
      .spyOn(mockConnector, "switchChain")
      .mockImplementation(() => Promise.resolve());

    // Mock the provider request method
    mockProvider.request.mockImplementation((req: any) => {
      if (req.method === "eth_chainId") {
        return Promise.resolve("0x58"); // Return chain ID as a hex string
      }
      return Promise.reject(new Error("Method not supported"));
    });
  });

  test("renders Connect Wallet button", async () => {
    await act(async () => {
      render(
        <WalletProvider>
          <ConnectButton
            connector={mockConnector}
            onConnect={jest.fn()}
            onDisconnect={jest.fn()}
          />
        </WalletProvider>
      );
    });

    const buttonElement = screen.getByText(/Connect Wallet/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders Disconnect button when connected", async () => {
    await act(async () => {
      render(
        <WalletProvider>
          <ConnectButton
            connector={mockConnector}
            connectedAccount="0x123"
            onConnect={jest.fn()}
            onDisconnect={jest.fn()}
          />
        </WalletProvider>
      );
    });

    const buttonElement = screen.getByText(/Disconnect/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("calls onConnect when a wallet is connected", async () => {
    const mockOnConnect = jest.fn();

    await act(async () => {
      render(
        <WalletProvider>
          <ConnectButton
            connector={mockConnector}
            onConnect={mockOnConnect}
            onDisconnect={jest.fn()}
          />
        </WalletProvider>
      );
    });

    // Click the "Connect Wallet" button to open the modal
    const modalConnectButton = screen.getByText(/Connect Wallet/i);

    await act(async () => {
      modalConnectButton.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    // Simulate waiting for wallet data to load
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Check if the modal is open by looking for a wallet option
    const walletButton = await screen.findByText(/Mock Wallet/i);
    expect(walletButton).toBeInTheDocument();

    // Click the mock wallet button to simulate connection
    await act(() => {
      walletButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // Ensure the mockOnConnect callback was called
    expect(mockOnConnect).toHaveBeenCalledTimes(1);
    expect(mockOnConnect).toHaveBeenCalledWith(mockProviderDetails[0]);
  });

  test("calls onDisconnect when the Disconnect button is clicked", async () => {
    const mockOnDisconnect = jest.fn();

    await act(async () => {
      render(
        <WalletProvider>
          <ConnectButton
            connector={mockConnector}
            connectedAccount="0x123"
            onConnect={jest.fn()}
            onDisconnect={mockOnDisconnect}
          />
        </WalletProvider>
      );
    });

    const buttonElement = screen.getByText(/Disconnect/i);
    await act(async () => {
      buttonElement.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  test("applies custom styles correctly", async () => {
    const customStyle = { background: "blue", color: "white" };

    await act(async () => {
      render(
        <WalletProvider>
          <ConnectButton
            connector={mockConnector}
            style={customStyle}
            onConnect={jest.fn()}
            onDisconnect={jest.fn()}
          />
        </WalletProvider>
      );
    });

    const buttonElement = screen.getByText(/Connect Wallet/i);
    expect(buttonElement).toHaveStyle(customStyle);
  });
});
