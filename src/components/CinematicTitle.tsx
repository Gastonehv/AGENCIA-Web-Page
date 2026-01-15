import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicTitleProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    splitBy?: 'chars' | 'words';
    stagger?: number;
}

const CinematicTitle: React.FC<CinematicTitleProps> = ({
    text,
    className = '',
    style = {},
    splitBy = 'chars',
    stagger = 0.03
}) => {
    const containerRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const elements = gsap.utils.toArray('.cinematic-char');

            gsap.fromTo(elements,
                {
                    y: '120%', // Start strictly below
                    rotateX: -90, // slight 3D rotation for depth
                    opacity: 0,
                    filter: 'blur(15px)',
                    transformOrigin: '50% 50% -50px',
                    willChange: 'transform, opacity, filter'
                },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%", // Trigger when visible
                        toggleActions: "play none none reverse"
                    },
                    y: '0%',
                    rotateX: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    stagger: stagger,
                    ease: "expo.out" // Elegant, slow finish
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [text, stagger]);

    // Manual Splitting
    const renderContent = () => {
        if (splitBy === 'chars') {
            return text.split('').map((char, i) => (
                <span
                    key={i}
                    className="cinematic-char"
                    style={{ display: 'inline-block', whiteSpace: 'pre' }} // preserve spaces
                >
                    {char}
                </span>
            ));
        }
        // Words fallback
        return text.split(' ').map((word, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
                <span className="cinematic-char" style={{ display: 'inline-block' }}>{word}</span>
            </span>
        ));
    };

    return (
        <span
            ref={containerRef}
            className={className}
            style={{
                display: 'inline-block',
                overflow: 'visible', // FIXED: Was 'hidden', caused letter clipping
                ...style
            }}
            aria-label={text}
        >
            {renderContent()}
        </span>
    );
};

export default React.memo(CinematicTitle);
