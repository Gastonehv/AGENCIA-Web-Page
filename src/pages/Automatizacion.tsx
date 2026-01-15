import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractionGuide from '../components/InteractionGuide';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

gsap.registerPlugin(ScrollTrigger);

// Mobile and Touch detection hook
const useTouchDevice = () => {
    const [isTouch, setIsTouch] = useState(() => {
        if (typeof window !== 'undefined') {
            return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        }
        return false;
    });

    useEffect(() => {
        const checkTouch = () => {
            const hasTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
            setIsTouch(hasTouch);
        };
        checkTouch();
        window.addEventListener('touchstart', checkTouch, { once: true });
        return () => window.removeEventListener('touchstart', checkTouch);
    }, []);

    return isTouch;
};

// --- 3D Logic ---

const generateGridPoints = (size: number, spacing: number) => {
    const points = [];
    const offset = (size * spacing) / 2;
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                points.push((x * spacing) - offset, (y * spacing) - offset, (z * spacing) - offset);
            }
        }
    }
    return new Float32Array(points);
};

// Global scroll state
const scrollState = {
    target: 0,
    current: 0
};

const DigitalGrid = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const geometryRef = useRef<THREE.BufferGeometry>(null);

    // Initial Data
    const [positions] = useState(() => generateGridPoints(15, 0.5));
    const count = positions.length / 3;

    // Positions Arrays
    const targetPositions = useMemo(() => Float32Array.from(positions), [positions]);
    const [startPositions] = useState(() => {
        const arr = new Float32Array(positions.length);
        for (let i = 0; i < arr.length; i++) {
            // True Chaos: Random distribution filling the screen
            arr[i] = (Math.random() - 0.5) * 50;
        }
        return arr;
    });

    // Current Positions Buffer (Mutable)
    const currentPositions = useMemo(() => Float32Array.from(startPositions), [startPositions]);

    // Color Arrays - Automation palette (more green/cyan focused)
    const chaosColors = useMemo(() => {
        const arr = new Float32Array(positions.length);
        const color = new THREE.Color();
        for (let i = 0; i < count; i++) {
            const rand = ((i * 0.73) % 1);
            if (rand > 0.5) {
                // Verde Neón primario (Efficiency)
                color.set('#00FF99');
            } else if (rand > 0.25) {
                // Cyan Eléctrico (Flow)
                color.set('#00E5FF');
            } else {
                // Naranja Alerta (Action Points)
                color.set('#FF6B35');
            }
            arr[i * 3] = color.r;
            arr[i * 3 + 1] = color.g;
            arr[i * 3 + 2] = color.b;
        }
        return arr;
    }, [positions, count]);

    const orderColors = useMemo(() => {
        const arr = new Float32Array(positions.length);
        const color = new THREE.Color();
        for (let i = 0; i < count; i++) {
            // Gris Técnico (Ordered Structure)
            color.set('#1A2530');
            arr[i * 3] = color.r;
            arr[i * 3 + 1] = color.g;
            arr[i * 3 + 2] = color.b;
        }
        return arr;
    }, [positions, count]);

    // Current Colors Buffer (Mutable)
    const currentColors = useMemo(() => Float32Array.from(chaosColors), [chaosColors]);

    useFrame(({ clock }) => {
        if (!geometryRef.current || !pointsRef.current) return;

        // 1. READ NATIVE SCROLL
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const rawProgress = window.scrollY / (maxScroll || 1);

        // 2. PHYSICS LERP
        scrollState.current += (rawProgress - scrollState.current) * 0.05;
        const p = scrollState.current;

        // 3. ANIMATION LOOP
        const posAttr = geometryRef.current.attributes.position;
        const colAttr = geometryRef.current.attributes.color;
        const time = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // --- POSITIONS & TURBULENCE ---
            const stagger = Math.sin(i * 0.05) * 0.1;
            let progress = p * 1.5 - stagger;
            progress = Math.max(0, Math.min(1, progress));
            const ease = 1 - Math.pow(1 - progress, 3);

            // Chaotic Turbulence
            const turbulence = (1 - ease) * 0.8;
            const vibrationX = Math.sin(time * 15 + i * 0.1) * turbulence;
            const vibrationY = Math.cos(time * 17 + i * 0.2) * turbulence;
            const vibrationZ = Math.sin(time * 19 + i * 0.3) * turbulence;

            // Positions
            posAttr.setXYZ(i,
                startPositions[ix] + (targetPositions[ix] - startPositions[ix]) * ease + vibrationX,
                startPositions[iy] + (targetPositions[iy] - startPositions[iy]) * ease + vibrationY,
                startPositions[iz] + (targetPositions[iz] - startPositions[iz]) * ease + vibrationZ
            );

            // --- COLORS & FLOW PULSE ---
            const rStart = chaosColors[ix];
            const gStart = chaosColors[iy];
            const bStart = chaosColors[iz];

            let rEnd = orderColors[ix];
            let gEnd = orderColors[iy];
            let bEnd = orderColors[iz];

            // Flow Pulse Logic (Data Streams)
            if (p > 0.4) {
                const spatialPhase = (startPositions[ix] + startPositions[iy] + startPositions[iz]) / 5.0;
                const flowWave = Math.sin(time * 1.5 + spatialPhase) * 0.5 + 0.5;
                const dataPulse = Math.sin(time * 4.0 + spatialPhase * 2.0) * 0.5 + 0.5;

                if (flowWave > 0.8 && dataPulse > 0.5) {
                    // Active Flow - Verde Neón Flash
                    const intensity = (flowWave - 0.8) / 0.2;
                    const flashColor = new THREE.Color('#00FF99');
                    rEnd = THREE.MathUtils.lerp(0.10, flashColor.r, intensity);
                    gEnd = THREE.MathUtils.lerp(0.15, flashColor.g, intensity);
                    bEnd = THREE.MathUtils.lerp(0.19, flashColor.b, intensity);
                } else if (flowWave > 0.5) {
                    // Data Transit - Cyan Glow
                    const glowColor = new THREE.Color('#00E5FF');
                    rEnd = glowColor.r * 0.4;
                    gEnd = glowColor.g * 0.4;
                    bEnd = glowColor.b * 0.4;
                } else {
                    // Idle State
                    rEnd = 0.10; gEnd = 0.15; bEnd = 0.19;
                }
            }

            colAttr.setXYZ(i,
                rStart + (rEnd - rStart) * ease,
                gStart + (gEnd - gStart) * ease,
                bStart + (bEnd - bStart) * ease
            );
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // 4. TRANSFORMS
        pointsRef.current.rotation.y = p * Math.PI * 2;
        pointsRef.current.rotation.x = p * Math.PI * 0.2;

        const scale = 0.5 + (p * 0.8);
        pointsRef.current.scale.set(scale, scale, scale);
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={currentPositions}
                    itemSize={3}
                    args={[currentPositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={currentColors}
                    itemSize={3}
                    args={[currentColors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors={true}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
};

// --- Main Component ---

const Automatizacion: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const isTouch = useTouchDevice();
    const containerRef = useRef<HTMLDivElement>(null);
    const actionBtnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll Reset on Mount
    React.useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Automation Sections
            const sections = document.querySelectorAll('.auto-section');
            sections.forEach((section) => {
                const title = section.querySelector('.auto-title');
                const text = section.querySelector('.auto-text');
                const decoration = section.querySelector('.flow-decoration');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'center center',
                        end: '+=2500',
                        pin: true,
                        pinSpacing: false,
                        scrub: 1.5,
                        toggleActions: 'play reverse play reverse'
                    }
                });

                // 1. Decoration Flow In
                tl.fromTo(decoration,
                    { opacity: 0, scale: 0.5 },
                    { opacity: 0.8, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
                );

                // 2. Title Reveal
                tl.fromTo(title,
                    { yPercent: 110, rotateX: -20, opacity: 0, transformOrigin: 'top center' },
                    { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
                    '-=0.3'
                );

                // 3. Text Unfold
                tl.fromTo(text,
                    { opacity: 0, y: 50, filter: 'blur(10px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
                    '-=1'
                );

                // 4. Elegant Exit
                tl.to([title, text, decoration],
                    { y: -100, opacity: 0, filter: 'blur(20px)', duration: 1, stagger: 0.1, ease: 'power2.in' },
                    '+=2'
                );
            });

            // Final Section Animation
            const tlFinal = gsap.timeline({
                scrollTrigger: {
                    trigger: '.final-auto-section',
                    start: 'center center',
                    end: '+=1500',
                    pin: true,
                    scrub: 1,
                    toggleActions: 'play reverse play reverse'
                }
            });

            tlFinal.fromTo('.final-auto-1', { opacity: 0, y: 50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' })
                .fromTo('.final-auto-2', { opacity: 0, scale: 0.9, filter: 'blur(15px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }, '-=0.5')
                .fromTo('.final-auto-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
                .to({}, { duration: 3 })
                .add('switch')
                .fromTo('.next-auto-btn',
                    { autoAlpha: 0, scale: 0.8, y: 100 },
                    { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.7)', pointerEvents: 'auto' },
                    'switch'
                )
                .to('.interaction-hud', { autoAlpha: 0, duration: 0.2 }, 'switch');

        }, containerRef);

        return () => ctx.revert();
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
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <SEO
                title="Automatización & Plataformas 360"
                description="Eficiencia imposible para humanos. Sistemas de gestión total y agentes autónomos de IA."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Automatización",
                "provider": {
                    "@type": "Organization",
                    "name": "AgencIA"
                },
                "description": "Automatización de procesos empresariales con IA y plataformas de gestión 360°."
            }} />

            {/* 1. Fixed WebGL Background */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1, pointerEvents: isTouch ? 'none' : 'auto' }}>
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    style={{
                        touchAction: 'auto',
                        pointerEvents: isTouch ? 'none' : 'auto'
                    }}
                >
                    <color attach="background" args={['#050A0D']} /> {/* Darker, more techy */}
                    <DigitalGrid />
                    {!isTouch && (
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={true}
                            autoRotate={true}
                            autoRotateSpeed={0.6}
                            enableDamping={true}
                        />
                    )}
                </Canvas>
            </div>

            {/* 2. Scrollable Content */}
            <div style={{ height: '1600vh', position: 'relative', zIndex: 10, pointerEvents: isTouch ? 'auto' : 'none' }}>

                {/* Interaction HUD */}
                <div className="interaction-hud" style={{ position: 'fixed', bottom: '1rem', width: '100%', zIndex: 20 }}>
                    <InteractionGuide mode="both" />
                </div>

                {/* HERO */}
                <div style={{
                    position: 'absolute', top: '40vh', width: '100%', textAlign: 'center',
                    color: '#00FF99', textShadow: '0 0 20px rgba(0, 255, 153, 0.5)'
                }}>
                    <div style={{ opacity: 0.7, marginBottom: '1rem', color: '#fff' }}>[ PROTOCOLO DE EFICIENCIA ]</div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', textTransform: 'uppercase' }}>
                        AUTOMATIZACIÓN TOTAL
                    </h1>
                </div>

                {/* SECTION 1: Control Total */}
                <div className="auto-section" style={{
                    position: 'absolute', top: '150vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box'
                }}>
                    <div className="flow-decoration" style={{
                        opacity: 0.3,
                        marginBottom: '1rem',
                        color: '#00FF99',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em'
                    }}>
                        {'{ PROCESS_SYNC }'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="auto-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 255, 153, 0.4)',
                            textWrap: 'balance',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            padding: isMobile ? '0 1rem' : '0'
                        }}>
                            PLATAFORMA 360°<br /> CONTROL ABSOLUTO
                        </h2>
                    </div>

                    <p className="auto-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        width: '100%',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        wordSpacing: '0.15em',
                        letterSpacing: '0.02em',
                        color: '#ffffff',
                        background: 'rgba(5, 10, 13, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 255, 153, 0.1)',
                        borderLeft: '2px solid #00FF99',
                        textAlign: 'left',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        boxSizing: 'border-box'
                    }}>
                        Las tareas repetitivas devoran tu tiempo y tu margen. En AgencIA diseñamos <strong style={{ color: '#00FF99' }}>ecosistemas de gestión empresarial</strong> que centralizan operaciones, inventarios, clientes y finanzas en una sola interfaz. Tu negocio opera en piloto automático mientras tú te enfocas en lo que realmente importa: crecer.
                    </p>

                    {/* HUMAN TRANSLATION - SECTION 1 */}
                    <div className="human-translation" style={{
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '1.5rem auto 0',
                        padding: isMobile ? '1rem' : '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(0, 255, 153, 0.08) 0%, rgba(0, 229, 255, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 255, 153, 0.2)',
                        position: 'relative',
                        textAlign: 'left'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: '#00FF99',
                            letterSpacing: '0.2em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                background: '#00FF99',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #00FF99'
                            }} />
                            EN SIMPLE
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 300
                        }}>
                            Cambiamos el <strong style={{ color: '#fff', fontWeight: 600 }}>caos por orden automático</strong>.
                            Sistemas que trabajan mientras tú descansas, gestionando clientes e inventarios sin errores humanos.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                            {['Eficiencia Total', 'Cero Errores', 'Ahorro de Tiempo'].map((tag) => (
                                <span key={tag} style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#00FF99',
                                    background: 'rgba(0, 255, 153, 0.1)',
                                    border: '1px solid rgba(0, 255, 153, 0.3)',
                                    borderRadius: '20px'
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Agentes IA */}
                <div className="auto-section" style={{
                    position: 'absolute', top: '550vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box'
                }}>
                    <div className="flow-decoration" style={{
                        opacity: 0.3,
                        marginBottom: '1rem',
                        color: '#00E5FF',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em'
                    }}>
                        {'[ AI_AGENTS ]'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="auto-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 229, 255, 0.4)',
                            textWrap: 'balance',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            padding: isMobile ? '0 1rem' : '0'
                        }}>
                            AGENTES AUTÓNOMOS<br /> INTELIGENCIA OPERATIVA
                        </h2>
                    </div>
                    <p className="auto-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        width: '100%',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(5, 10, 13, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 229, 255, 0.1)',
                        borderRight: '2px solid #00E5FF',
                        textAlign: isMobile ? 'left' : 'right',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        boxSizing: 'border-box'
                    }}>
                        ¿Y si tus procesos pensaran por sí mismos? Desplegamos <strong style={{ color: '#00E5FF' }}>agentes de IA que ejecutan, deciden y optimizan</strong> sin intervención humana. Desde atención al cliente 24/7 hasta análisis predictivo y generación de reportes. Tu equipo se libera para tareas de alto valor mientras la IA maneja lo demás.
                    </p>

                    {/* HUMAN TRANSLATION - SECTION 2 */}
                    <div className="human-translation" style={{
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '1.5rem auto 0',
                        padding: isMobile ? '1rem' : '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 255, 153, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 229, 255, 0.2)',
                        position: 'relative',
                        textAlign: isMobile ? 'left' : 'right'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: '#00E5FF',
                            letterSpacing: '0.2em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: isMobile ? 'flex-start' : 'flex-end'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                background: '#00E5FF',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #00E5FF'
                            }} />
                            EN SIMPLE
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 300
                        }}>
                            <strong style={{ color: '#fff', fontWeight: 600 }}>Para un equipo humano de 20 personas</strong>, coordinar ventas, soporte y despliegue en 100ms es imposible.
                            Para AgencIA, es solo un martes por la mañana.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                            {['Control Absoluto', 'Sistemas Conectados', 'Visión 360'].map((tag) => (
                                <span key={tag} style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#00E5FF',
                                    background: 'rgba(0, 229, 255, 0.1)',
                                    border: '1px solid rgba(0, 229, 255, 0.3)',
                                    borderRadius: '20px'
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Flujos Conectados */}
                <div className="auto-section" style={{
                    position: 'absolute', top: '950vh', width: '100%', textAlign: 'center',
                    color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box',
                    transform: isMobile ? 'translateY(-8vh)' : 'none'
                }}>
                    <div className="flow-decoration" style={{
                        opacity: 0.3,
                        marginBottom: '1rem',
                        color: '#FF6B35',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em'
                    }}>
                        {'< FLOW_INTEGRATION />'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="auto-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(255, 107, 53, 0.4)',
                            textWrap: 'balance',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            padding: isMobile ? '0 1rem' : '0'
                        }}>
                            FLUJOS SIN FRICCIÓN<br /> CONEXIONES QUE MULTIPLICAN
                        </h2>
                    </div>
                    <p className="auto-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        width: '100%',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(5, 10, 13, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 107, 53, 0.1)',
                        borderBottom: '2px solid #FF6B35',
                        textAlign: isMobile ? 'left' : 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        boxSizing: 'border-box'
                    }}>
                        Tus herramientas actuales no colaboran, compiten. Creamos <strong style={{ color: '#FF6B35' }}>integraciones que conectan CRM, e-commerce, contabilidad y logística</strong> en un flujo continuo. Cada dato en su lugar, cada proceso eslabonado. Sin copiar y pegar. Sin errores humanos. Solo eficiencia pura.
                    </p>

                    {/* HUMAN TRANSLATION - SECTION 3 */}
                    <div className="human-translation" style={{
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '1.5rem auto 0',
                        padding: isMobile ? '1rem' : '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(0, 255, 153, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 107, 53, 0.2)',
                        position: 'relative',
                        textAlign: isMobile ? 'left' : 'center'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: '#FF6B35',
                            letterSpacing: '0.2em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: isMobile ? 'flex-start' : 'center'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                background: '#FF6B35',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #FF6B35'
                            }} />
                            EN SIMPLE
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 300
                        }}>
                            <strong style={{ color: '#fff', fontWeight: 600 }}>Todo conectado, todo funcionando</strong>.
                            Tu web, tu CRM y tu inventario hablando el mismo idioma. Sin copiar y pegar datos; solo eficiencia pura.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: isMobile ? 'flex-start' : 'center' }}>
                            {['Eficiencia Real', 'ROI Inmediato', 'Futuro Digital'].map((tag) => (
                                <span key={tag} style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#FF6B35',
                                    background: 'rgba(255, 107, 53, 0.1)',
                                    border: '1px solid rgba(255, 107, 53, 0.3)',
                                    borderRadius: '20px'
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FINAL COPY SECTION */}
                <div className="final-auto-section" style={{
                    position: 'absolute', top: '1320vh', width: '100%', textAlign: 'center',
                    color: '#fff', padding: '0 2rem', boxSizing: 'border-box',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh',
                    transform: 'translateY(-10vh)'
                }}>
                    <h3 className="final-auto-1" style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: 300,
                        marginBottom: '1rem',
                        opacity: 0,
                        visibility: 'visible',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        wordSpacing: '0.2em',
                        letterSpacing: '0.05em'
                    }}>
                        No eliminamos tareas...
                    </h3>

                    <h1 className="final-auto-2" style={{
                        fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        lineHeight: 0.9,
                        marginBottom: '2rem',
                        background: 'linear-gradient(to bottom, #fff, #00FF99)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 30px rgba(0, 255, 153, 0.5)) drop-shadow(0 4px 8px rgba(0,0,0,0.8))',
                        opacity: 0,
                        width: '100%',
                        padding: '0 1rem',
                        boxSizing: 'border-box',
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word'
                    }}>
                        LIBERAMOS<br />TU POTENCIAL.
                    </h1>

                    <p className="final-auto-3" style={{
                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        opacity: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        wordSpacing: '0.15em',
                        lineHeight: 1.5
                    }}>
                        En AgencIA, transformamos el ruido operativo en sinfonía automatizada.<br />
                        <strong style={{ color: '#00FF99', fontWeight: 600 }}>Porque tu tiempo es tu recurso más valioso.</strong>
                    </p>
                </div>

                {/* ELEGANT CTA - Minimalist Text Link */}
                <div className="action-bar" style={{
                    position: 'fixed',
                    bottom: '3rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    pointerEvents: 'none'
                }}>
                    <a
                        ref={actionBtnRef}
                        href="/#case-03"
                        className="next-auto-btn elegant-cta"
                        style={{
                            opacity: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#00FF99',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                            fontWeight: 500,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            pointerEvents: 'none',
                            position: 'relative',
                            padding: '0.5rem 0',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {/* Underline with animated gradient */}
                        <span className="cta-underline" />

                        {/* Text */}
                        <span style={{ position: 'relative', zIndex: 2 }}>
                            Continuar Exploración
                        </span>

                        {/* Floating Arrow */}
                        <span className="cta-arrow" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid rgba(0, 255, 153, 0.3)',
                            fontSize: '0.9rem',
                            position: 'relative',
                            transition: 'all 0.4s ease'
                        }}>
                            →
                            <span className="arrow-glow" />
                        </span>
                    </a>

                    <style>{`
                        .elegant-cta {
                            filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.2));
                        }
                        .elegant-cta:hover {
                            color: #fff !important;
                            filter: drop-shadow(0 0 30px rgba(0, 255, 153, 0.5));
                        }
                        .elegant-cta:hover .cta-arrow {
                            background: rgba(0, 255, 153, 0.15);
                            border-color: rgba(0, 255, 153, 0.6);
                            transform: translateX(5px);
                        }
                        .elegant-cta:hover .cta-underline {
                            width: 100%;
                            opacity: 1;
                        }
                        .elegant-cta:hover .arrow-glow {
                            opacity: 1;
                        }
                        .cta-underline {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 0;
                            height: 1px;
                            background: linear-gradient(90deg, #00FF99, #00E5FF, #00FF99);
                            background-size: 200% 100%;
                            opacity: 0;
                            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                            animation: shimmer 3s infinite linear;
                        }
                        .arrow-glow {
                            position: absolute;
                            inset: -2px;
                            border-radius: 50%;
                            background: radial-gradient(circle, rgba(0, 255, 153, 0.4) 0%, transparent 70%);
                            opacity: 0;
                            transition: opacity 0.4s ease;
                            animation: pulse-soft 2s infinite ease-in-out;
                        }
                        @keyframes shimmer {
                            0% { background-position: 200% 0; }
                            100% { background-position: -200% 0; }
                        }
                        @keyframes pulse-soft {
                            0%, 100% { transform: scale(1); opacity: 0.3; }
                            50% { transform: scale(1.2); opacity: 0.6; }
                        }
                    `}</style>
                </div>

            </div>

        </div>
    );
};

export default Automatizacion;
