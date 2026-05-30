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
    isActive?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON MAP — each icon is a unique signal glyph, 24px, 1.25px stroke
// Language: frequency lines, not generic UI metaphors
// ─────────────────────────────────────────────────────────────────────────────

// SCROLL — single vertical bar + downward chevron. Reads instantly as "go down".
const IconScroll = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="2" x2="10" y2="14" stroke="#00FF99" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M7 11L10 14L13 11" stroke="#00FF99" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="ig-scroll-arrow" />
    </svg>
);

// DRAG — pure bidirectional arrow ←→. One line, two heads.
const IconDrag = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10H18" stroke="#00E5FF" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M5 7L2 10L5 13" stroke="#00E5FF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="ig-drag-left" />
        <path d="M15 7L18 10L15 13" stroke="#00E5FF" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="ig-drag-right" />
    </svg>
);

// HOVER — one circle. Nothing else. The ring pulsing IS the meaning.
const IconHover = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="#00FF99" strokeWidth="1.25" className="ig-hover-r1" />
        <circle cx="10" cy="10" r="2" fill="#00FF99" />
    </svg>
);

// CLICK — diagonal tap arrow. Not a burst, just a finger vector pointing down-right.
const IconClick = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5L15 15" stroke="#FF0080" strokeWidth="1.25" strokeLinecap="round" className="ig-click-rays" />
        <path d="M9 15H15V9" stroke="#FF0080" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// HOLD — a simple arc (semicircle). Open = waiting. Animates to closed.
const IconHold = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="rgba(255,255,255,0.1)" strokeWidth="1.25" />
        <path d="M10 3 A7 7 0 0 1 10 17" stroke="#00FF99" strokeWidth="1.25" strokeLinecap="round" className="ig-hold-arc" />
    </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// WORD MAP — one word per action
// ─────────────────────────────────────────────────────────────────────────────
const WORD_MAP: Record<InteractionType, string> = {
    scroll: 'EXPLORAR',
    drag:   'ARRASTRAR',
    hover:  'DETECTAR',
    click:  'ACTIVAR',
    hold:   'CARGAR',
};

const COLOR_MAP: Record<InteractionType, string> = {
    scroll: '#00FF99',
    drag:   '#00E5FF',
    hover:  '#00FF99',
    click:  '#FF0080',
    hold:   '#00FF99',
};

const ICON_MAP: Record<InteractionType, React.ReactNode> = {
    scroll: <IconScroll />,
    drag:   <IconDrag />,
    hover:  <IconHover />,
    click:  <IconClick />,
    hold:   <IconHold />,
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const InteractionGuide: React.FC<InteractionGuideProps> = ({
    items, mode, className, style, persist = false, isActive
}) => {
    const [isVisible, setIsVisible] = useState(isActive !== undefined ? isActive : true);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeItems = items || (() => {
        const defaults: InteractionItem[] = [];
        if (mode === 'scroll' || mode === 'both') defaults.push({ type: 'scroll', text: 'EXPLORAR' });
        if (mode === 'drag'   || mode === 'both') defaults.push({ type: 'drag',   text: 'ARRASTRAR' });
        return defaults;
    })();

    // Visibility logic — fully reversible on scroll
    useEffect(() => {
        if (isActive !== undefined) {
            if (isActive) {
                setIsVisible(true);
                const startScroll = window.scrollY;
                const handleScroll = () => {
                    if (Math.abs(window.scrollY - startScroll) > 100) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                };
                window.addEventListener('scroll', handleScroll, { passive: true });
                return () => window.removeEventListener('scroll', handleScroll);
            } else {
                setIsVisible(false);
            }
            return;
        }
        if (persist) { setIsVisible(true); return; }
        
        const hideOnScroll = () => { 
            if (window.scrollY > 250) {
                setIsVisible(false); 
            } else {
                setIsVisible(true);
            }
        };
        
        // Initial execution to match current position
        hideOnScroll();
        
        window.addEventListener('scroll', hideOnScroll, { passive: true });
        return () => window.removeEventListener('scroll', hideOnScroll);
    }, [isActive, persist]);

    // GSAP micro-animations
    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            // Gentle float of the entire pill
            gsap.to(containerRef.current, {
                y: -5, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut'
            });

            // SCROLL: chevron drifts down and fades
            gsap.to('.ig-scroll-arrow', {
                y: 3, opacity: 0.2, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut'
            });

            // DRAG: arrowheads spread apart
            gsap.to('.ig-drag-left',  { x: -2, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
            gsap.to('.ig-drag-right', { x:  2, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.45 });

            // HOVER: single ring pulses outward
            gsap.to('.ig-hover-r1', {
                scale: 1.2, opacity: 0.15, duration: 1.4,
                yoyo: true, repeat: -1, ease: 'sine.inOut',
                transformOrigin: 'center'
            });

            // CLICK: diagonal line flickers
            gsap.to('.ig-click-rays', {
                opacity: 0.3, duration: 0.4,
                yoyo: true, repeat: -1, ease: 'power2.out', repeatDelay: 1.2
            });

            // HOLD: arc charges from open to closed, resets
            gsap.fromTo('.ig-hold-arc',
                { strokeDashoffset: 44 },
                { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.4 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [activeItems]);

    const hasDivider = activeItems.length > 1;

    return (
        <>
            <style>{`
                .ig-pill {
                    position: absolute;
                    bottom: 1.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: inline-flex;
                    align-items: center;
                    gap: 0;
                    background: rgba(4, 7, 14, 0.75);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 40px;
                    padding: 0 4px;
                    height: 40px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
                    z-index: 8888;
                    pointer-events: none;
                    white-space: nowrap;
                }
                .ig-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0 14px;
                }
                .ig-divider {
                    width: 1px;
                    height: 18px;
                    background: rgba(255,255,255,0.1);
                    flex-shrink: 0;
                }
                .ig-word {
                    font-family: var(--font-mono);
                    font-size: 0.52rem;
                    font-weight: 600;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    line-height: 1;
                }
            `}</style>

            <div
                ref={containerRef}
                className={`ig-pill ${className || ''}`}
                style={{
                    ...style,
                    opacity: isVisible ? 1 : 0,
                    visibility: isVisible ? 'visible' : 'hidden',
                    transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: isVisible ? 'auto' : 'none'
                }}
            >
                {activeItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && hasDivider && <div className="ig-divider" />}
                        <div className="ig-item">
                            {ICON_MAP[item.type]}
                            <span
                                className="ig-word"
                                style={{ color: COLOR_MAP[item.type] }}
                            >
                                {WORD_MAP[item.type]}
                            </span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export default InteractionGuide;
