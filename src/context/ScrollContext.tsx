import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to handle Lenis updates
gsap.registerPlugin(ScrollTrigger);

interface ScrollContextType {
    lenis: Lenis | null;
    scrollProgress: number; // 0 to 1 (Global page progress)
    velocity: number;
    currentSection: number; // 0: Hero, 1: Nexus, 2: Contact
}

const ScrollContext = createContext<ScrollContextType>({
    lenis: null,
    scrollProgress: 0,
    velocity: 0,
    currentSection: 0,
});

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const [scrollData, setScrollData] = useState({
        scrollProgress: 0,
        velocity: 0,
        currentSection: 0
    });
    const reqIdRef = useRef<number | null>(null);

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        // FORCE SCROLL RESET ON LOAD
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        lenisInstance.scrollTo(0, { immediate: true });

        setLenis(lenisInstance);

        // Sync Lenis with ScrollTrigger
        lenisInstance.on('scroll', ScrollTrigger.update);

        // Add Lenis's requestAnimationFrame to GSAP's ticker for better sync
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        // Disable GSAP's lag smoothing to prevent stutters during heavy scroll
        gsap.ticker.lagSmoothing(0);

        // Scroll Loop for State Updates
        const update = () => {
            // Calculate global progress
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

            // Determine "Section" roughly based on scroll position
            // This is a simplified heuristic; components should ideally report their visibility
            // But for the 3D background, this global state is useful.
            let section = 0;
            if (progress < 0.2) section = 0; // Hero
            else if (progress < 0.8) section = 1; // Nexus (Services)
            else section = 2; // Contact

            setScrollData({
                scrollProgress: progress,
                velocity: lenisInstance.velocity,
                currentSection: section
            });

            reqIdRef.current = requestAnimationFrame(update);
        };

        reqIdRef.current = requestAnimationFrame(update);

        return () => {
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            lenisInstance.destroy();
            gsap.ticker.remove((time) => lenisInstance.raf(time * 1000));
        };
    }, []);

    return (
        <ScrollContext.Provider value={{ lenis, ...scrollData }}>
            {children}
        </ScrollContext.Provider>
    );
};
