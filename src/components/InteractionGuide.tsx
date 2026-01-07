import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type InteractionType = 'scroll' | 'drag' | 'hover' | 'click';

interface InteractionItem {
    type: InteractionType;
    text: string;
}

interface InteractionGuideProps {
    items?: InteractionItem[];
    mode?: 'scroll' | 'drag' | 'both';
    className?: string;
    style?: React.CSSProperties;
}

const InteractionGuide: React.FC<InteractionGuideProps> = ({ items, mode, className, style }) => {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize functionality
    const activeItems = items || (() => {
        const defaults: InteractionItem[] = [];
        if (mode === 'scroll' || mode === 'both') defaults.push({ type: 'scroll', text: 'Scroll' });
        if (mode === 'drag' || mode === 'both') defaults.push({ type: 'drag', text: 'Drag' });
        return defaults;
    })();

    // Auto-hide after user starts interacting
    useEffect(() => {
        const hideOnScroll = () => {
            if (window.scrollY > 200) {
                setIsVisible(false);
            }
        };
        window.addEventListener('scroll', hideOnScroll, { passive: true });
        return () => window.removeEventListener('scroll', hideOnScroll);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !isVisible) return;

        const ctx = gsap.context(() => {
            // Subtle float animation
            gsap.to(containerRef.current, {
                y: -4,
                duration: 2.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // Icon animations
            activeItems.forEach(item => {
                if (item.type === 'scroll') {
                    gsap.to('.scroll-indicator', {
                        y: 6,
                        opacity: 0.4,
                        duration: 1.2,
                        repeat: -1,
                        ease: "power1.inOut"
                    });
                }
                if (item.type === 'drag') {
                    gsap.to('.drag-indicator', {
                        x: 8,
                        duration: 1.5,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut"
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [activeItems, isVisible]);

    const renderMinimalIcon = (type: InteractionType) => {
        switch (type) {
            case 'scroll':
                return (
                    <div style={{
                        width: '20px',
                        height: '32px',
                        border: '2px solid rgba(0, 255, 153, 0.6)',
                        borderRadius: '10px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '6px'
                    }}>
                        <div
                            className="scroll-indicator"
                            style={{
                                width: '3px',
                                height: '8px',
                                background: '#00FF99',
                                borderRadius: '2px',
                                boxShadow: '0 0 6px rgba(0, 255, 153, 0.8)'
                            }}
                        />
                    </div>
                );
            case 'drag':
                return (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span style={{ fontSize: '0.9rem', color: 'rgba(143, 0, 255, 0.7)' }}>←</span>
                        <div
                            className="drag-indicator"
                            style={{
                                width: '10px',
                                height: '10px',
                                background: 'rgba(143, 0, 255, 0.8)',
                                borderRadius: '50%',
                                boxShadow: '0 0 8px rgba(143, 0, 255, 0.6)'
                            }}
                        />
                        <span style={{ fontSize: '0.9rem', color: 'rgba(143, 0, 255, 0.7)' }}>→</span>
                    </div>
                );
            case 'hover':
                return (
                    <div style={{ color: '#00D4FF', fontSize: '1.2rem' }}>◎</div>
                );
            case 'click':
                return (
                    <div style={{ color: '#FF0055', fontSize: '1.2rem' }}>⦿</div>
                );
            default:
                return null;
        }
    };

    const getColor = (type: InteractionType) => {
        switch (type) {
            case 'scroll': return 'rgba(0, 255, 153, 0.8)';
            case 'drag': return 'rgba(143, 0, 255, 0.8)';
            case 'hover': return 'rgba(0, 212, 255, 0.8)';
            case 'click': return 'rgba(255, 0, 85, 0.8)';
            default: return 'rgba(255, 255, 255, 0.8)';
        }
    };

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '2.5rem',
                zIndex: 50,
                pointerEvents: 'none',
                transition: 'opacity 0.5s ease',
                ...style
            }}
        >
            {activeItems.map((item, index) => (
                <div
                    key={index}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {renderMinimalIcon(item.type)}
                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: getColor(item.type),
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em'
                    }}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default InteractionGuide;
