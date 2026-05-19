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

const NeuroIdentity: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef1 = useRef<HTMLDivElement>(null);
    const textRef2 = useRef<HTMLDivElement>(null);
    const textRef3 = useRef<HTMLDivElement>(null);
    const textRef4 = useRef<HTMLDivElement>(null);
    const textRef5 = useRef<HTMLDivElement>(null);

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
                .to(textRef1.current, { opacity: 0, scale: 1.1, duration: 0.5, ease: 'power2.in' }, 0.12);

            // PHASE 2: BLUE STRAND - MATHEMATICAL (15% - 40%)
            tl.to(textRef2.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.18)
                .to(textRef2.current, { opacity: 0, x: -80, duration: 0.5, ease: 'power2.in' }, 0.38);

            // PHASE 3: MAGENTA STRAND - ORGANIC (40% - 68%)
            tl.to(textRef3.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.44)
                .to(textRef3.current, { opacity: 0, x: 80, duration: 0.5, ease: 'power2.in' }, 0.68);

            // PHASE 4: CONVERGENCE - THE DNA (68% - 88%)
            tl.to(textRef4.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 0.72)
                .to(textRef4.current, { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 0.5, ease: 'power2.in' }, 0.88);

            // PHASE 5: CTA / EXIT (88% - 100%)
            tl.to(textRef5.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.92)
                .set(textRef5.current, { pointerEvents: 'auto' }, 0.92);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // SHARED BASE TEXT STYLE
    const textStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
        zIndex: 20,
        width: '100%',
        maxWidth: '1200px',
        padding: '0 2rem',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)'
    };

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
                        { type: 'scroll', text: 'DESLIZAR PARA INICIAR SECUENCIA' }
                    ]}
                    style={{ zIndex: 9999, bottom: '3.5rem' }}
                />

                {/* --- NARRATIVE OVERLAYS --- */}

                {/* 1. GENESIS */}
                <div ref={textRef1} style={textStyle}>
                    <div style={{
                        background: 'rgba(3, 3, 6, 0.75)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '3.5rem 2.5rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        maxWidth: '700px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#00E5FF' }}>
                            <Sparkles size={36} className="animate-pulse" />
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
                            SINOPSIS CROMÁTICA
                        </h2>
                        <h3 style={{ fontSize: '1rem', color: '#00E5FF', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '1.5rem' }}>
                            EL CÓDIGO BIOLÓGICO DE LA SUPREMACÍA DIGITAL
                        </h3>
                        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.75)', fontWeight: 300 }}>
                            No creamos páginas web convencionales. Esculpimos organismos digitales de alta conversión. 
                            El ADN de <span style={{ color: '#00E5FF', fontWeight: 600 }}>AgencIA</span> nace de la colisión simbiótica entre dos fuerzas opuestas e inseparables.
                        </p>
                    </div>
                </div>

                {/* 2. THE BLUE HELIX - MATHEMATICAL */}
                <div ref={textRef2} style={{ ...textStyle, transform: 'translate(-50%, -50%)', alignItems: 'flex-start', left: '20%' }}>
                    <div style={{
                        background: 'rgba(3, 3, 6, 0.85)',
                        backdropFilter: 'blur(25px)',
                        borderLeft: '3px solid #00E5FF',
                        borderTop: '1px solid rgba(0, 229, 255, 0.1)',
                        borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.03)',
                        padding: '3rem 2.5rem',
                        borderRadius: '0 16px 16px 0',
                        textAlign: 'left',
                        maxWidth: '520px',
                        boxShadow: '0 40px 80px rgba(0, 229, 255, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#00E5FF', marginBottom: '1rem' }}>
                            <Cpu size={24} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em' }}>01 // HÉLICE SOBERANA</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                            EL RIGOR MATEMÁTICO
                        </h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem', fontWeight: 300 }}>
                            La línea azul representa la infraestructura implacable: algoritmos deterministas, código limpio, 
                            velocidad extrema, seguridad impenetrable y una automatización soberana. Es el motor lógico que rige el backend del negocio.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(0, 229, 255, 0.15)', paddingTop: '1.5rem', fontSize: '0.7rem', color: '#00E5FF', fontWeight: 800 }}>
                            <div>[ LATENCIA: 0.004ms ]</div>
                            <div>[ INFRAESTRUCTURA: SOVEREIGN ]</div>
                        </div>
                    </div>
                </div>

                {/* 3. THE MAGENTA HELIX - ORGANIC */}
                <div ref={textRef3} style={{ ...textStyle, transform: 'translate(-50%, -50%)', alignItems: 'flex-end', left: '80%' }}>
                    <div style={{
                        background: 'rgba(3, 3, 6, 0.85)',
                        backdropFilter: 'blur(25px)',
                        borderRight: '3px solid #FF0080',
                        borderTop: '1px solid rgba(255, 0, 128, 0.1)',
                        borderBottom: '1px solid rgba(255, 0, 128, 0.1)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.03)',
                        padding: '3rem 2.5rem',
                        borderRadius: '16px 0 0 16px',
                        textAlign: 'right',
                        maxWidth: '520px',
                        boxShadow: '0 40px 80px rgba(255, 0, 128, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#FF0080', marginBottom: '1rem', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em' }}>02 // HÉLICE SENSORIAL</span>
                            <Activity size={24} />
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                            EL CÓDIGO NEURO-EMOCIONAL
                        </h2>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem', fontWeight: 300 }}>
                            La línea magenta encarna la respuesta viva: psicología aplicada, estética sublime de alta retención, 
                            diseño cerebral e intuición visceral. El arte que hackea la percepción humana para transformar software complejo en puro deseo de compra.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255, 0, 128, 0.15)', paddingTop: '1.5rem', fontSize: '0.7rem', color: '#FF0080', fontWeight: 800, justifyContent: 'flex-end' }}>
                            <div>[ CONVERSIÓN: +320% ]</div>
                            <div>[ PERCEPCIÓN: PREMIUM ]</div>
                        </div>
                    </div>
                </div>

                {/* 4. CONVERGENCE */}
                <div ref={textRef4} style={{ ...textStyle, transform: 'translate(-50%, -50%) scale(0.95)' }}>
                    <div style={{
                        background: 'rgba(3, 3, 6, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        padding: '4rem 3rem',
                        borderRadius: '24px',
                        textAlign: 'center',
                        maxWidth: '750px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#fff' }}>
                            <div style={{ color: '#00E5FF' }}><Cpu size={30} /></div>
                            <div style={{ color: '#FF0080' }}><Activity size={30} /></div>
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                            LA DOBLE HÉLICE
                        </h2>
                        <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.2em', color: 'transparent', backgroundImage: 'linear-gradient(to right, #00E5FF, #FF0080)', WebkitBackgroundClip: 'text', fontWeight: 700, marginBottom: '2rem' }}>
                            INGENIERÍA E INSTINTO EN SIMBIOSIS
                        </h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 300 }}>
                            Cuando el código frío y calculador se fusiona con la emoción cerebral y la estética disruptiva, 
                            las líneas vibracionales se entrelazan. El resultado es el ADN de <span style={{ fontWeight: 600 }}>AgencIA</span>: 
                            obras de arte tecnológicas de altísimo rendimiento financiero.
                        </p>
                    </div>
                </div>

                {/* 5. CTA / EXIT */}
                <div ref={textRef5} style={{ ...textStyle, transform: 'translate(-50%, -50%)' }}>
                    <div style={{
                        background: 'rgba(3, 3, 6, 0.85)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '4.5rem 3.5rem',
                        borderRadius: '24px',
                        textAlign: 'center',
                        maxWidth: '680px',
                        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.9)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#FF0080' }}>
                            <Zap size={36} className="animate-bounce" />
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                            LIDERA O SIGUE
                        </h2>
                        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '3rem', fontWeight: 300 }}>
                            El mercado ignora a los mediocres y premia a los audaces. Es hora de inyectar esta doble hélice de suprema conversión y diseño estético en tu propia marca.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/contacto')}
                                style={{
                                    background: 'linear-gradient(to right, #00E5FF, #FF0080)',
                                    color: '#000',
                                    border: 'none',
                                    padding: '1rem 2.2rem',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.15em',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    boxShadow: '0 10px 30px rgba(0, 229, 255, 0.3)',
                                    transition: 'all 0.3s ease'
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
                                    padding: '1rem 2.2rem',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.15em',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
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
    );
};

export default NeuroIdentity;
