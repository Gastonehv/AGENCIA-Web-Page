import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ChapterTitleProps {
    number: string;
    title: string;
    subtitle?: string;
}

const ChapterTitle: React.FC<ChapterTitleProps> = ({ number, title, subtitle }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: false,
                    toggleActions: 'play none none reverse',
                }
            });

            tl.fromTo(numberRef.current,
                { opacity: 0, x: -20, filter: 'blur(10px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
            )
                .fromTo(titleRef.current,
                    { opacity: 0, scale: 0.9, filter: 'blur(15px)' },
                    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out' },
                    '-=0.5'
                )
                .fromTo(lineRef.current,
                    { scaleX: 0, transformOrigin: 'left' },
                    { scaleX: 1, duration: 1, ease: 'power4.inOut' },
                    '-=0.8'
                );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="chapter-title-container" style={{
            padding: '4rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            overflow: 'hidden',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span ref={numberRef} style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '1rem',
                    color: 'var(--accent-color, #00FF99)',
                    letterSpacing: '0.3em',
                    fontWeight: 700, // Thicker
                    textShadow: '0 0 10px rgba(0, 255, 153, 0.5)' // Glow for visibility
                }}>
                    CAPÍTULO {number}
                </span>
                <div ref={lineRef} style={{
                    width: '60px',
                    height: '2px', // Thicker line
                    backgroundColor: 'rgba(255,255,255,0.8)' // Much higher opacity
                }} />
            </div>

            <h2 ref={titleRef} style={{
                fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: '#FFF'
            }}>
                {title}
            </h2>

            {subtitle && (
                <p style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.9rem',
                    color: '#888',
                    marginTop: '1rem',
                    letterSpacing: '0.1em'
                }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default ChapterTitle;
