interface EthereumProvider {
  request(args: { method: string; params?: any[] }): Promise<any>;
  on(event: string, handler: (...args: any[]) => void): void;
  removeListener(event: string, handler: (...args: any[]) => void): void;
  isMetaMask?: boolean;
  isConnected(): boolean;
  chainId: string;
  networkVersion: string;
  selectedAddress: string | null;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};