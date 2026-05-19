import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAHelix from './DNAHelix';
import InteractionGuide from '../InteractionGuide';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Activity, Zap, Sparkles, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Cybernetic HUD Corner Brackets Component
const CornerBrackets = ({ color, locLabel, techLabel }: { color: string; locLabel?: string; techLabel?: string }) => (
    <>
        {/* Top-Left Corner */}
        <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '24px',
            height: '24px',
            borderLeft: `2px solid ${color}`,
            borderTop: `2px solid ${color}`,
            pointerEvents: 'none'
        }} />
        {locLabel && (
            <span style={{
                position: 'absolute',
                top: '14px',
                left: '42px',
                fontSize: '0.55rem',
                color: color,
                letterSpacing: '0.15em',
                fontWeight: 800,
                opacity: 0.8,
                fontFamily: 'var(--font-mono)'
            }}>
                {locLabel}
            </span>
        )}

        {/* Top-Right Corner */}
        <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            borderRight: `2px solid ${color}`,
            borderTop: `2px solid ${color}`,
            pointerEvents: 'none'
        }} />
        {techLabel && (
            <span style={{
                position: 'absolute',
                top: '14px',
                right: '42px',
                fontSize: '0.55rem',
                color: color,
                letterSpacing: '0.15em',
                fontWeight: 800,
                opacity: 0.8,
                fontFamily: 'var(--font-mono)'
            }}>
                {techLabel}
            </span>
        )}

        {/* Bottom-Left Corner */}
        <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            width: '24px',
            height: '24px',
            borderLeft: `2px solid ${color}`,
            borderBottom: `2px solid ${color}`,
            pointerEvents: 'none'
        }} />

        {/* Bottom-Right Corner */}
        <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            borderRight: `2px solid ${color}`,
            borderBottom: `2px solid ${color}`,
            pointerEvents: 'none'
        }} />
    </>
);

