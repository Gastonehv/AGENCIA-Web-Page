import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAHelix from './DNAHelix';
import InteractionGuide from '../InteractionGuide';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- DESIGN DE ICONOGRAFÍA EXCLUSIVA DE AGENCIA ---

// Icono 01: El Rigor Matemático / Algoritmo (Hélice Izquierda - Azul)
const CustomMathIcon = ({ color, size = 32 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Core central de cómputo */}
        <rect x="22" y="22" width="20" height="20" rx="4" stroke={color} strokeWidth="2.5" fill="none" />
        <rect x="28" y="28" width="8" height="8" rx="1.5" fill={color} opacity="0.9" />
        {/* Buses de flujo lógico */}
        <path d="M32 6V16M32 48V58M6 32H16M48 32H58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {/* Nodos de intersección binaria */}
        <circle cx="32" cy="16" r="3" fill={color} />
        <circle cx="32" cy="48" r="3" fill={color} />
        <circle cx="16" cy="32" r="3" fill={color} />
        <circle cx="48" cy="32" r="3" fill={color} />
        {/* Líneas diagonales de trazo lógico */}
        <path d="M12 12L20 20M52 12L44 20M12 52L20 44M52 52L44 44" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
    </svg>
);

// Icono 02: El Código Neuro-Emocional / Cerebro (Hélice Derecha - Magenta)
const CustomEmotionIcon = ({ color, size = 32 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Onda de feedback cerebral y pulso cardiaco */}
        <path d="M6 32H18L24 10L32 54L40 20L46 40L50 32H58" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Ondas radiales de transmisión de datos */}
        <circle cx="24" cy="10" r="4" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="32" cy="54" r="5" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="40" cy="20" r="3" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Sinapsis activas */}
        <circle cx="24" cy="10" r="2.5" fill={color} />
        <circle cx="32" cy="54" r="2.5" fill={color} />
        <circle cx="40" cy="20" r="2.5" fill={color} />
    </svg>
);

// Icono 03: Génesis / Fusión Inicial (Blanco/Cyan)
const CustomGenesisIcon = ({ color, size = 36 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cruz de alineación dimensional */}
        <path d="M32 6V58M6 32H58" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        {/* Anillos orbitales concéntricos */}
        <circle cx="32" cy="32" r="18" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="32" cy="32" r="8" stroke={color} strokeWidth="1.5" />
        {/* Destellos de origen de código */}
        <path d="M18 18L24 24M46 18L40 24M18 46L24 40M46 46L40 40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

// Icono 04: Acción Soberana / Relámpago Quántico (Lidera o Sigue - Magenta)
const CustomZapIcon = ({ color, size = 36 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rayo vectorial de doble impacto */}
        <path d="M36 4L16 34H32L28 60L48 30H32L36 4Z" stroke={color} strokeWidth="3" strokeLinejoin="round" fill="none" />
        <path d="M38 12L22 34H32L28 52" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Escudo HUD exterior */}
        <path d="M8 8H16M8 8V16M56 8H48M56 8V16M8 56H16M8 56V48M56 56H48M56 56V48" stroke={color} strokeWidth="2" opacity="0.6" />
    </svg>
);

