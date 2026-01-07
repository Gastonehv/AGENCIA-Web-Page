import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// OPTIMIZED ASSETS (Production Candidates)
import videoPillar1 from '../assets/videos/simbiosis_001.mp4'; // New User Asset
import videoPillar2 from '../assets/videos/simbiosis_002.mp4'; // New User Asset
import videoPillar3 from '../assets/videos/simbiosis_003.mp4'; // New User Asset

gsap.registerPlugin(ScrollTrigger);

const Symbiosis: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // ASSET INFRASTRUCTURE
    const chartAssets = {
        pillar1: { src: videoPillar1, type: 'video' as const },
        pillar2: { src: videoPillar2, type: 'video' as const },
        pillar3: { src: videoPillar3, type: 'video' as const }
    };

    // HYBRID MEDIA PLAYER (Supports SVG & Video)
    const MediaPlayer = ({ src, type }: { src: string, type: 'video' | 'image' }) => {
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
                preload="metadata"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
            />
        );
    };

    useEffect(() => {
        const ctx = gsap.matchMedia();

        // 1. DESKTOP ANIMATIONS (> 800px)
        ctx.add("(min-width: 800px)", () => {
            if (titleRef.current) {
                gsap.from(titleRef.current, {
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
                    opacity: 0, y: 30, duration: 1, ease: "power2.out"
                });
            }
        });

        // 2. MOBILE ANIMATIONS (< 800px)
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
                height: '100vh',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 25%, #E2E8F0 50%, #F5F7FA 75%, #FFFFFF 100%)',
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                zIndex: 200,
                overflow: 'hidden'
            }}
        >
            {/* MINIMALIST DOT GRID */}
            <div className="dot-grid" style={{
                position: 'absolute', inset: '-100px',
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.6, pointerEvents: 'none', zIndex: 4,
                willChange: 'transform'
            }} />

            {/* MAIN DASHBOARD */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '95%',
                width: '100%',
                margin: '0 auto',
                height: '100%',
                padding: '120px 2% 40px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '4vh',
                justifyContent: 'center'
            }}>

                {/* header row */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    {/* TITLE */}
                    <div>
                        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ height: '2px', background: '#000', width: '30px' }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.3em', color: '#000', textTransform: 'uppercase', fontWeight: 600 }}>
                                ACELERADORA_DE_IMPACTO
                            </span>
                        </div>
                        <h2 ref={titleRef} style={{
                            fontSize: 'clamp(3rem, 5vw, 5rem)',
                            fontWeight: 900,
                            lineHeight: 0.85,
                            letterSpacing: '-0.04em',
                            margin: 0,
                            textTransform: 'uppercase',
                            color: '#000'
                        }}>
                            SIMBIOSIS
                        </h2>
                    </div>

                    {/* STATEMENT */}
                    <div style={{ maxWidth: '500px', textAlign: 'right', paddingBottom: '0.5rem' }}>
                        <h3 style={{
                            fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: '#000',
                            margin: '0 0 10px 0',
                            letterSpacing: '-0.02em'
                        }}>
                            ¿Tienes una Startup con tracción?
                        </h3>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(0.8rem, 1vw, 1rem)',
                            lineHeight: 1.5,
                            color: '#555',
                            margin: 0
                        }}>
                            Evaluamos fit técnico y equity en <strong style={{ color: '#000', fontWeight: 800 }}>48 horas.</strong><br />
                            Infraestructura, Talento y Capital listos para escalar.
                        </p>
                    </div>
                </div>

                {/* CARDS CONTAINER */}
                <div className="pillars-grid" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1.5vw',
                    flex: '1 1 auto',
                    minHeight: 0,
                    width: '100%',
                    overflow: 'visible'
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
                                /// 01_ALIANZA
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                SOCIOS DE<br />CÓDIGO
                            </h3>
                        </div>
                        {/* MEDIA */}
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: '300px' }}>
                                {chartAssets.pillar1 && <MediaPlayer src={chartAssets.pillar1.src} type={chartAssets.pillar1.type} />}
                            </div>
                        </div>
                        {/* FOOTER */}
                        <div style={{ padding: '1.5rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                CTO Fraccional & Dev Team.<br />
                                <span style={{ color: '#FFF' }}>MVP en 4 Semanas.</span>
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
                                /// 02_INFRAESTRUCTURA
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                ESCALABILIDAD<br />TOTAL
                            </h3>
                        </div>
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: '300px' }}>
                                {chartAssets.pillar2 && <MediaPlayer src={chartAssets.pillar2.src} type={chartAssets.pillar2.type} />}
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                AWS / Google Cloud Partners.<br />
                                <span style={{ color: '#FFF' }}>99.9% Uptime Garantizado.</span>
                            </p>
                        </div>
                    </div>

                    {/* CARD 3: INVERSIÓN */}
                    <div className="pillar-item" style={{
                        flex: '1 1 0px', minWidth: 0,
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00FF99', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 03_CAPITAL
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                ID PARA<br />INVERSIÓN
                            </h3>
                        </div>
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: '300px' }}>
                                {chartAssets.pillar3 && <MediaPlayer src={chartAssets.pillar3.src} type={chartAssets.pillar3.type} />}
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                Pitch Decks & Data Rooms.<br />
                                <span style={{ color: '#FFF' }}>Autoridad de Mercado.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    #simbiosis-startups {
                        height: auto !important;
                        overflow: visible !important;
                        padding: 50px 0 !important;
                    }
                    .pillars-grid {
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        padding: 0 5% !important;
                        gap: 2rem !important;
                    }
                    .pillar-item {
                        min-height: 70vh !important;
                        width: 100% !important;
                        max-width: 400px !important;
                        margin: 0 auto 1.5rem auto !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Symbiosis;
