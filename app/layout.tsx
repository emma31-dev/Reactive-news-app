import './globals.css';
import React from 'react';
import { AuthProvider } from '../components/AuthContext';
import { SavedNewsProvider } from '../components/SavedNewsContext';
import { ReactPriceProvider } from '../components/ReactPriceContext';
import { NewsProvider } from '../components/NewsContext';
import { Web3Provider } from '../components/Web3Context';
import { NavBarWrapper } from '../components/NavBarWrapper';
import PageTransition from '../components/PageTransition';
import ReactPriceBar from '../components/ReactPriceBar';
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: 'Reactive News - Live On-Chain Event Monitor',
  description: 'Real-time monitoring of Reactive Network blockchain events with live REACT token prices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* Early theme application to avoid flash on loading screens */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem('theme');const m=window.matchMedia('(prefers-color-scheme: dark)').matches; if(s==='dark'||(!s&&m)){document.documentElement.classList.add('dark');} }catch(e){}})();`
          }}
        />
        <Web3Provider>
          <AuthProvider>
            <SavedNewsProvider>
              <ReactPriceProvider>
                <NewsProvider>
                  {/* Global NavBar - Fixed to Viewport Top with Error Boundary and Stability */}
                  <div className="relative z-50">
                    <NavBarWrapper />
                  </div>
              
              <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Floating decorative SVGs (fixed to viewport) */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
              <img src="/float1.svg" alt="" className="float-blur float-white opacity-55 dark:opacity-40 animate-float-slow motion-reduce:animate-none absolute top-16 left-[6%] w-32 md:w-48 select-none" />
              <img src="/float2.svg" alt="" className="float-blur float-white opacity-65 dark:opacity-45 animate-float-medium motion-reduce:animate-none absolute bottom-28 -right-16 md:-right-28 w-64 md:w-[420px] select-none -rotate-12" />
              <img src="/float3.svg" alt="" className="float-blur float-white opacity-70 dark:opacity-55 animate-float-fast motion-reduce:animate-none absolute bottom-4 left-4 w-48 md:w-64 select-none" />
            </div>
            {/* Content backdrop so floats show softly behind */}
            <div className="flex-1 flex flex-col bg-white/75 dark:bg-black/70 backdrop-blur-sm supports-[backdrop-filter]:bg-white/55 dark:supports-[backdrop-filter]:bg-black/55 transition-colors">
              <main className="flex-1 container mx-auto px-4 py-4 pt-20 lg:px-8 xl:px-12 max-w-4xl xl:max-w-6xl w-full pb-20">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
            </div>
            
            {/* Global REACT Price Bar - Fixed to Viewport Bottom */}
            <ReactPriceBar />
              </div>
              </NewsProvider>
            </ReactPriceProvider>
          </SavedNewsProvider>
        </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

