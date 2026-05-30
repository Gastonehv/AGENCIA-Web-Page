import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAHelix from './DNAHelix';
import LiquidContactCTA from '../LiquidContactCTA';
import InteractionGuide from '../InteractionGuide';
import { useSound } from '../../context/SoundContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────
// CORNER BRACKETS
// ─────────────────────────────────────────────
const CornerBrackets = ({ color, locLabel, techLabel }: { color: string; locLabel?: string; techLabel?: string }) => (
    <>
        <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderLeft: `1.5px solid ${color}`, borderTop: `1.5px solid ${color}`, pointerEvents: 'none', opacity: 0.7 }} />
        {locLabel && (
            <span style={{ position: 'absolute', top: '14px', left: '38px', fontSize: '0.5rem', color: color, letterSpacing: '0.18em', fontWeight: 700, opacity: 0.6, fontFamily: 'var(--font-mono)' }}>
                {locLabel}
            </span>
        )}
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderRight: `1.5px solid ${color}`, borderTop: `1.5px solid ${color}`, pointerEvents: 'none', opacity: 0.7 }} />
        {techLabel && (
            <span style={{ position: 'absolute', top: '14px', right: '38px', fontSize: '0.5rem', color: color, letterSpacing: '0.18em', fontWeight: 700, opacity: 0.6, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                {techLabel}
            </span>
        )}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderLeft: `1.5px solid ${color}`, borderBottom: `1.5px solid ${color}`, pointerEvents: 'none', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderRight: `1.5px solid ${color}`, borderBottom: `1.5px solid ${color}`, pointerEvents: 'none', opacity: 0.7 }} />
    </>
);

// ─────────────────────────────────────────────
// ANIMATED SCAN LINE (micro-detail)
// ─────────────────────────────────────────────
const ScanLine = ({ color }: { color: string }) => (
    <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        opacity: 0.4,
        animation: 'scanline-sweep 3s ease-in-out infinite',
        pointerEvents: 'none'
    }} />
);

