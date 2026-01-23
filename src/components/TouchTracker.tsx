import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TouchTracker: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Use a ref to track active touches to avoid re-renders on every move
    const touchesRef = useRef<Map<number, HTMLDivElement>>(new Map());
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Feature detection for touch capability
        const checkTouch = () => {
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsTouchDevice(isTouch);
            return isTouch;
        };

        if (!checkTouch()) return;

        const container = containerRef.current;
        if (!container) return;

        // Pool of touch elements to reuse? 
        // For simplicity and multi-touch correctness, we'll create/remove DOM elements dynamically
        // but optimize with GSAP quickTo for movement.

        // We need a way to store gsap.quickTo functions for each active touch
        const quickSetters = new Map<number, { x: gsap.QuickToFunc, y: gsap.QuickToFunc }>();

        const createTouchIndicator = (id: number, x: number, y: number) => {
            const el = document.createElement('div');
            el.className = 'touch-indicator';

            // Visual Styles for the touch indicator
            Object.assign(el.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none',
                zIndex: 100000,
                transform: 'translate(-50%, -50%)',
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
                mixBlendMode: 'screen',
                opacity: '0', // Start invisible, fade in
            });

            // Inner core
            const core = document.createElement('div');
            Object.assign(core.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'white',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px white'
            });
            el.appendChild(core);

            container.appendChild(el);
            touchesRef.current.set(id, el);

            // Initialize GSAP Setters
            const xTo = gsap.quickTo(el, "x", { duration: 0.1, ease: "power3.out" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.1, ease: "power3.out" });

            // Initial position
            xTo(x);
            yTo(y);

            quickSetters.set(id, { x: xTo, y: yTo });

            // Animate In
            gsap.fromTo(el,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
            );

            return el;
        };

        const removeTouchIndicator = (id: number) => {
            const el = touchesRef.current.get(id);
            if (el) {
                // Animate Out
                gsap.to(el, {
                    scale: 1.5,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                        if (el.parentNode) el.parentNode.removeChild(el);
                    }
                });
                touchesRef.current.delete(id);
                quickSetters.delete(id);
            }
        };

        const updateTouchPosition = (id: number, x: number, y: number) => {
            const setters = quickSetters.get(id);
            if (setters) {
                setters.x(x);
                setters.y(y);
            }
        };

        // --- Event Handlers ---

        const handleTouchStart = (e: TouchEvent) => {
            // We only care about changed touches
            Array.from(e.changedTouches).forEach(touch => {
                createTouchIndicator(touch.identifier, touch.clientX, touch.clientY);
            });
        };

        const handleTouchMove = (e: TouchEvent) => {
            Array.from(e.changedTouches).forEach(touch => {
                updateTouchPosition(touch.identifier, touch.clientX, touch.clientY);
            });
        };

        const handleTouchEnd = (e: TouchEvent) => {
            Array.from(e.changedTouches).forEach(touch => {
                removeTouchIndicator(touch.identifier);
            });
        };

        const handleTouchCancel = (e: TouchEvent) => {
            Array.from(e.changedTouches).forEach(touch => {
                removeTouchIndicator(touch.identifier);
            });
        };

        // Add Listeners
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchCancel);

            // Remove all remaining elements
            touchesRef.current.forEach(el => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
            touchesRef.current.clear();
            quickSetters.clear();
        };

    }, []);

    if (!isTouchDevice) return null;

    return (
        <div
            ref={containerRef}
            className="touch-tracker-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 100000,
                overflow: 'hidden'
            }}
        />
    );
};

export default TouchTracker;
