import { useState, useEffect } from "react";

interface ScreenBreakpoints {
  xs: number; // 0px
  sm: number; // 640px
  md: number; // 768px
  lg: number; // 1024px
  xl: number; // 1280px
  "2xl": number; // 1536px
}

const BREAKPOINTS: ScreenBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

interface UseScreenWidthReturn {
  screenWidth: number;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

export const useScreenWidth = (): UseScreenWidthReturn => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    // Set initial width
    setScreenWidth(window.innerWidth);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isXs = screenWidth >= BREAKPOINTS.xs;
  const isSm = screenWidth >= BREAKPOINTS.sm;
  const isMd = screenWidth >= BREAKPOINTS.md;
  const isLg = screenWidth >= BREAKPOINTS.lg;
  const isXl = screenWidth >= BREAKPOINTS.xl;
  const is2xl = screenWidth >= BREAKPOINTS["2xl"];

  // Convenience breakpoints
  const isMobile = screenWidth < BREAKPOINTS.md; // < 768px
  const isTablet =
    screenWidth >= BREAKPOINTS.md && screenWidth < BREAKPOINTS.xl; // 768px - 1279px
  const isDesktop = screenWidth >= BREAKPOINTS.xl; // >= 1280px
  const isLargeDesktop = screenWidth >= BREAKPOINTS["2xl"]; // >= 1536px

  return {
    screenWidth,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};

export default useScreenWidth;
