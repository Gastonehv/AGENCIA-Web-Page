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

            // 1. Counter Animation (00 -> 100)
            const counterObj = { val: 0 };
            tl.to(counterObj, {
                val: 100,
                duration: 2.0, // Slightly longer for drama
                ease: "power2.inOut",
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.innerText = Math.floor(counterObj.val).toString().padStart(3, '0');
                    }
                }
            });

            // 2. Rapid Word Cycling (Kinetic Typography)
            // Removed "AGENCIA" from loop to treat it specially
            const sequenceWords = ["ESTRATEGIA", "DISEÑO", "TECNOLOGÍA", "FUTURO"];

            sequenceWords.forEach((word, index) => {
                tl.to(textRef.current, {
                    opacity: 1,
                    duration: 0.05,
                    onStart: () => {
                        if (textRef.current) textRef.current.innerText = word;
                    }
                }, index * 0.4) // Slower pace for readability
                    .to(textRef.current, {
                        opacity: 0,
                        duration: 0.05,
                        delay: 0.25
                    });
            });

            // 3. THE DISRUPTIVE FINALE (The "Flash Bang")

            // A. "AGENCIA" appears with glitch/shake effect
            tl.set(textRef.current, {
                text: "AGENCIA",
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)'
            })
                .to(textRef.current, {
                    duration: 0.05,
                    x: -5, // Shake
                    y: 5,
                    color: '#00ffff' // Cyan glitch
                })
                .to(textRef.current, {
                    duration: 0.05,
                    x: 5,
                    y: -5,
                    color: '#ff00ff' // Magenta glitch
                })
                .to(textRef.current, {
                    duration: 0.05,
                    x: 0,
                    y: 0,
                    color: '#fff',
                    scale: 1.5 // Start growing
                })

                // B. Aggressive Expansion into the camera (Singularity)
                .to(textRef.current, {
                    scale: 50, // Massive scale - fly through the text
                    opacity: 0,
                    duration: 0.4,
                    ease: "expo.in",
                    filter: 'blur(20px)'
                })

                // C. SCREEN FLASH (White Out)
                .to(containerRef.current, {
                    backgroundColor: '#ffffff',
                    duration: 0.05,
                    ease: "power4.out"
                }, "-=0.1") // Overlap with text explosion

                // D. Fade back to Black & Logo Reveal
                .to(containerRef.current, {
                    backgroundColor: '#000000',
                    duration: 0.5,
                    ease: "power2.in"
                })
                .fromTo(logoRef.current,
                    { scale: 2, opacity: 0, filter: 'blur(20px)' },
                    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: "expo.out" },
                    "-=0.4"
                )

                // 4. Exit Animation (Curtain Up)
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power4.inOut",
                    delay: 0.5
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
