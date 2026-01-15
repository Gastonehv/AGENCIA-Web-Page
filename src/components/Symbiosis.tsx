import React, { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// OPTIMIZED ASSETS (Production Candidates)
import videoElite from '../assets/videos/simbiosis_001_opt.mp4';
import videoEscalabilidad from '../assets/videos/simbiosis_002_opt.mp4';
import videoDominio from '../assets/videos/simbiosis_003_opt.mp4';
import CinematicTitle from './CinematicTitle';

gsap.registerPlugin(ScrollTrigger);

// MEMOIZED MEDIA PLAYER - Defined OUTSIDE component to prevent re-renders
const MediaPlayer = memo(({ src, type }: { src: string, type: 'video' | 'image' }) => {
    if (type === 'image') {
        return (
            <img
                src={src}
                alt="Data Visualization"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
        );
    }
    return (
        <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Changed from 'cover' to show full video scale
                display: 'block'
            }}
        />
    );
});

// Asset configuration - Semantically Named
const chartAssets = {
    elite: { src: videoElite, type: 'video' as const },
    escalabilidad: { src: videoEscalabilidad, type: 'video' as const },
    dominio: { src: videoDominio, type: 'video' as const }
};

const Symbiosis: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.matchMedia();

        // 1. DESKTOP ANIMATIONS (> 800px)
        ctx.add("(min-width: 800px)", () => {
            // PIN: Section stays fixed while user scrolls through it
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=100%', // Stay pinned for 100vh of scroll
                pin: true,
                pinSpacing: true,
                id: 'symbiosis-pin'
            });

            // Title animation
            if (titleRef.current) {
                gsap.from(titleRef.current, {
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
                    opacity: 0, y: 30, duration: 1, ease: "power2.out"
                });
            }
        });

        // 2. MOBILE ANIMATIONS (< 800px) - No pin on mobile
        ctx.add("(max-width: 799px)", () => {
            gsap.from(titleRef.current, {
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
                opacity: 0, y: 20, duration: 0.8, ease: "power2.out"
            });
        });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            clearTimeout(timer);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="simbiosis-startups"
            style={{
                height: '100vh', // LOCKED: Strictly one screen
                backgroundColor: '#000000',
                color: '#FFFFFF',
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                zIndex: 200,
                overflow: 'hidden', // Contain everything
                scrollSnapAlign: 'start'
            }}
        >
            {/* GRID OVERLAY - Subtle Tech Feel */}
            {/* LIVING NOISE TEXTURE */}
            <div style={{
                position: 'absolute', inset: -50,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                opacity: 0.15, // VISIBLE NOW
                mixBlendMode: 'normal',
                pointerEvents: 'none',
                animation: 'noise-shift 0.2s infinite',
                zIndex: 1
            }} />
            <style>{`
                @keyframes noise-shift {
                    0% { transform: translate(0,0); }
                    10% { transform: translate(-5px,-5px); }
                    20% { transform: translate(-10px,5px); }
                    30% { transform: translate(5px,-10px); }
                    40% { transform: translate(-5px,15px); }
                    50% { transform: translate(-10px,5px); }
                    60% { transform: translate(15px,0); }
                    70% { transform: translate(0,10px); }
                    80% { transform: translate(-15px,0); }
                    90% { transform: translate(10px,5px); }
                    100% { transform: translate(5px,0); }
                }
            `}</style>

            {/* MAIN DASHBOARD */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '96%', // Wider spread
                width: '100%',
                margin: '0 auto',
                height: '100%',
                padding: '2vh 2% 2vh', // Compact vertical padding
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between' // Spread title and cards evenly
            }}>

                {/* HEADER: RESTRUCTURED - Kicker above, Title+Manifesto on same line */}
                <div style={{
                    marginBottom: '2vh',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '1vh'
                }}>
                    {/* 1. KICKER - OWN LINE */}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00FF99', marginBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span>/// SISTEMA_OPERATIVO_DE_CRECIMIENTO</span>
                        <span style={{ width: '40px', height: '1px', backgroundColor: '#00FF99' }}></span>
                    </div>

                    {/* 2. TITLE + MANIFESTO ROW */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        {/* TITLE */}
                        <h2 ref={titleRef} style={{
                            fontSize: 'clamp(4rem, 13vw, 12rem)',
                            lineHeight: 0.85,
                            letterSpacing: '-0.06em',
                            margin: 0,
                            textTransform: 'uppercase',
                            color: '#FFF',
                            whiteSpace: 'nowrap',
                            flex: '1 1 auto'
                        }}>
                            <CinematicTitle
                                text="SIMBIOSIS"
                                stagger={0.06}
                            />
                        </h2>

                        {/* MANIFESTO */}
                        <div className="manifesto-block" style={{ textAlign: 'right', maxWidth: '350px', flexShrink: 0 }}>
                            <h3 style={{
                                fontSize: 'clamp(1rem, 1.3vw, 1.5rem)',
                                fontWeight: 600,
                                color: '#FFF',
                                margin: 0,
                                textTransform: 'uppercase',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2
                            }}>
                                No buscamos clientes.<br />
                                <span style={{ color: '#888' }}>Buscamos imperios.</span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* CARDS CONTAINER */}
                <div className="pillars-grid" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1.5vw',
                    flex: '1 1 auto',
                    minHeight: 0, // CRITICAL: Allow grid to shrink to fit
                    width: '100%',
                    overflow: 'hidden'
                }}>

                    {/* CARD 1: SOCIOS */}
                    <div className="pillar-item" style={{
                        flex: '1 1 0px', minWidth: 0,
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        {/* HEADER */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#FF40FF', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 01_ÉLITE
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                INGENIERÍA<br />DE ÉLITE
                            </h3>
                        </div>
                        {/* MEDIA */}
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: 0, flex: 1 }}>
                                {chartAssets.elite && <MediaPlayer src={chartAssets.elite.src} type={chartAssets.elite.type} />}
                            </div>
                        </div>
                        {/* FOOTER */}
                        <div style={{ padding: '1rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                CTO Fraccional & Dev Team.<br />
                                <span style={{ color: '#FFF' }}>De idea a mercado en 30 días. Sin excusas.</span>
                            </p>
                        </div>
                    </div>

                    {/* CARD 2: INFRAESTRUCTURA */}
                    <div className="pillar-item" style={{
                        flex: '1 1 0px', minWidth: 0,
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00f3ff', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 02_ESCALABILIDAD
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                ESCALABILIDAD<br />TOTAL
                            </h3>
                        </div>
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: 0, flex: 1 }}>
                                {chartAssets.escalabilidad && <MediaPlayer src={chartAssets.escalabilidad.src} type={chartAssets.escalabilidad.type} />}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                AWS / Google Cloud Partners.<br />
                                <span style={{ color: '#FFF' }}>99.9% Uptime Garantizado.</span>
                            </p>
                        </div>
                    </div>

                    {/* CARD 3: ALINEACIÓN */}
                    <div className="pillar-item" style={{
                        flex: '1 1 0px', minWidth: 0,
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00FF99', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 03_DOMINIO
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                DOMINIO DE<br />MERCADO
                            </h3>
                        </div>
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: 0, flex: 1 }}>
                                {chartAssets.dominio && <MediaPlayer src={chartAssets.dominio.src} type={chartAssets.dominio.type} />}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                Infraestructura & Talento.<br />
                                <span style={{ color: '#FFF' }}>Tú pones la visión, nosotros el motor.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    #simbiosis-startups {
                        height: auto !important;
                        min-height: 100vh !important;
                        overflow: visible !important;
                        padding: 60px 0 !important;
                    }
                    #simbiosis-startups h2 {
                        font-size: clamp(3rem, 18vw, 6rem) !important;
                        white-space: normal !important;
                        line-height: 0.9 !important;
                        text-align: left !important;
                        width: 100% !important;
                    }
                    .pillars-grid {
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: flex-start !important;
                        padding: 0 1.5rem !important;
                        gap: 2.5rem !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .pillar-item {
                        min-height: 400px !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                    }
                    #simbiosis-startups .manifesto-block {
                        text-align: left !important;
                        align-self: flex-start !important;
                        margin-top: 1rem !important;
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </section >
    );
};

export default Symbiosis;
