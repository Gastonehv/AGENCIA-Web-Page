import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Symbiosis: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // MATCH MEDIA FOR PERFORMANCE
        const ctx = gsap.matchMedia();

        // 1. DESKTOP HIGH-END ANIMATIONS (> 800px)
        ctx.add("(min-width: 800px)", () => {
            // TITLE REVEAL
            if (titleRef.current) {
                const chars = titleRef.current.querySelectorAll('.char');
                gsap.from(chars, {
                    scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
                    opacity: 0, y: 60, filter: "blur(20px)", duration: 1.4, stagger: 0.025, ease: "power4.out"
                });
            }

            // === J-CURVE (Growth) ===
            gsap.killTweensOf('.chart-line-base');
            gsap.killTweensOf('.chart-line-flow');
            gsap.killTweensOf('.chart-dot-growth');

            const tlCurve = gsap.timeline({
                scrollTrigger: {
                    trigger: '.pillar-1', start: "top 60%", toggleActions: "play none none reset"
                }
            });
            tlCurve.from('.chart-line-base', { strokeDashoffset: 1000, duration: 4, ease: "power2.out" })
                .from('.chart-dot-growth', { scale: 0, opacity: 0, duration: 1, ease: "back.out(2)" }, "-=1")
                .add(() => {
                    gsap.to('.chart-line-flow', { strokeDashoffset: -2000, duration: 4, repeat: -1, ease: "linear" });
                    gsap.to('.chart-line-flow', { strokeWidth: 10, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
                    gsap.to('.chart-dot-growth', { fill: "#ccff00", boxShadow: "0 0 50px #ccff00", scale: 1.5, duration: 0.4, repeat: -1, yoyo: true, ease: "power2.in" });
                });


            // === TRAFFIC (Stability) ===
            gsap.killTweensOf('.chart-bar-traffic');
            gsap.from('.chart-bar-traffic', {
                scrollTrigger: { trigger: '.pillar-2', start: "top 60%", toggleActions: "play none none reset" },
                scaleY: 0, transformOrigin: 'bottom', stagger: 0.2, duration: 3, ease: "power2.out",
                onStart: () => { gsap.set('.chart-bar-traffic', { filter: "hue-rotate(0deg)" }); },
                onComplete: () => {
                    const bars = document.querySelectorAll('.chart-bar-traffic');
                    bars.forEach((bar, i) => {
                        gsap.killTweensOf(bar);
                        const baseScale = 0.3 + (i / bars.length) * 0.7;
                        gsap.to(bar, {
                            scaleY: `random(${baseScale * 0.8}, ${Math.min(baseScale * 1.2, 1)})`,
                            duration: "random(0.4, 0.8)", repeat: -1, yoyo: true, ease: "power1.inOut", delay: "random(0, 0.5)"
                        });
                        // EXPENSIVE: Hue Rotate only on Desktop
                        gsap.to(bar, { filter: "hue-rotate(360deg)", duration: 5, repeat: -1, ease: "linear" });
                    });
                }
            });

            gsap.killTweensOf('.chart-line-latency-scanner');
            gsap.fromTo('.chart-line-latency-scanner', { left: '-20%' }, { left: '120%', duration: 2, repeat: -1, ease: "power1.inOut" });


            // === FUNDING (Identity) ===
            gsap.killTweensOf('.chart-bar-fund');
            gsap.from('.chart-bar-fund', {
                scrollTrigger: { trigger: '.pillar-3', start: "top 60%", toggleActions: "play none none reset" },
                height: 0, stagger: 0.6, duration: 3.5, ease: "power3.out",
                onComplete: () => {
                    gsap.fromTo('.chart-bar-fund-seed', { height: "15%" }, { height: "45%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
                    gsap.fromTo('.chart-bar-fund-series', { height: "30%" }, { height: "75%", duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });
                    gsap.fromTo('.chart-bar-fund-unicorn', { height: "50%" }, { height: "100%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });

                    gsap.to('.unicorn-text', { color: "#ff00ff", scale: 1.3, duration: 0.8, repeat: -1, yoyo: true, ease: "steps(1)" });
                }
            });

            // TEXT REVEALS
            gsap.from('.pillar-content', {
                scrollTrigger: { trigger: '.pillars-grid', start: "top 65%" },
                y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
            });

            // LIVING TEXTURES
            gsap.to('.dot-grid', { x: 150, y: 80, duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.to('.noise-texture', { rotation: 360, duration: 120, repeat: -1, ease: "none" }); // Rotating noise is fine on desktop
            gsap.to('.gradient-mesh', { opacity: 0.85, scale: 1.35, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });


        // 2. MOBILE OPTIMIZED ANIMATIONS (< 800px)
        ctx.add("(max-width: 799px)", () => {
            // Simple Fade In Title
            gsap.from(titleRef.current, {
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
                opacity: 0, y: 30, duration: 1, ease: "power2.out"
            });

            // Simple Entry for Pillars (No complex staggers)
            gsap.from('.pillar-item', {
                scrollTrigger: { trigger: '.pillars-grid', start: "top 80%" },
                y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
            });

            // === J-CURVE (Mobile) ===
            // Just loop the dashoffset efficiently, no pulsing stroke width
            gsap.to('.chart-line-flow', { strokeDashoffset: -2000, duration: 6, repeat: -1, ease: "linear" }); // Slower for less repaint
            gsap.to('.chart-dot-growth', { scale: 1.2, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" }); // Simple scale

            // === TRAFFIC (Mobile) ===
            // NO hue-rotate, just height dance
            const bars = document.querySelectorAll('.chart-bar-traffic');
            bars.forEach((bar, i) => {
                const baseScale = 0.3 + (i / bars.length) * 0.7;
                gsap.to(bar, {
                    scaleY: `random(${baseScale * 0.9}, ${Math.min(baseScale * 1.1, 1)})`, // Reduced movement range
                    duration: "random(0.8, 1.2)", // Slower movement
                    repeat: -1, yoyo: true, ease: "power1.inOut", delay: "random(0, 0.5)"
                });
            });
            // Scanner
            gsap.fromTo('.chart-line-latency-scanner', { left: '-20%' }, { left: '120%', duration: 3, repeat: -1, ease: "power1.inOut" });

            // === FUNDING (Mobile) ===
            // Simple loops using fromTo for valid syntax
            gsap.fromTo('.chart-bar-fund-seed', { height: "15%" }, { height: "45%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
            gsap.fromTo('.chart-bar-fund-series', { height: "30%" }, { height: "75%", duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2 });
            gsap.fromTo('.chart-bar-fund-unicorn', { height: "50%" }, { height: "100%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4 });
            gsap.to('.unicorn-text', { color: "#ff00ff", scale: 1.1, duration: 1, repeat: -1, yoyo: true, ease: "steps(1)" }); // Less scale

            // No texture rotation or grid movement on mobile to save CPU
        });

        return () => ctx.revert();
    }, []);

    // Reusable Grid Background Style
    const chartGridStyle: React.CSSProperties = {
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6, // Increased from 0.3
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
        `, // Increased line alpha from 0.05 to 0.15
        backgroundSize: '20px 20px',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 100%)'
    };

    return (
        <section
            ref={sectionRef}
            id="simbiosis-startups"
            style={{
                minHeight: '100vh', // Reduced min-height for mobile
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 25%, #E2E8F0 50%, #F5F7FA 75%, #FFFFFF 100%)',
                position: 'relative',
                padding: '10vh 5% 15vh', // Tighter padding
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                zIndex: 200, overflow: 'hidden'
            }}
        >
            {/* NOISE - Static on mobile via CSS if possible, but JS stops rotation anyway */}
            <div className="noise-texture" style={{
                position: 'absolute', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%', width: '200%', height: '200%',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                opacity: 0.4, pointerEvents: 'none', zIndex: 5, mixBlendMode: 'multiply'
            }} />
            <div className="dot-grid" style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.4) 1.5px, transparent 1.5px)',
                backgroundSize: '32px 32px', opacity: 0.8, pointerEvents: 'none', zIndex: 4
            }} />
            <div className="gradient-mesh" style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(200,210,230,0.3) 30%, rgba(180,190,210,0.3) 70%, rgba(255,255,255,0) 100%)`,
                filter: 'blur(80px)', opacity: 0.6, zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1600px', width: '100%', margin: '0 auto' }}>

                {/* HEADER */}
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.12)', width: '60px' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>
                        ACELERADORA_DE_STARTUPS
                    </span>
                </div>
                <h2 ref={titleRef} style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em', margin: '0 0 4vh 0', textTransform: 'uppercase', color: '#000', wordBreak: 'break-word' }}>
                    {/* Simplified character splitting for React safety if needed, but existing is fine */}
                    {Array.from("SIMBIOSIS").map((char, i) => (
                        <span key={i} className="char" style={{ display: 'inline-block' }}>{char}</span>
                    ))}
                </h2>

                {/* INTRO */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '8vh', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '3rem' }}>
                    <div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.35)', marginBottom: '1rem', textTransform: 'uppercase' }}>[ Modelo de Selección ]</p>
                        <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.2, color: '#000', margin: 0 }}>No aceptamos cualquier proyecto.</h3>
                    </div>
                    <div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', lineHeight: 1.6, color: '#222', margin: '0 0 1.2rem 0' }}>
                            <strong style={{ color: '#000', fontWeight: 700 }}>Seleccionamos startups</strong> con tracción validada, founders ejecutores y mercados con potencial 10x. Tomamos equity como compensación, no fees tradicionales.
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', lineHeight: 1.6, color: '#444', margin: 0 }}>
                            Si tu negocio crece, nosotros crecemos. Si fallas, perdemos. <strong style={{ color: '#000', fontWeight: 600 }}>Esa alineación nos obliga a entregar excelencia técnica</strong>, no somos un vendor que cobra y desaparece.
                        </p>
                    </div>
                </div>

                {/* GRAPHICAL PILLARS GRID */}
                <div className="pillars-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '8vh'
                }}>

                    {/* --- PILLAR 1: EQUITY (J-CURVE) --- */}
                    <div className="pillar-item pillar-1" style={{
                        position: 'relative', minHeight: '450px', background: '#040404',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden'
                    }}>
                        <div style={chartGridStyle} />

                        <div style={{ position: 'absolute', top: '15%', left: '0', right: '0', height: '50%', opacity: 1, zIndex: 1 }}>
                            <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="hyperGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ff0080" />
                                        <stop offset="50%" stopColor="#7928ca" />
                                        <stop offset="100%" stopColor="#00FF99" />
                                    </linearGradient>
                                </defs>
                                <path className="chart-line-base" d="M0,200 C100,200 250,180 350,50"
                                    fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
                                <path className="chart-line-flow" d="M0,200 C100,200 250,180 350,50"
                                    fill="none" stroke="url(#hyperGradient)" strokeWidth="8"
                                    strokeDasharray="100 200" strokeLinecap="round" />
                                <circle className="chart-dot-growth" cx="350" cy="50" r="12" fill="#00FF99" stroke="#fff" strokeWidth="3" />
                            </svg>
                            <div style={{ position: 'absolute', top: '10%', right: '10%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00FF99', fontWeight: 800, background: '#000', padding: '0.2rem 0.6rem', borderRadius: '2px', border: '1px solid #333' }}>10X RETURNS</div>
                        </div>
                        <div className="pillar-content" style={{ marginTop: 'auto', zIndex: 2 }}>
                            <div style={{ marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#ff0080', letterSpacing: '0.1em' }}>/// ALIANZA_ESTRATÉGICA</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.8rem 0', color: '#FFF' }}>Socios por Capital</h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#AAA' }}>Impacto: MVP en 4 Semanas · Cero Deuda Técnica</p>
                        </div>
                    </div>


                    {/* --- PILLAR 2: INFRA (STABILITY) --- */}
                    <div className="pillar-item pillar-2" style={{
                        position: 'relative', minHeight: '450px', background: '#040404',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden'
                    }}>
                        <div style={chartGridStyle} />

                        <div style={{ position: 'absolute', top: '20%', left: '10%', right: '10%', height: '40%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px', zIndex: 1 }}>
                            {[15, 25, 30, 45, 40, 60, 55, 75, 85, 100].map((h, i) => (
                                <div key={i} className="chart-bar-traffic" style={{
                                    width: '8%', height: `${h}%`,
                                    background: `linear-gradient(to top, #00f3ff, #7000ff)`,
                                    borderRadius: '2px 2px 0 0',
                                    boxShadow: '0 0 10px rgba(112,0,255,0.4)'
                                }} />
                            ))}

                            <div style={{ position: 'absolute', bottom: '15%', left: 0, width: '100%', height: '4px', overflow: 'hidden', borderRadius: '2px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)' }} />
                                <div className="chart-line-latency-scanner" style={{ position: 'absolute', top: 0, left: '-20%', width: '20%', height: '100%', background: '#fff', boxShadow: '0 0 20px #fff' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '25%', right: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00f3ff', fontWeight: 800, background: '#000', padding: '0.2rem 0.6rem', borderRadius: '2px', border: '1px solid #333' }}>LATENCY: 12ms</div>
                        </div>
                        <div className="pillar-content" style={{ marginTop: 'auto', zIndex: 2 }}>
                            <div style={{ marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00f3ff', letterSpacing: '0.1em' }}>/// INFRAESTRUCTURA_GLOBAL</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.8rem 0', color: '#FFF' }}>Escalabilidad Día Uno</h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#AAA' }}>Performance: 99.9% Uptime · Seguridad Bancaria</p>
                        </div>
                    </div>


                    {/* --- PILLAR 3: IDENTITY (FUNDING) --- */}
                    <div className="pillar-item pillar-3" style={{
                        position: 'relative', minHeight: '450px', background: '#040404',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden'
                    }}>
                        <div style={chartGridStyle} />

                        <div style={{ position: 'absolute', top: '10%', left: '15%', right: '15%', height: '50%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', zIndex: 1 }}>
                            <div className="chart-bar-fund chart-bar-fund-seed" style={{ width: '30%', height: '35%', background: '#00aaff', boxShadow: '0 0 20px rgba(0,170,255,0.4)', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#FFF' }}>SEED</div>
                            </div>
                            <div className="chart-bar-fund chart-bar-fund-series" style={{ width: '30%', height: '65%', background: '#aa00ff', boxShadow: '0 0 20px rgba(170,0,255,0.4)', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#FFF' }}>SERIES A</div>
                            </div>
                            <div className="chart-bar-fund chart-bar-fund-unicorn unicorn-bar" style={{ width: '30%', height: '90%', background: 'linear-gradient(180deg, #00FF99 0%, #004411 100%)', position: 'relative' }}>
                                <div className="unicorn-text" style={{ position: 'absolute', top: '-30px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00FF99', fontWeight: 700 }}>UNICORN</div>
                            </div>
                        </div>
                        <div className="pillar-content" style={{ marginTop: 'auto', zIndex: 2 }}>
                            <div style={{ marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00FF99', letterSpacing: '0.1em' }}>/// DISEÑO_DE_CAPITAL</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.8rem 0', color: '#FFF' }}>Identidad para Inversión</h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#AAA' }}>Valor: Investor-Ready · Autoridad de Mercado</p>
                        </div>
                    </div>

                </div>

                {/* CTA SECTION */}
                <div style={{ textAlign: 'center', paddingTop: '6vh', borderTop: '1px solid rgba(0,0,0,0.08)', maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 800, color: '#000', marginBottom: '1rem', letterSpacing: '-0.01em' }}>¿Tu startup califica?</h3>
                    <p style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', lineHeight: 1.7, color: '#444', fontFamily: 'var(--font-body)', margin: 0 }}>
                        Si tienes tracción validada (revenue recurrente, usuarios activos medibles, o funding secured), hablemos. <strong style={{ color: '#000', fontWeight: 600 }}>Evaluamos fit técnico y equity structure en 48 horas.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Symbiosis;