// ─────────────────────────────────────────────
// ICONS — minimal, 18px baseline, 1.5px stroke
// ─────────────────────────────────────────────
const IconMath = ({ color, size = 18 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="6" height="6" rx="1" stroke={color} strokeWidth="1.25" />
        <path d="M8 1V4M8 12V15M1 8H4M12 8H15" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
        <circle cx="8" cy="1" r="1" fill={color} />
        <circle cx="8" cy="15" r="1" fill={color} />
        <circle cx="1" cy="8" r="1" fill={color} />
        <circle cx="15" cy="8" r="1" fill={color} />
    </svg>
);

const IconSoul = ({ color, size = 18 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 8H4L6 2L8 14L10 5L12 10L13 8H15" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="2" r="1" fill={color} />
        <circle cx="8" cy="14" r="1" fill={color} />
    </svg>
);

const IconFusion = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="fg" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#FF0080" />
            </linearGradient>
        </defs>
        <circle cx="8" cy="8" r="5" stroke="url(#fg)" strokeWidth="1.25" />
        <path d="M8 1V15M1 8H15" stroke="url(#fg)" strokeWidth="1.25" strokeLinecap="round" />
        <circle cx="8" cy="8" r="1.5" fill="url(#fg)" />
    </svg>
);

const IconZap = ({ color, size = 18 }: { color: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L4 9H8L7 15L12 7H8L9 1Z" stroke={color} strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
);

// ─────────────────────────────────────────────
// TYPED TEXT (micro-animation for code labels)
// ─────────────────────────────────────────────
const TypedLabel = ({ text, color }: { text: string; color: string }) => (
    <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: color,
        opacity: 0.75,
        display: 'inline-block'
    }}>
        {text}
    </span>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const NeuroIdentity: React.FC = () => {
    const navigate = useNavigate();
    const { playClick, playHover } = useSound();
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollHintRef = useRef<HTMLDivElement>(null);

    const cardRef1 = useRef<HTMLDivElement>(null); // INTRO — two lines
    const cardRef2 = useRef<HTMLDivElement>(null); // MATH — left
    const cardRef3 = useRef<HTMLDivElement>(null); // SOUL — right
    const cardRef4 = useRef<HTMLDivElement>(null); // CONVERGENCE
    const cardRef5 = useRef<HTMLDivElement>(null); // CTA
    const convergenceGlowRef = useRef<HTMLDivElement>(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mouse tilt parallax
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1200px) rotateX(${(y / (rect.height / 2)) * -4}deg) rotateY(${(x / (rect.width / 2)) * 4}deg) scale(1.015)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
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

            // ── PHASE 1: THE PREMISE — two lines (0 → 3)
            tl.to(cardRef1.current, { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 0.0)
              .to(cardRef1.current, { autoAlpha: 0, y: -50, duration: 0.8, ease: 'power2.in' }, 2.2);

            // ── PHASE 2: MATH LINE — emerges from left, slightly up (3 → 6)
            tl.to(cardRef2.current, { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: 'power3.out' }, 3.0)
              .to(cardRef2.current, { autoAlpha: 0, x: isMobile ? -30 : -80, duration: 0.8, ease: 'power2.in' }, 5.2);

            // ── PHASE 3: SOUL LINE — emerges from right, slightly down (6 → 9)
            tl.to(cardRef3.current, { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: 'power3.out' }, 6.2)
              .to(cardRef3.current, { autoAlpha: 0, x: isMobile ? 30 : 80, duration: 0.8, ease: 'power2.in' }, 8.4);

            // ── PHASE 4: CONVERGENCE — explodes in from scale 0 (9 → 12)
            tl.to(cardRef4.current, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' }, 9.4)
              .to(convergenceGlowRef.current, { opacity: 1, scale: 1.6, duration: 1.4, ease: 'expo.out' }, 9.4)
              .to(cardRef4.current, { autoAlpha: 0, scale: 1.08, duration: 0.8, ease: 'power2.in' }, 11.8)
              .to(convergenceGlowRef.current, { opacity: 0, duration: 0.6 }, 11.8);

            // ── PHASE 5: CTA (12 → end)
            tl.to(cardRef5.current, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 12.6);

            if (scrollHintRef.current) {
                tl.to(scrollHintRef.current, { autoAlpha: 0, duration: 0.4 }, 12.6);
            }

        }, containerRef);

        return () => ctx.revert();
    }, [isMobile]);

    // ── LAYOUT HELPERS ──────────────────────────────
    const overlay: React.CSSProperties = {
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 10, pointerEvents: 'none', overflow: 'hidden'
    };

    const slide = (justify: 'center' | 'flex-start' | 'flex-end'): React.CSSProperties => ({
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center',
        justifyContent: isMobile ? 'center' : justify,
        padding: isMobile ? '0 1.25rem' : '0 clamp(2rem, 7vw, 9rem)',
        boxSizing: 'border-box'
    });

    // Shared card shell — no glow, very minimal glass
    const glassCard = (accentColor: string, side: 'left' | 'right' | 'center', maxW = 520): React.CSSProperties => ({
        background: 'linear-gradient(145deg, rgba(5, 8, 16, 0.55) 0%, rgba(2, 4, 8, 0.72) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: side === 'right' && !isMobile ? '1px solid rgba(255,255,255,0.06)' : `3px solid ${accentColor}`,
        borderRight: side === 'right' && !isMobile ? `3px solid ${accentColor}` : '1px solid rgba(255,255,255,0.06)',
        padding: isMobile ? '2rem 1.5rem' : '3rem 2.8rem',
        borderRadius: '14px',
        boxShadow: `0 24px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)`,
        position: 'relative',
        transition: 'transform 0.12s ease-out',
        width: '100%',
        maxWidth: `${maxW}px`,
        boxSizing: 'border-box',
        cursor: 'default',
        pointerEvents: 'auto',
        maxHeight: isMobile ? '82vh' : 'none',
        overflowY: isMobile ? 'auto' : 'visible'
    });

    return (
        <>
            {/* GLOBAL KEYFRAMES */}
            <style>{`
                @keyframes scanline-sweep {
                    0% { transform: translateY(-1px); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.3; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
                @keyframes ni-blink {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 0.1; }
                }
                @keyframes ni-pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.9; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes ni-float-up {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes ni-gradient-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <div ref={containerRef} className="neuro-identity-master" style={{ width: '100%', position: 'relative', background: '#000' }}>

                {/* SCROLL TRACK */}
                <div style={{ height: '1200vh', width: '100%', pointerEvents: 'none' }} />

                {/* CANVAS WINDOW */}
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, overflow: 'hidden' }}>
                    <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
                        <color attach="background" args={['#000']} />
                        <DNAHelix />
                        <EffectComposer>
                            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                        </EffectComposer>
                    </Canvas>

                    {/* Scroll hint */}
                    <div ref={scrollHintRef} style={{ pointerEvents: 'none' }}>
                        <InteractionGuide
                            items={[{ type: 'scroll', text: 'DESLIZAR PARA EXPLORAR LA SIMBIOSIS' }]}
                            style={{ zIndex: 9999, bottom: '3.5rem' }}
                        />
                    </div>

                    {/* CONVERGENCE BG GLOW (behind card 4) */}
                    <div
                        ref={convergenceGlowRef}
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%) scale(1)',
                            width: isMobile ? '300px' : '500px',
                            height: isMobile ? '300px' : '500px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, rgba(255,0,128,0.08) 40%, transparent 70%)',
                            opacity: 0,
                            pointerEvents: 'none',
                            zIndex: 9,
                            filter: 'blur(20px)'
                        }}
                    />

                    {/* ── NARRATIVE CARDS ─────────────────────────── */}
                    <div style={overlay}>

                        {/* ══ CARD 1: THE PREMISE ══════════════════════
                            Two lines, a rhythm, a tension.
                            No sales pitch — just the concept revealed.       */}
                        <div style={slide('center')}>
                            <div
                                ref={cardRef1}
                                style={{
                                    ...glassCard('#00E5FF', 'center', 680),
                                    textAlign: 'center',
                                    opacity: 0, visibility: 'hidden',
                                    transform: 'translateY(40px)',
                                    animation: 'ni-float-up 4s ease-in-out infinite'
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CornerBrackets color="#00E5FF" locLabel="SIGNAL.INIT" techLabel="STRAND_DETECT" />
                                <ScanLine color="#00E5FF" />

                                {/* Two lines visual motif */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
                                    {/* Math line */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '2px', height: isMobile ? '40px' : '56px', background: 'linear-gradient(to bottom, transparent, #00E5FF)' }} />
                                        <IconMath color="#00E5FF" size={isMobile ? 18 : 20} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#00E5FF', letterSpacing: '0.2em', opacity: 0.7 }}>ΛΌΓΟΣ</span>
                                    </div>
                                    {/* Central pulse */}
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', marginBottom: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 10px #fff' }} />
                                        <div style={{ position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', animation: 'ni-pulse-ring 1.8s ease-out infinite' }} />
                                    </div>
                                    {/* Soul line */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '2px', height: isMobile ? '40px' : '56px', background: 'linear-gradient(to bottom, transparent, #FF0080)' }} />
                                        <IconSoul color="#FF0080" size={isMobile ? 18 : 20} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: '#FF0080', letterSpacing: '0.2em', opacity: 0.7 }}>ΠΆΘΟΣ</span>
                                    </div>
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: isMobile ? '1.6rem' : 'clamp(2rem, 4.5vw, 3.2rem)',
                                    fontWeight: 900,
                                    letterSpacing: '-0.02em',
                                    color: '#fff',
                                    marginBottom: '0.75rem',
                                    lineHeight: 1.05,
                                    textTransform: 'uppercase'
                                }}>
                                    DOS LÍNEAS.<br />
                                    <span style={{
                                        backgroundImage: 'linear-gradient(90deg, #00E5FF, #FF0080)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        backgroundSize: '200% auto',
                                        animation: 'ni-gradient-flow 3s linear infinite'
                                    }}>UN ADN.</span>
                                </h2>
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    lineHeight: 1.75,
                                    color: 'rgba(255,255,255,0.65)',
                                    fontWeight: 300,
                                    maxWidth: '480px',
                                    margin: '0 auto'
                                }}>
                                    Una vibra matemática. Otra vibra humana.
                                    Las dos se entrelazan y forman algo que ninguna podría ser sola.
                                </p>
                            </div>
                        </div>

                        {/* ══ CARD 2: MATH STRAND ══════════════════════
                            Cold, geometric, monospaced — emerges left.
                            Typography: uppercase, tight, mono-grid feel.       */}
                        <div style={slide('flex-start')}>
                            <div
                                ref={cardRef2}
                                style={{
                                    ...glassCard('#00E5FF', 'left'),
                                    opacity: 0, visibility: 'hidden',
                                    transform: isMobile ? 'translateY(50px)' : 'translateX(-120px) translateY(-20px)'
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CornerBrackets color="#00E5FF" locLabel="STRAND.01" techLabel="LOGIC_CORE" />
                                <ScanLine color="#00E5FF" />

                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                                    <IconMath color="#00E5FF" size={isMobile ? 18 : 20} />
                                    <div>
                                        <TypedLabel text="01 // RIGOR MATEMÁTICO" color="#00E5FF" />
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'rgba(0,229,255,0.4)', letterSpacing: '0.15em', marginTop: '2px' }}>
                                            HEMISFERIO_IZQUIERDO :: LÓGICA
                                        </div>
                                    </div>
                                </div>

                                {/* The headline — geometric, cold, precise */}
                                <h2 style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 3.2vw, 2.6rem)',
                                    fontWeight: 700,
                                    color: '#fff',
                                    marginBottom: '1.25rem',
                                    lineHeight: 1.0,
                                    letterSpacing: '-0.03em',
                                    textTransform: 'uppercase'
                                }}>
                                    LA LÓGICA<br />
                                    <span style={{ color: '#00E5FF' }}>QUE NO FALLA.</span>
                                </h2>

                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: isMobile ? '0.88rem' : '0.95rem',
                                    lineHeight: 1.75,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontWeight: 300,
                                    marginBottom: '2rem'
                                }}>
                                    Sin estructura, el caos no escala. Construimos con ingeniería de precisión:
                                    arquitecturas que resisten, velocidad que convierte y sistemas que no necesitan perdón.
                                </p>

                                {/* Metric row */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.75rem',
                                    borderTop: '1px solid rgba(0,229,255,0.12)',
                                    paddingTop: '1.5rem'
                                }}>
                                    {[
                                        { val: '<0.8s', label: 'LOAD TIME' },
                                        { val: '99.9%', label: 'UPTIME' },
                                        { val: 'A+', label: 'PERF SCORE' },
                                        { val: '0ms', label: 'DOWNTIME' }
                                    ].map(m => (
                                        <div key={m.label} style={{ padding: '0.6rem 0.8rem', border: '1px solid rgba(0,229,255,0.1)', borderRadius: '6px', background: 'rgba(0,229,255,0.03)' }}>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 700, color: '#00E5FF', lineHeight: 1 }}>{m.val}</div>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'rgba(0,229,255,0.5)', letterSpacing: '0.2em', marginTop: '4px' }}>{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ══ CARD 3: SOUL STRAND ══════════════════════
                            Warm, organic, editorial — emerges right.
                            Typography: expressive, flowing, human.             */}
                        <div style={slide('flex-end')}>
                            <div
                                ref={cardRef3}
                                style={{
                                    ...glassCard('#FF0080', 'right'),
                                    opacity: 0, visibility: 'hidden',
                                    transform: isMobile ? 'translateY(50px)' : 'translateX(120px) translateY(20px)'
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CornerBrackets color="#FF0080" locLabel="STRAND.02" techLabel="SOUL_CORE" />
                                <ScanLine color="#FF0080" />

                                {/* Header — mirrored */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                                    {!isMobile && <TypedLabel text="02 // INSTINTO HUMANO" color="#FF0080" />}
                                    <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                                        {isMobile && <TypedLabel text="02 // INSTINTO HUMANO" color="#FF0080" />}
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'rgba(255,0,128,0.4)', letterSpacing: '0.15em', marginTop: '2px', textAlign: isMobile ? 'left' : 'right' }}>
                                            HEMISFERIO_DERECHO :: EMOCIÓN
                                        </div>
                                    </div>
                                    <IconSoul color="#FF0080" size={isMobile ? 18 : 20} />
                                </div>

                                {/* The headline — editorial, warm, organic */}
                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 3.2vw, 2.6rem)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    marginBottom: '1.25rem',
                                    lineHeight: 1.05,
                                    letterSpacing: '0.02em',
                                    textAlign: isMobile ? 'left' : 'right',
                                    textTransform: 'uppercase',
                                    fontStyle: 'italic'
                                }}>
                                    EL INSTINTO<br />
                                    <span style={{ color: '#FF0080' }}>QUE ENAMORA.</span>
                                </h2>

                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: isMobile ? '0.88rem' : '0.95rem',
                                    lineHeight: 1.75,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontWeight: 300,
                                    marginBottom: '2rem',
                                    textAlign: isMobile ? 'left' : 'right'
                                }}>
                                    Sin emoción, la lógica es ruido. Diseñamos experiencias
                                    que el cerebro reconoce antes de que el ojo termine de leer.
                                    Psicología visual convertida en arquitectura de deseo.
                                </p>

                                {/* Pulse signal bar */}
                                <div style={{
                                    borderTop: '1px solid rgba(255,0,128,0.12)',
                                    paddingTop: '1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.6rem',
                                    alignItems: isMobile ? 'flex-start' : 'flex-end'
                                }}>
                                    {[
                                        { label: 'RETENCIÓN VISUAL', pct: 92 },
                                        { label: 'TASA DE CONVERSIÓN', pct: 78 },
                                        { label: 'RESPUESTA EMOCIONAL', pct: 96 }
                                    ].map(b => (
                                        <div key={b.label} style={{ width: '100%', maxWidth: '260px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'rgba(255,0,128,0.6)', letterSpacing: '0.15em' }}>{b.label}</span>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: '#FF0080', fontWeight: 700 }}>{b.pct}%</span>
                                            </div>
                                            <div style={{ height: '2px', background: 'rgba(255,0,128,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${b.pct}%`, background: 'linear-gradient(to right, rgba(255,0,128,0.5), #FF0080)', borderRadius: '2px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ══ CARD 4: CONVERGENCE ══════════════════════
                            THE CLIMAX. Explodes in. Both strands fuse.
                            The glow behind it makes the canvas pulse.          */}
                        <div style={slide('center')}>
                            <div
                                ref={cardRef4}
                                style={{
                                    ...glassCard('rgba(255,255,255,0.3)', 'center', 700),
                                    textAlign: 'center',
                                    opacity: 0, visibility: 'hidden',
                                    transform: 'scale(0.7)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderLeft: '1px solid rgba(255,255,255,0.1)',
                                    borderRight: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 0 80px rgba(0,229,255,0.08), 0 0 80px rgba(255,0,128,0.08), 0 24px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)'
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CornerBrackets color="#ffffff" locLabel="NEXUS.SYNAPSE" techLabel="STRAND_MERGE" />

                                {/* Two icons merging into one */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '1rem' : '1.5rem', marginBottom: '1.75rem' }}>
                                    <IconMath color="#00E5FF" size={isMobile ? 18 : 20} />
                                    <div style={{ position: 'relative', width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px' }}>
                                        <IconFusion size={isMobile ? 20 : 24} />
                                        {/* Pulse rings */}
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', animation: 'ni-pulse-ring 2s ease-out infinite' }} />
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', animation: 'ni-pulse-ring 2s ease-out 0.6s infinite' }} />
                                    </div>
                                    <IconSoul color="#FF0080" size={isMobile ? 18 : 20} />
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: isMobile ? '2rem' : 'clamp(2.4rem, 5.5vw, 4rem)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    marginBottom: '0.5rem',
                                    lineHeight: 1.0,
                                    letterSpacing: '-0.02em',
                                    textTransform: 'uppercase'
                                }}>
                                    LA DOBLE<br />
                                    <span style={{
                                        backgroundImage: 'linear-gradient(90deg, #00E5FF 0%, #ffffff 50%, #FF0080 100%)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        backgroundSize: '200% auto',
                                        animation: 'ni-gradient-flow 4s linear infinite'
                                    }}>HÉLICE.</span>
                                </h2>

                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: isMobile ? '0.6rem' : '0.7rem',
                                    letterSpacing: '0.25em',
                                    color: 'rgba(255,255,255,0.4)',
                                    marginBottom: '2rem',
                                    textTransform: 'uppercase'
                                }}>
                                    INGENIERÍA · INSTINTO · SIMBIOSIS
                                </div>

                                {/* The dividing line between two worlds */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #00E5FF)' }} />
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 8px #fff' }} />
                                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #FF0080)' }} />
                                </div>

                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: isMobile ? '0.9rem' : '1.05rem',
                                    lineHeight: 1.8,
                                    color: 'rgba(255,255,255,0.75)',
                                    fontWeight: 300,
                                    maxWidth: '560px',
                                    margin: '0 auto'
                                }}>
                                    El ADN de tu marca no es ni solo lógica ni solo emoción.
                                    Es la tensión entre las dos. El punto donde la precisión se vuelve belleza
                                    y la belleza se convierte en conversión.
                                </p>
                            </div>
                        </div>

                        {/* ══ CARD 5: CTA ══════════════════════════════ */}
                        <div style={slide('center')}>
                            <div
                                ref={cardRef5}
                                style={{
                                    ...glassCard('#FF0080', 'center', 640),
                                    textAlign: 'center',
                                    opacity: 0, visibility: 'hidden',
                                    transform: 'translateY(50px)',
                                    maxHeight: isMobile ? '88vh' : 'none'
                                }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CornerBrackets color="#FF0080" locLabel="SYS.EXIT" techLabel="SOVEREIGN_LAUNCH" />
                                <ScanLine color="#FF0080" />

                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <IconZap color="#FF0080" size={isMobile ? 18 : 20} />
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 5vw, 3.2rem)',
                                    fontWeight: 900,
                                    letterSpacing: '-0.01em',
                                    color: '#fff',
                                    marginBottom: '0.75rem',
                                    lineHeight: 1.0,
                                    textTransform: 'uppercase'
                                }}>
                                    LIDERA<br />
                                    <span style={{ color: '#FF0080' }}>O SIGUE.</span>
                                </h2>

                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: isMobile ? '0.88rem' : '0.98rem',
                                    lineHeight: 1.75,
                                    color: 'rgba(255,255,255,0.65)',
                                    marginBottom: isMobile ? '1.75rem' : '2.5rem',
                                    fontWeight: 300,
                                    maxWidth: '480px',
                                    margin: '0 auto',
                                    paddingBottom: isMobile ? '1.75rem' : '2.5rem'
                                }}>
                                    Tu competencia usa herramientas genéricas para hacer marcas genéricas.
                                    Inyecta el ADN de la doble hélice de{' '}
                                    <span className="brand-text">Agenc<span className="ia-highlight">IA</span></span>{' '}
                                    en tu negocio y domina tu sector hoy mismo.
                                </p>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    justifyContent: 'center',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    width: '100%'
                                }}>
                                    <LiquidContactCTA text="SOLICITAR CONSULTA" />
                                    <button
                                        onClick={() => { playClick(); navigate('/infraestructura'); }}
                                        style={{
                                            background: 'transparent',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.18)',
                                            padding: '0 2.2rem',
                                            height: '56px',
                                            borderRadius: '30px',
                                            fontSize: '0.75rem',
                                            fontWeight: 800,
                                            letterSpacing: '0.14em',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontFamily: 'var(--font-heading)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            boxSizing: 'border-box',
                                            width: isMobile ? '100%' : 'auto',
                                            textTransform: 'uppercase'
                                        }}
                                        onMouseEnter={(e) => {
                                            playHover();
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                            e.currentTarget.style.borderColor = '#00E5FF';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,229,255,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        VER CÓMO TRABAJAMOS
                                        <svg width="12" height="12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M25 75 L75 25" />
                                            <path d="M45 25 H75 V55" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default NeuroIdentity;