// Icono 05: Flecha de Conversión de AgencIA (Botones CTA)
const CustomChevronIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12H3" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    </svg>
);

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
    
    // Card Refs for Precise Animations
    const cardRef1 = useRef<HTMLDivElement>(null);
    const cardRef2 = useRef<HTMLDivElement>(null);
    const cardRef3 = useRef<HTMLDivElement>(null);
    const cardRef4 = useRef<HTMLDivElement>(null);
    const cardRef5 = useRef<HTMLDivElement>(null);

    // Interactive Parallax Mouse Tilt handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Calculate tilt angles (max 5 degrees rotation)
        const tiltX = (y / (rect.height / 2)) * -5;
        const tiltY = (x / (rect.width / 2)) * 5;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        // Reset translation state based on active card type
        if (card === cardRef1.current || card === cardRef5.current) {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0px)';
        } else if (card === cardRef2.current || card === cardRef3.current) {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateX(0px)';
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }
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

            // PHASE 1: GENESIS (Timeline time: 0.0 to 3.0)
            tl.to(cardRef1.current, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.0)
                .to(cardRef1.current, { autoAlpha: 0, y: -60, duration: 1.0, ease: 'power2.in' }, 2.0);

            // PHASE 2: BLUE STRAND - MATHEMATICAL / LEFT HEMISPHERE (Timeline time: 3.2 to 6.2)
            tl.to(cardRef2.current, { autoAlpha: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 3.2)
                .to(cardRef2.current, { autoAlpha: 0, x: -100, duration: 1.0, ease: 'power2.in' }, 5.2);

            // PHASE 3: MAGENTA STRAND - ORGANIC / RIGHT HEMISPHERE (Timeline time: 6.4 to 9.4)
            tl.to(cardRef3.current, { autoAlpha: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 6.4)
                .to(cardRef3.current, { autoAlpha: 0, x: 100, duration: 1.0, ease: 'power2.in' }, 8.4);

            // PHASE 4: CONVERGENCE - THE DNA (Timeline time: 9.6 to 12.6)
            tl.to(cardRef4.current, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 9.6)
                .to(cardRef4.current, { autoAlpha: 0, scale: 1.15, duration: 1.0, ease: 'power2.in' }, 11.6);

            // PHASE 5: CTA / EXIT (Timeline time: 12.8 to 15.0)
            tl.to(cardRef5.current, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 12.8);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // SCREEN-SAFE RESPONSIVE FLEX LAYOUTS
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
        padding: '0 clamp(1.5rem, 6vw, 8rem)',
        boxSizing: 'border-box'
    });

    const cardStyleBase = (glowColor: string, isLeftBorder: boolean, borderColor: string): React.CSSProperties => ({
        background: 'linear-gradient(135deg, rgba(3, 6, 12, 0.45) 0%, rgba(1, 2, 4, 0.6) 100%)',
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
        cursor: 'default',
        pointerEvents: 'auto'
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
                    <div style={slideStyleBase('center')}>
                        <div 
                            ref={cardRef1}
                            style={{ 
                                ...cardStyleBase('rgba(0, 229, 255, 0.08)', true, '#00E5FF'), 
                                maxWidth: '720px', 
                                textAlign: 'center',
                                opacity: 0,
                                visibility: 'hidden',
                                transform: 'translateY(50px)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#00E5FF" locLabel="SYS.GENESIS" techLabel="DNA_ALIGNMENT" />
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#00E5FF' }}>
                                <CustomGenesisIcon color="#00E5FF" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>
                                SINOPSIS CROMÁTICA
                            </h2>
                            <h3 style={{ fontSize: '0.9rem', color: '#00E5FF', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                                EL CÓDIGO BIOLÓGICO DE LA SUPREMACÍA DIGITAL
                            </h3>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 300 }}>
                                No creamos páginas web convencionales. Esculpimos organismos digitales de alta conversión. 
                                El ADN de <span style={{ color: '#00E5FF', fontWeight: 600 }}>AgencIA</span> nace de la colisión simbiótica entre dos fuerzas opuestas e inseparables.
                            </p>
                        </div>
                    </div>

                    {/* 2. THE LEFT HEMISPHERE - MATHEMATICAL / AZUL (LEFT ALIGNED) */}
                    <div style={slideStyleBase('flex-start')}>
                        <div 
                            ref={cardRef2}
                            style={{
                                ...cardStyleBase('rgba(0, 229, 255, 0.08)', true, '#00E5FF'),
                                opacity: 0,
                                visibility: 'hidden',
                                transform: 'translateX(-100px)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#00E5FF" locLabel="SYS.HEMISPHERE_LEFT" techLabel="COGNITIVE_LOGIC" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#00E5FF', marginBottom: '1.5rem' }}>
                                <CustomMathIcon color="#00E5FF" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>01 // HÉLICE SOBERANA</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginBottom: '1.2rem', lineHeight: 1.1 }}>
                                EL RIGOR MATEMÁTICO
                            </h2>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2.5rem', fontWeight: 300 }}>
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
                    <div style={slideStyleBase('flex-end')}>
                        <div 
                            ref={cardRef3}
                            style={{
                                ...cardStyleBase('rgba(255, 0, 128, 0.08)', false, '#FF0080'),
                                opacity: 0,
                                visibility: 'hidden',
                                transform: 'translateX(100px)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#FF0080" locLabel="SYS.HEMISPHERE_RIGHT" techLabel="COGNITIVE_EMOTION" />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#FF0080', marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', fontFamily: 'var(--font-mono)' }}>02 // HÉLICE SENSORIAL</span>
                                <CustomEmotionIcon color="#FF0080" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '0.05em', color: '#fff', marginBottom: '1.2rem', lineHeight: 1.1, textAlign: 'right' }}>
                                EL CÓDIGO NEURO-EMOCIONAL
                            </h2>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '2.5rem', fontWeight: 300, textAlign: 'right' }}>
                                La hélice magenta del lado **derecho** encarna la respuesta viva: psicología del comportamiento, estética sublime, 
                                interfaces fluidas e intuición visceral. El arte que hackea la percepción humana para transformar software complejo en puro deseo de compra.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255, 0, 128, 0.15)', paddingTop: '1.5rem', fontSize: '0.7rem', color: '#FF0080', fontWeight: 800, fontFamily: 'var(--font-mono)', justifyContent: 'flex-end' }}>
                                <div>[ CONVERSIÓN: +320% ]</div>
                                <div>[ PERCEPCIÓN: PREMIUM ]</div>
                            </div>
                        </div>
                    </div>

                    {/* 4. CONVERGENCE (CENTERED) */}
                    <div style={slideStyleBase('center')}>
                        <div 
                            ref={cardRef4}
                            style={{ 
                                ...cardStyleBase('rgba(255, 255, 255, 0.05)', true, '#ffffff'), 
                                maxWidth: '750px', 
                                textAlign: 'center',
                                opacity: 0,
                                visibility: 'hidden',
                                transform: 'scale(0.85)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#ffffff" locLabel="SYS.SYNAPSE" techLabel="NEXUS_CONVERGENCE" />
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <CustomMathIcon color="#00E5FF" />
                                <CustomEmotionIcon color="#FF0080" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, textTransform: 'uppercase', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                                LA DOBLE HÉLICE
                            </h2>
                            <h3 style={{ fontSize: '1rem', letterSpacing: '0.2em', color: 'transparent', backgroundImage: 'linear-gradient(to right, #00E5FF, #FF0080)', WebkitBackgroundClip: 'text', fontWeight: 700, marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                                INGENIERÍA E INSTINTO EN SIMBIOSIS
                            </h3>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.85)', fontWeight: 300 }}>
                                Cuando el código frío y calculador se fusiona con la emoción cerebral y la estética disruptiva, 
                                las hélices se entrelazan. El resultado es el ADN de <span style={{ fontWeight: 600 }}>AgencIA</span>: 
                                obras de arte de la programación y el diseño web con rendimiento financiero exponencial.
                            </p>
                        </div>
                    </div>

                    {/* 5. CTA / EXIT (CENTERED) */}
                    <div style={slideStyleBase('center')}>
                        <div 
                            ref={cardRef5}
                            style={{ 
                                ...cardStyleBase('rgba(255, 0, 128, 0.08)', false, '#FF0080'), 
                                maxWidth: '680px', 
                                textAlign: 'center',
                                opacity: 0,
                                visibility: 'hidden',
                                transform: 'translateY(50px)'
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CornerBrackets color="#FF0080" locLabel="SYS.EXIT" techLabel="SOVEREIGN_LAUNCH" />
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#FF0080' }}>
                                <CustomZapIcon color="#FF0080" />
                            </div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
                                LIDERA O SIGUE
                            </h2>
                            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.75)', marginBottom: '3rem', fontWeight: 300 }}>
                                El mercado ignora a los mediocres y premia a los audaces. Es hora de desplegar la doble hélice de suprema conversión y diseño estético en tu propia marca.
                            </p>
                            
                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                                    INICIAR SECUENCIA <CustomChevronIcon color="#000" />
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
