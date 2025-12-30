import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

interface FloatingWindowProps {
    id?: string;
    title: string;
    type?: 'code' | 'graph' | 'alert' | 'agent';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content?: any;
    initialX?: number;
    initialY?: number;
    zIndex?: number;
    delay?: number;
    variant?: 'danger' | 'success' | 'neutral';

    // Props for IntelligenceScene
    position?: 'left' | 'right';
    mode?: 'text' | 'image';
    isActive?: boolean;
    image?: string;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({
    title, type = 'agent', content, initialX = 0, initialY = 0, zIndex = 10, variant = 'neutral',
    position, mode, isActive, image
}) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [displayContent, setDisplayContent] = useState('');

    // Appearance Coreography
    useEffect(() => {
        const el = windowRef.current;
        if (!el) return;

        if (typeof isActive === 'boolean') {
            if (isActive) {
                gsap.fromTo(el,
                    { opacity: 0, x: position === 'left' ? -50 : 50, filter: 'blur(10px)' },
                    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }
                );
            } else {
                gsap.to(el, { opacity: 0, x: position === 'left' ? -20 : 20, duration: 0.4, ease: 'power2.in' });
            }
        }
    }, [isActive, position]);

    // Typewriter effect simulation for content
    useEffect(() => {
        if (isActive && mode === 'text' && typeof content === 'string') {
            let i = 0;
            const timer = setInterval(() => {
                setDisplayContent(content.substring(0, i));
                i++;
                if (i > content.length) clearInterval(timer);
            }, 30);
            return () => clearInterval(timer);
        }
    }, [isActive, content, mode]);

    const getBorderColor = () => {
        if (variant === 'danger') return '#ff4444';
        if (variant === 'success') return '#00ff99';
        return 'rgba(255, 255, 255, 0.2)';
    };

    let positionStyles: React.CSSProperties = {
        position: 'absolute',
        left: initialX, top: initialY,
    };

    if (position === 'left') {
        positionStyles = { position: 'absolute', left: '4%', top: '15%' };
    } else if (position === 'right') {
        positionStyles = { position: 'absolute', right: '4%', top: '15%' };
    }

    return (
        <div
            ref={windowRef}
            style={{
                ...positionStyles,
                width: position ? '380px' : (type === 'alert' ? '300px' : '400px'),
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: `0.5px solid ${getBorderColor()}`,
                zIndex: zIndex,
                color: '#FFF',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
                opacity: typeof isActive === 'boolean' ? 0 : 1,
                boxShadow: '0 0 40px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* EDITORIAL HEADER */}
            <div style={{
                padding: '10px 15px',
                borderBottom: `0.5px solid ${getBorderColor()}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.02)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', background: getBorderColor() }} />
                    <span style={{ fontSize: '0.65rem', letterSpacing: '2px', opacity: 0.8, textTransform: 'uppercase' }}>
                        {title}
                    </span>
                </div>
                <div style={{ fontSize: '0.6rem', opacity: 0.4 }}>
                    {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div ref={contentRef} style={{ padding: '20px', position: 'relative' }}>

                {/* Scanline overlay (Subtle) */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    zIndex: 2, backgroundSize: '100% 2px, 3px 100%', pointerEvents: 'none', opacity: 0.1
                }} />

                {mode === 'text' && (
                    <div style={{
                        fontSize: '0.85rem',
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,0.9)',
                        minHeight: '100px'
                    }}>
                        {displayContent}
                        <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#00f3ff', marginLeft: '4px', verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
                    </div>
                )}

                {mode === 'image' && image && (
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: isActive ? 1 : 1.1, opacity: isActive ? 1 : 0 }}
                        style={{ width: '100%', filter: 'grayscale(0.5) contrast(1.2)' }}
                    >
                        <img src={image} alt="Visual Stream" style={{ width: '100%', filter: 'sepia(0.2) hue-rotate(140deg)' }} />
                    </motion.div>
                )}

                {mode === 'image' && !image && (
                    <div style={{ fontSize: '0.7rem', opacity: 0.3, textAlign: 'center', padding: '40px 0' }}>
                        [ NO FEED DETECTED ]
                    </div>
                )}

                {!mode && type === 'code' && (
                    <pre style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>
                        {content}
                    </pre>
                )}
            </div>

            {/* BOTTOM DECORATION */}
            <div style={{
                height: '4px',
                width: '100%',
                background: `linear-gradient(90deg, transparent, ${getBorderColor()}, transparent)`,
                opacity: 0.3
            }} />

            <style>{`
                @keyframes blink { 
                    0%, 100% { opacity: 1; } 
                    50% { opacity: 0; } 
                }
            `}</style>
        </div>
    );
};

export default FloatingWindow;
