"use client";
import { useReactPrice } from './ReactPriceContext';

// Force white text styles - maximum specificity
const forceWhiteStyle = {
  color: 'white !important',
  filter: 'none !important',
  WebkitFilter: 'none !important',
  textColor: 'white !important',
  '--tw-text-opacity': '1 !important',
  '--text-color': 'white !important'
};

// CSS injection for maximum override
const whiteTextCSS = `
  .force-white-text, .force-white-text * {
    color: white !important;
    text-color: white !important;
  }
`;

// Custom spinner component
const DotSpinner = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
  </div>
);

export default function ReactPriceBar() {
  // Get price data from context - persists across page changes
  const { priceData, loading, error, offline } = useReactPrice();

  // Always show the price bar, just indicate loading state within it
  const isPositive = !isNaN(parseFloat(priceData.changePercent)) && parseFloat(priceData.changePercent) >= 0;
  const hasValidData = priceData.price !== '' && priceData.price !== 'N/A';
  const stale = !!priceData.stale || offline;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: whiteTextCSS }} />
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 lg:px-8 xl:px-12 shadow-lg backdrop-blur-sm border-t border-blue-500/30 force-white-text" 
        style={forceWhiteStyle}
      >
        <div 
          className="max-w-4xl xl:max-w-6xl mx-auto flex items-center justify-center space-x-4 md:space-x-6 text-sm font-medium force-white-text" 
          style={forceWhiteStyle}
        >
        {loading ? (
          <DotSpinner />
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <span className="!text-white force-white-text" style={forceWhiteStyle}>{priceData.symbol}/USD:</span>
              <span className="font-bold !text-white force-white-text" style={forceWhiteStyle}>
                {hasValidData ? `$${priceData.price}` : priceData.price}
              </span>
            </div>
            
            {hasValidData && (
              <div className="flex items-center space-x-1">
                <span className={`flex items-center space-x-1 ${
                  isPositive ? 'text-green-300' : 'text-red-300'
                }`}>
                  <span>{isPositive ? '↗' : '↘'}</span>
                  <span>{isPositive ? '+' : ''}{priceData.changePercent}%</span>
                </span>
              </div>
            )}

            {hasValidData && (
              <div className="text-xs hidden sm:block !text-white force-white-text" style={forceWhiteStyle}>
                <span className="!text-white force-white-text" style={forceWhiteStyle}>24h: </span>
                <span className={isPositive ? 'text-green-300' : 'text-red-300'}>
                  {isPositive ? '+' : ''}${priceData.change24h}
                </span>
              </div>
            )}

            {/* Suppress explicit API error message per request; silently rely on stale/offline badge */}

            {hasValidData && !error && !stale && (
              <div className="hidden md:flex items-center text-xs space-x-1 !text-white force-white-text" style={forceWhiteStyle}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="!text-white force-white-text" style={forceWhiteStyle}>Live</span>
              </div>
            )}
            {hasValidData && stale && (
              <div className="hidden md:flex items-center text-xs space-x-1 !text-white force-white-text" style={forceWhiteStyle}>
                <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                <span className="!text-white force-white-text" style={forceWhiteStyle}>Offline (cached)</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}