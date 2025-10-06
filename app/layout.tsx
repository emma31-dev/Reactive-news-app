import './globals.css';
import React from 'react';
import Image from 'next/image';
import { AuthProvider } from '../components/AuthContext';
import { SavedNewsProvider } from '../components/SavedNewsContext';
import { ReactPriceProvider } from '../components/ReactPriceContext';
import { NewsProvider } from '../components/NewsContext';
import { NavBarWrapper } from '../components/NavBarWrapper';
import { ThemeProvider } from '../components/ThemeContext';
import { Web3Provider } from '../components/Web3Context';
import { Web3ModalProvider } from '../components/Web3ModalProvider';
import ConditionalPriceBar from '../components/ConditionalPriceBar';
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
  title: 'Reactive Events - Live On-Chain Event Monitor',
  description: 'Real-time monitoring of Reactive Network blockchain events with live REACT token prices',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`}>
        {/* Early theme application to avoid flash on loading screens; force-enable float animations by default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem('theme');const m=window.matchMedia('(prefers-color-scheme: dark)').matches; if(s==='dark'||(!s&&m)){document.documentElement.classList.add('dark');} }catch(e){}; try{const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(rm){document.documentElement.setAttribute('data-prefers-reduced-motion','true');} else {document.documentElement.setAttribute('data-prefers-reduced-motion','false');}}catch(e){}; try{document.documentElement.setAttribute('data-force-animate','true'); localStorage.setItem('forceAnimate','true');}catch(e){} })();`
          }}
        />
  {/* Web3ModalProvider removed: use Web3Modal component directly in NavBar */}
          <ThemeProvider>
            <AuthProvider>
              <SavedNewsProvider>
                <ReactPriceProvider>
                  <NewsProvider>
                    {/* Global NavBar - Fixed to Viewport Top with Error Boundary and Stability */}
                    <div className="relative z-50">
                      <NavBarWrapper />
                    </div>

                    <Web3ModalProvider>
                      <Web3Provider>
                        <div className="min-h-screen flex flex-col relative overflow-hidden">
                          {/* Floating decorative SVGs (fixed to viewport) */}
                          <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
                            <Image src="/float1.svg" alt="" width={192} height={192} className="float-blur float-white opacity-35 dark:opacity-35 animate-float-slow absolute top-16 left-[6%] w-32 md:w-48 select-none" priority />
                            <Image src="/float2.svg" alt="" width={420} height={420} className="float-blur float-white opacity-35 dark:opacity-35 animate-float-medium absolute bottom-28 -right-16 md:-right-28 w-64 md:w-[420px] select-none -rotate-12" />
                            <Image src="/float3.svg" alt="" width={256} height={256} className="float-blur float-white opacity-35 dark:opacity-35 animate-float-fast absolute bottom-4 left-4 w-48 md:w-64 select-none" />
                          </div>
                          {/* Content backdrop so floats show softly behind */}
                          <div className="flex-1 flex flex-col bg-transparent backdrop-blur-[2px] transition-colors">
                            <main className="flex-1 container mx-auto px-4 py-4 pt-20 lg:px-8 xl:px-12 max-w-4xl xl:max-w-6xl w-full pb-20">
                              {children}
                            </main>
                          </div>
                          {/* Global REACT Price Bar - Hidden on /chart via ConditionalPriceBar */}
                          <ConditionalPriceBar />
                        </div>
                      </Web3Provider>
                    </Web3ModalProvider>
                  </NewsProvider>
                </ReactPriceProvider>
              </SavedNewsProvider>
            </AuthProvider>
          </ThemeProvider>
  {/* End Web3ModalProvider removed */}
      </body>
    </html>
  );
}

