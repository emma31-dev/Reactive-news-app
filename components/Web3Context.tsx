"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';

// Extend window interface for MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
      removeAllListeners?: (eventName?: string) => void;
      isMetaMask?: boolean;
      chainId?: string;
      networkVersion?: string;
      selectedAddress?: string;
      _metamask?: {
        isUnlocked: () => Promise<boolean>;
      };
    } & import('ethers').Eip1193Provider;
  }
}

// Contract ABI (simplified - in production, import from compiled artifacts)
const REACTIVE_NEWS_ABI = [
  "function submitNews(string title, string content, string category) external returns (uint256)",
  "function voteOnNews(uint256 newsId, bool upvote) external",
  "function verifyNews(uint256 newsId, bool isVerified) external",
  "function getNewsItem(uint256 newsId) external view returns (tuple(uint256 id, string title, string content, string category, address submitter, uint256 timestamp, uint256 upvotes, uint256 downvotes, bool verified, bytes32 contentHash))",
  "function isNewsVerified(uint256 newsId) external view returns (bool)",
  "function getNewsCount() external view returns (uint256)",
  "function getVerifierInfo(address verifier) external view returns (tuple(bool authorized, uint256 reputation, uint256 totalVerifications, uint256 correctVerifications))",
  "event NewsSubmitted(uint256 indexed newsId, address indexed submitter, string title, string category, uint256 timestamp)",
  "event NewsVoted(uint256 indexed newsId, address indexed voter, bool upvote, uint256 newUpvotes, uint256 newDownvotes)",
  "event NewsVerified(uint256 indexed newsId, bool verified, uint256 finalUpvotes, uint256 finalDownvotes)",
  "event ReactiveCallback(uint256 indexed newsId, string action, bytes data)"
];

// Reactive Network Testnet Configuration (env-driven)
const ENV_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_REACTIVE_CHAIN_ID || '5318008', 10);
const REACTIVE_NETWORK_CONFIG = {
  chainId: ENV_CHAIN_ID,
  name: 'Reactive Network Testnet',
  rpc: process.env.NEXT_PUBLIC_REACTIVE_NETWORK_RPC || 'https://sepolia-rpc.reactive.network',
  explorer: process.env.NEXT_PUBLIC_REACTIVE_NETWORK_EXPLORER || 'https://sepolia-explorer.reactive.network'
};

interface Web3ContextType {
  // Connection state
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  connected: boolean;
  connecting: boolean;
  
  // Contract interaction
  newsContract: ethers.Contract | null;
  expectedChainId: number; // from env
  wrongNetwork: boolean;
  configError: string | null;
  
  // Functions
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToReactiveNetwork: () => Promise<void>;
  
  // News functions
  submitNews: (title: string, content: string, category: string) => Promise<string>;
  voteOnNews: (newsId: string, upvote: boolean) => Promise<void>;
  getNewsVerification: (newsId: string) => Promise<boolean>;
  getOnChainNews: (newsId: string) => Promise<any>;
  
  // Events
  subscribeToNewsEvents: (callback: (event: any) => void) => () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Replace with your deployed contract address
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_REACTIVE_NEWS_CONTRACT || '').trim() || "0x0000000000000000000000000000000000000000";

