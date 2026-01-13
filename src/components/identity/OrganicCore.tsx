import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bonsaiHero from '../../assets/images/digital_bonsai_hero.png';
import bonsaiSeed from '../../assets/images/digital_bonsai_seed.png';

gsap.registerPlugin(ScrollTrigger);

const OrganicCore: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const seedRef = useRef<HTMLImageElement>(null);
    const treeRef = useRef<HTMLImageElement>(null);
    const rootsRef = useRef<SVGSVGElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=500%', // Increased scroll distance for distinct stages
                    scrub: 1, // Tighter scrub for precision
                    pin: true,
                    anticipatePin: 1
                }
            });

            // ------------------------------
            // INITIAL STATES (STRICT HIDDEN)
            // ------------------------------
            // Tree is completely hidden and small/low
            gsap.set(treeRef.current, { autoAlpha: 0, scale: 0.1, y: 300, filter: 'blur(20px)', transformOrigin: 'center bottom' });
            // Seed is visible and centered
            gsap.set(seedRef.current, { autoAlpha: 1, scale: 1, y: 0 });
            // Roots are hidden
            const roots = rootsRef.current?.querySelectorAll('path');
            if (roots) {
                gsap.set(roots, { strokeDasharray: 2000, strokeDashoffset: 2000, autoAlpha: 0 });
            }

            // ------------------------------
            // THE NARRATIVE TIMELINE
            // ------------------------------

            // STAGE 1: THE PLANTING (Scroll 0% -> 20%)
            // The seed moves DOWN physically to find "ground"
            tl.to(seedRef.current, {
                y: 250, // Moves down significantly
                scale: 0.8,
                rotation: 180,
                duration: 2,
                ease: 'power2.inOut'
            }, "stage1");

            // STAGE 2: ROOTING (Scroll 20% -> 40%)
            // Once low, the roots explode outwards
            if (roots) {
                tl.to(roots, {
                    autoAlpha: 1,
                    duration: 0.1 // Instant visibility for stroke anim
                }, "stage2");

                tl.to(roots, {
                    strokeDashoffset: 0, // Draw the lines
                    duration: 3,
                    stagger: 0.1,
                    ease: 'power4.out'
                }, "stage2");
            }

            // Seed cracks/fades as energy transfers to roots
            tl.to(seedRef.current, {
                scale: 0,
                autoAlpha: 0,
                duration: 1,
                ease: 'back.in(2)'
            }, "stage2+=1"); // Happens mid-root growth

            // STAGE 3: GROWTH (Scroll 40% -> 80%)
            // The Tree shoots UP from the same position the seed landed (y: 250)
            tl.to(treeRef.current, {
                autoAlpha: 1,
                y: 0, // Rises to center
                scale: 1, // Full size
                filter: 'blur(0px)',
                duration: 5,
                ease: 'power3.out'
            }, "stage3");

            // STAGE 4: GLOW/LIFE (Scroll 80% -> 100%)
            tl.to(treeRef.current, {
                filter: 'brightness(1.2) drop-shadow(0 0 30px cyan)',
                scale: 1.05,
                duration: 2,
                yoyo: true,
                repeat: 1
            }, "stage4");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="organic-core-section"
            style={{
                height: '100vh',
                width: '100vw',
                background: '#020202',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
                padding: 0
            }}
        >
            {/* BACKGROUND GRADIENT */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at center, #111 0%, #000 70%)',
                zIndex: 0
            }} />

            {/* CONTAINER FOR ALIGNMENT */}
            <div ref={contentRef} style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
            }}>

                {/* SVG ROOTS - Anchored Lower */}
                <svg
                    ref={rootsRef}
                    style={{
                        position: 'absolute',
                        top: '50%', // Centers the SVG container
                        left: '50%',
                        transform: 'translate(-50%, 10%)', // Shift down so roots start where seed lands
                        width: '1000px',
                        height: '800px',
                        zIndex: 10, // Roots on top of background
                        pointerEvents: 'none',
                        overflow: 'visible'
                    }}
                    viewBox="0 0 1000 800"
                    fill="none"
                >
                    <defs>
                        <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Organic Root Paths - Starting from Top Center of SVG (500, 0) going DOWN */}
                    <path d="M500,0 Q500,100 400,200 T200,400" stroke="#00ffff" strokeWidth="2" fill="none" filter="url(#cyanGlow)" />
                    <path d="M500,0 Q500,150 600,250 T800,500" stroke="#00ffff" strokeWidth="2" fill="none" filter="url(#cyanGlow)" />
                    <path d="M500,0 Q450,150 350,300" stroke="#00ffff" strokeWidth="1" fill="none" filter="url(#cyanGlow)" opacity="0.7" />
                    <path d="M500,0 Q550,150 650,300" stroke="#00ffff" strokeWidth="1" fill="none" filter="url(#cyanGlow)" opacity="0.7" />
                    <path d="M500,0 Q500,200 500,600" stroke="#00ffff" strokeWidth="3" fill="none" filter="url(#cyanGlow)" strokeOpacity="0.5" />

                    {/* Horizontal networks */}
                    <path d="M400,200 Q300,250 100,250" stroke="#00ffff" strokeWidth="1" fill="none" filter="url(#cyanGlow)" />
                    <path d="M600,250 Q700,300 900,300" stroke="#00ffff" strokeWidth="1" fill="none" filter="url(#cyanGlow)" />
                </svg>

                {/* THE SEED - Z-Index 20 (Top) */}
                <img
                    ref={seedRef}
                    src={bonsaiSeed}
                    alt="Seed"
                    style={{
                        position: 'absolute',
                        width: '200px',
                        zIndex: 20,
                        filter: 'drop-shadow(0 0 20px cyan)'
                    }}
                />

                {/* THE TREE - Z-Index 15 (Behind Seed, but grows over it) */}
                <img
                    ref={treeRef}
                    src={bonsaiHero}
                    alt="Bonsai"
                    style={{
                        position: 'absolute',
                        width: '700px', // Large Hero
                        zIndex: 15,
                        // Initial position handled by GSAP
                    }}
                />

            </div>
        </section>
    );
};

export default OrganicCore;
