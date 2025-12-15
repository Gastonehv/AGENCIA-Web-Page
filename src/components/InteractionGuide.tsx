import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type InteractionType = 'scroll' | 'drag' | 'hover' | 'click';

interface InteractionItem {
    type: InteractionType;
    text: string;
}

interface InteractionGuideProps {
    items?: InteractionItem[];
    mode?: 'scroll' | 'drag' | 'both'; // Deprecated
    className?: string; // For custom positioning
    style?: React.CSSProperties;
}

const InteractionGuide: React.FC<InteractionGuideProps> = ({ items, mode, className, style }) => {
    // Normalize functionality: use items if provided, otherwise map mode
    const activeItems = items || (() => {
        const defaults: InteractionItem[] = [];
        if (mode === 'scroll' || mode === 'both') defaults.push({ type: 'scroll', text: 'Deslizar' });
        if (mode === 'drag' || mode === 'both') defaults.push({ type: 'drag', text: 'Arrastrar' });
        return defaults;
    })();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Container Pulse
            gsap.to(containerRef.current, {
                scale: 1.05,
                boxShadow: '0 0 20px rgba(0, 255, 153, 0.3)',
                duration: 1.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            // Animations for each type
            activeItems.forEach(item => {
                if (item.type === 'scroll') {
                    gsap.to('.scroll-wheel', { y: 5, opacity: 0, duration: 1.5, repeat: -1, ease: "power1.inOut" });
                }
                if (item.type === 'drag') {
                    gsap.to('.drag-hand', { x: 10, duration: 1, yoyo: true, repeat: -1, ease: "sine.inOut" });
                }
                if (item.type === 'hover') {
                    gsap.to('.hover-mouse', { x: 8, y: -5, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
                }
                if (item.type === 'click') {
                    gsap.fromTo('.click-ring',
                        { scale: 0.5, opacity: 1 },
                        { scale: 1.5, opacity: 0, duration: 1.5, repeat: -1, ease: "power1.out" }
                    );
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [activeItems]);

    const renderIcon = (type: InteractionType) => {
        switch (type) {
            case 'scroll':
                return (
                    <div style={{
                        width: '18px', height: '30px',
                        border: '2px solid #00FF99', borderRadius: '10px',
                        position: 'relative', boxShadow: '0 0 10px rgba(0, 255, 153, 0.5)'
                    }}>
                        <div className="scroll-wheel" style={{
                            width: '3px', height: '5px', background: '#fff',
                            borderRadius: '2px', position: 'absolute', top: '5px',
                            left: '50%', transform: 'translateX(-50%)'
                        }} />
                    </div>
                );
            case 'drag':
                return (
                    <div style={{ width: '30px', height: '30px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: '100%', border: '1px dashed rgba(143, 0, 255, 0.5)', borderRadius: '50%', position: 'absolute' }} />
                        <svg className="drag-hand" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8F00FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px #8F00FF)' }}>
                            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                        </svg>
                    </div>
                );
            case 'hover':
                return (
                    <div style={{ width: '30px', height: '30px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Mouse Moving */}
                        <svg className="hover-mouse" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px #00D4FF)' }}>
                            <rect x="5" y="2" width="14" height="20" rx="7" />
                            <line x1="12" y1="6" x2="12" y2="6" strokeWidth="4" />
                            {/* Represents movement trails */}
                            <path d="M22 10 l2 2 -2 2" opacity="0.6" strokeWidth="1.5" />
                        </svg>
                    </div>
                );
            case 'click':
                return (
                    <div style={{ width: '30px', height: '30px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Finger Pressing */}
                        <div className="click-ring" style={{
                            position: 'absolute', width: '100%', height: '100%',
                            border: '2px solid #FF0055', borderRadius: '50%',
                            opacity: 0
                        }} />
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF0055" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px #FF0055)' }}>
                            <path d="M14 9l-2-2-2 2" />
                            <path d="M12 7v10" />
                            <circle cx="12" cy="19" r="2" fill="#FF0055" />
                        </svg>
                    </div>
                );
            default: return null;
        }
    };

    const getColor = (type: InteractionType) => {
        switch (type) {
            case 'scroll': return '#00FF99';
            case 'drag': return '#8F00FF';
            case 'hover': return '#00D4FF';
            case 'click': return '#FF0055';
            default: return '#fff';
        }
    };

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
                gap: '2rem',
                zIndex: 50,
                pointerEvents: 'none',
                background: 'rgba(10, 0, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '0.8rem 1.5rem',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                ...style // Allow style overrides
            }}
        >
            {activeItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    {renderIcon(item.type)}
                    <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: getColor(item.type),
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        textShadow: `0 0 5px ${getColor(item.type)}`,
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                    }}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default InteractionGuide;
