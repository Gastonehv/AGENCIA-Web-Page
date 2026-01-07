import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrainCircuit, Eye, Globe, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════
// NEURA-GLASS V.01 - Case Study Landing Component
// Powered by A.L.M.A. (Algoritmo Lógico de Mente Artificial)
// ═══════════════════════════════════════════════════════════════════════════

const PRODUCT_DATA = {
    Producto_Nombre: "NEURA-GLASS V.01",
    Slogan: "Ver lo que otros solo imaginan.",
    Tecnologia_Creadora: "Powered by A.L.M.A. (Algoritmo Lógico de Mente Artificial)",
    Colores_Marca: {
        Primario: "#00CCCC",      // Cyan Eléctrico
        Fondo: "#000000",         // Negro Puro
        Texto: "#FFFFFF",         // Blanco Cloud Dancer
        Acento: "#7000FF"         // Future Dusk
    },
    Fases_del_Scroll: [
        {
            Titulo: "Fase 1: Neuro-Escaneo",
            Descripcion: "A.L.M.A. analizó 4.5 billones de micro-gestos para diseñar la ergonomía perfecta.",
            Icono: "BrainCircuit"
        },
        {
            Titulo: "Fase 2: Síntesis Visual",
            Descripcion: "Generación de identidad líquida que se adapta a la retina del usuario.",
            Icono: "Eye"
        },
        {
            Titulo: "Fase 3: Despliegue Omnicanal",
            Descripcion: "Lanzamiento simultáneo en Web, App y Metaverso orquestado por agentes autónomos.",
            Icono: "Globe"
        }
    ],
    Footer_Legal: "A.L.M.A. es una propiedad intelectual de AgencIA. Sistemas de orquestación propietaria. All rights reserved."
};

const { Colores_Marca: COLORS, Fases_del_Scroll: PHASES } = PRODUCT_DATA;

// Icon Mapping
const IconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
    BrainCircuit,
    Eye,
    Globe
};

const NeuraGlassSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const glassesRef = useRef<HTMLDivElement>(null);
    const phasesRef = useRef<HTMLDivElement>(null);
    const phaseCardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // ═══════════════════════════════════════════════════════════════════════
    // GSAP SCROLL ANIMATIONS
    // ═══════════════════════════════════════════════════════════════════════
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Title Animation
            gsap.from('.neura-title', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.3
            });

            gsap.from('.neura-slogan', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.6
            });

            gsap.from('.neura-product-visual', {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.9
            });

            gsap.from('.alma-badge', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 1.2
            });

            // Parallax on Hero
            gsap.to('.hero-glow', {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100,
                opacity: 0.3
            });

            // Glasses 3D Rotation Effect
            gsap.to('.glasses-3d', {
                scrollTrigger: {
                    trigger: glassesRef.current,
                    start: 'top 80%',
                    end: 'center center',
                    scrub: 1
                },
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                opacity: 1
            });

            // Phase Cards - "Downloading from Cloud" effect
            phaseCardsRef.current.forEach((card, i) => {
                if (!card) return;

                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 50%',
                        scrub: 1,
                        toggleActions: 'play none none reverse'
                    },
                    y: 80,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1,
                    delay: i * 0.15
                });

                // Glow animation on enter
                gsap.to(card.querySelector('.phase-glow'), {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 1,
                    duration: 0.8
                });
            });

            // Final CTA Animation
            gsap.from('.final-cta', {
                scrollTrigger: {
                    trigger: '.final-cta',
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: '100vh',
                background: COLORS.Fondo,
                color: COLORS.Texto,
                fontFamily: "'Inter', 'system-ui', sans-serif",
                overflow: 'hidden'
            }}
        >
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* HERO SECTION */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <section
                ref={heroRef}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '2rem',
                    textAlign: 'center'
                }}
            >
                {/* Radial Glow Background */}
                <div
                    className="hero-glow"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120vw',
                        height: '120vh',
                        background: `radial-gradient(ellipse at center, ${COLORS.Primario}15 0%, transparent 50%)`,
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                />

                {/* Accent Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '30%',
                        right: '10%',
                        width: '400px',
                        height: '400px',
                        background: `radial-gradient(circle, ${COLORS.Acento}20 0%, transparent 60%)`,
                        filter: 'blur(80px)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                />

                {/* A.L.M.A. Badge */}
                <div
                    className="alma-badge"
                    style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '0.75rem 2rem',
                        background: `linear-gradient(135deg, ${COLORS.Fondo}CC, ${COLORS.Fondo}99)`,
                        border: `1px solid ${COLORS.Primario}40`,
                        borderRadius: '50px',
                        backdropFilter: 'blur(20px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        zIndex: 10
                    }}
                >
                    <Sparkles size={16} color={COLORS.Primario} />
                    <span style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: COLORS.Primario
                    }}>
                        {PRODUCT_DATA.Tecnologia_Creadora}
                    </span>
                </div>

                {/* Product Title */}
                <h1
                    className="neura-title"
                    style={{
                        fontSize: 'clamp(3rem, 12vw, 10rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        lineHeight: 0.9,
                        margin: 0,
                        background: `linear-gradient(135deg, ${COLORS.Texto} 0%, ${COLORS.Primario} 50%, ${COLORS.Acento} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    {PRODUCT_DATA.Producto_Nombre}
                </h1>

                {/* Slogan */}
                <p
                    className="neura-slogan"
                    style={{
                        fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                        fontWeight: 300,
                        marginTop: '1.5rem',
                        color: COLORS.Texto,
                        opacity: 0.8,
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    {PRODUCT_DATA.Slogan}
                </p>

                {/* Product Visual - Glasses Representation */}
                <div
                    ref={glassesRef}
                    className="neura-product-visual"
                    style={{
                        marginTop: '4rem',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <div
                        className="glasses-3d"
                        style={{
                            width: 'clamp(300px, 60vw, 600px)',
                            height: 'clamp(150px, 25vw, 250px)',
                            background: `linear-gradient(135deg, ${COLORS.Fondo}CC 0%, ${COLORS.Primario}20 50%, ${COLORS.Acento}20 100%)`,
                            border: `2px solid ${COLORS.Primario}60`,
                            borderRadius: '100px',
                            backdropFilter: 'blur(40px)',
                            boxShadow: `
                0 0 60px ${COLORS.Primario}40,
                0 0 120px ${COLORS.Acento}20,
                inset 0 0 60px ${COLORS.Primario}10
              `,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg) scale(0.9)',
                            opacity: 0.5
                        }}
                    >
                        {/* Lens Left */}
                        <div
                            style={{
                                width: '40%',
                                height: '70%',
                                background: `linear-gradient(135deg, ${COLORS.Primario}30, ${COLORS.Acento}30)`,
                                borderRadius: '50px',
                                margin: '0 1rem',
                                boxShadow: `inset 0 0 30px ${COLORS.Primario}40`,
                                border: `1px solid ${COLORS.Primario}40`
                            }}
                        />
                        {/* Nose Bridge */}
                        <div
                            style={{
                                width: '5%',
                                height: '30%',
                                background: `linear-gradient(to bottom, ${COLORS.Primario}60, transparent)`,
                                borderRadius: '10px'
                            }}
                        />
                        {/* Lens Right */}
                        <div
                            style={{
                                width: '40%',
                                height: '70%',
                                background: `linear-gradient(135deg, ${COLORS.Acento}30, ${COLORS.Primario}30)`,
                                borderRadius: '50px',
                                margin: '0 1rem',
                                boxShadow: `inset 0 0 30px ${COLORS.Acento}40`,
                                border: `1px solid ${COLORS.Acento}40`
                            }}
                        />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '3rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: 0.6,
                        animation: 'pulse 2s infinite'
                    }}
                >
                    <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        Scroll para explorar
                    </span>
                    <div
                        style={{
                            width: '1px',
                            height: '40px',
                            background: `linear-gradient(to bottom, ${COLORS.Primario}, transparent)`
                        }}
                    />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* PHASES SECTION - "Downloading from Cloud" Effect */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <section
                ref={phasesRef}
                style={{
                    padding: 'clamp(4rem, 10vw, 10rem) 5%',
                    position: 'relative'
                }}
            >
                {/* Section Title */}
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                            letterSpacing: '0.4em',
                            textTransform: 'uppercase',
                            color: COLORS.Primario,
                            marginBottom: '1rem'
                        }}
                    >
                        Proceso de Creación
                    </h2>
                    <p
                        style={{
                            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                            fontWeight: 700,
                            maxWidth: '800px',
                            margin: '0 auto',
                            lineHeight: 1.2
                        }}
                    >
                        Cómo <span style={{ color: COLORS.Primario }}>A.L.M.A.</span> diseñó la{' '}
                        <span style={{ color: COLORS.Acento }}>revolución visual</span>
                    </p>
                </div>

                {/* Phase Cards Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}
                >
                    {PHASES.map((phase, index) => {
                        const IconComponent = IconMap[phase.Icono];
                        return (
                            <div
                                key={index}
                                ref={(el) => { phaseCardsRef.current[index] = el; }}
                                style={{
                                    position: 'relative',
                                    padding: '3rem 2rem',
                                    background: `linear-gradient(135deg, ${COLORS.Fondo}E6 0%, ${COLORS.Fondo}CC 100%)`,
                                    border: `1px solid ${COLORS.Primario}30`,
                                    borderRadius: '24px',
                                    backdropFilter: 'blur(30px)',
                                    overflow: 'hidden',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget;
                                    el.style.borderColor = COLORS.Primario;
                                    el.style.transform = 'translateY(-8px) scale(1.02)';
                                    el.style.boxShadow = `0 20px 60px ${COLORS.Primario}30`;
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget;
                                    el.style.borderColor = `${COLORS.Primario}30`;
                                    el.style.transform = 'translateY(0) scale(1)';
                                    el.style.boxShadow = 'none';
                                }}
                            >
                                {/* Glow Effect */}
                                <div
                                    className="phase-glow"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '100%',
                                        background: `linear-gradient(135deg, ${COLORS.Primario}10 0%, transparent 60%)`,
                                        opacity: 0,
                                        transition: 'opacity 0.5s ease',
                                        pointerEvents: 'none'
                                    }}
                                />

                                {/* Phase Number */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        fontSize: '4rem',
                                        fontWeight: 900,
                                        color: COLORS.Primario,
                                        opacity: 0.1,
                                        lineHeight: 1
                                    }}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                {/* Icon */}
                                <div
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: `linear-gradient(135deg, ${COLORS.Primario}20, ${COLORS.Acento}20)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem',
                                        border: `1px solid ${COLORS.Primario}40`
                                    }}
                                >
                                    {IconComponent && <IconComponent size={28} className="phase-icon" />}
                                </div>

                                {/* Title */}
                                <h3
                                    style={{
                                        fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                                        fontWeight: 700,
                                        marginBottom: '1rem',
                                        color: COLORS.Texto
                                    }}
                                >
                                    {phase.Titulo}
                                </h3>

                                {/* Description */}
                                <p
                                    style={{
                                        fontSize: '1rem',
                                        lineHeight: 1.7,
                                        color: `${COLORS.Texto}CC`,
                                        margin: 0
                                    }}
                                >
                                    {phase.Descripcion}
                                </p>

                                {/* Glass Reflection Line */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: `linear-gradient(90deg, transparent, ${COLORS.Primario}60, ${COLORS.Acento}60, transparent)`
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* FINAL CTA SECTION */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <section
                className="final-cta"
                style={{
                    padding: 'clamp(6rem, 15vw, 12rem) 5%',
                    textAlign: 'center',
                    position: 'relative'
                }}
            >
                {/* Background Glow */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80vw',
                        height: '80vh',
                        background: `radial-gradient(ellipse at center, ${COLORS.Acento}15 0%, transparent 50%)`,
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p
                        style={{
                            fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: COLORS.Primario,
                            marginBottom: '1.5rem'
                        }}
                    >
                        ¿Listo para ver diferente?
                    </p>

                    <h2
                        style={{
                            fontSize: 'clamp(2rem, 6vw, 5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '2rem',
                            background: `linear-gradient(135deg, ${COLORS.Texto} 30%, ${COLORS.Primario} 70%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        El futuro no se espera.<br />
                        <span style={{
                            background: `linear-gradient(135deg, ${COLORS.Primario} 0%, ${COLORS.Acento} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Se diseña.
                        </span>
                    </h2>

                    <button
                        style={{
                            padding: '1.25rem 3rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: COLORS.Fondo,
                            background: `linear-gradient(135deg, ${COLORS.Primario} 0%, ${COLORS.Acento} 100%)`,
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 10px 40px ${COLORS.Primario}40`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = `0 15px 50px ${COLORS.Primario}60`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = `0 10px 40px ${COLORS.Primario}40`;
                        }}
                    >
                        Contactar AgencIA
                    </button>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* FOOTER LEGAL */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <footer
                style={{
                    padding: '3rem 5%',
                    textAlign: 'center',
                    borderTop: `1px solid ${COLORS.Primario}20`
                }}
            >
                <p
                    style={{
                        fontSize: '0.75rem',
                        color: `${COLORS.Texto}60`,
                        letterSpacing: '0.05em'
                    }}
                >
                    {PRODUCT_DATA.Footer_Legal}
                </p>
            </footer>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* CSS KEYFRAMES */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <style>
                {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          .phase-icon {
            color: ${COLORS.Primario};
            transition: all 0.3s ease;
          }

          /* Lucide icon styling */
          svg.lucide {
            stroke: ${COLORS.Primario};
          }
        `}
            </style>
        </div>
    );
};

export default NeuraGlassSection;
