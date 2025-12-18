import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FloatingWindowProps {
    id?: string;
    title: string;
    type?: 'code' | 'graph' | 'alert' | 'agent';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content?: any; // Flexible content payload
    initialX?: number;
    initialY?: number;
    zIndex?: number;
    delay?: number;
    variant?: 'danger' | 'success' | 'neutral';

    // New Props for IntelligenceScene
    position?: 'left' | 'right';
    mode?: 'text' | 'image';
    isActive?: boolean;
    image?: string;
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({
    title, type = 'agent', content, initialX = 0, initialY = 0, zIndex = 10, delay = 0, variant = 'neutral',
    position, mode, isActive, image
}) => {
    const windowRef = useRef<HTMLDivElement>(null);

    // Initial Appearance Animation
    useEffect(() => {
        const el = windowRef.current;
        if (!el) return;

        // If explicitly active/inactive (Intelligence Scene Mode)
        if (typeof isActive === 'boolean') {
            if (isActive) {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
            } else {
                gsap.to(el, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.in' });
            }
            return;
        }

        // Default Animation
        gsap.fromTo(el,
            {
                scale: 0.8,
                opacity: 0,
                y: initialY + 50,
                x: initialX
            },
            {
                scale: 1,
                opacity: 1,
                y: initialY,
                x: initialX,
                duration: 0.6,
                delay: delay,
                ease: 'back.out(1.2)'
            }
        );
    }, [initialX, initialY, delay, isActive]); // Added isActive dependency

    // Dynamic Style based on Variant
    const getBorderColor = () => {
        if (variant === 'danger') return 'rgba(255, 50, 50, 0.5)';
        if (variant === 'success') return 'rgba(0, 255, 153, 0.5)';
        return 'rgba(255, 255, 255, 0.1)';
    };

    const getShadow = () => {
        if (variant === 'danger') return '0 10px 40px rgba(255, 0, 0, 0.2)';
        if (variant === 'success') return '0 10px 40px rgba(0, 255, 153, 0.15)';
        return '0 20px 50px rgba(0, 0, 0, 0.5)';
    };

    // Calculate Position Styles
    let positionStyles: React.CSSProperties = {
        position: 'absolute',
        left: 0, top: 0, // Default generic
    };

    if (position === 'left') {
        positionStyles = { position: 'absolute', left: '5%', top: '20%' };
    } else if (position === 'right') {
        positionStyles = { position: 'absolute', right: '5%', top: '20%' };
    }


    return (
        <div
            ref={windowRef}
            className={`window-${type}`}
            style={{
                ...positionStyles,
                width: type === 'alert' ? '300px' : '400px',
                minHeight: type === 'alert' ? '100px' : '200px',
                backgroundColor: 'rgba(10, 10, 12, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                border: `1px solid ${getBorderColor()}`,
                boxShadow: getShadow(),
                zIndex: zIndex,
                color: '#EEE',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
                willChange: 'transform',
                opacity: typeof isActive === 'boolean' ? 0 : 1, // Start hidden if managed by isActive
                transform: typeof isActive === 'boolean' ? 'translateY(20px)' : 'none'
            }}
        >
            {/* WINDOW HEADER (Traffic Lights) */}
            <div style={{
                height: '32px',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }} /> {/* Red */}
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} /> {/* Yellow */}
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }} /> {/* Green */}
                </div>
                <div style={{ fontSize: '0.7em', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {title}
                </div>
                <div style={{ width: '30px' }} /> {/* Spacer for centering */}
            </div>

            {/* WINDOW CONTENT */}
            <div style={{ padding: '16px', fontSize: '0.85rem' }}>

                {/* MODE: TEXT (Intelligence) */}
                {mode === 'text' && (
                    <div style={{ lineHeight: 1.6, color: '#A9B7C6' }}>
                        {content}
                    </div>
                )}

                {/* MODE: IMAGE (Intelligence) */}
                {mode === 'image' && image && (
                    <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={image} alt="Visual Process" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                )}
                {mode === 'image' && !image && (
                    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                        NO DATA STREAM
                    </div>
                )}


                {/* LEGACY MODES */}
                {!mode && type === 'code' && (
                    <pre style={{ margin: 0, fontFamily: 'monospace', color: '#A9B7C6', overflowX: 'auto' }}>
                        <code>
                            {content && content.split('\n').map((line: string, i: number) => (
                                <div key={i} style={{ display: 'flex' }}>
                                    <span style={{ color: '#555', marginRight: '10px', userSelect: 'none' }}>{i + 1}</span>
                                    {/* Simple Syntax Highlighting Simulation */}
                                    <span dangerouslySetInnerHTML={{
                                        __html: line
                                            .replace(/(const|let|var|function|return|if|else)/g, '<span style="color:#CC7832">$1</span>')
                                            .replace(/('.*?')/g, '<span style="color:#6A8759">$1</span>')
                                            .replace(/(console|log|await|async)/g, '<span style="color:#9876AA">$1</span>')
                                    }} />
                                </div>
                            ))}
                        </code>
                    </pre>
                )}

                {!mode && type === 'alert' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            fontSize: '2rem',
                            color: variant === 'danger' ? '#FF5F56' : '#27C93F'
                        }}>
                            {variant === 'danger' ? '⚠️' : '✅'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{content.title}</div>
                            <div style={{ opacity: 0.7, fontSize: '0.8em' }}>{content.message}</div>
                        </div>
                    </div>
                )}

                {!mode && type === 'graph' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                        {/* FAKE BARS */}
                        {content && content.data.map((val: number, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '40px', fontSize: '0.7em', opacity: 0.5 }}>{content.labels[i]}</div>
                                <div style={{
                                    flex: 1,
                                    height: '6px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${val}%`,
                                        height: '100%',
                                        background: variant === 'danger' ? '#FF5F56' : '#00FF99',
                                        transition: 'width 1s ease-out'
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.7em', width: '30px' }}>{val}%</div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default FloatingWindow;
