import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import essenceHeroVideo from '../assets/videos/esencia_hero.mp4';
import ShowcaseSlider from '../components/ShowcaseSlider';
import SEO from '../components/SEO';
import SoulManifesto from '../components/SoulManifesto';
import Symbiosis from '../components/Symbiosis';
import StructuredData from '../components/StructuredData';

import ceoImg from '../assets/team/ceo.jpg';
import footerLogo from '../assets/logo_agencia_full.png';

gsap.registerPlugin(ScrollTrigger);

const Esencia: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const team = [
        { id: 1, role: 'CEO / VISIONARY', name: 'Arquitecto de Realidades', img: ceoImg },
        { id: 2, role: 'CTO / AI LEAD', name: 'Oráculo de Datos', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' },
        { id: 3, role: 'LEAD DEVELOPER', name: 'Tejedor de Código', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop' },
        { id: 4, role: 'UX/UI DIRECTOR', name: 'Escultor de Interfaces', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop' },
    ];

    const [canRenderSlider, setCanRenderSlider] = useState(false);

    useEffect(() => {
        // Wait for Hero/Text layout to stabilize
        const timer = setTimeout(() => {
            setCanRenderSlider(true);
            setTimeout(() => ScrollTrigger.refresh(), 100);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {

            const mm = gsap.matchMedia();

            // --- HERO ANIMATION ---
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

            // Phase 1: "ESENC" flies up/away & Collapses
            tlHero.to('.hero-char-main', {
                y: -150, opacity: 0, width: 0, margin: 0, stagger: 0.1, ease: 'power3.in', duration: 2
            }, 0);

            // Phase 2: "IA" Mutation
            tlHero.to('.hero-char-ia', {
                color: '#0044FF', // ELECTRIC BLUE
                textShadow: '0 0 60px rgba(0,68,255,0.9)', // Blue Glow
                scale: 1.2, duration: 1, ease: 'sine.out'
            }, 2);

            // Phase 3: VIDEO SCALING (Floating -> Immersive)
            tlHero.to('.liquid-container', {
                scale: 1,
                borderRadius: '0rem', // Flattens for full screen
                boxShadow: '0 0 0 rgba(0,0,0,0)', // Shadow disappears
                duration: 3,
                ease: 'power2.inOut'
            }, 1);

            // FADE OUT SEQUENCE (Synced)
            tlHero.to('.liquid-container', { opacity: 0, duration: 2, ease: 'power2.inOut' }, 4);
            tlHero.to(containerRef.current, { backgroundColor: '#FFFFFF', duration: 2, ease: 'power2.inOut' }, 4);

            // Phase 4: IA Explosion (Last)
            tlHero.to('.hero-char-ia', {
                scale: 60, opacity: 0, duration: 2, ease: 'power4.in'
            }, 5);


            // --- IDENTIDAD REVEAL ---
            const tlIdentidad = gsap.timeline({
                scrollTrigger: {
                    trigger: '#identidad-section',
                    start: 'top top',
                    end: '+=900%',
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            tlIdentidad.fromTo(['.identidad-marker', '.identidad-chapter-label'],
                { opacity: 0, x: -50, filter: 'blur(10px)' },
                { opacity: 1, x: 0, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' }
            );

            tlIdentidad.fromTo('.identidad-headline-1',
                { y: 200, opacity: 0, rotationX: -90, filter: 'blur(20px)', transformOrigin: '50% 100%' },
                { y: 0, opacity: 1, rotationX: 0, filter: 'blur(0px)', duration: 2, ease: 'none' },
                ">"
            );

            tlIdentidad.fromTo('.identidad-headline-2',
                { y: 200, opacity: 0, rotationX: -90, filter: 'blur(20px)', transformOrigin: '50% 100%' },
                { y: 0, opacity: 1, rotationX: 0, filter: 'blur(0px)', duration: 2, ease: 'none' },
                ">"
            );

            tlIdentidad.fromTo('.identidad-body-text',
                { x: 100, opacity: 0, filter: 'blur(10px)' },
                { x: 0, opacity: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
                ">"
            );

            tlIdentidad.to({}, { duration: 3 });

            tlIdentidad.to(['.identidad-marker', '.identidad-chapter-label', '.identidad-headline-1', '.identidad-headline-2', '.identidad-body-text'], {
                scale: 0.9,
                filter: 'blur(20px)',
                opacity: 0,
                duration: 2,
                ease: 'power2.in'
            });


            // --- RESPONSIVE & TEAM ---
            const rifts = gsap.utils.toArray<HTMLElement>('.rift-row');

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

            // DESKTOP
            mm.add("(min-width: 769px)", () => {
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
            });

            // MOBILE
            mm.add("(max-width: 768px)", () => {
                gsap.set('.liquid-container', {
                    scale: 0.35,
                    borderRadius: '2rem',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
                    transformOrigin: 'center center'
                });

                gsap.set("#identidad-section", { gridTemplateColumns: "1fr", height: "auto", paddingTop: "10rem" });
                // ... other mobile sets can be inferred or simplified for brevity as the logic is robust

                rifts.forEach(rift => {
                    ScrollTrigger.create({
                        trigger: rift,
                        start: "top 70%",
                        end: "bottom 30%",
                        onEnter: () => openRift(rift),
                        onLeave: () => closeRift(rift),
                        onEnterBack: () => openRift(rift),
                        onLeaveBack: () => closeRift(rift)
                    });
                    rift.addEventListener('click', () => {
                        // Simple toggle logic
                        const idOpacity = gsap.getProperty(rift.querySelector('.rift-id'), "opacity");
                        if (idOpacity && Number(idOpacity) > 0.5) openRift(rift);
                        else closeRift(rift);
                    });
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{ backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh', position: 'relative', fontFamily: 'var(--font-heading)', overflowX: 'hidden' }}>
            <SEO
                title="Nuestra Esencia"
                description="Descubre el ADN detrás de AgencIA. Filosofía, equipo y nuestra visión de la inteligencia creativa."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "Nuestra Esencia",
                "publisher": {
                    "@type": "Organization",
                    "name": "AgencIA"
                }
            }} />

            {/* VIDEO BACKGROUND */}
            <div className="liquid-container" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
                <video src={essenceHeroVideo} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} />
            </div>

            {/* HERO */}
            <section className="hero-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%', zIndex: 10 }}>
                <div style={{ overflow: 'visible', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1 style={{ lineHeight: 0.85, fontWeight: 900, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase', color: '#000000', textShadow: '0 0 50px rgba(255,255,255,0.9)', mixBlendMode: 'normal', textAlign: 'center' }}>

                        {/* LINE 1: NUESTRA */}
                        <div style={{ fontSize: 'clamp(2rem, 10vw, 12rem)', display: 'block' }}>
                            <span className="hero-char-nuestra">NUESTRA</span>
                        </div>

                        {/* LINE 2: ESENCIA */}
                        <div style={{ fontSize: 'clamp(2.5rem, 13vw, 16rem)', display: 'flex', justifyContent: 'center' }}>
                            <span className="hero-char-main" style={{ display: 'inline-block' }}>E</span>
                            <span className="hero-char-main" style={{ display: 'inline-block' }}>S</span>
                            <span className="hero-char-main" style={{ display: 'inline-block' }}>E</span>
                            <span className="hero-char-main" style={{ display: 'inline-block' }}>N</span>
                            <span className="hero-char-main" style={{ display: 'inline-block' }}>C</span>
                            <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', zIndex: 10 }}>I</span>
                            <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', zIndex: 10 }}>A</span>
                        </div>
                    </h1>
                </div>
            </section>



            {/* IDENTIDAD SECTION */}
            <section id="identidad-section" style={{ minHeight: '80vh', padding: '5rem 5%', backgroundColor: '#FFFFFF', display: 'grid', gridTemplateColumns: '1fr 1.5fr', alignItems: 'center', position: 'relative', zIndex: 30, overflow: 'hidden', perspective: '1000px', transformStyle: 'preserve-3d' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', paddingRight: '3rem' }}>
                    <div className="identidad-marker" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#666', marginTop: '150px' }}>/// SYSTEM_IDENTITY</div>
                </div>
                <div style={{ paddingLeft: '5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="identidad-chapter-label"><span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', padding: '0.2rem 0.6rem', border: '1px solid #000', borderRadius: '20px', display: 'inline-block', marginBottom: '1rem' }}>CAPÍTULO 001 — ORIGEN</span></div>
                    <h2 className="identidad-headline-1" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: '#000', margin: 0 }}>NO SOMOS UNA<br /><span style={{ color: '#0044FF' }}>AGENCIA CON IA.</span></h2>
                    <h2 className="identidad-headline-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: '#000', margin: 0, opacity: 0.3 }}>SOMOS LA IA<br />COMO AGENCIA.</h2>
                    <p className="identidad-body-text" style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', lineHeight: 1.5, maxWidth: '600px', marginTop: '1rem', borderLeft: '4px solid #0044FF', paddingLeft: '1.5rem', color: '#333' }}>Trascendemos la estética convencional. <br />Orquestamos sistemas de inteligencia visual que no solo comunican, sino que dominan el entorno digital.<br /><br /><strong style={{ color: '#000' }}>Simbiosis absoluta entre intuición humana y precisión algorítmica.</strong></p>
                </div>
            </section>

            {/* SLIDER SECTION */}
            <section className="identity-section" style={{ position: 'relative', zIndex: 50, marginTop: '-50vh', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
                {canRenderSlider && <ShowcaseSlider />}
            </section>

            {/* SOUL MANIFESTO */}
            <section className="soul-narrative-section" style={{ position: 'relative', zIndex: 30, backgroundColor: '#000', color: '#FFF' }}>
                <div style={{ position: 'absolute', top: '15vh', left: '5%', fontFamily: 'var(--font-mono)', color: '#FFF', opacity: 0.5, zIndex: 40, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_002_INIT</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>GÉNESIS</span>
                </div>
                <SoulManifesto />
            </section>



            {/* TEAM LIST */}
            <section className="team-list" style={{ minHeight: '100vh', padding: '10vh 0', backgroundColor: '#FFFFFF', color: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '2rem', left: '5%', fontFamily: 'var(--font-mono)', color: '#000', opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_003_CORE</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>NÚCLEO</span>
                </div>
                <h2 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '6rem', fontWeight: 900, textAlign: 'center', letterSpacing: '0.02em', wordSpacing: '0.2em', color: '#000' }}>EL NÚCLEO</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {team.map((member) => (
                        <div key={member.id} className="rift-row" style={{ position: 'relative', width: '100%', height: '30vh', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <div className="rift-img" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${member.img})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 0.3, transform: 'scale(0.9)', filter: 'grayscale(100%)', zIndex: 0, transition: 'none' }} />
                            <span className="rift-id" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', fontWeight: 900, opacity: 0.05, zIndex: 1, pointerEvents: 'none', color: '#000' }}>0{member.id}</span>
                            <div className="rift-left" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4rem', zIndex: 2, background: 'linear-gradient(90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', transform: 'translateX(0)', willChange: 'transform' }}>
                                <h3 style={{ fontSize: 'clamp(2rem, 3.5vw, 4rem)', fontWeight: 700, textAlign: 'right', margin: 0, color: '#000' }}>{member.role}</h3>
                            </div>
                            <div className="rift-right" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '4rem', zIndex: 2, background: 'linear-gradient(-90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', transform: 'translateX(0)', willChange: 'transform' }}>
                                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#000', maxWidth: '300px' }}>{member.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SIMBIOSIS (STARTUPS) */}
            <section className="symbiosis-narrative-section" style={{ position: 'relative', zIndex: 60, backgroundColor: '#000', color: '#FFF' }}>
                <div style={{ position: 'absolute', top: '15vh', left: '5%', fontFamily: 'var(--font-mono)', color: '#FFF', opacity: 0.5, zIndex: 40, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_004_GROWTH</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>SIMBIOSIS</span>
                </div>
                <Symbiosis />
            </section>

            {/* CONTACT */}
            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', color: '#000', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '2rem', left: '5%', fontFamily: 'var(--font-mono)', color: '#000', opacity: 0.5, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>/// CHAPTER_005_EXIT</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>CONTACTO</span>
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textAlign: 'center', fontWeight: 900, marginBottom: '2rem' }}>SOMOS</h2>
                <div style={{ width: '50%', maxWidth: '600px', opacity: 1 }}>
                    <img src={footerLogo} alt="AgencIA Logo" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            </section>
        </div>
    );
};

export default Esencia;
