import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MaskedTextProps {
    main: string;
    sub?: string; // Optional sub-text for hover effect
    index?: number; // For staggering
    className?: string;
    style?: React.CSSProperties; // Optional style overrides
    start?: string; // ScrollTrigger start
    manualControl?: boolean; // If true, we don't auto-trigger. Values controlled externally (WJY style).
}

const MaskedText: React.FC<MaskedTextProps> = ({ main, sub, index = 0, className, style, start = "top 80%", manualControl = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (manualControl) return; // Skip internal animation if controlled externally

        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current,
                { yPercent: 120, rotateX: -20, opacity: 0 },
                {
                    yPercent: 0,
                    rotateX: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power4.out',
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: start,
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [index, start, manualControl]);

    return (
        <div ref={containerRef} style={{ overflow: 'hidden', position: 'relative', marginTop: '-0.2em', ...style }} className={className}>
            <h2 ref={textRef}
                style={{
                    margin: 0,
                    lineHeight: 1,
                    display: 'block',
                    position: 'relative',
                    cursor: sub ? 'pointer' : 'default'
                    // Initial state handled by GSAP
                }}
                onMouseEnter={() => sub && setIsHovered(true)}
                onMouseLeave={() => sub && setIsHovered(false)}
            >
                {/* Main Text */}
                <span className="masked-main" style={{
                    display: 'inline-block',
                    transition: 'all 0.5s ease',
                    opacity: isHovered ? 0.1 : 1, // Deep fade for contrast
                    filter: isHovered ? 'blur(4px)' : 'none', // Increased blur
                    willChange: 'transform, opacity, filter'
                }}>
                    {main}
                </span>

                {/* Sub Text Overlay */}
                {sub && (
                    <span className="masked-sub bio-text" style={{
                        position: 'absolute', top: 0, left: 0,
                        // Color controlled by .bio-text gradient
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.1, 0.5, 0.5, 1)',
                        fontWeight: 700,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap'
                    }}>
                        {sub}
                    </span>
                )}
            </h2>
        </div>
    );
};

export default MaskedText;
