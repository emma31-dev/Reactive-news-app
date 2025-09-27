import { AuthGate } from '../../components/AuthGate';
import LearnQuiz from '../../components/LearnQuiz';

export default function LearnPage() {
  return (
    <AuthGate>
      <div className="space-y-8 relative">
        {/* Glassmorphism background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/25 to-blue-400/25 rounded-full blur-3xl"></div>
        </div>
      
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Learn About <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                Discover how <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network is revolutionizing blockchain interoperability with <span className="!text-blue-600 dark:!text-blue-400">reactive</span> smart contracts and cross-chain automation.
              </p>
            </div>
          </div>
        </section>

        {/* What is Reactive Network */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">What is <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network?</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network is a groundbreaking blockchain platform that introduces <strong><span className="!text-blue-600 dark:!text-blue-400">reactive</span> smart contracts</strong> - 
                  autonomous programs that can monitor and respond to events across multiple blockchain networks in real-time.
                </p>
                <p>
                  Unlike traditional smart contracts that only execute when directly called, <span className="!text-blue-600 dark:!text-blue-400">reactive</span> contracts continuously 
                  listen for specific events and automatically trigger actions across different chains, enabling true cross-chain automation.
                </p>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30 dark:border-white/20 shadow-2xl">
                  <div className="space-y-4">
                    {/* Network nodes visualization */}
                    <div className="flex justify-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                    {/* Connection lines */}
                    <div className="flex justify-center">
                      <svg className="w-24 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 96 64">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 32 L88 32" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16 L88 48" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 48 L88 16" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Cross-Chain Network</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">How <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-neutral-900 dark:text-white">Event Monitoring</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> contracts continuously monitor specified events across supported blockchain networks using advanced listening mechanisms.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-neutral-900 dark:text-white">Condition Evaluation</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    When events occur, the <span className="!text-blue-600 dark:!text-blue-400">reactive</span> contract evaluates predefined conditions and logic to determine if action is required.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-neutral-900 dark:text-white">Automated Execution</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    If conditions are met, the contract automatically executes predefined actions across one or more blockchain networks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-white/20">
              <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Example Use Cases</h3>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Cross-chain yield farming automation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span>Multi-chain governance voting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Automated arbitrage opportunities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>Cross-chain asset management</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center border border-white/30 dark:border-white/20">
                <span className="text-green-600 dark:text-green-400 text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Real-time Reactivity</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Contracts respond to events in real-time, enabling instant cross-chain automation without manual intervention.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-yellow-500/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center border border-white/30 dark:border-white/20">
                <span className="text-yellow-600 dark:text-yellow-400 text-2xl">🔗</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Multi-chain Support</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Native support for multiple blockchain networks including Ethereum, Polygon, BSC, and more.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center border border-white/30 dark:border-white/20">
                <span className="text-blue-600 dark:text-blue-400 text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">Secure & Decentralized</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Built with security-first principles and fully decentralized validator network for trustless operation.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Technical Architecture</h2>
            {/* Architecture diagram */}
            <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-blue-500/15 to-indigo-500/15 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-white/20">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">RVM Core</span>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 32 16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 8 L30 8" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M26 4 L30 8 L26 12" />
                  </svg>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-indigo-500 rounded-lg mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Event System</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-neutral-900 dark:text-white"><span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Virtual Machine (RVM)</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  The core execution environment that processes <span className="!text-blue-600 dark:!text-blue-400">reactive</span> contracts and manages cross-chain communication.
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <li>• EVM-compatible for easy migration</li>
                  <li>• Enhanced with <span className="!text-blue-600 dark:!text-blue-400">reactive</span> capabilities</li>
                  <li>• Optimized for cross-chain operations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-neutral-900 dark:text-white">Event Subscription System</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Advanced event monitoring system that tracks activities across multiple blockchain networks.
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <li>• Real-time event streaming</li>
                  <li>• Configurable event filters</li>
                  <li>• Cross-chain event correlation</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-white/10">
              <h3 className="font-semibold mb-3 text-neutral-900 dark:text-white">Consensus Mechanism</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network uses a hybrid Proof-of-Stake consensus mechanism optimized for cross-chain operations, 
                ensuring fast finality and high security while maintaining decentralization.
              </p>
            </div>
          </div>
        </section>

        {/* REACT Token */}
        <section className="bg-gradient-to-br from-blue-900/90 via-blue-700/85 to-blue-500/80 backdrop-blur-md text-white rounded-2xl p-6 md:p-8 border border-blue-300/30 shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🪙</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">REACT Token Utility</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-2xl p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">⚡</span>
                </div>
                <h3 className="font-bold text-emerald-300 text-lg">Network Operations</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-emerald-100">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Gas fees for <span className="!text-white">reactive</span> contract execution
                </li>
                <li className="flex items-center text-emerald-100">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Cross-chain transaction costs
                </li>
                <li className="flex items-center text-emerald-100">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Event subscription payments
                </li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🏛️</span>
                </div>
                <h3 className="font-bold text-purple-300 text-lg">Governance & Staking</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-purple-100">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Validator staking requirements
                </li>
                <li className="flex items-center text-purple-100">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Network governance voting power
                </li>
                <li className="flex items-center text-purple-100">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Protocol upgrade decisions
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl backdrop-blur-md border border-yellow-400/40 hover:border-yellow-400/60 transition-all duration-300">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-xl">📊</span>
              </div>
              <div>
                <h4 className="font-bold text-yellow-300 mb-2 text-lg">Live Price Tracking</h4>
                <p className="text-yellow-100">
                  Track real-time REACT token prices in our bottom ticker, sourced from major exchanges 
                  including <span className="text-yellow-300 font-semibold">Binance</span> and <span className="text-yellow-300 font-semibold">Bybit</span>. 
                  Get instant updates on market movements and trading volume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started */}
        <section className="text-center bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-white/10 shadow-2xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Ready to Build on <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network?</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl mx-auto">
              Start monitoring real-time blockchain events and explore the possibilities of <span className="!text-blue-600 dark:!text-blue-400">reactive</span> smart contracts 
              with our comprehensive event tracking platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Live Events
            </a>
            <a 
              href="https://docs.reactive.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-neutral-300 dark:border-neutral-600 hover:bg-white hover:!text-blue-600 dark:hover:!text-blue-600 text-neutral-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Developer Docs
            </a>
            <a 
              href="https://reactive.network" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Official Website
            </a>
          </div>
          
          {/* Additional visual elements */}
          <div className="mt-8 flex justify-center space-x-8 opacity-60">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center mb-2 border border-white/30 dark:border-white/20">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Secure</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-500/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center mb-2 border border-white/30 dark:border-white/20">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Fast</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center mb-2 border border-white/30 dark:border-white/20">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9 9s4-9 9-9" />
                </svg>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Scalable</span>
            </div>
          </div>
        </section>
      </div>
        <LearnQuiz />
      </div>
    </AuthGate>
  );
}