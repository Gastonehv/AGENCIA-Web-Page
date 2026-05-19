import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type InteractionType = 'scroll' | 'drag' | 'hover' | 'click' | 'hold';

interface InteractionItem {
    type: InteractionType;
    text: string;
}

interface InteractionGuideProps {
    items?: InteractionItem[];
    mode?: 'scroll' | 'drag' | 'both';
    className?: string;
    style?: React.CSSProperties;
    persist?: boolean;
}

const InteractionGuide: React.FC<InteractionGuideProps> = ({ items, mode, className, style, persist = false }) => {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize functionality
    const activeItems = items || (() => {
        const defaults: InteractionItem[] = [];
        if (mode === 'scroll' || mode === 'both') defaults.push({ type: 'scroll', text: 'DESLIZAR' });
        if (mode === 'drag' || mode === 'both') defaults.push({ type: 'drag', text: 'ARRASTRAR' });
        return defaults;
    })();

    // Auto-hide after user starts interacting (unless persist is true)
    useEffect(() => {
        if (persist) return;
        const hideOnScroll = () => {
            if (window.scrollY > 250) {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', hideOnScroll, { passive: true });
        return () => window.removeEventListener('scroll', hideOnScroll);
    }, [persist]);

    useEffect(() => {
        if (!containerRef.current || !isVisible) return;

        const ctx = gsap.context(() => {
            // Subtle float animation for the entire HUD pill
            gsap.to(containerRef.current, {
                y: -6,
                duration: 2.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // Specific icon animations
            activeItems.forEach(item => {
                if (item.type === 'scroll') {
                    gsap.to('.cyber-scroll-wheel', {
                        y: 12,
                        opacity: 0.2,
                        duration: 1.4,
                        repeat: -1,
                        ease: "power2.inOut"
                    });
                }
                if (item.type === 'drag') {
                    gsap.to('.cyber-drag-arrows', {
                        x: 6,
                        duration: 1.2,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut"
                    });
                    gsap.to('.cyber-drag-ring', {
                        rotation: 360,
                        duration: 8,
                        repeat: -1,
                        ease: "linear",
                        transformOrigin: "center center"
                    });
                }
                if (item.type === 'hold') {
                    gsap.to('.cyber-hold-pulse', {
                        scale: 1.8,
                        opacity: 0,
                        duration: 1.8,
                        repeat: -1,
                        ease: "power2.out",
                        transformOrigin: "center center"
                    });
                }
                if (item.type === 'click') {
                    gsap.to('.cyber-click-core', {
                        scale: 0.7,
                        duration: 0.8,
                        yoyo: true,
                        repeat: -1,
                        ease: "power3.inOut",
                        transformOrigin: "center center"
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [activeItems, isVisible]);

    const renderCyberIcon = (type: InteractionType) => {
        switch (type) {
            case 'scroll':
                return (
                    <div style={{ position: 'relative', width: '28px', height: '42px', display: 'flex', justifyContent: 'center' }}>
                        <svg width="28" height="42" viewBox="0 0 28 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="26" height="40" rx="13" stroke="#00FF99" strokeWidth="2" strokeOpacity="0.8" filter="drop-shadow(0 0 8px rgba(0,255,153,0.5))" />
                            <path d="M7 12H21" stroke="#00FF99" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
                            <path d="M7 30H21" stroke="#00FF99" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
                            <circle className="cyber-scroll-wheel" cx="14" cy="10" r="3.5" fill="#00FF99" filter="drop-shadow(0 0 6px #00FF99)" />
                        </svg>
                    </div>
                );
            case 'drag':
                return (
                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className="cyber-drag-ring" cx="20" cy="20" r="16" stroke="#8F00FF" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.8" filter="drop-shadow(0 0 8px #8F00FF)" />
                            <g className="cyber-drag-arrows">
                                <path d="M12 20L16 16M12 20L16 24" stroke="#00F3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M28 20L24 16M28 20L24 24" stroke="#00F3FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="20" x2="28" y2="20" stroke="#00F3FF" strokeWidth="2" />
                            </g>
                            <circle cx="20" cy="20" r="3" fill="#00FF99" filter="drop-shadow(0 0 6px #00FF99)" />
                        </svg>
                    </div>
                );
            case 'hold':
                return (
                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle className="cyber-hold-pulse" cx="20" cy="20" r="12" stroke="#00FF99" strokeWidth="1.5" fill="none" filter="drop-shadow(0 0 10px #00FF99)" />
                            <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                            <path d="M20 12V15M20 25V28M12 20H15M25 20H28" stroke="#00FF99" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="20" cy="20" r="6" fill="#00FF99" fillOpacity="0.9" filter="drop-shadow(0 0 8px #00FF99)" />
                        </svg>
                    </div>
                );
            case 'click':
                return (
                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Reticle brackets */}
                            <path d="M8 14V8H14" stroke="#FF00AA" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 6px #FF00AA)" />
                            <path d="M32 14V8H26" stroke="#FF00AA" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 6px #FF00AA)" />
                            <path d="M8 26V32H14" stroke="#FF00AA" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 6px #FF00AA)" />
                            <path d="M32 26V32H26" stroke="#FF00AA" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 6px #FF00AA)" />
                            {/* Central core */}
                            <circle className="cyber-click-core" cx="20" cy="20" r="7" fill="#00FF99" filter="drop-shadow(0 0 10px #00FF99)" />
                        </svg>
                    </div>
                );
            case 'hover':
                return (
                    <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="20" cy="20" rx="18" ry="8" transform="rotate(30 20 20)" stroke="#00F3FF" strokeWidth="1.5" strokeDasharray="4 2" strokeOpacity="0.8" filter="drop-shadow(0 0 6px #00F3FF)" />
                            <ellipse cx="20" cy="20" rx="18" ry="8" transform="rotate(-30 20 20)" stroke="#8F00FF" strokeWidth="1.5" strokeDasharray="4 2" strokeOpacity="0.8" filter="drop-shadow(0 0 6px #8F00FF)" />
                            <circle cx="20" cy="20" r="5" fill="#00F3FF" filter="drop-shadow(0 0 10px #00F3FF)" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getColor = (type: InteractionType) => {
        switch (type) {
            case 'scroll': return '#00FF99';
            case 'drag': return '#00F3FF';
            case 'hover': return '#00F3FF';
            case 'click': return '#FF00AA';
            case 'hold': return '#00FF99';
            default: return '#FFFFFF';
        }
    };

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className={`cyber-interaction-guide ${className || ''}`}
            style={{
                position: 'absolute',
                bottom: '2.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                backgroundColor: 'rgba(6, 12, 18, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 255, 153, 0.3)',
                padding: '12px 32px',
                borderRadius: '50px',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 255, 153, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.05)',
                zIndex: 8888,
                pointerEvents: 'none',
                transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                ...style
            }}
        >
            {activeItems.map((item, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}
                >
                    {renderCyberIcon(item.type)}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6rem',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase'
                        }}>
                            ACCIÓN //
                        </span>
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.85rem',
                            fontWeight: 900,
                            color: getColor(item.type),
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            textShadow: `0 0 15px ${getColor(item.type)}`
                        }}>
                            {item.text}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InteractionGuide;
