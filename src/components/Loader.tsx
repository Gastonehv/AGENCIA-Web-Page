import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import iconWhite from '../assets/logos/icon-white.png';

gsap.registerPlugin(TextPlugin);

interface LoaderProps {
    onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);

    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (containerRef.current) {
                        gsap.set(containerRef.current, { display: 'none' });
                    }
                    if (onCompleteRef.current) onCompleteRef.current();
                }
            });

            // --- SC: HYBRID REAL-TIME LOADER (Visuals + Real Logic) ---

            // 0. Setup Real Load Listener
            let isLoaded = false;
            // Check if already loaded (e.g. refresh)
            if (document.readyState === 'complete') {
                isLoaded = true;
            } else {
                window.addEventListener('load', () => { isLoaded = true; checkLoadRelease(); });
                // Fallback: Force release after 5s to prevent infinite hanging on broken assets
                setTimeout(() => { isLoaded = true; checkLoadRelease(); }, 5000);
            }

            const counterObj = { val: 0 }; // Defined properly in scope

            // Helper to release the lock
            const checkLoadRelease = () => {
                if (isLoaded && tl && tl.paused()) {
                    tl.play();
                }
            };

            // 1. HONEST PROGRESS SEQUENCE (0 -> 99%)
            // SC: Replaced "Fake Boost" with linear information reveal. 25% per concept.

            const sequenceWords = ["ESTRATEGIA", "DISEÑO", "TECNOLOGÍA", "FUTURO"];
            const steps = sequenceWords.length; // 4 steps
            const totalDuration = 2.0; // Total time for words
            const stepDuration = totalDuration / steps;

            sequenceWords.forEach((word, index) => {
                const endPct = (index + 1) * 25 - (index === steps - 1 ? 1 : 0); // End at 99 for last step

                const startTime = index * stepDuration;

                // Word Appearance
                tl.to(textRef.current, {
                    opacity: 1,
                    duration: 0.1,
                    onStart: () => { if (textRef.current) textRef.current.innerText = word; }
                }, startTime)

                    // Counter Progress for this Step
                    .to(counterObj, {
                        val: endPct,
                        duration: stepDuration, // Linear filling
                        ease: "none", // Honest linear time
                        onUpdate: () => {
                            if (counterRef.current) counterRef.current.innerText = Math.floor(counterObj.val).toString().padStart(3, '0');
                        }
                    }, startTime)

                // Word Disappearance (except last one)
                if (index < steps - 1) {
                    tl.to(textRef.current, { opacity: 0, duration: 0.1 }, startTime + stepDuration - 0.1);
                }
            });

            // Last word "FUTURO" stays visible and enters destabilization

            // Parallel: Violent Shake while loading
            tl.to(textRef.current, {
                x: () => (Math.random() - 0.5) * 10, // Jitter
                y: () => (Math.random() - 0.5) * 10,
                filter: 'blur(2px)',
                textShadow: '2px 0 #00ffff, -2px 0 #ff00ff', // Chromatic Aberration
                duration: 0.05,
                repeat: 30, // Shake for 1.5s
                yoyo: true
            }, "<");

            // 4. THE REALITY CHECK (Pause if not loaded)
            tl.call(() => {
                if (!isLoaded) {
                    tl.pause();
                }
            });

            // 4.5. SINGULARITY COLLAPSE (Release Sequence)
            // Text sucks in before exploding
            tl.to(textRef.current, {
                scale: 0.1, // SINGULARITY
                opacity: 0,
                duration: 0.2, // Fast suck
                ease: "back.in(2)",
                filter: 'blur(10px)'
            });

            // 5. THE RELEASE (100% + EXPLOSION)
            tl.addLabel("explosion")
                .to(counterObj, {
                    val: 100,
                    duration: 0.1,
                    onUpdate: () => {
                        if (counterRef.current) {
                            counterRef.current.innerText = "100";
                            counterRef.current.style.color = "#00FF99";
                        }
                    }
                }, "explosion")
                .to(textRef.current, {
                    scale: 100, // Zoom into the void
                    opacity: 0,
                    duration: 0.4,
                    ease: "expo.in"
                }, "explosion")
                .to(containerRef.current, {
                    backgroundColor: '#ffffff',
                    duration: 0.1
                }, "explosion+=0.1")
                .to(containerRef.current, {
                    backgroundColor: '#000000',
                    duration: 0.1 // Fast fade to black background for logo contrast
                })
                // RESTORED: THE BRAIN LOGO REVEAL
                .fromTo(logoRef.current,
                    { scale: 3, opacity: 0, filter: 'blur(20px)' },
                    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: "expo.out" },
                    "-=0.1"
                )
                // Hold logo for a split second before curtain up
                .to(logoRef.current, {
                    duration: 0.5
                })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut"
                });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: '#000',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Counter (Top Right) */}
            <div
                ref={counterRef}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    fontFamily: 'monospace',
                    fontSize: '1.5rem',
                    color: '#fff',
                    opacity: 0.5
                }}
            >
                000
            </div>

            {/* Kinetic Text Center */}
            <div
                ref={textRef}
                style={{
                    position: 'absolute',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.1em',
                    opacity: 0,
                    willChange: 'transform, opacity'
                }}
            >
                INIT
            </div>

            {/* Final Logo */}
            <img
                ref={logoRef}
                src={iconWhite}
                alt="AgencIA"
                style={{
                    width: 'clamp(150px, 30vw, 300px)',
                    height: 'auto',
                    opacity: 0,
                    position: 'absolute'
                }}
            />
        </div>
    );
};

export default Loader;
