import React, { useEffect, useRef, useState, memo } from 'react';
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
                objectFit: 'contain',
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

    // FIX: isMobile state controls layout via React (inline styles always win over CSS !important)
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth <= 800 : false
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 800);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
                // FIX CRITICO: height controlado por React state, no CSS !important
                height: isMobile ? 'auto' : '100vh',
                minHeight: isMobile ? 'auto' : undefined,
                backgroundColor: '#000000',
                color: '#FFFFFF',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 200,
                overflow: isMobile ? 'visible' : 'hidden',
                scrollSnapAlign: 'start',
                paddingBottom: isMobile ? '3rem' : undefined
            }}
        >
            {/* BACKGROUND SYSTEM */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: '#050505',
                zIndex: 1,
                overflow: 'hidden'
            }}>
                {/* DATA GRID - disabled on mobile for performance */}
                <div style={{
                    position: 'absolute', inset: -200,
                    backgroundImage: `linear-gradient(rgba(0, 255, 153, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 153, 0.4) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    opacity: 0.5,
                    animation: isMobile ? 'none' : 'grid-ascension 40s linear infinite'
                }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `linear-gradient(rgba(0, 255, 153, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 153, 1) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px',
                        mixBlendMode: 'screen',
                        maskImage: 'repeating-radial-gradient(circle at bottom left, transparent 0, transparent 10%, #000 10%, #000 11%, transparent 11%, transparent 20%)',
                        WebkitMaskImage: 'repeating-radial-gradient(circle at bottom left, transparent 0, transparent 10%, #000 10%, #000 11%, transparent 11%, transparent 20%)',
                        maskSize: '100% 100%',
                        WebkitMaskSize: '100% 100%',
                        maskPosition: 'bottom left',
                        WebkitMaskPosition: 'bottom left',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        animation: isMobile ? 'none' : 'pulse-expansion 4s steps(60) infinite linear',
                        willChange: 'mask-size',
                        pointerEvents: 'none'
                    }} />
                </div>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.9) 100%)'
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    opacity: 0.08,
                    mixBlendMode: 'overlay',
                }} />
            </div>

            <style>{`
                @keyframes grid-ascension {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(-60px, -60px); }
                }
                @keyframes pulse-expansion {
                    0% { mask-size: 0% 0%; -webkit-mask-size: 0% 0%; }
                    100% { mask-size: 300% 300%; -webkit-mask-size: 300% 300%; }
                }
            `}</style>

            {/* MAIN DASHBOARD */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '96%',
                width: '100%',
                margin: '0 auto',
                height: isMobile ? 'auto' : '100%',
                padding: isMobile ? '5rem 4% 2rem' : '2vh 2% 2vh',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isMobile ? 'flex-start' : 'space-between',
                gap: isMobile ? '2rem' : undefined
            }}>

                {/* HEADER */}
                <div style={{
                    marginBottom: isMobile ? '0' : '2vh',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '1vh'
                }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00FF99', marginBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span>/// SISTEMA_OPERATIVO_DE_CRECIMIENTO</span>
                        <span style={{ width: '40px', height: '1px', backgroundColor: '#00FF99' }}></span>
                    </div>

                    {/* TITLE + MANIFESTO ROW */}
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        alignItems: isMobile ? 'flex-start' : 'flex-end',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        {/* FIX: whiteSpace controlado por React state */}
                        <h2 ref={titleRef} style={{
                            fontSize: isMobile ? 'clamp(3rem, 12vw, 6rem)' : 'clamp(4rem, 13vw, 12rem)',
                            lineHeight: 0.85,
                            letterSpacing: '-0.06em',
                            margin: 0,
                            textTransform: 'uppercase',
                            color: '#FFF',
                            whiteSpace: isMobile ? 'normal' : 'nowrap',
                            flex: '1 1 auto'
                        }}>
                            <CinematicTitle text="SIMBIOSIS" stagger={0.06} />
                        </h2>

                        {/* FIX: flexShrink y minWidth controlados */}
                        <div className="manifesto-block" style={{
                            textAlign: isMobile ? 'left' : 'right',
                            maxWidth: isMobile ? '100%' : '350px',
                            minWidth: 0,
                            flexShrink: isMobile ? 1 : 0,
                            alignSelf: isMobile ? 'flex-start' : undefined,
                            marginTop: isMobile ? '0.5rem' : undefined
                        }}>
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
                {/* FIX: gap y flexDirection controlados por React state */}
                <div className="pillars-grid" style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '1.5rem' : '1.5vw',
                    flex: isMobile ? '0 0 auto' : '1 1 auto',
                    minHeight: 0,
                    width: '100%',
                    overflow: 'visible'
                }}>

                    {/* CARD 1 */}
                    <div className="pillar-item" style={{
                        flex: isMobile ? '0 0 auto' : '1 1 0px',
                        minWidth: 0,
                        height: isMobile ? '320px' : 'auto',
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: isMobile ? '1rem' : '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#FF40FF', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 01_ÉLITE
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
                                INGENIERÍA<br />DE ÉLITE
                            </h3>
                        </div>
                        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 0, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', minHeight: 0, flex: 1 }}>
                                {chartAssets.elite && <MediaPlayer src={chartAssets.elite.src} type={chartAssets.elite.type} />}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
                                CTO Fraccional & Dev Team.<br />
                                <span style={{ color: '#FFF' }}>De idea a mercado en 30 días. Sin excusas.</span>
                            </p>
                        </div>
                    </div>

                    {/* CARD 2 */}
                    <div className="pillar-item" style={{
                        flex: isMobile ? '0 0 auto' : '1 1 0px',
                        minWidth: 0,
                        height: isMobile ? '320px' : 'auto',
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: isMobile ? '1rem' : '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00f3ff', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 02_ESCALABILIDAD
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
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

                    {/* CARD 3 */}
                    <div className="pillar-item" style={{
                        flex: isMobile ? '0 0 auto' : '1 1 0px',
                        minWidth: 0,
                        height: isMobile ? '320px' : 'auto',
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        background: '#040404', borderRadius: '12px', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: isMobile ? '1rem' : '1.5rem', zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#00FF99', letterSpacing: '0.15em', fontWeight: 700, marginBottom: '5px' }}>
                                /// 03_DOMINIO
                            </div>
                            <h3 style={{ color: '#FFF', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.9 }}>
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
        </section>
    );
};

export default Symbiosis;
