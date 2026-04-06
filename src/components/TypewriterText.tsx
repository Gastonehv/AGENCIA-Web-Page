import React, { useEffect, useRef } from 'react';

/**
 * Character typewriter effect for Cinematic pages.
 * Specifically interacts with parent scroll state.
 */

interface TypewriterTextProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
    trigger?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, className, style, delay = 0, trigger = false }) => {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!trigger || !elementRef.current) return;

        const el = elementRef.current;
        const originalText = text;
        el.textContent = "";
        
        let currentIdx = 0;
        const totalChars = originalText.length;
        
        const type = () => {
            if (currentIdx <= totalChars) {
                el.textContent = originalText.substring(0, currentIdx);
                // Random characters for "AI/Tech" feel
                if (currentIdx < totalChars) {
                    const randomChars = "!@#$%/&*<>[]01";
                    el.textContent += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                currentIdx++;
                setTimeout(type, 15 + Math.random() * 25); // Fast but visible
            }
        };

        const timeout = setTimeout(type, delay);
        return () => clearTimeout(timeout);
    }, [trigger, text, delay]);

    return (
        <span
            ref={elementRef}
            className={className}
            style={{
                fontFamily: 'var(--font-mono, monospace)',
                whiteSpace: 'pre-wrap',
                ...style
            }}
        >
            {/* Render nothing initially to avoid flash */}
        </span>
    );
};

export default TypewriterText;