function isZeroAddress(addr: string) {
  return /^0x0{40}$/i.test(addr);
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [newsContract, setNewsContract] = useState<ethers.Contract | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Validate early
  useEffect(() => {
    if (isZeroAddress(CONTRACT_ADDRESS)) {
      setConfigError('Contract address not configured. Set NEXT_PUBLIC_REACTIVE_NEWS_CONTRACT in .env');
    } else if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      setConfigError('Invalid contract address format');
    }
  }, []);

  // Declare chain change handler first (no deps)
  const handleChainChanged = useCallback(() => { window.location.reload(); }, []);

  // Refs to keep stable identities without expanding dependency arrays
  const disconnectRef = React.useRef<() => void>(() => {});
  const connectWalletRef = React.useRef<(
    web3Provider?: ethers.BrowserProvider
  ) => Promise<void>>(async () => {});
  const handleAccountsChangedRef = React.useRef<(accounts: string[]) => void>(() => {});

  // Stable handler leveraging refs – no deps needed
  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectRef.current();
      return;
    }
    if (!window.ethereum) return;
    (async () => {
      try {
        const providerInstance = new ethers.BrowserProvider(window.ethereum!);
        const list = await providerInstance.listAccounts();
        if (list.length > 0) {
          await connectWalletRef.current(providerInstance);
        }
      } catch (e) {
        console.error('accountsChanged reconnect failed', e);
      }
    })();
  }, []);
  // Keep ref pointing to latest stable handler
  handleAccountsChangedRef.current = handleAccountsChanged;

  const connectWallet = useCallback(async (web3Provider?: ethers.BrowserProvider) => {
    if (!window.ethereum && !web3Provider) throw new Error('MetaMask not installed');
    try {
      if (!web3Provider) web3Provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();
      const network = await web3Provider.getNetwork();
      setProvider(web3Provider);
      setSigner(signer);
      setAccount(address);
      setChainId(Number(network.chainId));
      setConnected(true);
      if (!configError && !isZeroAddress(CONTRACT_ADDRESS)) {
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, REACTIVE_NEWS_ABI, signer);
          setNewsContract(contract);
        } catch (e) {
          console.error('Failed to init contract:', e);
          setNewsContract(null);
        }
      } else {
        setNewsContract(null);
      }
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChangedRef.current as any);
        window.ethereum.on('chainChanged', handleChainChanged as any);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }, [configError, handleChainChanged]);

  // Keep ref to latest connectWallet implementation
  useEffect(() => { connectWalletRef.current = connectWallet; }, [connectWallet]);

  const checkConnection = useCallback(async () => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        await connectWallet(provider);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  }, [connectWallet]);

  // Check for existing connection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkConnection();
    }
  }, [checkConnection]);

  // (old non-memoized connectWallet removed; replaced by memoized version above)

  const connect = useCallback(async () => {
    if (connecting) {
      console.log('🔄 Connection already in progress...');
      return;
    }
    
    setConnecting(true);
    console.log('🚀 Starting wallet connection process...');
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }
      
      console.log('📝 Requesting account access...');
      await window.ethereum!.request({ method: 'eth_requestAccounts' });
      
      console.log('🌐 Creating ethers provider...');
  const providerInstance = new ethers.BrowserProvider(window.ethereum!);
  console.log('🔗 Connecting wallet...');
  await connectWallet(providerInstance);
      
      console.log('✅ Wallet connection complete!');
      
    } catch (error) {
      console.error('❌ Connection error:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [connecting, connectWallet]);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setConnected(false);
    setNewsContract(null);
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChangedRef.current as any);
      window.ethereum.removeListener('chainChanged', handleChainChanged as any);
    }
  }, [handleChainChanged]);

  // keep ref updated
  useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);

  // (handlers moved above with useCallback)

  const switchToReactiveNetwork = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not available');
    }
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${REACTIVE_NETWORK_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902 && window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${REACTIVE_NETWORK_CONFIG.chainId.toString(16)}`,
                chainName: REACTIVE_NETWORK_CONFIG.name,
                rpcUrls: [REACTIVE_NETWORK_CONFIG.rpc],
                blockExplorerUrls: [REACTIVE_NETWORK_CONFIG.explorer],
                nativeCurrency: {
                  name: 'REACT',
                  symbol: 'REACT',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Reactive Network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  // Reinitialize contract if signer or chain change
  useEffect(() => {
    if (signer && !configError && !isZeroAddress(CONTRACT_ADDRESS)) {
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, REACTIVE_NEWS_ABI, signer);
        setNewsContract(contract);
      } catch (e) {
        console.error('Contract re-init failed:', e);
        setNewsContract(null);
      }
    } else {
      setNewsContract(null);
    }
  }, [signer, chainId, configError]);

  // Contract interaction functions
  const submitNews = async (title: string, content: string, category: string): Promise<string> => {
    if (!newsContract) throw new Error('Contract not initialized');
    
    try {
      const tx = await newsContract.submitNews(title, content, category);
      const receipt = await tx.wait();
      
      // Extract newsId from events
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = newsContract.interface.parseLog(log);
          return parsed?.name === 'NewsSubmitted';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsedEvent = newsContract.interface.parseLog(event);
        return parsedEvent?.args?.newsId?.toString() || '';
      }
      
      return receipt.hash;
    } catch (error) {
      console.error('Error submitting news:', error);
      throw error;
    }
  };

  const voteOnNews = async (newsId: string, upvote: boolean): Promise<void> => {
    if (!newsContract) throw new Error('Contract not initialized');
    
    try {
      // Convert string ID to number for blockchain call
      const numericId = parseInt(newsId, 10);
      const tx = await newsContract.voteOnNews(numericId, upvote);
      await tx.wait();
    } catch (error) {
      console.error('Error voting on news:', error);
      throw error;
    }
  };

  const getNewsVerification = async (newsId: string): Promise<boolean> => {
    if (!newsContract) throw new Error('Contract not initialized');
    
    try {
      // Convert string ID to number for blockchain call
      const numericId = parseInt(newsId, 10);
      return await newsContract.isNewsVerified(numericId);
    } catch (error) {
      console.error('Error checking verification:', error);
      return false;
    }
  };

  const getOnChainNews = async (newsId: string) => {
    if (!newsContract) throw new Error('Contract not initialized');
    
    try {
      // Convert string ID to number for blockchain call
      const numericId = parseInt(newsId, 10);
      const news = await newsContract.getNewsItem(numericId);
      return {
        id: news.id.toString(),
        title: news.title,
        content: news.content,
        category: news.category,
        submitter: news.submitter,
        timestamp: Number(news.timestamp),
        upvotes: Number(news.upvotes),
        downvotes: Number(news.downvotes),
        verified: news.verified,
        contentHash: news.contentHash
      };
    } catch (error) {
      console.error('Error fetching on-chain news:', error);
      throw error;
    }
  };

  const subscribeToNewsEvents = (callback: (event: any) => void) => {
    if (!newsContract) return () => {};
    
    const eventFilters = [
      newsContract.filters.NewsSubmitted(),
      newsContract.filters.NewsVoted(),
      newsContract.filters.NewsVerified(),
      newsContract.filters.ReactiveCallback()
    ];
    
    eventFilters.forEach(filter => {
      newsContract.on(filter, callback);
    });
    
    // Return cleanup function
    return () => {
      eventFilters.forEach(filter => {
        newsContract.off(filter, callback);
      });
    };
  };

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    chainId,
    connected,
    connecting,
    newsContract,
    expectedChainId: REACTIVE_NETWORK_CONFIG.chainId,
    wrongNetwork: !!chainId && chainId !== REACTIVE_NETWORK_CONFIG.chainId,
    configError,
    connect,
    disconnect,
    switchToReactiveNetwork,
    submitNews,
    voteOnNews,
    getNewsVerification,
    getOnChainNews,
    subscribeToNewsEvents
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    // Instead of throwing, return a safe fallback to avoid runtime crashes
    // when components call useWeb3() before a provider is mounted.
    console.warn('useWeb3() called without a Web3Provider - returning fallback stub.');
    const noop = async () => {};
    const fallback = {
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      connected: false,
      connecting: false,
      newsContract: null,
      expectedChainId: REACTIVE_NETWORK_CONFIG.chainId,
      wrongNetwork: false,
      configError: 'Web3Provider not mounted',
      connect: async () => { throw new Error('Web3Provider not available'); },
      disconnect: () => {},
      switchToReactiveNetwork: async () => { throw new Error('Web3Provider not available'); },
      submitNews: async () => { throw new Error('Web3Provider not available'); },
      voteOnNews: async () => { throw new Error('Web3Provider not available'); },
      getNewsVerification: async () => false,
      getOnChainNews: async () => { throw new Error('Web3Provider not available'); },
      subscribeToNewsEvents: () => () => {}
    } as Web3ContextType;
    return fallback;
  }
  return context;
}