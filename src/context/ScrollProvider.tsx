import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollContext } from './ScrollContext';

// Register ScrollTrigger to handle Lenis updates
gsap.registerPlugin(ScrollTrigger);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const [scrollData, setScrollData] = useState({
        scrollProgress: 0,
        velocity: 0,
        currentSection: 0
    });

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        lenisInstance.scrollTo(0, { immediate: true });

        // Use a slight delay to avoid synchronous state updates durante mount
        Promise.resolve().then(() => {
            setLenis(lenisInstance);
        });

        // Sync ScrollTrigger with Lenis
        lenisInstance.on('scroll', ScrollTrigger.update);

        // Update React Context State on Scroll (Throttled by Lenis emit)
        // Optimization: Only run this logic when scrolling occurs
        lenisInstance.on('scroll', ({ scroll, limit, velocity }) => {
            const progress = limit > 0 ? scroll / limit : 0;

            let section = 0;
            if (progress < 0.2) section = 0; // Hero
            else if (progress < 0.8) section = 1; // Nexus (Services)
            else section = 2; // Contact

            setScrollData({
                scrollProgress: progress,
                velocity: velocity,
                currentSection: section
            });
        });

        // Use GSAP Ticker to drive Lenis (High Priority)
        gsap.ticker.add((time) => {
            lenisInstance.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
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
