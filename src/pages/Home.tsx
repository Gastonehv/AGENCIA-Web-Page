import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loader from '../components/Loader';
import { useScroll } from '../context/ScrollContext';
import EssenceBackground from '../components/EssenceBackground';
import SoulManifesto from '../components/SoulManifesto';
import ShowcaseSlider from '../components/ShowcaseSlider';
import Symbiosis from '../components/Symbiosis';
import Footer from '../components/Footer';
import AlmaSection from '../components/AlmaSection';
import GlitchPortal from '../components/GlitchPortal';
import type { GlitchPortalHandle } from '../components/GlitchPortal';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import ChapterHUD from '../components/ChapterHUD';
// --- ASSETS (From Esencia) ---
import essenceHeroVideo from '../assets/videos/esencia_hero_ultra.mp4';
const videoSrc = essenceHeroVideo;
import officialTypography from '../assets/logos/agencia_typography_official.png';
import ceoImg from '../assets/team/ceo.jpg';
import gaelImg from '../assets/team/gael_oracle.png';
import footerLogo from '../assets/logo_agencia_full.png';


gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
    // SKIP LOADER IF RETURNING (Hash detected)
    const { hash } = useLocation();
    const [loading, setLoading] = useState(!hash); // If hash exists, loading = false
    const { lenis } = useScroll();
    const maskRef = useRef<SVGGElement>(null); // Target the Mask Group
    const containerRef = useRef<HTMLDivElement>(null);
    const pulseButtonRef = useRef<HTMLButtonElement>(null);
    const ctaSectionRef = useRef<HTMLElement>(null); // New Ref for Pinning safety
    const glitchRef = useRef<GlitchPortalHandle>(null);

    // CHAPTER HUD STATE
    const [activeChapter, setActiveChapter] = useState('ESENCIA');
    const [chapterNum, setChapterNum] = useState('1');
    // Scroll state for neural networks (previously Essence)

    // TEAM DATA
    const team = [
        { id: 1, role: 'CEO / VISIONARY', name: 'Arquitecto de Ecosistemas Digitales', img: ceoImg, scale: 1.35 },
        { id: 2, role: 'CTO /\nAI LEAD', name: 'Oráculo\nde Datos', img: gaelImg, scale: 1.6 },
        { id: 3, role: 'LEAD DEVELOPER', name: 'Tejedor de Código', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop', scale: 1.35 },
        { id: 4, role: 'UX/UI DIRECTOR', name: 'Escultor de Interfaces', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop', scale: 1.35 },
    ];

    // Logo PATHS (For the Portal Mask)
    const logoPaths = [
        "449.17,2442.5 90.53,2442.5 1043.39,157.04 1992.73,2442.5 1637.6,2442.5 1043.39,1025.52", // A
        "M3825.9 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,215.66 72.66,400.84 218,555.54 145.33,154.71 321.13,232.07 527.41,232.07 119.54,0 234.99,-30.47 346.33,-91.43 111.35,-60.95 203.35,-145.33 276.01,-253.15l80.88 -116.04 -397.32 -348.09 235.58 -270.75 559.06 488.74c-77.35,285.97 -216.24,515.7 -416.65,689.15 -200.42,173.46 -428.37,260.2 -683.87,260.2 -304.74,0 -564.92,-111.93 -780.58,-335.79 -215.66,-223.86 -323.48,-494.01 -323.48,-810.46 0,-314.11 107.82,-582.5 323.48,-805.18 215.66,-222.69 475.84,-334.03 780.58,-334.03 215.65,0 416.07,59.78 601.25,179.32l-242.61 274.26c-107.82,-60.95 -227.38,-91.43 -358.64,-91.43z", // G
        "6253.29,515.69 6253.29,1120.45 6995.18,1120.45 6995.18,1479.09 6253.29,1479.09 6253.29,2083.86 7297.56,2083.86 7297.56,2442.5 5894.64,2442.5 5894.64,157.04 7297.56,157.04 7297.56,515.69", // E
        "9999.2,2438.98 8687.7,1074.74 8687.7,2442.5 8329.06,2442.5 8329.06,157.04 9640.56,1531.83 9640.56,157.04 9999.2,157.04", // N
        "M12138.27 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,218 72.66,403.77 218,557.3 145.33,153.54 321.13,230.31 527.41,230.31 128.92,0 248.47,-31.65 358.64,-94.93l242.61 274.25c-180.5,119.54 -380.91,179.32 -601.25,179.32 -304.74,0 -564.92,-111.34 -780.58,-334.03 -215.66,-222.69 -323.48,-491.08 -323.48,-805.18 0,-316.44 107.82,-586.6 323.48,-810.46 215.66,-223.86 475.84,-335.79 780.58,-335.79 220.34,0 420.75,59.78 601.25,179.32l-242.61 277.77c-105.48,-63.28 -225.03,-94.93 -358.64,-94.93z", // C
        "13718.27,2442.5 13718.27,157.04 14076.92,157.04 14076.92,2442.5", // I
        "15375.63,2442.5 15016.99,2442.5 15969.85,157.04 16919.2,2442.5 16564.07,2442.5 15969.85,1025.52" // A
    ];

    const handleLoaderComplete = React.useCallback(() => {
        setLoading(false);
    }, []);

    // ANIMATION LOGIC
    useEffect(() => {
        // Enforce Scroll Lock during Loader
        if (loading) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.classList.add('loading'); // ADD CLASS
            if (lenis) lenis.stop();
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.classList.remove('loading'); // REMOVE CLASS

            // HASH NAVIGATION LOGIC
            if (hash && lenis) {
                lenis.start();
                // Forced refresh to ensure layout is correct before scrolling
                ScrollTrigger.refresh();

                // Use a single robust scroll call with onComplete
                // Delay slightly to ensure browser paint
                gsap.delayedCall(0.1, () => {
                    lenis.scrollTo(hash, {
                        offset: 0,
                        duration: 1.5,
                        force: true,
                        onComplete: () => ScrollTrigger.refresh()
                    });
                });
            } else if (lenis) {
                // Normal Load (No Hash) -> Start and Reset
                lenis.start();
                lenis.scrollTo(0, { immediate: true });
            }
        }

        if (!loading && maskRef.current) {
            // Native reset only if not targetting a hash
            if (!hash) window.scrollTo(0, 0);

            const ctx = gsap.context(() => {
                // --- 1. PORTAL OPENING ---
                const tlPortal = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".portal-wrapper",
                        start: "top top",
                        end: "+=300%",
                        pin: true,
                        scrub: true,
                        anticipatePin: 1,
                        refreshPriority: 10,
                        invalidateOnRefresh: true,
                        snap: window.innerWidth <= 768 ? undefined : {
                            snapTo: 1,
                            duration: { min: 0.2, max: 0.5 },
                            delay: 0,
                            ease: 'power1.inOut'
                        }
                    }
                });

                // Primero se abre la máscara
                tlPortal.fromTo([maskRef.current, ".portal-text-overlay"],
                    { scale: 1, transformOrigin: 'center center' },
                    { scale: 80, ease: 'power2.in', duration: 1 }
                )
                    .to(".portal-text-overlay", { opacity: 0, duration: 1, ease: 'none' }, 0)
                    .to(".portal-overlay", { autoAlpha: 0, duration: 0.1 }, "-=0.1")
                    .to(".scroll-indicator", { opacity: 0, duration: 0.1, ease: 'power2.out' }, "-=0.2");



                // --- 3. TEAM RIFT ANIMATIONS ---
                const mm = gsap.matchMedia();

                // TEAM RIFT ANIMATIONS
                const rifts = gsap.utils.toArray<HTMLElement>('.rift-row');

                // --- NEW PINNING LOGIC (FORCE PAUSE) ---
                // Applies to ALL screen sizes to ensure readability
                rifts.forEach((rift, i) => {
                    ScrollTrigger.create({
                        trigger: rift,
                        start: "center center",
                        end: "+=60%", // Holds the member in center for 60% of viewport height
                        pin: true,
                        pinSpacing: true, // Adds physical space
                        id: `rift-pin-${i}`,
                        snap: window.innerWidth <= 768 ? undefined : {
                            snapTo: 1,
                            duration: { min: 0.1, max: 0.3 },
                            ease: 'power1.inOut'
                        }
                    });
                });

                // ALMA SECTION - MAGNETIC PIN RESTORED
                ScrollTrigger.create({
                    trigger: ".alma-portal-container",
                    start: "center center",
                    end: "+=150%", // Holds screen for reading
                    pin: true,
                    pinSpacing: true,
                    snap: window.innerWidth <= 768 ? undefined : { // DISABLE aggressive snap on mobile
                        snapTo: 1,
                        duration: { min: 0.2, max: 0.8 },
                        delay: 0.1,
                        ease: 'power2.inOut'
                    }
                });

                // --- 4. CHAPTER HUD TRACKING (SC: Robust Implementation) ---
                const chapters = [
                    { id: '#hero', name: 'ESENCIA', num: '1' },
                    { id: '#identidad', name: 'IDENTIDAD', num: '2' },
                    { id: '#manifesto', name: 'EL MANIFIESTO', num: '3' },
                    { id: '#capacidades', name: 'INGENIERÍA CREATIVA', num: '4' },
                    { id: '#nucleo', name: 'EL NÚCLEO', num: '5' },
                    { id: '#simbiosis', name: 'SIMBIOSIS', num: '6' },
                    { id: '#contacto', name: 'EL SALTO', num: '7' },
                ];

                chapters.forEach(chapter => {
                    ScrollTrigger.create({
                        trigger: chapter.id,
                        start: "top 50%",
                        end: "bottom 50%",
                        onEnter: () => {
                            setActiveChapter(chapter.name);
                            setChapterNum(chapter.num);
                        },
                        onEnterBack: () => {
                            setActiveChapter(chapter.name);
                            setChapterNum(chapter.num);
                        }
                    });
                });

                const openRift = (target: HTMLElement) => {
                    const q = gsap.utils.selector(target);
                    // Standardize animation for both
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

                // GRADIENT BRIDGE LOGIC (Identity -> Manifesto)



                // DESKTOP CONFIG
                mm.add("(min-width: 769px)", () => {
                    // Initial State for Liquid Container
                    gsap.set('.liquid-container', {
                        scale: 0.5,
                        borderRadius: '4rem',
                        boxShadow: '0 60px 150px rgba(0,0,0,0.9)',
                        transformOrigin: 'center center'
                    });

                    // Team Hover
                    rifts.forEach(rift => {
                        rift.addEventListener('mouseenter', () => openRift(rift));
                        rift.addEventListener('mouseleave', () => closeRift(rift));

                        // AUTO-FOCUS ON SCROLL (Fix for "dead" state when scrolling)
                        ScrollTrigger.create({
                            trigger: rift,
                            start: "top 60%", // Focus point near center
                            end: "bottom 40%",
                            onEnter: () => openRift(rift),
                            onLeave: () => closeRift(rift),
                            onEnterBack: () => openRift(rift),
                            onLeaveBack: () => closeRift(rift)
                        });
                    });
                });


                // MOBILE CONFIG
                mm.add("(max-width: 768px)", () => {
                    // Initial State: Start VERY Small for dramatic growth
                    gsap.set('.liquid-container', {
                        scale: 0.35,
                        borderRadius: '2rem',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
                        transformOrigin: 'center center'
                    });

                    // Identidad Stack Vertical
                    gsap.set("#identidad", { gridTemplateColumns: "1fr", height: "auto", paddingTop: "10rem" });
                    gsap.set("#identidad > div:first-child", { paddingRight: 0, marginBottom: "2rem", textAlign: "center" });

                    gsap.set("#identidad > div:last-child", { paddingLeft: "1.5rem", paddingRight: "1.5rem", gap: "1.5rem" });
                    gsap.set(".rift-left", { paddingRight: "1rem" });
                    gsap.set(".rift-right", { paddingLeft: "1rem" });
                    gsap.set(".rift-left h3", { fontSize: "1.5rem" });

                    // Team Hybrid Triggers
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
                        // B. TAP TO TOGGLE
                        const toggleRift = () => {
                            const idOpacity = gsap.getProperty(rift.querySelector('.rift-id'), "opacity");
                            if (idOpacity && Number(idOpacity) > 0.5) openRift(rift);
                            else closeRift(rift);
                        };
                        rift.addEventListener('click', toggleRift);
                    });
                });

                // --- 3. ESENCIA HERO TIMELINE ---
                const tlHero = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.narrative-hero', // The section containing ESENCIA text
                        start: 'top top',
                        end: '+=300%',
                        pin: true,
                        scrub: 0.5,
                        anticipatePin: 1,
                        refreshPriority: 8
                    }
                });

                // MASTER DURATION: Forces a 10s virtual timeline for precise % calculations
                tlHero.to({}, { duration: 10 }, 0);

                // Phase 1: "ESENC" Vanishes to clear the stage
                tlHero.to('.word-esenc', {
                    opacity: 0,
                    filter: 'blur(30px)',
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 0);

                // Phase 2: "NUESTRA" Descends and Grows to match IA
                tlHero.to('.word-nuestra', {
                    y: '100%', // Moves down to line 2 (approx)
                    scale: 2.5, // GROWS to match the big font size
                    x: 0, // RESTORED DEFAULT CENTER
                    duration: 2,
                    ease: 'power2.inOut'
                }, 0.5); // Starts while ESENC is fading

                // Phase 3 (SYNCED): "IA" turns Green (Radioactive) AS Nuestra descends
                tlHero.to('.hero-char-ia', {
                    color: '#00FF99', // PALETTE: Verde Turquesa Fosforescente
                    textShadow: '0 0 30px rgba(0,255,153,1), 0 0 60px rgba(0,255,153,0.8)', // OPTIMIZED: Reduced bloom radius
                    scale: 1.1,

                    duration: 3, // Match increased duration for stability
                    ease: 'power2.out'
                }, 0.5)
                    // SYNC LIQUID LAYER TO FADE (V33: KEEP background-video-main VISIBLE)
                    .to(".liquid-container", {
                        opacity: 0,
                        duration: 3,
                        ease: 'power2.inOut'
                    }, 0.5)
                    // FADE OUT ESSENCE WRAPPER (Neural Network) 
                    // CRITICAL: Total extinction but KEEP DOM NODE for stability
                    .to(".essence-fixed-wrapper", {
                        opacity: 0,
                        autoAlpha: 0, // Better than just opacity
                        display: 'none', // Performance boost
                        duration: 0.8,
                        ease: 'power1.in'
                    }, 0.1);

                // --- THE PAUSE: NUESTRA ESENCIA on Video Card ---
                // We hold the alignment for a significant amount of scroll
                tlHero.to({}, { duration: 6 }, 2.5); // Extended from 4 to 6

                // Phase 3.5: IA Persists Green
                tlHero.to({}, { duration: 2 });

                // SIMULTANEOUSLY: Nuestra disappears BEFORE the zoom
                tlHero.to('.word-nuestra', {
                    opacity: 0,
                    filter: 'blur(20px)',
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 8.5); // Fading out later to stay during the pause

                // Phase 3: VIDEO SCALING (Floating -> Immersive)
                tlHero.to('.liquid-container', {
                    scale: 1,
                    borderRadius: '0rem',
                    boxShadow: '0 0 0 rgba(0,0,0,0)',
                    duration: 3,
                    ease: 'power2.inOut'
                }, 1);

                // We keep narrative-wrapper transparent to show EtherBackground behind it
                // tlHero.to('.narrative-wrapper', { backgroundColor: '#FFFFFF', duration: 2, ease: 'power2.inOut' }, 4);

                // Phase 5: IA PORTAL (The Zoom Event)
                // Shifted to 10.5 total duration area
                tlHero.to('.hero-char-ia', {
                    scale: 80,
                    filter: 'blur(0px)',
                    opacity: 0,
                    duration: 1.5,
                    ease: 'expo.in'
                }, 10.5);

                // --- 4. IDENTIDAD REVEAL (The Entropy / Nolan Effect) ---
                const tlIdentidad = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#identidad',
                        start: 'top top',
                        end: '+=1500%',
                        pin: true,
                        scrub: 0.5,
                        anticipatePin: 1
                    }
                });

                tlIdentidad.to('.entropy-el', {
                    opacity: 1,
                    filter: 'blur(0px)',
                    transform: 'scale(1)',
                    duration: 3,
                    stagger: 1.2,
                    ease: 'power2.out'
                }, 0.2);

                tlIdentidad.to('.entropy-catchphrase', {
                    opacity: 1,
                    filter: 'blur(0px)',
                    transform: 'scale(1)',
                    color: '#888888', // SC: CORRECTION - Gray instead of White (Invisible)
                    duration: 3,
                    ease: 'expo.out'
                }, ">-0.5");

                tlIdentidad.to('.entropy-catchphrase', {
                    color: '#00FF99',
                    textShadow: '0 0 40px rgba(0,255,153,0.6), 0 0 80px rgba(0,255,153,0.4)',
                    duration: 2,
                    ease: 'power4.out'
                }, ">");

                tlIdentidad.to('.entropy-finish', {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 3,
                    ease: 'power2.out'
                }, ">-1");

                tlIdentidad.to('.entropy-line', {
                    scaleY: 1,
                    duration: 3,
                    ease: 'power2.inOut'
                }, ">-1.5");

                tlIdentidad.to('.entropy-body', {
                    opacity: 1,
                    transform: 'translateY(0)',
                    filter: 'blur(0px)',
                    duration: 3,
                    stagger: 1,
                    ease: 'power2.out'
                }, ">-1.5");

                tlIdentidad.to('#identidad', {
                    opacity: 0,
                    duration: 4,
                    ease: 'power2.in'
                }, ">+1.5");

                ScrollTrigger.create({
                    trigger: '#contacto',
                    start: 'top bottom',
                    onEnter: () => {
                        glitchRef.current?.trigger(0.8);
                    },
                    onLeaveBack: () => {
                        glitchRef.current?.trigger(0.35);
                    }
                });

                if (ctaSectionRef.current) {
                    const ctaTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: ctaSectionRef.current,
                            start: 'top top',
                            end: '+=500%',
                            pin: true,
                            pinSpacing: true,
                            scrub: 1,
                            anticipatePin: 1,
                            snap: {
                                snapTo: (value) => {
                                    return value < 0.2 ? 0 : 1;
                                },
                                duration: { min: 0.5, max: 1.2 },
                                delay: 0.02,
                                ease: 'expo.out'
                            }
                        }
                    });

                    ctaTl.addLabel("somos");
                    ctaTl.to({}, { duration: 1 });
                    ctaTl.to('.cta-somos-text', {
                        opacity: 0,
                        y: -80,
                        duration: 0.6,
                        ease: 'power3.in'
                    });

                    ctaTl.to('.cta-brain-container', {
                        y: '-35vh',
                        scale: 0.5,
                        duration: 1,
                        ease: 'power4.inOut'
                    }, "<");

                    ctaTl.to('.cta-invitation-container', {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }, ">-0.4");

                    ctaTl.addLabel("final");
                }

                if (pulseButtonRef.current) {
                    const btn = pulseButtonRef.current;
                    gsap.from(btn, {
                        scrollTrigger: {
                            trigger: btn,
                            start: "top 95%"
                        },
                        y: 40,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power4.out"
                    });
                }

            }, containerRef.current || undefined);

            return () => { ctx.revert(); };
        }
    }, [loading, lenis, hash]);

    // canRenderSlider removed to prevent layout thrashing

    return (
        <main ref={containerRef} style={{ backgroundColor: 'transparent' }}>
            <SEO
                title="Agencia de Ingeniería Digital & Automatización"
                description="Especialistas en Arquitectura Digital, Sistemas de Automatización 360 e Identidad Visual de Alta Fidelidad. Operamos a un nivel de eficiencia imposible para humanos."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "AgencIA",
                "url": "https://www.agenciamx.app",
                "logo": "https://www.agenciamx.app/logo.png",
                "description": "Agencia líder en Transformación Digital e Inteligencia Artificial.",
                "sameAs": [
                    "https://www.linkedin.com/company/agencia",
                    "https://instagram.com/agencia"
                ]
            }} />
            {loading && <Loader onComplete={handleLoaderComplete} />}
            <GlitchPortal ref={glitchRef} />
            {/* SECTIONS */}
            <div className="essence-fixed-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                <EssenceBackground />
            </div>

            {/* --- PORTAL WRAPPER (Pinned Entry) --- */}
            <div className="portal-wrapper" style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', zIndex: 20 }}>
                {/* BLACK WALL OVERLAY */}
                <div className="portal-overlay" style={{ position: 'absolute', inset: 0, zIndex: 10, backgroundColor: 'transparent' }}>
                    <svg width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
                        <defs>
                            <mask id="logo-mask">
                                <rect x="-10%" y="-10%" width="120%" height="120%" fill="white" />
                                <g ref={maskRef} style={{ transformOrigin: 'center' }}>
                                    <svg viewBox="0 0 17009 2588" width="75%" height="75%" x="12.5%" y="12.5%" preserveAspectRatio="xMidYMid meet">
                                        <g fill="black">
                                            {logoPaths.map((d, i) => (
                                                d.startsWith('M') ? <path key={i} d={d} /> : <polygon key={i} points={d} />
                                            ))}
                                        </g>
                                    </svg>
                                </g>
                            </mask>
                        </defs>
                        <rect x="-10%" y="-10%" width="120%" height="120%" fill="#ffffff" mask="url(#logo-mask)" />

                        {/* BLACK TEXT OVERLAY (Fades out to reveal video) */}
                        <g className="portal-text-overlay" style={{ transformOrigin: 'center' }}>
                            <svg viewBox="0 0 17009 2588" width="75%" height="75%" x="12.5%" y="12.5%" preserveAspectRatio="xMidYMid meet">
                                <g fill="black">
                                    {logoPaths.map((d, i) => (
                                        d.startsWith('M') ? <path key={i} d={d} /> : <polygon key={i} points={d} />
                                    ))}
                                </g>
                            </svg>
                        </g>
                    </svg>
                </div>

                {/* HIGH PROFILE SCROLL INDICATOR */}
                {/* STATIC SCROLL PROMPT: ADVANCE */}
                <div className="scroll-indicator" style={{
                    position: 'absolute', bottom: '5vh', left: 0, width: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                    zIndex: 20, pointerEvents: 'none', opacity: 1 // Always Visible Initially
                }}>
                    <div style={{
                        width: '20px', height: '32px', border: '2px solid #000', borderRadius: '12px', position: 'relative', opacity: 0.8
                    }}>
                        <div style={{
                            width: '4px', height: '4px', backgroundColor: '#000', borderRadius: '50%', position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', animation: 'scrollBounce 2s infinite'
                        }} />
                    </div>
                    <span style={{ color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.4em', marginRight: '-0.2em', fontWeight: 600, textTransform: 'uppercase', opacity: 0.8 }}>
                        Desliza para Avanzar
                    </span>
                    <style>{`
                        @keyframes scrollBounce {
                            0% { top: 6px; opacity: 1; }
                            50% { top: 16px; opacity: 0; }
                            100% { top: 6px; opacity: 0; }
                        }
                    `}</style>
                </div>
            </div>

            {/* --- NARRATIVE WRAPPER (The "Esencia" Content) --- */}
            {/* Starts Transparent (Showing Universe), then Background becomes White via Timeline */}
            <div className="narrative-wrapper" style={{ position: 'relative', zIndex: 10, backgroundColor: 'transparent', marginTop: '-100vh' }}>

                {/* BACKGROUND VIDEO (LATA AGENCIA) */}
                <div className="liquid-container" style={{
                    position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none',
                    backgroundColor: 'transparent',
                    overflow: 'hidden', opacity: 1
                }}>
                    <video src={videoSrc} autoPlay muted loop playsInline webkit-playsinline="true" preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* 1. NARRATIVE HERO (ESENCIA TEXT) */}
                <section id="hero" className="narrative-hero" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 5%', zIndex: 10 }}>
                    <div style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
                        <h1 style={{
                            fontSize: 'clamp(3rem, 12vw, 15rem)', // Adjusted for mobile fit
                            lineHeight: 0.9,
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            margin: 0,
                            textTransform: 'uppercase',
                            color: '#000000',
                            textShadow: '0 0 30px rgba(255,255,255,0.9), 0 0 60px rgba(255,255,255,0.5)', // OPTIMIZED
                            mixBlendMode: 'normal',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column', // VERTICAL STACK
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* LINE 1: NUESTRA (Small) */}
                            <span className="word-nuestra" style={{
                                display: 'inline-block',
                                fontSize: '0.4em', // 40% of the main text size
                                letterSpacing: '0.2em',
                                marginBottom: '0.2em',
                                position: 'relative',
                                textShadow: '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.7)', // PERMANENT GLOW
                                textAlign: 'center',
                                marginRight: '-0.1em', // Original optical compensation
                                transform: 'none'
                            }}>
                                NUESTRA
                            </span>

                            {/* LINE 2: ESENCIA (Giant) */}
                            <div style={{
                                display: 'flex', gap: '0', whiteSpace: 'nowrap', flexWrap: 'nowrap', // REMOVED GAP 0.1em to prevent splitting
                                width: '100%', justifyContent: 'center', alignItems: 'center',
                                transform: 'translateX(-0.04em)'
                            }}>
                                {/* PART 2A: ESENC (Will Fade Away) */}
                                <span className="word-esenc" style={{ display: 'inline-flex', flexShrink: 0, letterSpacing: '-0.02em' }}>
                                    <span className="hero-char-main">E</span>
                                    <span className="hero-char-main">S</span>
                                    <span className="hero-char-main">E</span>
                                    <span className="hero-char-main">N</span>
                                    <span className="hero-char-main">C</span>
                                </span>

                                {/* PART 2B: IA (The Final Survivor) */}
                                <span className="word-ia-wrapper" style={{ display: 'inline-flex', flexShrink: 0, letterSpacing: '-0.02em' }}>
                                    <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', zIndex: 10, willChange: 'transform, color, text-shadow', transformOrigin: 'center' }}>I</span>
                                    <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', zIndex: 10, willChange: 'transform, color, text-shadow', transformOrigin: 'center' }}>A</span>
                                </span>
                            </div>
                        </h1>
                    </div>
                </section>

                {/* 3. IDENTIDAD MASTERPIECE */}
                <section id="identidad" style={{
                    minHeight: '100vh',
                    padding: '2rem 5% 2rem 5%', // Compact Padding
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column', // Force Stack for perfect centering
                    alignItems: 'center', // Horizontally center
                    justifyContent: 'center', // Vertically center in 100vh
                    gap: '4vh', // Dynamic spacing
                    position: 'relative',
                    zIndex: 40,
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                }}>
                    {/* COLUMN 2: CONTENT (Main Text) */}
                    <div className="identidad-headline-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', perspective: '1000px', width: '100%', maxWidth: '800px' }}>

                        {/* BLOCK 1: NO SOMOS UNA AGENCIA... */}
                        <div className="entropy-block-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <h2 className="entropy-el" style={{
                                fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', // Reduced Size
                                fontWeight: 900,
                                margin: 0,
                                lineHeight: 1.1,
                                color: '#000',
                                opacity: 0,
                                filter: 'blur(20px)',
                                transform: 'scale(0.8)',
                                willChange: 'opacity, filter, transform'
                            }}>
                                NO SOMOS UNA
                            </h2>
                            <h2 className="entropy-el" style={{
                                fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', // Reduced Size
                                fontWeight: 900,
                                margin: 0,
                                lineHeight: 1.1,
                                color: '#222', // SC: Increased contrast for visibility
                                opacity: 0,
                                filter: 'blur(30px)',
                                transform: 'scale(0.7)',
                                willChange: 'opacity, filter, transform'
                            }}>
                                AGENCIA CON IA.
                            </h2>
                        </div>

                        {/* BLOCK 2: SOMOS LA IA... */}
                        <div className="entropy-block-2" style={{ marginTop: '1rem' }}>
                            <h2 className="entropy-catchphrase" style={{
                                fontSize: 'clamp(2rem, 5vw, 4.5rem)', // Reduced Size
                                fontWeight: 900,
                                margin: 0,
                                lineHeight: 1,
                                color: '#333',
                                opacity: 0,
                                filter: 'blur(40px)',
                                transform: 'scale(1.2)',
                                willChange: 'opacity, filter, transform, color, text-shadow'
                            }}>
                                SOMOS LA IA
                            </h2>
                            <div className="entropy-finish" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.3rem', opacity: 0, filter: 'blur(20px)' }}>
                                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 900, margin: 0, lineHeight: 1, color: '#000' }}>COMO</h2>
                                <img
                                    src={officialTypography}
                                    alt="AgencIA"
                                    style={{
                                        height: 'clamp(1.8rem, 4.5vw, 4rem)', // Tuned for crispness
                                        width: 'auto',
                                        objectFit: 'contain',
                                        imageRendering: 'auto' // Let browser handle smoothing
                                    }}
                                />
                            </div>
                        </div>

                    </div>

                    <div className="identidad-body-container" style={{
                        marginTop: '1.5rem',
                        paddingLeft: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        position: 'relative',
                        // borderLeft removed
                    }}>
                        {/* ANIMATED VERTICAL LINE */}
                        <div className="entropy-line" style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '3px',
                            backgroundColor: '#00FF99', // Neon Acccent
                            boxShadow: '0 0 10px rgba(0,255,153,0.5)',
                            transformOrigin: 'top',
                            transform: 'scaleY(0)', // Start hidden
                        }} />

                        {/* Line 1 */}
                        <p className="entropy-body" style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                            lineHeight: 1.3,
                            maxWidth: '550px',
                            color: '#333',
                            margin: 0,
                            opacity: 0,
                            transform: 'translateY(20px)',
                            filter: 'blur(10px)'
                        }}>
                            No hacemos "diseño bonito". Construimos interfaces que<br />
                            <strong style={{ color: '#00FF99' }}>imponen autoridad</strong> y capturan mercado.
                        </p>

                        {/* Line 2 - NIVEL 2 */}
                        <p className="entropy-body" style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                            lineHeight: 1.3,
                            maxWidth: '550px',
                            color: '#333',
                            margin: 0,
                            opacity: 0,
                            transform: 'translateY(20px)',
                            filter: 'blur(10px)',
                            textShadow: '3px 6px 12px rgba(0,0,0,0.28)'
                        }}>
                            Estética superior. Ejecución quirúrgica. Resultados financieros.
                        </p>

                        {/* Line 3 - NIVEL 1 (más cerca, más marcada) */}
                        <p className="entropy-body" style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                            lineHeight: 1.3,
                            maxWidth: '550px',
                            color: '#000',
                            fontWeight: 800,
                            margin: '0.3rem 0 0',
                            opacity: 0,
                            transform: 'translateY(20px)',
                            filter: 'blur(10px)',
                            textShadow: '4px 8px 16px rgba(0,0,0,0.35)'
                        }}>
                            Creatividad humana. Velocidad de máquina.
                        </p>
                    </div>

                </section>


                {/* 4. SOUL MANIFESTO */}
                <section id="manifesto" className="soul-narrative-section" style={{ position: 'relative', zIndex: 40, backgroundColor: 'transparent', color: '#FFF' }}>
                    <SoulManifesto />
                </section>


                {/* 5. SHOWCASE SLIDER */}
                <section id="capacidades" className="identity-section" style={{ position: 'relative', zIndex: 50, marginTop: '0', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
                    <ShowcaseSlider initialHash={hash} />
                </section>

                {/* 6. TEAM RIFT */}
                <section id="nucleo" className="team-list" style={{ minHeight: '100vh', padding: '0 0 10vh', backgroundColor: '#FFFFFF', color: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', margin: '6rem 0', fontWeight: 900, textAlign: 'center', letterSpacing: '0.02em', wordSpacing: '0.2em', color: '#000' }}>EL NÚCLEO</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {team.map((member) => (
                            <div key={member.id} className="rift-row" style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <div className="rift-img" style={{ position: 'absolute', top: '15%', left: 0, width: '100%', height: '70%', zIndex: 0, transition: 'none', overflow: 'hidden', opacity: 0.3, filter: 'grayscale(100%)' }}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${member.img})`,
                                        backgroundSize: 'contain', // Revert to contain to prevent "enormous" cutups
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center', // Focus on faces generally
                                        transform: 'scale(1)', // No zoom
                                    }} />
                                </div>
                                <span className="rift-id" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', fontWeight: 900, opacity: 0.05, zIndex: 1, pointerEvents: 'none', color: '#000' }}>0{member.id}</span>
                                <div className="rift-left" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4rem', zIndex: 2, background: 'linear-gradient(90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', transform: 'translateX(0)', willChange: 'transform' }}>
                                    <h3 style={{ fontSize: 'clamp(2rem, 3.5vw, 4rem)', fontWeight: 700, textAlign: 'right', margin: 0, color: '#000', whiteSpace: 'pre-line' }}>{member.role}</h3>
                                </div>
                                <div className="rift-right" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '4rem', zIndex: 2, background: 'linear-gradient(-90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', transform: 'translateX(0)', willChange: 'transform' }}>
                                    <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#000', maxWidth: '300px', whiteSpace: 'pre-line' }}>{member.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* A.L.M.A. PORTAL (Integrated into Nucleo End) */}
                    <div className="alma-portal-container" style={{ marginTop: '5vh' }}>
                        <AlmaSection />
                    </div>
                </section>

                {/* 7. SIMBIOSIS */}
                {/* GRADIENT BRIDGE: WHITE -> BLACK (Smooth Descent) */}
                <div style={{ height: '20vh', background: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 100%)', width: '100%', position: 'relative', zIndex: 15 }} />

                <div id="simbiosis" style={{ position: 'relative' }}>
                    <Symbiosis />
                </div>

                {/* INJECTED STYLES FOR MOBILE MASTERPIECE */}
                <style>{`
                    @media (max-width: 768px) {
                        #identidad {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                            /* CENTERED LAYOUT with safe padding */
                            justify-content: center !important;
                            padding: 2rem 5% 2rem 5% !important; 
                            gap: 0.5rem !important;
                            min-height: 100vh !important; /* Ensure full height for centering */
                        }
                        .identidad-marker {
                            display: none !important;
                        }
                        .identidad-headline-1 {
                            font-size: clamp(1.5rem, 8vw, 2.5rem) !important; /* SMALLER BASE for iPhone 5 */
                            line-height: 1.1 !important;
                        }
                        .identidad-headline-2 {
                            font-size: clamp(1.8rem, 10vw, 3rem) !important; /* SMALLER BASE */
                            margin-top: 0.2rem !important;
                            line-height: 1 !important;
                        }
                        .identidad-body-container {
                            margin-top: 0.8rem !important;
                            padding-left: 0.8rem !important; /* Less indentation */
                            gap: 0.5rem !important;
                        }
                        .identidad-body-line {
                            font-size: clamp(0.75rem, 3.5vw, 1rem) !important; /* iPhone 5 safe */
                            line-height: 1.3 !important;
                        }
                        /* FORCE LOGO COMPACTNESS */
                        #identidad img {
                            max-height: 10vh !important; /* Even smaller for iPhone 5 safety */
                            margin-top: 0.5rem !important;
                            align-self: flex-start !important; /* Ensure left align */
                        }
                    }

                    /* IPHONE 5/SE & ULTRA SMALL SPECIFIC OVERRIDES */
                    @media (max-width: 380px), (max-height: 700px) {
                        #identidad {
                            justify-content: flex-start !important; /* Let it flow from top */
                            padding-top: 10vh !important; /* REDUCED to bring connection closer to prev section */
                            padding-bottom: 25vh !important; /* MASSIVE BOTTOM PADDING TO PREVENT CUTOFF */
                            gap: 0.2rem !important;
                        }
                        .identidad-headline-1 {
                            font-size: 1.3rem !important; /* EVEN SMALLER */
                        }
                        .identidad-headline-2 {
                            font-size: 1.5rem !important; /* EVEN SMALLER */
                            margin-top: 0.1rem !important;
                        }
                        .identidad-body-container {
                             margin-top: 0.5rem !important;
                             padding-left: 0.5rem !important;
                        }
                        .identidad-body-line {
                            font-size: 0.7rem !important;
                            line-height: 1.25 !important;
                        }
                        #identidad img {
                            max-height: 70px !important; /* Fixed pixel max height for safety */
                            margin-top: 0.2rem !important;
                        }
                        /* Ensure nothing is hidden */
                        #identidad {
                            overflow-y: visible !important;
                            height: auto !important;
                            min-height: 100svh !important;
                        }
                    }
                `}</style>

                {/* 8. CTA SECTION - PINNED ANIMATION RESTORED */}
                <section
                    ref={ctaSectionRef} // Attached Ref
                    id="contacto"
                    className="cta-section"
                    style={{
                        height: '100vh', // Viewport height (GSAP adds scroll space)
                        width: '100%',
                        position: 'relative',
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden', // Clean edges
                        zIndex: 50 // Ensure it sits on top of previous gradients
                    }}
                >
                    {/* PINNED CONTENT CONTAINER */}
                    <div
                        className="cta-pinned-content"
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center', // Back to center
                            alignItems: 'center',
                            position: 'relative',
                            paddingTop: '0'
                        }}
                    >

                        {/* SOMOS text */}
                        <h2
                            className="cta-somos-text"
                            style={{
                                fontSize: 'clamp(3rem, 8vw, 6rem)',
                                textAlign: 'center',
                                fontWeight: 900,
                                margin: '0 0 2vh 0',
                                letterSpacing: '-0.05em',
                                color: '#000',
                                position: 'relative',
                                zIndex: 2
                            }}
                        >
                            SOMOS
                        </h2>

                        {/* BRAIN + AGENCIA LOGO */}
                        <div
                            className="cta-brain-container"
                            style={{
                                width: 'clamp(400px, 80vw, 1200px)', // Keep width MAX
                                maxHeight: '65vh', // SAFE HEIGHT to ensure Pin works (75vh was too risky)
                                marginBottom: '1rem',
                                position: 'relative',
                                zIndex: 1,
                                transformOrigin: 'center center',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <img src={footerLogo} alt="AgencIA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                        </div>

                        {/* CTA CONTENT - Hidden initially */}
                        <div
                            className="cta-invitation-container"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'absolute',
                                top: '55%', // Positioned relative to viewport height
                                left: '50%',
                                transform: 'translateX(-50%) translateY(50px)', // Centered horizontally
                                width: '100%',
                                opacity: 0,
                                zIndex: 5
                            }}
                        >
                            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.05em', color: '#333' }}>
                                ¿TIENES UNA IDEA?
                            </h2>

                            <Link to="/contacto">
                                <button
                                    ref={pulseButtonRef}
                                    style={{
                                        padding: 'clamp(0.8rem, 2vh, 1.2rem) clamp(1.5rem, 8vw, 4rem)',
                                        background: '#000',
                                        color: '#FFF',
                                        border: '1px solid #000',
                                        borderRadius: '0px',
                                        fontWeight: '900',
                                        fontSize: 'clamp(0.85rem, 4vw, 1.1rem)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                                        letterSpacing: 'clamp(0.1em, 2vw, 0.25em)',
                                        textTransform: 'uppercase',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'clamp(0.5rem, 3vw, 1.5rem)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        width: 'auto',
                                        maxWidth: '92vw'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = '#FFF';
                                        e.currentTarget.style.color = '#000';
                                        e.currentTarget.style.padding = 'clamp(0.8rem, 2vh, 1.2rem) clamp(2rem, 9vw, 4.5rem)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,153,0.15)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = '#000';
                                        e.currentTarget.style.color = '#FFF';
                                        e.currentTarget.style.padding = 'clamp(0.8rem, 2vh, 1.2rem) clamp(1.5rem, 8vw, 4rem)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <span style={{ position: 'relative', zIndex: 1 }}>Tómate un café virtual</span>
                                    <span style={{ fontSize: '1.4rem', transition: 'transform 0.3s ease' }} className="cta-arrow">→</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* --- PHYSICAL GRADIENT BRIDGE: WHITE -> BLACK (To Footer) --- */}
                <div style={{
                    width: '100%',
                    height: '150px',
                    background: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 100%)',
                    position: 'relative',
                    zIndex: 20
                }} />

                {/* 7. FOOTER */}
                <Footer />

            </div >
            {/* HUD DE CAPÍTULOS (WOW!) - SC: Moved to top level for stability */}
            <ChapterHUD currentChapter={activeChapter} chapterNumber={chapterNum} />
        </main >
    );
};

export default Home;
