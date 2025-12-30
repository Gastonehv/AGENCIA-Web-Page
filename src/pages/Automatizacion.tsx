import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import crystalVideo from '../assets/videos/cristal.mp4';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

gsap.registerPlugin(ScrollTrigger);

const Automatizacion: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const actionBtnRef = useRef<HTMLAnchorElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

    useEffect(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        video.src = crystalVideo;
        video.muted = true;
        video.loop = true;
        video.play().catch(() => { });

    }, []);

    // MAGNETIC BUTTON EFFECT
    useEffect(() => {
        const el = actionBtnRef.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(x * x + y * y);

            if (distance < 300) {
                gsap.to(el, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.6,
                    ease: "power2.out"
                });
            } else {
                gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} style={{ background: '#000', color: '#FFF', position: 'relative' }}>
            <SEO title="Automatización & Plataforma 360" description="Eficiencia imposible para humanos. Ecosistema de gestión total y agentes autónomos." />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Automatización",
                "description": "Sistemas de gestión empresarial 360 y agentes de IA autónomos."
            }} />

            {/* HERO / VIDEO BACKGROUND */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }}>
                <motion.video
                    ref={videoRef}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, scale }}
                    playsInline
                    autoPlay
                    muted
                    loop
                />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }} />
            </div>

            {/* CONTENT SECTIONS */}
            <div style={{ position: 'relative', zIndex: 1 }}>

                {/* SECTION 1: ESTATUTO */}
                <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10vw' }}>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        style={{ color: '#00FF99', fontFamily: 'var(--font-mono)', letterSpacing: '0.4em', marginBottom: '1rem' }}
                    >
                        [ LIBERTAD OPERATIVA ]
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(3rem, 10vw, 8rem)',
                            fontWeight: 900,
                            lineHeight: 1.05, // Increased from 0.8
                            textTransform: 'uppercase',
                            wordSpacing: '0.15em', // Added for editorial breathing
                            letterSpacing: '-0.02em'
                        }}
                    >
                        TU TIEMPO ES<br />EL ACTIVO MÁS<br />CARO
                    </motion.h1>
                </section>

                {/* SECTION 2: CONTROL TOTAL */}
                <section style={{ minHeight: '100vh', padding: '10vh 10vw', display: 'flex', gap: '5vw', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#00FF99', marginBottom: '2rem' }}>CONTROL TOTAL</h2>
                        <p style={{ fontSize: '1.5rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', maxWidth: '600px' }}>
                            Implementamos el cerebro central de tu negocio. Una arquitectura que unifica ventas, atención y operaciones en un ecosistema que no depende de la memoria humana.
                            <strong> Escala tu empresa, no tu carga de trabajo.</strong>
                        </p>
                    </div>
                    <div style={{ flex: 1, height: '60vh', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#00FF99', opacity: 0.5 }}>[ INTERFACE_ACTIVE ]</div>
                        {/* Here goes a 3D symbol or graphic later */}
                    </div>
                </section>

                {/* SECTION 3: FUERZA DE VENTA INAGOTABLE */}
                <section style={{ minHeight: '100vh', padding: '10vh 10vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ maxWidth: '900px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', fontWeight: 900, marginBottom: '2rem' }}>FUERZA DE VENTA<br /><span style={{ color: 'transparent', WebkitTextStroke: '1px #00FF99' }}>INAGOTABLE</span></h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <div style={{ padding: '2rem', background: 'rgba(0,255,153,0.03)', borderLeft: '2px solid #00FF99' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '1rem' }}>ASESORES 24/7</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Sistemas que califican, atienden y cierran tratos mientras tú te enfocas en la estrategia de alto nivel.</p>
                            </div>
                            <div style={{ padding: '2rem', background: 'rgba(0,255,153,0.03)', borderLeft: '2px solid #00FF99' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginBottom: '1rem' }}>PROCESOS AUTÓNOMOS</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Eliminamos el error humano. Tus flujos administrativos se ejecutan solos, con precisión quirúrgica y reportes en tiempo real.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: CONSOLIDATION & CTA */}
                <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 300, marginBottom: '2rem' }}>
                        TU NEGOCIO NO DUERME.<br />
                        <strong>TÚ SÍ.</strong>
                    </h2>

                    <div style={{ marginTop: '4rem' }}>
                        <a
                            ref={actionBtnRef}
                            href="/#case-03"
                            className="super-cta-button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1.8rem 5rem',
                                background: '#000',
                                border: '1px solid rgba(0, 255, 153, 0.4)',
                                borderRadius: '4px',
                                color: '#00FF99',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1rem',
                                fontWeight: 900,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                boxShadow: '0 0 30px rgba(0, 255, 153, 0.1)',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                            }}
                        >
                            <div className="cta-scanline" />
                            <div className="cta-glow" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                                <span>LIBERAR POTENCIAL OPERATIVO</span>
                                <span style={{ fontSize: '1.2rem', animation: 'arrowPulse 1.2s infinite ease-in-out' }}>→</span>
                            </div>
                        </a>
                    </div>
                </section>
            </div>

            <style>{`
                .super-cta-button:hover {
                    border-color: #00FF99 !important;
                    box-shadow: 0 0 50px rgba(0, 255, 153, 0.4) !important;
                }
                .cta-scanline {
                    position: absolute;
                    top: -100%;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, rgba(0, 255, 153, 0.2), transparent);
                    animation: scan 3s infinite linear;
                }
                .cta-glow {
                    position: absolute;
                    inset: 0;
                    box-shadow: inset 0 0 30px rgba(0, 255, 153, 0.2);
                    animation: breathe 4s infinite ease-in-out;
                }
                @keyframes scan {
                    0% { top: -100%; }
                    100% { top: 100%; }
                }
                @keyframes breathe {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
                @keyframes arrowPulse {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(10px); }
                }
            `}</style>

            {/* SPACER FOR FOOTER FADE */}
            <div style={{ height: '30vh' }} />
        </div>
    );
};

export default Automatizacion;
