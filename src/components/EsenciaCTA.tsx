import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const EsenciaCTA: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLHeadingElement>(null);
    const line2Ref = useRef<HTMLHeadingElement>(null);
    const line3Ref = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const buttonContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Magnetic Button Refs
    const xTo = useRef<gsap.QuickToFunc | null>(null);
    const yTo = useRef<gsap.QuickToFunc | null>(null);
    const textXTo = useRef<gsap.QuickToFunc | null>(null);
    const textYTo = useRef<gsap.QuickToFunc | null>(null);

    const scrambleText = (
        element: HTMLElement | null,
        finalText: string,
        progress: number
    ) => {
        if (!element) return;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const totalLen = finalText.length;

        if (progress >= 1) {
            element.innerText = finalText;
            return;
        }

        const scrambled = finalText.split('').map((char, index) => {
            if (char === ' ') return ' ';
            if (index < progress * totalLen) {
                return char;
            }
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        element.innerText = scrambled;
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current) return;

            // Pin the section for a forced viewing experience
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=150%", // Pin for 1.5 screen heights
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                }
            });

            // Phase 1: Background darkens massively to isolate the text
            tl.to(".cta-backdrop", { opacity: 0.95, duration: 0.2 }, 0);

            // Phase 2: Vertical convergence and Decrypt
            const lines = [
                { ref: line1Ref.current, text: "NO SOMOS" },
                { ref: line2Ref.current, text: "CÓDIGO" },
                { ref: line3Ref.current, text: "SOMOS ESENCIA" }
            ];

            // Initial setup for the lines
            gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
                y: 100,
                opacity: 0,
                filter: 'blur(10px)'
            });

            lines.forEach((line, i) => {
                // Intro motion: Fly up and focus
                tl.to(line.ref,
                    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5 },
                    i * 0.2 // Stagger
                );

                // Scramble effect driven by scroll
                let progressObj = { val: 0 };
                tl.to(progressObj, {
                    val: 1,
                    duration: 0.5,
                    ease: "none",
                    onUpdate: () => {
                        scrambleText(line.ref, line.text, progressObj.val);
                    }
                }, i * 0.2); // Sync with appearance
            });

            // Phase 3: Button Reveal (Explosive)
            tl.fromTo(buttonContainerRef.current,
                { scale: 0, opacity: 0, rotation: -45 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
                ">"
            );

            // Phase 4: EXIT FADE (Prevent overlap with Next Section)
            tl.to([containerRef.current, buttonContainerRef.current], {
                autoAlpha: 0,
                filter: 'blur(20px)',
                duration: 0.5
            }, "+=0.5");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Magnetic Start
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (buttonRef.current) {
                xTo.current = gsap.quickTo(buttonRef.current, "x", { duration: 0.3, ease: "power3.out" });
                yTo.current = gsap.quickTo(buttonRef.current, "y", { duration: 0.3, ease: "power3.out" });
            }
            // Parallax text
            const textSpan = buttonRef.current?.querySelector('.btn-text');
            if (textSpan) {
                textXTo.current = gsap.quickTo(textSpan, "x", { duration: 0.2, ease: "power3.out" }); // Faster/Slower
                textYTo.current = gsap.quickTo(textSpan, "y", { duration: 0.2, ease: "power3.out" });
            }
        }, buttonContainerRef);
        return () => ctx.revert();
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonContainerRef.current || !xTo.current || !yTo.current) return;
        const rect = buttonContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        xTo.current(x * 0.3); // Magnetic Pull Factor
        yTo.current(y * 0.3);

        if (textXTo.current && textYTo.current) {
            textXTo.current(x * 0.1);
            textYTo.current(y * 0.1);
        }
    };

    const handleMouseLeave = () => {
        if (xTo.current && yTo.current) {
            xTo.current(0);
            yTo.current(0);
        }
        if (textXTo.current && textYTo.current) {
            textXTo.current(0);
            textYTo.current(0);
        }
    };


    return (
        <section
            ref={sectionRef}
            className="w-full h-screen flex flex-col items-center justify-center relative z-50 overflow-hidden bg-transparent"
        >
            {/* Deep Dark Singularity Backdrop - High z-index to cover particles */}
            <div className="cta-backdrop absolute inset-0 bg-black opacity-0 transition-opacity pointer-events-none" style={{ zIndex: -1 }} />

            {/* Radial Gradient overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] pointer-events-none" style={{ zIndex: -1 }} />

            <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center space-y-2 md:space-y-6 select-none bg-transparent">
                <h2
                    ref={line1Ref}
                    className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-center leading-none"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#ffffff', // Explicit white
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}
                >
                    X0_S0M0S
                </h2>

                <h2
                    ref={line2Ref}
                    className="text-6xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-center leading-none"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        background: 'linear-gradient(90deg, #00ffff, #ffffff, #9d00ff)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent', // Gradient text
                        filter: 'drop-shadow(0 0 40px rgba(0,255,255,0.4))'
                    }}
                >
                    C0D1G0
                </h2>

                <h2
                    ref={line3Ref}
                    className="text-4xl md:text-7xl lg:text-[14rem] font-black tracking-[0.1em] text-center mt-4 md:mt-12"
                    style={{
                        fontFamily: 'var(--font-heading)',
                        color: '#ffffff',
                        textShadow: '0 0 50px rgba(255, 255, 255, 0.4), 0 0 100px rgba(0, 255, 255, 0.2)',
                        lineHeight: '0.8'
                    }}
                >
                    SOMOS ESENCIA
                </h2>
            </div>

            {/* Button Container for Magnetic Boundary */}
            <div
                ref={buttonContainerRef}
                className="mt-24 relative z-20 w-64 h-32 flex items-center justify-center"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    ref={buttonRef}
                    onClick={() => navigate('/esencia')}
                    className="group relative flex items-center justify-center px-16 py-6 overflow-visible rounded-full cursor-pointer transition-transform ease-out"
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 0 30px rgba(0,255,255,0.2), inset 0 0 20px rgba(0,255,255,0.1)'
                    }}
                >
                    {/* Rotating Border Gradient (Pseudo) */}
                    <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-50 blur-[4px] group-hover:opacity-100 group-hover:blur-[8px] transition-all duration-500 animate-spin-slow pointer-events-none" />

                    {/* Hover Glow Interior */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                    {/* Text Parallax */}
                    <span className="btn-text relative z-10 text-xl md:text-2xl font-bold tracking-[0.3em] text-white group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                        DESCUBRIR
                    </span>

                    {/* Heartbeat Idle Animation (Only when NOT hovered - handled via CSS or complex GSAP, using simple CSS animation here) */}
                    <div className="absolute inset-0 rounded-full border border-cyan-400 opacity-20 animate-ping group-hover:animate-none pointer-events-none" />
                </button>
            </div>
        </section>
    );
};

export default EsenciaCTA;
