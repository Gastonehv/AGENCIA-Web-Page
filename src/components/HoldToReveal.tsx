import React, { useRef, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';

interface HoldToRevealProps {
    children: React.ReactNode;
    onComplete: () => void;
    duration?: number; // Duration in ms to hold
    className?: string;
    style?: React.CSSProperties;
}

const HoldToReveal: React.FC<HoldToRevealProps> = ({
    children,
    onComplete,
    duration = 1000,
    className,
    style
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [, setIsHolding] = useState(false); // Used for trigger logic even if not render-critical

    const bind = useGesture({
        onPointerDown: ({ event }) => {
            event.preventDefault(); // Prevent text selection/native behavior
            setIsHolding(true);

            // Visual Feedback: Scale Down slightly
            gsap.to(containerRef.current, { scale: 0.95, duration: 0.3, ease: 'power2.out' });

            // Start Progress Animation
            if (progressRef.current) {
                gsap.fromTo(progressRef.current,
                    { scaleX: 0, opacity: 1 },
                    {
                        scaleX: 1,
                        duration: duration / 1000,
                        ease: 'none',
                        onComplete: () => {
                            // If successfully held for full duration
                            gsap.to(containerRef.current, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
                            onComplete();
                        }
                    }
                );
            }
        },
        onPointerUp: () => {
            // Cancel if simple tap or released too early
            setIsHolding(false);
            // if (tap) logic removed since tap is not directly exposed here without proper config

            // Reset Visuals
            gsap.to(containerRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });

            // Kill Progress Animation if active
            if (progressRef.current) {
                gsap.killTweensOf(progressRef.current);
                gsap.to(progressRef.current, { scaleX: 0, opacity: 0, duration: 0.2 });
            }
        },
        onPointerCancel: () => {
            setIsHolding(false);
            gsap.to(containerRef.current, { scale: 1, duration: 0.3 });
            if (progressRef.current) {
                gsap.killTweensOf(progressRef.current);
                gsap.to(progressRef.current, { scaleX: 0, opacity: 0, duration: 0.2 });
            }
        }
    }, {
        // filterTaps removed as it is not a valid config option for useGesture hook directly in this version
    });

    return (
        <div
            ref={containerRef}
            {...bind()}
            className={`hold-to-reveal-container ${className || ''}`}
            style={{
                position: 'relative',
                touchAction: 'none', // Critical for preventing scroll while holding
                userSelect: 'none',
                cursor: 'pointer',
                overflow: 'hidden', // Contain the progress bar
                ...style
            }}
        >
            {children}

            {/* Progress Indicator (Overlay) */}
            <div
                ref={progressRef}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#00FF99', // Cyber green
                    transformOrigin: 'left',
                    transform: 'scaleX(0)',
                    opacity: 0,
                    zIndex: 10,
                    boxShadow: '0 -2px 10px rgba(0, 255, 153, 0.5)'
                }}
            />
        </div>
    );
};

export default HoldToReveal;
