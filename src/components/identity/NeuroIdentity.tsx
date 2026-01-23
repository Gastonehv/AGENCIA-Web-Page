import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAHelix from './DNAHelix';

// ... (imports remain)
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const NeuroIdentity: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef1 = useRef<HTMLDivElement>(null);
    const textRef2 = useRef<HTMLDivElement>(null);
    const textRef3 = useRef<HTMLDivElement>(null);
    const textRef4 = useRef<HTMLDivElement>(null);

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

            // PHASE 1: GENESIS (0% - 10%)
            tl.to(textRef1.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
                .to(textRef1.current, { opacity: 0, scale: 1.1, duration: 0.5 }, 0.1);

            // PHASE 2: DIVE (10% - 30%)
            tl.to(textRef2.current, { opacity: 1, y: 0, duration: 0.5 }, 0.15)
                .to(textRef2.current, { opacity: 0, y: -50, duration: 0.5 }, 0.25);

            // PHASE 3: VOYAGE (30% - 80%)
            tl.to(textRef3.current, { opacity: 1, scale: 1, duration: 1 }, 0.35)
                .to(textRef3.current, { opacity: 0, scale: 1.2, filter: 'blur(10px)', duration: 0.5 }, 0.75);

            // PHASE 4: EXIT (85% - 100%)
            tl.to(textRef4.current, { opacity: 1, y: 0, duration: 0.5 }, 0.85);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // SHARED TEXT STYLES
    const textStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: '#fff',
        zIndex: 20,
        width: '100%',
        maxWidth: '1200px',
        padding: '0 2rem',
        opacity: 0,
        pointerEvents: 'none',
        textShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
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
                <div style={{
                    position: 'absolute', bottom: '50px', width: '100%', textAlign: 'center', pointerEvents: 'none', zIndex: 10, mixBlendMode: 'difference'
                }}>
                    <span style={{ color: '#fff', fontSize: 'clamp(10px, 3vw, 12px)', letterSpacing: '0.3em', fontFamily: 'monospace', textTransform: 'uppercase', opacity: 0.8 }}>
                        DESLIZA PARA INICIAR SECUENCIA
                    </span>
                </div>

                {/* --- NARRATIVE OVERLAYS --- */}

                {/* 1. GENESIS */}
                <div ref={textRef1} style={textStyle}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, letterSpacing: '0.2em', fontFamily: 'var(--font-heading)' }}>
                        GENESIS
                    </h2>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontFamily: 'var(--font-mono)', color: '#00FFFF', marginTop: '1rem' }}>
                        EL CÓDIGO NO SOLO FUNCIONA. <strong style={{ color: '#fff' }}>VENDE.</strong>
                    </p>
                </div>

                {/* 2. DIVE */}
                <div ref={textRef2} style={{ ...textStyle, transform: 'translate(-50%, 50%)' }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.9 }}>
                        NO DISEÑAMOS<br />LOGOS
                    </h2>
                    <p style={{ fontSize: '1.2rem', letterSpacing: '0.1em', marginTop: '2rem', borderLeft: '3px solid #FF0080', paddingLeft: '1rem', display: 'inline-block' }}>
                        CONSTRUIMOS AUTORIDAD DE MERCADO
                    </p>
                </div>

                {/* 3. VOYAGE */}
                <div ref={textRef3} style={{ ...textStyle, transform: 'translate(-50%, -50%) scale(0.8)' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1 }}>
                        SI TE VES BARATO<br />
                        <span style={{ color: '#FF0080' }}>TE PAGAN BARATO</span>
                    </h2>
                    <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', opacity: 0.8, marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0' }}>
                        La verdad financiera más brutal: El diseño no es arte, es el multiplicador del precio de tu hora.
                        <br /><strong style={{ color: '#00FFFF' }}>AQUÍ TE VES CARO.</strong>
                    </p>
                </div>

                {/* 4. EXIT */}
                <div ref={textRef4} style={{ ...textStyle, transform: 'translate(-50%, 50%)' }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300 }}>
                        LIDERA<br />O SIGUE
                    </h2>
                    <div style={{ marginTop: '2rem', fontSize: '0.9rem', letterSpacing: '0.3em', color: '#00FFFF' }}>
                        TÚ DECIDES EL RITMO
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NeuroIdentity;
