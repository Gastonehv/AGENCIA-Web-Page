import { createContext, useContext } from 'react';
import Lenis from 'lenis';

interface ScrollContextType {
    lenis: Lenis | null;
    scrollProgress: number;
    velocity: number;
    currentSection: number;
}

export const ScrollContext = createContext<ScrollContextType>({
    lenis: null,
    scrollProgress: 0,
    velocity: 0,
    currentSection: 0,
});

export const useScroll = () => useContext(ScrollContext);
