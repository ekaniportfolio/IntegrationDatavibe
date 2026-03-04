import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isMobile, isTablet, isBrowser, isSmartTV, isConsole, isWearable } from 'react-device-detect';

interface DeviceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isTactileDesktop: boolean; // Desktop with touch screen
  isSmallScreen: boolean; // Window width < 768px
  isSmartTV: boolean;
  isConsole: boolean;
  isWearable: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'smarttv' | 'console' | 'wearable' | 'unknown';
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check Touch
      const hasTouchScreen =
        'ontouchstart' in window ||
        (navigator.maxTouchPoints > 0);
      setIsTouch(hasTouchScreen);

      // Check Screen Size (Responsive)
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkDevice();
    
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // react-device-detect 'isBrowser' might be true for mobile browsers too depending on interpretation,
  // but usually we want 'Desktop' to mean non-mobile.
  const isDesktop = !isMobile && !isTablet; 
  // Note: isMobile usually includes tablets in some libraries, but react-device-detect separates them sometimes. 
  // Safest for 'Desktop' form factor is !isMobile. 
  // However, react-device-detect 'isMobile' is true for phones and tablets.
  
  const isTactileDesktop = isDesktop && isTouch;

  let deviceType: DeviceContextType['deviceType'] = 'unknown';
  if (isMobile) deviceType = 'mobile';
  if (isTablet) deviceType = 'tablet';
  if (isDesktop) deviceType = 'desktop';
  if (isSmartTV) deviceType = 'smarttv';
  if (isConsole) deviceType = 'console';
  if (isWearable) deviceType = 'wearable';

  const value: DeviceContextType = {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    isTactileDesktop,
    isSmallScreen,
    isSmartTV,
    isConsole,
    isWearable,
    deviceType,
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevice = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};
