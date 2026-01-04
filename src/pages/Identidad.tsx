import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import genesisVideo from '../assets/videos/zapatilla-agencia.mp4';
import serviceBrutalismImage from '../assets/images/service_brutalism.png';
import genesisDnaImage from '../assets/images/genesis-dna-v2.jpg';
import sintesisAgenciaImage from '../assets/images/sintesis-agencia-v2.jpg';
import CinematicDrinkHero from '../components/hero/CinematicDrinkHero';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';


gsap.registerPlugin(ScrollTrigger);

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update(mouse: { x: number, y: number }, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseDistance = 200;

        if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * this.size;
            const directionY = forceDirectionY * force * this.size;

            this.x -= directionX * 0.5;
            this.y -= directionY * 0.5;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }
}

const Identidad: React.FC = () => {
    const actionBtnRef = useRef<HTMLAnchorElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeCard, setActiveCard] = useState<number | null>(null);
    const [activePanel, setActivePanel] = useState<number>(0);

    // Force scroll to top on mount
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Supreme Neural Network Canvas Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = width < 768 ? 50 : 100;
        const connectionDistance = 150;

        const mouse = { x: -1000, y: -1000 };

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(width, height));
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(mouse, width, height);
                p.draw(ctx);
            });

            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 42, 109, ${1 - distance / connectionDistance})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Hero & Scroll Animations
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from('.hero-title', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.2
            })
                .from('.hero-subtitle', {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, '-=1');

            // Parallax for Sneaker Video
            gsap.to('.sneaker-bg', {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                yPercent: 30,
                scale: 1.1
            });

            // DNA Strip Animation (Marquee)
            gsap.to('.dna-track', {
                xPercent: -50,
                ease: 'none',
                duration: 20,
                repeat: -1
            });

            // Manifesto Reveal
            gsap.from('.manifesto-text', {
                scrollTrigger: {
                    trigger: '.manifesto-section',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Cards Animation
            gsap.fromTo('.service-card',
                {
                    y: 100,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: '.services-grid',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power4.out'
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        // Animate content based on activePanel
        const panels = document.querySelectorAll('.triptych-panel');
        panels.forEach((p, index) => {
            if (index === activePanel) {
                gsap.to(p.querySelectorAll('.panel-content'), { opacity: 1, y: 0, duration: 0.4, delay: 0.2, overwrite: true });
                gsap.to(p, { borderColor: '#ff2a6d', boxShadow: '0 0 30px rgba(255, 42, 109, 0.1)', overwrite: true });
                gsap.to(p.querySelectorAll('.vertical-title'), { opacity: 0, duration: 0.2, overwrite: true });
                gsap.to(p.querySelector('.panel-bg-image'), { opacity: 0.4, duration: 0.5, overwrite: true });
            } else {
                gsap.to(p.querySelectorAll('.panel-content'), { opacity: 0, y: 20, duration: 0.3, overwrite: true });
                gsap.to(p, { borderColor: 'rgba(255,255,255,0.05)', boxShadow: 'none', overwrite: true });
                gsap.to(p.querySelectorAll('.vertical-title'), { opacity: 1, duration: 0.3, delay: 0.2, overwrite: true });
                gsap.to(p.querySelector('.panel-bg-image'), { opacity: 0, duration: 0.5, overwrite: true });
            }
        });
    }, [activePanel]);

    const services = [
        {
            id: 1,
            title: 'AUTORIDAD VISUAL',
            desc: 'La autoridad es la única moneda que no se devalúa.',
            longDesc: 'Diseñamos identidades que imponen respeto instantáneo. No competimos por precio; posicionamos tu marca en un nivel donde la calidad es el único argumento necesario para cerrar el trato.',
            baseOpacity: 0.1
        },
        {
            id: 2,
            title: 'MARKET DOMINANCE',
            desc: 'Verse como el líder absoluto es el primer paso para serlo.',
            longDesc: 'Utilizamos tecnología de alta fidelidad y narrativa visual para que tu mensaje no solo se escuche, sino que domine. Creamos ecosistemas visuales que proyectan poder y solvencia técnica.',
            baseOpacity: 0.15
        },
        {
            id: 3,
            title: 'SELLO DE VALOR',
            desc: 'Resultados maestros para negocios que no aceptan mediocridad.',
            longDesc: 'Tu presencia debe ser una declaración de intenciones. Forjamos marcas robustas que respiran éxito, asegurando que cada interacción del cliente sea un paso hacia la conversión de alto valor.',
            baseOpacity: 0.2
        },
    ];

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
        <div ref={containerRef} style={{
            minHeight: '100vh',
            background: '#000',
            color: '#fff',
            position: 'relative'
        }}>
            <SEO
                title="Autoridad de Mercado & Branding de Lujo"
                description="Diseñamos marcas que imponen respeto. Sistemas de autoridad visual y experiencias de usuario que cierran tratos."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Identidad Visual",
                "provider": {
                    "@type": "Organization",
                    "name": "AgencIA"
                },
                "description": "Creación de identidades dinámicas utilizando WebGL y animaciones de alto nivel."
            }} />
            {/* Hero Section */}
            <section className="hero-section" style={{
                minHeight: '100vh', // Changed from height to minHeight for small screens
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '6rem 0' // Added padding for vertical centering safety
            }}>
                {/* Background Video */}
                < div className="sneaker-bg" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '120%', // Taller for parallax
                    zIndex: 0,
                    opacity: 0.6
                }}>
                    <video
                        src={genesisVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div >

                {/* Overlay Gradient */}
                < div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                    zIndex: 1
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    maxWidth: '1200px',
                    padding: '0 5%'
                }}>
                    <h1 className="hero-title" style={{
                        fontSize: 'clamp(4rem, 10vw, 8rem)',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 800,
                        lineHeight: 0.9,
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        color: '#ff2a6d', // Neon Red
                        textShadow: '0 0 30px rgba(255, 42, 109, 0.5)'
                    }}>
                        IDENTIDAD
                    </h1>
                    <p className="hero-subtitle" style={{
                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                        fontFamily: 'var(--font-body)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: 1.4,
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    }}>
                        No creamos marcas. Diseñamos objetos de deseo.
                        <br />
                        <span style={{ opacity: 0.7, fontSize: '0.9em' }}>Identidad / Estrategia / Culto</span>
                    </p>
                </div>
            </section >

            {/* Manifesto Section */}
            < section className="manifesto-section" style={{
                padding: '8rem 5%',
                background: '#050505',
                textAlign: 'center',
                position: 'relative',
                zIndex: 5
            }}>
                <p className="manifesto-text" style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    maxWidth: '1000px',
                    margin: '0 auto',
                    background: 'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.05em'
                }}>
                    "No vendemos productos. <br />
                    <span style={{ color: '#ff2a6d', WebkitTextFillColor: '#ff2a6d', letterSpacing: '0.05em' }}>Codificamos estatus.</span>"
                </p>
            </section >

            {/* DNA Strip (Marquee) */}
            < div style={{
                background: '#ff2a6d',
                color: '#000',
                padding: '1rem 0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                position: 'relative',
                zIndex: 5,
                transform: 'rotate(-2deg) scale(1.05)',
                marginBottom: '2rem'
            }}>
                <div className="dna-track" style={{ display: 'inline-block' }}>
                    {Array(10).fill('ESTRATEGIA // DISEÑO // CULTO // IA // ').map((text, i) => (
                        <span key={i} style={{
                            fontSize: '1.5rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            marginRight: '2rem',
                            letterSpacing: '0.1em'
                        }}>{text}</span>
                    ))}
                </div>
            </div >

            {/* Services Section */}
            < section style={{
                padding: '5rem 5%',
                background: '#050505',
                position: 'relative',
                zIndex: 5
            }}>
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '4rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#fff',
                    textShadow: '0 0 20px rgba(255, 42, 109, 0.5)'
                }}>PROTOCOLOS DE DOMINIO</h2>

                <div className="services-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    {services.map((service) => (
                        <div key={service.id} className={`service-card ${activeCard === service.id ? 'active' : ''}`} style={{
                            padding: '3rem',
                            // Dark Glass Aesthetics
                            background: activeCard === service.id
                                ? 'rgba(10, 10, 10, 0.95)' // Solid dark when active
                                : 'rgba(20, 20, 20, 0.6)', // Semi-transparent dark when inactive
                            border: activeCard === service.id ? '1px solid #ff2a6d' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px', // Slight tech radius
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: activeCard === service.id
                                ? '0 0 50px rgba(255, 42, 109, 0.2), inset 0 0 20px rgba(255, 42, 109, 0.1)'
                                : 'none',
                            cursor: 'pointer',
                            height: activeCard === service.id ? 'auto' : '350px', // Taller default
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start'
                        }}
                            onClick={() => {
                                console.log('Card clicked:', service.id);
                                setActiveCard(activeCard === service.id ? null : service.id);
                            }}
                            onMouseEnter={(e) => {
                                if (activeCard !== service.id) {
                                    e.currentTarget.style.borderColor = '#ff2a6d';
                                    e.currentTarget.style.background = `rgba(255, 42, 109, ${service.baseOpacity + 0.05})`;
                                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                    const scanline = e.currentTarget.querySelector('.scanline') as HTMLElement;
                                    if (scanline) scanline.style.opacity = '1';

                                    // Trigger Sheen
                                    const sheen = e.currentTarget.querySelector('.sheen') as HTMLElement;
                                    if (sheen) {
                                        sheen.style.transition = 'none';
                                        sheen.style.left = '-100%';
                                        setTimeout(() => {
                                            sheen.style.transition = 'left 0.8s ease';
                                            sheen.style.left = '200%';
                                        }, 10);
                                    }
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeCard !== service.id) {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.background = `rgba(255,255,255,${service.baseOpacity})`;
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    const scanline = e.currentTarget.querySelector('.scanline') as HTMLElement;
                                    if (scanline) scanline.style.opacity = '0';
                                }
                            }}
                        >


                            {/* Sheen Effect */}
                            <div className="sheen" style={{
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '50%',
                                height: '100%',
                                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
                                transform: 'skewX(-25deg)',
                                transition: 'left 0.5s ease',
                                pointerEvents: 'none',
                                zIndex: 2
                            }} />

                            {/* Scanline Effect */}
                            <div className="scanline" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, transparent 50%, rgba(255, 42, 109, 0.1) 51%, transparent 52%)',
                                backgroundSize: '100% 10px',
                                opacity: activeCard === service.id ? 1 : 0,
                                pointerEvents: 'none',
                                transition: 'opacity 0.3s ease',
                                zIndex: 1
                            }} />

                            <h3 style={{
                                fontSize: '2rem',
                                fontFamily: 'var(--font-heading)',
                                marginBottom: '1rem',
                                color: '#fff',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                {service.title}
                                {activeCard === service.id && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff2a6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                )}
                            </h3>
                            <p style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.95rem',
                                lineHeight: 1.8,
                                opacity: 0.9,
                                letterSpacing: '0.05em',
                                color: '#e0e0e0',
                                marginBottom: '1.5rem',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                {service.desc}
                            </p>

                            {/* Expand Indicator */}
                            <div style={{
                                position: 'absolute',
                                bottom: '1.5rem',
                                right: '1.5rem',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.8rem',
                                color: activeCard === service.id ? '#ff2a6d' : 'rgba(255,255,255,0.5)',
                                transition: 'all 0.3s ease',
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                letterSpacing: '0.1em',
                                zIndex: 2
                            }}>
                                {activeCard === service.id ? (
                                    <>
                                        MINIMIZAR
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        EXPANDIR
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </>
                                )}
                            </div>

                            {/* Expanded Content */}
                            <div style={{
                                maxHeight: activeCard === service.id ? '500px' : '0',
                                opacity: activeCard === service.id ? 1 : 0,
                                overflow: 'hidden',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                borderTop: activeCard === service.id ? '1px solid rgba(255, 42, 109, 0.3)' : '1px solid transparent',
                                paddingTop: activeCard === service.id ? '1.5rem' : '0',
                                marginTop: 'auto',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    lineHeight: 1.8,
                                    color: '#fff',
                                    fontWeight: 300,
                                    letterSpacing: '0.03em'
                                }}>
                                    {service.longDesc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* The Algorithm (Methodology) - Obsidian Triptych */}
            <section className="algorithm-section" style={{
                padding: '10rem 5%',
                background: '#000',
                position: 'relative',
                zIndex: 5,
                overflow: 'hidden'
            }}>
                {/* Supreme Neural Network Canvas Background */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        opacity: 1, // Full Brightness for maximum life
                        pointerEvents: 'none'
                    }}
                />

                {/* Lighting & Depth Overlays - Minimal Vignette */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    // Very soft vignette, just enough to focus attention
                    background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }} />

                {/* Bottom Glow - Horizontal Horizon (Black -> Color -> Black) */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '60%',
                    // Vertical Gradient (creates Horizontal Lines): Black -> Color -> Black
                    // This creates a horizontal band of light across the screen
                    background: 'linear-gradient(to bottom, #000 0%, rgba(255, 42, 109, 0.8) 50%, #000 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    mixBlendMode: 'screen',
                    opacity: 1
                }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 3vw, 3rem)',
                        fontFamily: 'var(--font-heading)',
                        marginBottom: '6rem',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        position: 'relative',
                        zIndex: 10,
                        letterSpacing: '0.5em',
                        color: '#fff',
                        textShadow: '0 0 20px rgba(255, 42, 109, 0.5)' // Neon glow
                    }}>
                        <span style={{
                            borderBottom: '1px solid #ff2a6d',
                            paddingBottom: '1rem',
                            display: 'inline-block'
                        }}>EL ALGORITMO</span>
                    </h2>
                </div>

                {/* Obsidian Triptych Implementation */}
                <div className="obsidian-triptych" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    minHeight: '450px', // Reduced from 600px
                    gap: '2px',
                    padding: '0 5%',
                    position: 'relative', // Ensure stacking context
                    zIndex: 10 // Force above the background glow (z-index: 1)
                }}
                    onMouseLeave={() => setActivePanel(0)} // Reset to first panel on leave
                >
                    {[
                        {
                            step: '01',
                            title: 'CONCEPCIÓN AI',
                            desc: 'Dirección creativa potenciada por inteligencia estratégica.',
                            longDesc: 'Utilizamos IA para explorar fronteras visuales inalcanzables, filtrando la innovación a través de un criterio humano de élite.',
                            image: genesisDnaImage
                        },
                        {
                            step: '02',
                            title: 'REFINAMIENTO',
                            desc: 'Artesanía digital en cada micro-interacción.',
                            longDesc: 'Pulimos el diamante. Cada animación y cada sombra está diseñada para proyectar una imagen de perfección inquebrantable.',
                            image: sintesisAgenciaImage
                        },
                        {
                            step: '03',
                            title: 'MAESTRÍA',
                            desc: 'Despliegue de una identidad visual dominante.',
                            longDesc: 'Tu marca se convierte en el referente de calidad. No compites por atención, la exiges por derecho propio.',
                            image: serviceBrutalismImage
                        }
                    ].map((item, i) => (
                        <div key={i} className={`triptych-panel panel-${i}`} style={{
                            flex: activePanel === i ? 3 : 1, // Controlled by State
                            position: 'relative',
                            background: '#000', // Solid black backing
                            border: activePanel === i ? '1px solid #ff2a6d' : '1px solid rgba(255,255,255,0.05)',
                            overflow: 'hidden',
                            transition: 'flex 0.6s cubic-bezier(0.16, 1, 0.3, 1)', // CSS handles the layout change
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '2rem 1.5rem', // Reduced padding
                            boxShadow: activePanel === i ? '0 0 30px rgba(255, 42, 109, 0.1)' : 'none'
                        }}
                            onMouseEnter={() => setActivePanel(i)} // Simple state update
                        >
                            {/* Background Image */}
                            <div className="panel-bg-image" style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${item.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 1, // Always solid, no transparency
                                transform: activePanel === i ? 'scale(1.1)' : 'scale(1.0)', // Subtle zoom breathing
                                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)', // Smooth cinematic transition
                                zIndex: 0,
                                filter: activePanel === i
                                    ? 'brightness(1.1) contrast(1.1) saturate(1.1)' // Natural & Bright
                                    : 'brightness(1.0) contrast(1.0) saturate(1.0)' // Fully visible, natural
                            }} />

                            {/* Gradient Overlay - REMOVED for 100% Clarity */}
                            <div style={{
                                display: 'none'
                            }} />

                            {/* Step Number */}
                            <div style={{
                                fontSize: 'clamp(3rem, 5vw, 6rem)',
                                fontFamily: 'var(--font-heading)',
                                fontWeight: 800,
                                color: 'rgba(255,255,255,0.5)', // Much more visible
                                textShadow: '0 4px 20px rgba(0,0,0,0.5)', // Added shadow for contrast
                                lineHeight: 1,
                                alignSelf: 'flex-start',
                                letterSpacing: '0.05em',
                                position: 'relative',
                                zIndex: 2
                            }}>
                                {item.step}
                            </div>

                            {/* Vertical Title - Visible when collapsed */}
                            <div className="vertical-title" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%) rotate(-90deg)',
                                whiteSpace: 'nowrap',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.5rem',
                                letterSpacing: '0.3em',
                                color: 'rgba(255,255,255,0.5)',
                                pointerEvents: 'none',
                                opacity: i === 0 ? 0 : 1, // Hidden on first panel initially
                                zIndex: 2
                            }}>
                                {item.title}
                            </div>

                            {/* Expanded Content - Visible when active */}
                            <div className="panel-content" style={{
                                opacity: activePanel === i ? 1 : 0,
                                transform: activePanel === i ? 'translateY(0)' : 'translateY(20px)',
                                transition: 'all 0.4s ease',
                                position: 'relative',
                                zIndex: 2,
                                background: 'rgba(0,0,0,0.6)', // Readability backing
                                backdropFilter: 'blur(10px)',
                                padding: '1.5rem',
                                borderRadius: '4px',
                                borderLeft: '2px solid #ff2a6d'
                            }}>
                                <h3 style={{
                                    fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
                                    fontFamily: 'var(--font-heading)',
                                    marginBottom: '0.5rem',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.9rem',
                                    color: '#ff2a6d',
                                    marginBottom: '1rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {item.desc}
                                </p>
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    color: '#e0e0e0'
                                }}>
                                    {item.longDesc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Animated Can Section */}
            <CinematicDrinkHero />

            {/* Final CTA - Minimalist */}
            <section style={{
                padding: '10rem 5%',
                background: '#000',
                textAlign: 'center',
                position: 'relative',
                zIndex: 5
            }}>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontFamily: 'var(--font-heading)',
                    color: '#fff',
                    marginBottom: '3rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    ¿Listo para <span style={{ color: '#ff2a6d' }}>DOMINAR</span> el mercado?
                </h2>
                <a
                    ref={actionBtnRef}
                    href="/#nucleo"
                    className="super-cta-button"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.8rem 5rem',
                        background: '#000',
                        border: '1px solid rgba(255, 42, 109, 0.4)',
                        borderRadius: '0px',
                        color: '#ff2a6d',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        fontWeight: 900,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 0 30px rgba(255, 42, 109, 0.1)',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                    }}
                >
                    {/* SCANLINE EFFECT */}
                    <div className="cta-scanline-pink" />

                    {/* BREATHING GLOW */}
                    <div className="cta-glow-pink" />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                        <span>DOMINAR MI MERCADO</span>
                        <span style={{ fontSize: '1.2rem', animation: 'arrowPulse 1.2s infinite ease-in-out' }}>→</span>
                    </div>
                </a>

                <style>{`
                    .super-cta-button:hover {
                        border-color: #ff2a6d !important;
                        box-shadow: 0 0 50px rgba(255, 42, 109, 0.4) !important;
                    }
                    .cta-scanline-pink {
                        position: absolute;
                        top: -100%;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(to bottom, transparent, rgba(255, 42, 109, 0.2), transparent);
                        animation: scan 3s infinite linear;
                    }
                    .cta-glow-pink {
                        position: absolute;
                        inset: 0;
                        box-shadow: inset 0 0 30px rgba(255, 42, 109, 0.2);
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
            </section >
        </div >
    );
};

export default Identidad;