const NeuroIdentity: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Slide Container Refs
    const textRef1 = useRef<HTMLDivElement>(null);
    const textRef2 = useRef<HTMLDivElement>(null);
    const textRef3 = useRef<HTMLDivElement>(null);
    const textRef4 = useRef<HTMLDivElement>(null);
    const textRef5 = useRef<HTMLDivElement>(null);

    // Interactive Parallax Mouse Tilt handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Calculate tilt angles (max 8 degrees rotation)
        const tiltX = (y / (rect.height / 2)) * -6;
        const tiltY = (x / (rect.width / 2)) * 6;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                }
            });

            // PHASE 1: GENESIS (0% - 15%)
            tl.to(textRef1.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
                .set(textRef1.current, { pointerEvents: 'auto' }, 0)
                .to(textRef1.current, { opacity: 0, scale: 1.1, duration: 0.5, ease: 'power2.in' }, 0.12)
                .set(textRef1.current, { pointerEvents: 'none' }, 0.12);

            // PHASE 2: BLUE STRAND - MATHEMATICAL / LEFT HEMISPHERE (15% - 40%)
            tl.to(textRef2.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.18)
                .set(textRef2.current, { pointerEvents: 'auto' }, 0.18)
                .to(textRef2.current, { opacity: 0, x: -80, duration: 0.5, ease: 'power2.in' }, 0.38)
                .set(textRef2.current, { pointerEvents: 'none' }, 0.38);

            // PHASE 3: MAGENTA STRAND - ORGANIC / RIGHT HEMISPHERE (40% - 68%)
            tl.to(textRef3.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.44)
                .set(textRef3.current, { pointerEvents: 'auto' }, 0.44)
                .to(textRef3.current, { opacity: 0, x: 80, duration: 0.5, ease: 'power2.in' }, 0.68)
                .set(textRef3.current, { pointerEvents: 'none' }, 0.68);

            // PHASE 4: CONVERGENCE - THE DNA (68% - 88%)
            tl.to(textRef4.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.72)
                .set(textRef4.current, { pointerEvents: 'auto' }, 0.72)
                .to(textRef4.current, { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 0.5, ease: 'power2.in' }, 0.88)
                .set(textRef4.current, { pointerEvents: 'none' }, 0.88);

            // PHASE 5: CTA / EXIT (88% - 100%)
            tl.to(textRef5.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.92)
                .set(textRef5.current, { pointerEvents: 'auto' }, 0.92);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // RESPONSIVE SCREEN-SAFE CONTAINER STYLES (FLEX BASED)
    const masterOverlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'hidden'
    };

    const slideStyleBase = (justifyContent: 'center' | 'flex-start' | 'flex-end'): React.CSSProperties => ({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        padding: '0 clamp(1rem, 6vw, 8rem)',
        opacity: 0,
        pointerEvents: 'none',
        boxSizing: 'border-box'
    });

    const cardStyleBase = (glowColor: string, isLeftBorder: boolean, borderColor: string): React.CSSProperties => ({
        background: 'linear-gradient(135deg, rgba(4, 8, 14, 0.94) 0%, rgba(1, 2, 4, 0.98) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: isLeftBorder ? `4px solid ${borderColor}` : '1px solid rgba(255, 255, 255, 0.08)',
        borderRight: !isLeftBorder ? `4px solid ${borderColor}` : '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3.5rem 3rem',
        borderRadius: '16px',
        boxShadow: `0 30px 70px rgba(0, 0, 0, 0.9), 0 0 45px ${glowColor}`,
        position: 'relative',
        transition: 'transform 0.1s ease-out, box-shadow 0.3s ease',
        width: '100%',
        maxWidth: '540px',
        boxSizing: 'border-box',
        cursor: 'default'
    });

    return (
        <div ref={containerRef} className="neuro-identity-master" style={{ width: '100%', position: 'relative', background: '#000' }}>

            {/* 1. SCROLL TRACK */}
            <div style={{ height: '1200vh', width: '100%', pointerEvents: 'none' }} />

            {/* 2. THE WINDOW (Canvas) */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden'
            }}>
                <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
                    <color attach="background" args={['#000']} />
                    <DNAHelix />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                    </EffectComposer>
                </Canvas>

                {/* UI: SCROLL HINT */}
                <InteractionGuide
                    items={[
                        { type: 'scroll', text: 'DESLIZAR PARA EXPLORAR LA SIMBIOSIS' }
                    ]}
                    style={{ zIndex: 9999, bottom: '3.5rem' }}
                />

                {/* --- NARRATIVE OVERLAYS (SCREEN SAFE, FLEX ALIGNED) --- */}
                <div style={masterOverlayStyle}>

                    {/* 1. GENESIS (CENTERED) */}
                    <div ref={textRef1} style={slideStyleBase('center')}>
                        <div 
                            style={{ ...cardStyleBase('rgba(0, 229, 255, 0.08)', true, '#00E5FF'), maxWidth: '720px', textAlign: 'center' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#00E5FF" locLabel="SYS.GENESIS" techLabel="DNA_ALIGNMENT" />
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#00E5FF' }}>
                                <Sparkles size={36} className="animate-pulse" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
                                SINOPSIS CROMÁTICA
                            </h2>
                            <h3 style={{ fontSize: '0.9rem', color: '#00E5FF', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                                EL CÓDIGO BIOLÓGICO DE LA SUPREMACÍA DIGITAL
                            </h3>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 300 }}>
                                No creamos páginas web convencionales. Esculpimos organismos digitales de alta conversión. 
                                El ADN de <span style={{ color: '#00E5FF', fontWeight: 600 }}>AgencIA</span> nace de la colisión simbiótica entre dos fuerzas opuestas e inseparables.
                            </p>
                        </div>
                    </div>

                    {/* 2. THE LEFT HEMISPHERE - MATHEMATICAL / AZUL (LEFT ALIGNED) */}
                    <div ref={textRef2} style={slideStyleBase('flex-start')}>
                        <div 
                            style={cardStyleBase('rgba(0, 229, 255, 0.08)', true, '#00E5FF')}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#00E5FF" locLabel="SYS.HEMISPHERE_LEFT" techLabel="COGNITIVE_LOGIC" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#00E5FF', marginBottom: '1.5rem' }}>
                                <Cpu size={28} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>01 // HÉLICE SOBERANA</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginBottom: '1.2rem', lineHeight: 1.1 }}>
                                EL RIGOR MATEMÁTICO
                            </h2>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.75)', marginBottom: '2.5rem', fontWeight: 300 }}>
                                La hélice azul del lado **izquierdo** encarna la infraestructura implacable: algoritmos deterministas, código estructurado, 
                                velocidad extrema, seguridad impenetrable y automatización limpia. El motor frío que sostiene el valor de tu negocio.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(0, 229, 255, 0.15)', paddingTop: '1.5rem', fontSize: '0.7rem', color: '#00E5FF', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                <div>[ LATENCIA: 0.004ms ]</div>
                                <div>[ SECURITY: ZERO-TRUST ]</div>
                            </div>
                        </div>
                    </div>

                    {/* 3. THE RIGHT HEMISPHERE - ORGANIC / MAGENTA (RIGHT ALIGNED) */}
                    <div ref={textRef3} style={slideStyleBase('flex-end')}>
                        <div 
                            style={cardStyleBase('rgba(255, 0, 128, 0.08)', false, '#FF0080')}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#FF0080" locLabel="SYS.HEMISPHERE_RIGHT" techLabel="COGNITIVE_EMOTION" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FF0080', marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>02 // HÉLICE SENSORIAL</span>
                                <Activity size={28} />
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginBottom: '1.2rem', lineHeight: 1.1, textAlign: 'right' }}>
                                EL CÓDIGO NEURO-EMOCIONAL
                            </h2>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.75)', marginBottom: '2.5rem', fontWeight: 300, textAlign: 'right' }}>
                                La hélice magenta del lado **derecho** encarna la respuesta viva: psicología del comportamiento, estética sublime, 
                                interfaces fluidas e intuición visceral. El arte que hackea la percepción humana para convertir el software en deseo de compra.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255, 0, 128, 0.15)', paddingTop: '1.5rem', fontSize: '0.7rem', color: '#FF0080', fontWeight: 800, fontFamily: 'var(--font-mono)', justifyContent: 'flex-end' }}>
                                <div>[ CONVERSIÓN: +320% ]</div>
                                <div>[ PERCEPCIÓN: PREMIUM ]</div>
                            </div>
                        </div>
                    </div>

                    {/* 4. CONVERGENCE (CENTERED) */}
                    <div ref={textRef4} style={slideStyleBase('center')}>
                        <div 
                            style={{ ...cardStyleBase('rgba(255, 255, 255, 0.05)', true, '#ffffff'), maxWidth: '750px', textAlign: 'center' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#ffffff" locLabel="SYS.SYNAPSE" techLabel="NEXUS_CONVERGENCE" />
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ color: '#00E5FF' }}><Cpu size={30} /></div>
                                <div style={{ color: '#FF0080' }}><Activity size={30} /></div>
                            </div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                                LA DOBLE HÉLICE
                            </h2>
                            <h3 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: 'transparent', backgroundImage: 'linear-gradient(to right, #00E5FF, #FF0080)', WebkitBackgroundClip: 'text', fontWeight: 700, marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                                INGENIERÍA E INSTINTO EN SIMBIOSIS
                            </h3>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 300 }}>
                                Cuando el código frío y calculador se fusiona con la emoción cerebral y la estética disruptiva, 
                                las hélices se entrelazan. El resultado es el ADN de <span style={{ fontWeight: 600 }}>AgencIA</span>: 
                                obras de arte de la programación y el diseño web con rendimiento financiero exponencial.
                            </p>
                        </div>
                    </div>

                    {/* 5. CTA / EXIT (CENTERED) */}
                    <div ref={textRef5} style={slideStyleBase('center')}>
                        <div 
                            style={{ ...cardStyleBase('rgba(255, 0, 128, 0.08)', false, '#FF0080'), maxWidth: '680px', textAlign: 'center' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#FF0080" locLabel="SYS.EXIT" techLabel="SOVEREIGN_LAUNCH" />
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#FF0080' }}>
                                <Zap size={36} className="animate-bounce" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                                LIDERA O SIGUE
                            </h2>
                            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3rem', fontWeight: 300 }}>
                                El mercado ignora a los mediocres y premia a los audaces. Es hora de desplegar la doble hélice de suprema conversión y diseño estético en tu propia marca.
                            </p>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', pointerEvents: 'auto' }}>
                                <button
                                    onClick={() => navigate('/contacto')}
                                    style={{
                                        background: 'linear-gradient(to right, #00E5FF, #FF0080)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '1.1rem 2.4rem',
                                        borderRadius: '50px',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.15em',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'var(--font-mono)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 0, 128, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 229, 255, 0.3)';
                                    }}
                                >
                                    INICIAR SECUENCIA <ArrowRight size={16} />
                                </button>
                                <button
                                    onClick={() => navigate('/arquitectura')}
                                    style={{
                                        background: 'transparent',
                                        color: '#fff',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        padding: '1.1rem 2.4rem',
                                        borderRadius: '50px',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.15em',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'var(--font-mono)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.borderColor = '#00E5FF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                >
                                    VER ARQUITECTURA
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NeuroIdentity;
