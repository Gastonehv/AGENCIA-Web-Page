import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// OPTIMIZED VIDEO ASSETS
import videoPillar1 from '../assets/videos/Gráfica 01.mp4';
import videoPillar2 from '../assets/videos/Gráfica 02.mp4';
import videoPillar3 from '../assets/videos/Gráfica 03.mp4';

gsap.registerPlugin(ScrollTrigger);

const Symbiosis: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // VIDEO INFRASTRUCTURE (Toggle these to use video instead of SVG)
    const chartVideos = {
        pillar1: videoPillar1,
        pillar2: videoPillar2,
        pillar3: videoPillar3
    };

    useEffect(() => {
        const ctx = gsap.matchMedia();

        // === LIVING LOOPS SYSTEM ===
        const livingLoops: gsap.core.Tween[] = [];

        const startLoops = () => {
            const isMobileView = window.innerWidth < 800;

            // J-Curve Flow
            livingLoops.push(gsap.to('.chart-line-flow', { strokeDashoffset: -2000, duration: 4, repeat: -1, ease: "linear", force3D: true }));

            if (!isMobileView) {
                livingLoops.push(gsap.to('.chart-line-flow', { strokeWidth: 12, duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" }));
                livingLoops.push(gsap.to('.chart-dot-growth', { fill: "#ccff00", boxShadow: "0 0 50px #ccff00", scale: 1.6, duration: 0.6, repeat: -1, yoyo: true, ease: "power2.inOut" }));
            }

            // Traffic Bars Height Dance
            const barsTraffic = document.querySelectorAll('.chart-bar-traffic');
            barsTraffic.forEach((bar, i) => {
                const baseScale = 0.3 + (i / barsTraffic.length) * 0.7;
                livingLoops.push(gsap.to(bar, {
                    scaleY: `random(${baseScale * 0.8}, ${Math.min(baseScale * 1.2, 1)})`,
                    duration: "random(0.4, 0.8)", repeat: -1, yoyo: true, ease: "power1.inOut", delay: "random(0, 0.5)",
                    force3D: true
                }));
                if (!isMobileView) {
                    livingLoops.push(gsap.to(bar, { filter: "hue-rotate(30deg)", duration: 5, repeat: -1, yoyo: true, ease: "linear" }));
                }
            });

            // Funding Bars Loops
            livingLoops.push(gsap.fromTo('.chart-bar-fund-seed', { height: "15%" }, { height: "45%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", force3D: true }));
            livingLoops.push(gsap.fromTo('.chart-bar-fund-series', { height: "30%" }, { height: "75%", duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.2, force3D: true }));
            livingLoops.push(gsap.fromTo('.chart-bar-fund-unicorn', { height: "50%" }, { height: "100%", duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.4, force3D: true }));

            if (!isMobileView) {
                livingLoops.push(gsap.to('.unicorn-text', { color: "#ff00ff", scale: 1.3, duration: 0.8, repeat: -1, yoyo: true, ease: "steps(1)" }));
            }

            // Scanner
            livingLoops.push(gsap.fromTo('.chart-line-latency-scanner', { left: '-20%' }, { left: '120%', duration: 2, repeat: -1, ease: "power1.inOut", force3D: true }));
        };

        // PERFORMANCE CONTROL: Only run when visible
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 120%",
            end: "bottom -20%",
            onEnter: () => {
                if (livingLoops.length === 0) startLoops();
                else livingLoops.forEach(l => l.resume());
            },
            onLeave: () => livingLoops.forEach(l => l.pause()),
            onEnterBack: () => {
                if (livingLoops.length === 0) startLoops();
                else livingLoops.forEach(l => l.resume());
            },
            onLeaveBack: () => livingLoops.forEach(l => l.pause()),
            // Ensure loops start if already in view
            onRefresh: (self) => {
                if (self.isActive && livingLoops.length === 0) startLoops();
            }
        });

        // FORCE REFRESH AFTER MOUNT
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1000);

        return () => {
            clearTimeout(timer);
            livingLoops.forEach(l => l.kill());
            ctx.revert();
        };

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

            // === SYMBIOTIC HOVER ANIMATIONS ===
            const pillars = document.querySelectorAll('.pillar-item');
            pillars.forEach((pillar) => {
                pillar.addEventListener('mouseenter', () => {
                    gsap.to(pillar, {
                        scale: 1.02,
                        boxShadow: '0 30px 80px -10px rgba(0, 255, 153, 0.4), 0 0 40px rgba(0, 255, 153, 0.2)',
                        borderColor: 'rgba(0, 255, 153, 0.3)',
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });
                pillar.addEventListener('mouseleave', () => {
                    gsap.to(pillar, {
                        scale: 1,
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });
            });

            // === REVEALS ===
            // 1. J-Curve Reveal
            gsap.from('.chart-line-base', {
                scrollTrigger: { trigger: '.pillar-1', start: "top 90%", toggleActions: "play none none reset" },
                strokeDashoffset: 1000, duration: 2, ease: "power3.inOut"
            });
            gsap.from('.chart-dot-growth', {
                scrollTrigger: { trigger: '.pillar-1', start: "top 90%", toggleActions: "play none none reset" },
                scale: 0, opacity: 0, duration: 1, ease: "back.out(1.7)", delay: 0.5
            });

            // 2. Traffic Reveal
            gsap.from('.chart-bar-traffic', {
                scrollTrigger: { trigger: '.pillar-2', start: "top 80%", toggleActions: "play none none reset" },
                scaleY: 0, transformOrigin: 'bottom', stagger: 0.1, duration: 1.5, ease: "power2.out"
            });

            // 3. Funding Reveal
            gsap.from('.chart-bar-fund', {
                scrollTrigger: { trigger: '.pillar-3', start: "top 80%", toggleActions: "play none none reset" },
                height: 0, stagger: 0.3, duration: 2, ease: "power3.out"
            });

            // 4. Content Reveals
            gsap.from('.pillar-content', {
                scrollTrigger: { trigger: '.pillars-grid', start: "top 85%" },
                y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out"
            });

            // LIGHTWEIGHT DOT GRID DRIFT
            livingLoops.push(gsap.to('.dot-grid', {
                x: 32,
                y: 32,
                duration: 20,
                repeat: -1,
                ease: "linear",
                force3D: true
            }));
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
        });

        return () => {
            livingLoops.forEach(l => l.kill());
            ctx.revert();
        };
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
            {/* MINIMALIST DOT GRID (High Performance) */}
            <div className="dot-grid" style={{
                position: 'absolute', inset: '-100px', // Overbleed for drift
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
                backgroundSize: '32px 32px', opacity: 0.5, pointerEvents: 'none', zIndex: 4,
                willChange: 'transform'
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '8vh', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '3rem' }}>
                    <div>
                        {/* BLOCKBUSTER HEADLINE */}
                        <h3 style={{
                            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: '#000',
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em'
                        }}>
                            ¿TIENES UNA STARTUP?
                        </h3>
                        {/* SOFTENED SUB-HEADLINE */}
                        <p style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.9rem',
                            letterSpacing: '0.1em',
                            color: '#666',
                            margin: 0,
                            textTransform: 'uppercase'
                        }}>
                            /// SELECCIONAMOS POR POTENCIAL
                        </p>
                    </div>
                    <div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', lineHeight: 1.6, color: '#222', margin: '0 0 1.2rem 0' }}>
                            <strong style={{ color: '#000', fontWeight: 700 }}>Seleccionamos proyectos</strong> con tracción validada y fundadores serios. No buscamos <i>hype</i> ni unicornios de papel; priorizamos negocios sólidos que necesitan arquitectura digital absoluta para escalar.
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', lineHeight: 1.6, color: '#444', margin: 0 }}>
                            Si tu negocio crece, nosotros crecemos. <strong style={{ color: '#000', fontWeight: 600 }}>Esa alineación nos obliga a entregar excelencia técnica</strong>. No somos un vendor; somos tus socios de ingeniería.
                        </p>
                    </div>
                </div>

                {/* GRAPHICAL PILLARS GRID */}
                <div className="pillars-grid" style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '8vh'
                }}>

                    {/* --- PILLAR 1: EQUITY (J-CURVE) --- */}
                    <div className="pillar-item pillar-1" style={{
                        position: 'relative', minHeight: '450px', background: '#040404',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={chartGridStyle} />

                        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', opacity: 1, zIndex: 1, marginTop: '1rem', overflow: 'hidden', borderRadius: '12px' }}>
                            {chartVideos.pillar1 ? (
                                <video src={chartVideos.pillar1} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                        <defs>
                                            <linearGradient id="hyperGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ff0080" />
                                                <stop offset="50%" stopColor="#7928ca" />
                                                <stop offset="100%" stopColor="#00FF99" />
                                            </linearGradient>
                                        </defs>
                                        <path className="chart-line-base" d="M0,200 C100,200 250,180 350,50"
                                            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" strokeLinecap="round" />
                                        <path className="chart-line-flow" d="M0,200 C100,200 250,180 350,50"
                                            fill="none" stroke="url(#hyperGradient)" strokeWidth="10"
                                            strokeDasharray="100 200" strokeLinecap="round" />
                                        <circle className="chart-dot-growth" cx="350" cy="50" r="14" fill="#00FF99" stroke="#fff" strokeWidth="4" />
                                    </svg>
                                    <div style={{ position: 'absolute', top: '10%', right: '10%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00FF99', fontWeight: 800, background: '#000', padding: '0.2rem 0.6rem', borderRadius: '2px', border: '1px solid #333' }}>10X RETURNS</div>
                                </>
                            )}
                        </div>
                        <div className="pillar-content" style={{ marginTop: 'auto', zIndex: 2 }}>
                            <div style={{ marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#FF40FF', letterSpacing: '0.1em' }}>/// ALIANZA_ESTRATÉGICA</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.8rem 0', color: '#FFF' }}>Socios por Capital</h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#AAA' }}>Impacto: MVP en 4 Semanas · Cero Deuda Técnica</p>
                        </div>
                    </div>


                    {/* --- PILLAR 2: INFRA (STABILITY) --- */}
                    <div className="pillar-item pillar-2" style={{
                        position: 'relative', minHeight: '450px', background: '#040404',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={chartGridStyle} />

                        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', opacity: 1, zIndex: 1, marginTop: '1rem', overflow: 'hidden', borderRadius: '12px' }}>
                            {chartVideos.pillar2 ? (
                                <video src={chartVideos.pillar2} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px' }}>
                                    {[15, 25, 30, 45, 40, 60, 55, 75, 85, 100].map((h, i) => (
                                        <div key={i} className="chart-bar-traffic" style={{
                                            width: '8%', height: `${h}%`,
                                            background: `linear-gradient(to top, #00f3ff, #7000ff)`,
                                            borderRadius: '2px 2px 0 0',
                                            boxShadow: '0 0 10px rgba(112,0,255,0.4)',
                                            willChange: 'transform'
                                        }} />
                                    ))}
                                    <div style={{ position: 'absolute', bottom: '15%', left: 0, width: '100%', height: '4px', overflow: 'hidden', borderRadius: '2px' }}>
                                        <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)' }} />
                                        <div className="chart-line-latency-scanner" style={{ position: 'absolute', top: 0, left: '-20%', width: '20%', height: '100%', background: '#fff', boxShadow: '0 0 20px #fff' }} />
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '25%', right: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#00f3ff', fontWeight: 800, background: '#000', padding: '0.2rem 0.6rem', borderRadius: '2px', border: '1px solid #333' }}>LATENCY: 9ms</div>
                                </div>
                            )}
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
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6)', padding: '2rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <div style={chartGridStyle} />

                        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', opacity: 1, zIndex: 1, marginTop: '1rem', overflow: 'hidden', borderRadius: '12px' }}>
                            {chartVideos.pillar3 ? (
                                <video src={chartVideos.pillar3} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
                                    <div className="chart-bar-fund chart-bar-fund-seed" style={{ width: '30%', height: '35%', background: '#00f3ff', boxShadow: '0 0 20px rgba(0,243,255,0.4)', position: 'relative', willChange: 'height' }}>
                                        <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#FFF' }}>MVP</div>
                                    </div>
                                    <div className="chart-bar-fund chart-bar-fund-series" style={{ width: '30%', height: '65%', background: '#7000ff', boxShadow: '0 0 20px rgba(112,0,255,0.4)', position: 'relative', willChange: 'height' }}>
                                        <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#FFF' }}>PMF</div>
                                    </div>
                                    <div className="chart-bar-fund chart-bar-fund-unicorn unicorn-bar" style={{ width: '30%', height: '100%', background: 'linear-gradient(180deg, #00FF99 0%, #004411 100%)', position: 'relative', willChange: 'height' }}>
                                        <div className="unicorn-text" style={{ position: 'absolute', top: '-30px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00FF99', fontWeight: 700 }}>DOMINANCE</div>
                                        <div style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#000', fontWeight: 800 }}>SCALE</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pillar-content" style={{ marginTop: 'auto', zIndex: 2 }}>
                            <div style={{ marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#00FF99', letterSpacing: '0.1em' }}>/// DISEÑO_DE_CAPITAL</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.8rem 0', color: '#FFF' }}>ID para inversión</h3>
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
