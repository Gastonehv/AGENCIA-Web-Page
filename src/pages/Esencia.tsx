import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// --- LOCAL VIDEO ASSET ---
// Importing with spaces can be tricky, assuming Vite handles it or I renamed it.
// Let's assume I will rename it to 'esencia_hero.mp4' in the next step for safety.
import essenceHeroVideo from '../assets/videos/esencia_hero.mp4';
const videoSrc = essenceHeroVideo;
import type { CanvasSequenceHandle } from '../components/CanvasSequence';
// MaskedText Import Removed
import ShowcaseSlider from '../components/ShowcaseSlider';
import SEO from '../components/SEO';
import SoulManifesto from '../components/SoulManifesto';


// Explicit Import to ensure bundling
import ceoImg from '../assets/team/ceo.jpg';
import footerLogo from '../assets/logo_agencia_full.png';

// --- LOGO PATHS (From Home.tsx) ---
// --- LOGO PATHS (From Home.tsx) - REMOVED (Unused)
// const logoPaths = [ ... ];

// Explicit Import to ensure bundling
const Esencia: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sequenceRef = useRef<CanvasSequenceHandle>(null); // Ref to control the player

    const team = [
        { id: 1, role: 'CEO / VISIONARY', name: 'Arquitecto de Realidades', img: ceoImg },
        { id: 2, role: 'CTO / AI LEAD', name: 'Oráculo de Datos', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' },
        { id: 3, role: 'LEAD DEVELOPER', name: 'Tejedor de Código', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop' },
        { id: 4, role: 'UX/UI DIRECTOR', name: 'Escultor de Interfaces', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop' },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Force Initial Draw with a small delay to ensure Canvas is mounted and sized
            setTimeout(() => {
                if (sequenceRef.current) sequenceRef.current.drawFrame(0);
                ScrollTrigger.refresh(); // Force GSAP to recalculate layout
            }, 100);

            // --- MOBILE LAYOUT OPTIMIZER (GSAP MatchMedia) ---
            const mm = gsap.matchMedia();

            mm.add("(max-width: 768px)", () => {
                // 1. Identidad Section: Stack Vertical
                gsap.set("#identidad-section", {
                    gridTemplateColumns: "1fr",
                    height: "auto",
                    paddingTop: "10rem"
                });
                gsap.set("#identidad-section > div:first-child", {
                    paddingRight: 0,
                    marginBottom: "2rem",
                    textAlign: "center"
                });
                gsap.set(".identidad-marker", { marginTop: 0 }); // Reset margins
                gsap.set("#identidad-section > div:last-child", {
                    paddingLeft: 0,
                    gap: "1.5rem"
                });

                // 2. Team List: Compact Rifts
                gsap.set(".rift-left", { paddingRight: "1rem" });
                gsap.set(".rift-right", { paddingLeft: "1rem" });
                gsap.set(".rift-left h3", { fontSize: "1.5rem" });
            });

            // --- 0. LOGO COLOR MANAGER ---
            // (Handled by CSS Static Style: Black + White Glow)

            // --- 1. HERO ANIMATION ---
            const tlHero = gsap.timeline({
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: '+=800%',
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                }
            });

            // Phase 1: "ESENC" flies up/away
            tlHero.to('.hero-char-main', {
                y: -150, opacity: 0, stagger: 0.1, ease: 'power3.in', duration: 2
            }, 0);

            // Phase 2: "IA" Mutation
            tlHero.to('.hero-char-ia', {
                color: '#0044FF', // ELECTRIC BLUE
                textShadow: '0 0 60px rgba(0,68,255,0.9)', // Blue Glow
                scale: 1.2, duration: 1, ease: 'sine.out'
            }, 2);

            // --- TEAM RIFT INTERACTION MANAGER ---
            const rifts = gsap.utils.toArray<HTMLElement>('.rift-row');

            // Animation Helpers
            const openRift = (target: HTMLElement) => {
                const q = gsap.utils.selector(target);
                gsap.to(q('.rift-left'), { x: '-20%', duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
                gsap.to(q('.rift-right'), { x: '20%', duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
                gsap.to(q('.rift-img'), { scale: 1, opacity: 1, filter: 'grayscale(0%)', duration: 0.6, overwrite: 'auto' });
                gsap.to(q('.rift-id'), { opacity: 0, duration: 0.3, overwrite: 'auto' });
            };

            const closeRift = (target: HTMLElement) => {
                const q = gsap.utils.selector(target);
                gsap.to(q('.rift-left'), { x: '0%', duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
                gsap.to(q('.rift-right'), { x: '0%', duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
                gsap.to(q('.rift-img'), { scale: 0.9, opacity: 0.3, filter: 'grayscale(100%)', duration: 0.6, overwrite: 'auto' });
                gsap.to(q('.rift-id'), { opacity: 1, duration: 0.3, overwrite: 'auto' });
            };

            // DESKTOP ICONFIG
            mm.add("(min-width: 769px)", () => {
                // Initial State: Start Medium
                gsap.set('.liquid-container', {
                    scale: 0.5,
                    borderRadius: '4rem',
                    boxShadow: '0 60px 150px rgba(0,0,0,0.9)',
                    transformOrigin: 'center center'
                });

                rifts.forEach(rift => {
                    rift.addEventListener('mouseenter', () => openRift(rift));
                    rift.addEventListener('mouseleave', () => closeRift(rift));
                });
                return () => {
                    // Cleanup
                };
            });

            // MOBILE CONFIG
            mm.add("(max-width: 768px)", () => {
                // Initial State: Start VERY Small for dramatic growth
                gsap.set('.liquid-container', {
                    scale: 0.35, // Requested "smaller"
                    borderRadius: '2rem',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
                    transformOrigin: 'center center'
                });

                // 1. Identidad Section: Stack Vertical
                gsap.set("#identidad-section", {
                    gridTemplateColumns: "1fr",
                    height: "auto",
                    paddingTop: "10rem"
                });
                gsap.set("#identidad-section > div:first-child", {
                    paddingRight: 0,
                    marginBottom: "2rem",
                    textAlign: "center"
                });
                gsap.set(".identidad-marker", { marginTop: 0 });
                gsap.set("#identidad-section > div:last-child", {
                    paddingLeft: 0,
                    gap: "1.5rem"
                });

                // 2. Team List: Compact Rifts
                gsap.set(".rift-left", { paddingRight: "1rem" });
                gsap.set(".rift-right", { paddingLeft: "1rem" });
                gsap.set(".rift-left h3", { fontSize: "1.5rem" });

                // 3. Team Scroll Interaction (Auto-Play) + TAP Fallback
                rifts.forEach(rift => {
                    // A. AUTO-SCROLL TRIGGER
                    ScrollTrigger.create({
                        trigger: rift,
                        start: "top 70%", // Optimized Zone
                        end: "bottom 30%",
                        onEnter: () => openRift(rift),
                        onLeave: () => closeRift(rift),
                        onEnterBack: () => openRift(rift),
                        onLeaveBack: () => closeRift(rift)
                    });

                    // B. TAP TO TOGGLE (Interaction Fallback)
                    const toggleRift = () => {
                        const idOpacity = gsap.getProperty(rift.querySelector('.rift-id'), "opacity");
                        if (idOpacity && Number(idOpacity) > 0.5) {
                            openRift(rift);
                        } else {
                            closeRift(rift);
                        }
                    };
                    rift.addEventListener('click', toggleRift);
                });
            });

            // Phase 3: VIDEO SCALING (Floating -> Immersive)
            tlHero.to('.liquid-container', {
                scale: 1,
                borderRadius: '0rem', // Flattens for full screen
                boxShadow: '0 0 0 rgba(0,0,0,0)', // Shadow disappears
                duration: 3,
                ease: 'power2.inOut'
            }, 1); // Start parallel with mutation

            // FADE OUT SEQUENCE (Synced)
            // Fade out Container contents/overlay but keep background WHITE for next section
            tlHero.to('.liquid-container', { opacity: 0, duration: 2, ease: 'power2.inOut' }, 4);
            tlHero.to(containerRef.current, { backgroundColor: '#FFFFFF', duration: 2, ease: 'power2.inOut' }, 4); // Background becomes White

            // Phase 4: IA Explosion (Last)
            tlHero.to('.hero-char-ia', {
                scale: 60, opacity: 0, duration: 2, ease: 'power4.in'
            }, 5);


            // --- LOGO MANAGEMENT FOR LATER SECTIONS (Soul) ---
            // (Handled natively by mix-blend-mode)

            // --- 2. IDENTIDAD REVEAL (STRICT NARRATIVE BLOCKS) ---
            // Use scoped string selectors for reliability in Step Context
            const tlIdentidad = gsap.timeline({
                scrollTrigger: {
                    trigger: '#identidad-section',
                    start: 'top top',
                    end: '+=900%', // 9 SCREENS: Deep Narrative
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Phase 0: CONTEXT
            tlIdentidad.fromTo(['.identidad-marker', '.identidad-chapter-label'],
                { opacity: 0, x: -50, filter: 'blur(10px)' }, // Start further back with blur
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' } // Slow, cinematic reveal
            );

            // Phase 1: FIRST BLOCK (Headline 1)
            tlIdentidad.fromTo('.identidad-headline-1',
                {
                    y: 200, opacity: 0, rotationX: -90, filter: 'blur(20px)', transformOrigin: '50% 100%'
                },
                {
                    y: 0, opacity: 1, rotationX: 0, filter: 'blur(0px)', duration: 2, ease: 'none'
                },
                ">"
            );

            // Phase 2: SECOND BLOCK (Headline 2)
            tlIdentidad.fromTo('.identidad-headline-2',
                {
                    y: 200, opacity: 0, rotationX: -90, filter: 'blur(20px)', transformOrigin: '50% 100%'
                },
                {
                    y: 0, opacity: 1, rotationX: 0, filter: 'blur(0px)', duration: 2, ease: 'none'
                },
                ">"
            );

            // Phase 3: THIRD BLOCK (Body)
            tlIdentidad.fromTo('.identidad-body-text',
                {
                    x: 100, opacity: 0, filter: 'blur(10px)'
                },
                {
                    x: 0, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out'
                },
                ">"
            );

            // Phase 4: PAUSE
            tlIdentidad.to({}, { duration: 3 });

            // Phase 5: THE MATERIALIZATION EXIT
            tlIdentidad.to(['.identidad-marker', '.identidad-chapter-label', '.identidad-headline-1', '.identidad-headline-2', '.identidad-body-text'], {
                scale: 0.9,
                filter: 'blur(20px)',
                opacity: 0,
                duration: 2,
                ease: 'power2.in'
            });


            /* TEXT REVEAL SECTION REMOVED */


            // --- 3. SHOWCASE SLIDER (Internal Logic) ---
            // No global timeline needed here, the component handles its own pinning.

            // --- 4. THE 5 PILLARS (REMOVED) ---
            // User requested to delete everything related to pillars.

            // --- SOUL NARRATIVE (GENESIS PROTOCOL) ---
            const soulSection = document.querySelector('.soul-narrative');
            // We select groups of text to reveal in phases
            /* TEMPORARILY DISABLED
            const phase1 = document.querySelectorAll('.soul-phase-1-final');
            const phase2 = document.querySelectorAll('.soul-phase-2-final');
            const phase3 = document.querySelectorAll('.soul-phase-3-final');
            const phase4 = document.querySelectorAll('.soul-phase-4-final');
            */

            if (soulSection) {
                /* TEMPORARILY DISABLED
                const tlSoul = gsap.timeline({
                    scrollTrigger: {
                        trigger: soulSection,
                        start: 'top top',
                        end: '+=800%', // Increased for longer reading time (200vh per phase roughly)
                        pin: true,
                        scrub: 1, // Smoother scrub
                        anticipatePin: 1
                    }
                });
    
                // PHASE 1: THE VOID (Enter)
                tlSoul.fromTo(phase1,
                    { autoAlpha: 0, scale: 0.9, filter: 'blur(10px)' },
                    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
                )
                    .to({}, { duration: 1 }) // HOLD for reading
                    .to(phase1, { autoAlpha: 0, y: -50, filter: 'blur(10px)', duration: 1, ease: 'power2.in' });
    
                // PHASE 2: THE SPARK (Enter)
                tlSoul.fromTo(phase2,
                    { autoAlpha: 0, y: 50, filter: 'blur(5px)' },
                    { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
                    "-=0.5" // Overlap slightly with exit of P1
                )
                    .to({}, { duration: 1 }) // HOLD
                    .to(phase2, { autoAlpha: 0, scale: 1.1, filter: 'blur(10px)', duration: 1, ease: 'power2.in' });
    
                // PHASE 3: THE SYMBIOSIS (Enter)
                tlSoul.fromTo(phase3,
                    { autoAlpha: 0, scale: 1.1, filter: 'blur(5px)' },
                    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
                    "-=0.5"
                )
                    .to({}, { duration: 1 }) // HOLD
                    .to(phase3, { autoAlpha: 0, y: -50, filter: 'blur(10px)', duration: 1, ease: 'power2.in' });
    
                // PHASE 4: THE RESULT (Final Statement)
                tlSoul.fromTo(phase4,
                    { autoAlpha: 0, scale: 0.5, filter: 'blur(20px)' },
                    { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'elastic.out(1, 0.7)' },
                    "-=0.5"
                );
                */
            }

            // --- 5. TEAM REVEAL REMOVED (Forced Visibility) ---
            // Animation removed to prevent 'opacity: 0' lock.

        }, containerRef);

        return () => {
            ctx.revert();
        };
    }, []);

    // const [globalHovered, setGlobalHovered] = useState(false); // REMOVED UNUSED
    const [canRenderSlider, setCanRenderSlider] = useState(false);

    // DELAYED RENDER EFFECT
    useEffect(() => {
        // Wait for Hero/Text layout to stabilize
        const timer = setTimeout(() => {
            setCanRenderSlider(true);
            setTimeout(() => ScrollTrigger.refresh(), 100); // Trigger refresh after mount
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // WJY STYLE COMPONENT (Instance Usage below, definition moved up)

    return (
        <div ref={containerRef} style={{
            backgroundColor: '#FFFFFF', // Reverted to WHITE to fix visibility
            color: '#000000',
            minHeight: '100vh',
            position: 'relative',
            fontFamily: 'var(--font-heading)',
            overflowX: 'hidden',
        }}>
            <SEO
                title="Esencia"
                description="La Esencia de AgencIA: Donde la inteligencia artificial se encuentra con la intuición humana."
            />

            {/* --- 0. BACKGROUND VIDEO (LATA AGENCIA) --- */}
            <div className="liquid-container" style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#FFFFFF',
                overflow: 'hidden' // VITAL: Clips the video to the borderRadius
            }}>
                <video
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 1, // Raw Video (Original)
                        // No filters, no ghost mode.
                    }}
                />
            </div>



            {/* 1. HERO SECTION */}
            <section className="hero-section" style={{
                height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%',
                zIndex: 10

            }}>
                <div style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 15vw, 18rem)', lineHeight: 0.85, fontWeight: 900,
                        letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase',
                        color: '#000000', // STRICT BLACK as requested
                        textShadow: '0 0 50px rgba(255,255,255,0.9), 0 0 100px rgba(255,255,255,0.5)', // White Glow/Backlight needed for visibility on Black Video
                        mixBlendMode: 'normal'
                    }}>
                        <span className="hero-char-main" style={{ display: 'inline-block' }}>E</span>
                        <span className="hero-char-main" style={{ display: 'inline-block' }}>S</span>
                        <span className="hero-char-main" style={{ display: 'inline-block' }}>E</span>
                        <span className="hero-char-main" style={{ display: 'inline-block' }}>N</span>
                        <span className="hero-char-main" style={{ display: 'inline-block' }}>C</span>
                        <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', zIndex: 10 }}>I</span>
                        <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', zIndex: 10 }}>A</span>
                    </h1>
                </div>
            </section>


            {/* 2. SPACER REMOVED (Relies on GSAP Pinning) */}


            {/* 3. IDENTIDAD MAESTRA (Concept / Thesis) - DESIGN MASTERPIECE */}
            <section id="identidad-section" style={{
                minHeight: '80vh', // More breathing room
                padding: '5rem 5%',
                backgroundColor: '#FFFFFF',
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr', // Swiss Grid Ratio
                alignItems: 'center',
                position: 'relative',
                zIndex: 30,

                overflow: 'hidden',
                perspective: '1000px', // CRITICAL: Enables 3D space for children
                transformStyle: 'preserve-3d'
            }}>
                {/* LEFT COL: TECHNICAL SPECS */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    paddingRight: '3rem'
                }}>
                    <div className="identidad-marker" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#666', marginTop: '150px' }}>
                        /// SYSTEM_IDENTITY
                    </div>
                </div>

                {/* RIGHT COL: THE MANIFESTO */}
                <div style={{ paddingLeft: '5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* The Hook */}
                    <div className="identidad-chapter-label">
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1rem',
                            padding: '0.2rem 0.6rem',
                            border: '1px solid #000',
                            borderRadius: '20px',
                            display: 'inline-block',
                            marginBottom: '1rem'
                        }}>
                            CAPÍTULO 001 — ORIGEN
                        </span>
                    </div>

                    {/* The Headline */}
                    <h2 className="identidad-headline-1" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em',
                        color: '#000',
                        margin: 0
                    }}>
                        NO SOMOS UNA<br />
                        <span style={{ color: '#0044FF' }}>AGENCIA CON IA.</span>
                    </h2>

                    <h2 className="identidad-headline-2" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                        fontWeight: 900,
                        lineHeight: 0.9,
                        letterSpacing: '-0.02em',
                        color: '#000',
                        margin: 0,
                        opacity: 0.3 // Stylistic choice
                    }}>
                        SOMOS LA IA<br />
                        COMO AGENCIA.
                    </h2>

                    {/* The Body */}
                    <p className="identidad-body-text" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.25rem',
                        lineHeight: 1.5,
                        maxWidth: '600px',
                        marginTop: '1rem',
                        borderLeft: '4px solid #0044FF',
                        paddingLeft: '1.5rem',
                        color: '#333'
                    }}>
                        Trascendemos la estética convencional. <br />
                        Orquestamos sistemas de inteligencia visual que no solo comunican, sino que dominan el entorno digital.
                        <br /><br />
                        <strong style={{ color: '#000' }}>Simbiosis absoluta entre intuición humana y precisión algorítmica.</strong>
                    </p>
                </div>
            </section>

            {/* 4. SPACER REMOVED */}


            {/* 4. SPACER REMOVED */}


            {/* 5. SHOWCASE SLIDER (Capabilities / Proof) */}
            {/* 6. SHOWCASE SLIDER (Digital Architecture - IDENTITY) */}
            <section className="identity-section" style={{
                position: 'relative',
                zIndex: 50,
                marginTop: '-50vh', // SMOOTH OVERLAP: Slider rises over fading text
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
            }}>
                {canRenderSlider && <ShowcaseSlider />}
            </section>

            {/* SOUL MANIFESTO (Philosophy) */}
            <section className="soul-narrative-section" style={{ position: 'relative', zIndex: 30, backgroundColor: '#000', color: '#FFF' }}>

                {/* Chapter Marker */}
                <div style={{
                    position: 'absolute', top: '15vh', left: '5%',
                    fontFamily: 'var(--font-mono)', color: '#FFF', opacity: 0.5,
                    zIndex: 40, pointerEvents: 'none',
                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_002_INIT</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>GÉNESIS</span>
                </div>

                <SoulManifesto />
            </section>

            {/* 9. TEAM LIST (The Core) */}
            <section className="team-list" style={{
                minHeight: '100vh', padding: '10vh 0', backgroundColor: '#FFFFFF', color: '#000', display: 'flex', flexDirection: 'column',
                position: 'relative',

            }}>
                <div style={{
                    position: 'absolute', top: '2rem', left: '5%',
                    fontFamily: 'var(--font-mono)', color: '#000', opacity: 0.5,
                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_003_CORE</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>NÚCLEO</span>
                </div>
                <h2 style={{
                    fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '6rem', fontWeight: 900, textAlign: 'center', letterSpacing: '-0.05em', color: '#000'
                }}>EL NÚCLEO</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {team.map((member) => (
                        <div key={member.id} className="rift-row" style={{
                            position: 'relative', width: '100%', height: '30vh', minHeight: '300px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', cursor: 'pointer',
                            borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)'
                        }}>
                            {/* CENTRAL IMAGE (FIT / COMPLETE) */}
                            <div className="rift-img" style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                backgroundImage: `url(${member.img})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                opacity: 0.3, transform: 'scale(0.9)',
                                filter: 'grayscale(100%)', zIndex: 0,
                                transition: 'none' // Handled by GSAP
                            }} />

                            {/* ID MARKER */}
                            <span className="rift-id" style={{
                                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                                fontSize: '10rem', fontWeight: 900, opacity: 0.05, zIndex: 1, pointerEvents: 'none', color: '#000'
                            }}>0{member.id}</span>

                            {/* LEFT PANEL (ROLE) */}
                            <div className="rift-left" style={{
                                flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                paddingRight: '4rem', zIndex: 2,
                                background: 'linear-gradient(90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', // Less aggressive solid mask
                                transform: 'translateX(0)', willChange: 'transform'
                            }}>
                                <h3 style={{ fontSize: 'clamp(2rem, 3.5vw, 4rem)', fontWeight: 700, textAlign: 'right', margin: 0, color: '#000' }}>
                                    {member.role}
                                </h3>
                            </div>

                            {/* RIGHT PANEL (FUNCTION) */}
                            <div className="rift-right" style={{
                                flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                                paddingLeft: '4rem', zIndex: 2,
                                background: 'linear-gradient(-90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)',
                                transform: 'translateX(0)', willChange: 'transform'
                            }}>
                                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#000', maxWidth: '300px' }}>
                                    {member.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 10. CLOSING (Logo) */}
            <section style={{
                height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', color: '#000',
                position: 'relative',

            }}>
                {/* Chapter Marker */}
                <div style={{
                    position: 'absolute', top: '2rem', left: '5%',
                    fontFamily: 'var(--font-mono)', color: '#000', opacity: 0.5,
                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_004_EXIT</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>CONTACTO</span>
                </div>

                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textAlign: 'center', fontWeight: 900, marginBottom: '2rem' }}>
                    SOMOS
                </h2>

                {/* LOGO IMAGE FROM USER */}
                <div style={{ width: '50%', maxWidth: '600px', opacity: 1 }}>
                    <img src={footerLogo} alt="AgencIA Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            </section>
        </div >
    );
};

export default Esencia;

