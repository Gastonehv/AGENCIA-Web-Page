import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ChapterHUDProps {
    currentChapter: string;
    chapterNumber: string;
}

const ChapterHUD: React.FC<ChapterHUDProps> = ({ currentChapter, chapterNumber }) => {
    const [displayChapter, setDisplayChapter] = useState(currentChapter);
    const [displayNumber, setDisplayNumber] = useState(chapterNumber);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 1. Chapter transition glitch - FIXED TARGET TO AVOID CONSOLE ERRORS
        const tl = gsap.timeline();
        tl.to('.hud-dynamic-text', {
            opacity: 0,
            y: 5,
            duration: 0.15,
            ease: 'power2.in',
            onComplete: () => {
                setDisplayChapter(currentChapter);
                setDisplayNumber(chapterNumber);
            }
        })
            .to('.hud-dynamic-text', {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
    }, [currentChapter, chapterNumber]);

    useEffect(() => {
        // 2. Global Scroll Progress Tracking (Odometer)
        const updateProgress = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (totalScroll <= 0) return;
            const currentScroll = window.scrollY;
            const p = Math.min(100, Math.max(0, Math.floor((currentScroll / totalScroll) * 100)));
            setProgress(p);
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
        updateProgress();

        // 3. Proximity Opacity Logic (SC: Non-Obstructive)
        ScrollTrigger.create({
            trigger: "#capacidades",
            start: "top 20%",
            end: "bottom 20%",
            onEnter: () => gsap.to('.chapter-hud-container', { opacity: 0.15, duration: 0.8 }),
            onLeave: () => gsap.to('.chapter-hud-container', { opacity: 1, duration: 0.8 }),
            onEnterBack: () => gsap.to('.chapter-hud-container', { opacity: 0.15, duration: 0.8 }),
            onLeaveBack: () => gsap.to('.chapter-hud-container', { opacity: 1, duration: 0.8 }),
        });

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    // Numbers for odometer column
    const digits = progress.toString().padStart(3, '0').split('');

    return (
        <div className="chapter-hud-container" style={{
            position: 'fixed',
            top: '50%',
            right: '1.5rem',
            transform: 'translateY(-50%)',
            zIndex: 9999,
            pointerEvents: 'none',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2.5rem'
        }}>
            {/* VERTICAL PROGRESS LINE (The Spine) */}
            <div style={{
                position: 'relative',
                width: '1px',
                height: '180px',
                background: 'rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                {/* CURSOR / BULLET */}
                <div style={{
                    position: 'absolute',
                    top: `${progress}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '6px',
                    height: '6px',
                    background: '#00FF99',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #00FF99',
                    zIndex: 2,
                    transition: 'top 0.15s linear'
                }} />

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '2px',
                    height: `${progress}%`,
                    background: '#00FF99',
                    opacity: 0.4,
                    boxShadow: '0 0 10px rgba(0,255,153,0.3)',
                    transition: 'height 0.15s linear',
                    marginLeft: '-0.5px'
                }} />
            </div>

            {/* ROTATED CHAPTER INFO (Edge Telemetry) */}
            <div className="hud-dynamic-text" style={{
                writingMode: 'vertical-rl',
                textTransform: 'uppercase',
                transform: 'rotate(180deg)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem',
                opacity: progress > 2 ? 0.8 : 0.1, // Fade out at absolute top
                transition: 'opacity 0.5s ease'
            }}>
                <span style={{
                    fontSize: '0.65rem',
                    color: '#000',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                    textShadow: '0 0 15px rgba(255,255,255,1)'
                }}>
                    CAPITULO_00{displayNumber}
                </span>
                <span style={{
                    fontSize: '0.9rem',
                    color: '#00FF99',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                    textShadow: '0 0 3px rgba(0,0,0,0.2)'
                }}>
                    {displayChapter}
                </span>
            </div>

            {/* ODOMETER (Ghost Style) */}
            <div className="hud-odometer" style={{
                display: 'flex',
                gap: '2px',
                height: '1rem',
                overflow: 'hidden',
                alignItems: 'flex-start',
                padding: '4px 6px',
                background: 'rgba(0,0,0,1)', // Black bar for contrast
                borderRadius: '2px'
            }}>
                {digits.map((digit, i) => (
                    <div key={i} style={{
                        width: '0.65rem',
                        height: '1rem',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            transform: `translateY(-${parseInt(digit) * 1}rem)`,
                            transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <div key={n} style={{
                                    height: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: 900,
                                    color: digit === n.toString() ? '#00FF99' : 'rgba(255,255,255,0.1)',
                                }}>
                                    {n}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .chapter-hud-container {
                        right: 0.8rem;
                        gap: 1.5rem;
                        scale: 0.8;
                    }
                    .chapter-hud-container h4 {
                        color: #00FF99 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChapterHUD;
