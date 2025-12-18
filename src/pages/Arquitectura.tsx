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

// Mobile detection hook - detects immediately on first render
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        // Check immediately on initialization (SSR-safe)
        if (typeof window !== 'undefined') {
            return window.matchMedia('(max-width: 768px)').matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        // Sync check
        if (isMobile !== mediaQuery.matches) {
            Promise.resolve().then(() => {
                setIsMobile(mediaQuery.matches);
            });
        }

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [isMobile]);

    return isMobile;
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
    const startPositions = useMemo(() => {
        const arr = new Float32Array(positions.length);
        for (let i = 0; i < arr.length; i++) {
            // Deterministic chaos based on index
            arr[i] = (((i * 1.57) % 60) - 30);
        }
        return arr;
    }, [positions]);

    // Current Positions Buffer (Mutable)
    const currentPositions = useMemo(() => Float32Array.from(startPositions), [startPositions]);

    // Color Arrays
    const chaosColors = useMemo(() => {
        const arr = new Float32Array(positions.length);
        const color = new THREE.Color();
        for (let i = 0; i < count; i++) {
            const rand = ((i * 0.73) % 1);
            if (rand > 0.6) {
                // Verde Turquesa Fosforescente (Main Accent)
                color.set('#00FF99');
            } else if (rand > 0.3) {
                // Púrpura Radioactivo (Secondary Accent)
                color.set('#8F00FF');
            } else {
                // Azul Fusión Nuclear (Depth)
                color.set('#0000FF');
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
            // Gris Cobalto Técnico (Structure Base)
            color.set('#1F2A38');
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

            // --- COLORS & TWINKLE ---
            const rStart = chaosColors[ix];
            const gStart = chaosColors[iy];
            const bStart = chaosColors[iz];

            let rEnd = orderColors[ix];
            let gEnd = orderColors[iy];
            let bEnd = orderColors[iz];

            // Twinkle Logic (Radioactive Decay)
            if (p > 0.4) {
                const spatialPhase = (startPositions[ix] + startPositions[iy] + startPositions[iz]) / 5.0;
                const breathing = Math.sin(time * 1.0 + spatialPhase) * 0.5 + 0.5;
                const nervePulse = Math.sin(time * 3.0 + spatialPhase * 2.0) * 0.5 + 0.5;

                if (breathing > 0.85 && nervePulse > 0.5) {
                    // Active Segment - Verde Turquesa Flash
                    const intensity = (breathing - 0.85) / 0.15;
                    const flashColor = new THREE.Color('#00FF99');
                    rEnd = THREE.MathUtils.lerp(0.12, flashColor.r, intensity);
                    gEnd = THREE.MathUtils.lerp(0.16, flashColor.g, intensity);
                    bEnd = THREE.MathUtils.lerp(0.22, flashColor.b, intensity);
                } else if (breathing > 0.6) {
                    // Semi-Active - Púrpura Glow
                    const glowColor = new THREE.Color('#8F00FF');
                    rEnd = glowColor.r * 0.5;
                    gEnd = glowColor.g * 0.5;
                    bEnd = glowColor.b * 0.5;
                } else {
                    // Resting State - Gris Cobalto
                    rEnd = 0.12; gEnd = 0.16; bEnd = 0.22; // #1F2A38
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

const Arquitectura: React.FC = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll Reset on Mount
    React.useLayoutEffect(() => {
        // Force manual scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Immediate reset
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Backup reset for race conditions
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Architecture Sections
            const sections = document.querySelectorAll('.arch-section');
            sections.forEach((section) => {
                const title = section.querySelector('.arch-title');
                const text = section.querySelector('.arch-text');
                const decoration = section.querySelector('.blueprint-decoration');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'center center', // Lock exactly at center
                        end: '+=2500', // Stay pinned
                        pin: true,
                        pinSpacing: false, // Maintain absolute layout
                        scrub: 1.5, // Smooth scrub
                        toggleActions: 'play reverse play reverse'
                    }
                });

                // 1. Decoration Glitch In
                tl.fromTo(decoration,
                    { opacity: 0, scale: 0.5 },
                    { opacity: 0.8, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
                );

                // 2. Title Reveal (WJY Masked Slide)
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

                // 4. Elegant Exit (Drift Up)
                // We add a 'to' animation at the end of the scroll period
                tl.to([title, text, decoration],
                    { y: -100, opacity: 0, filter: 'blur(20px)', duration: 1, stagger: 0.1, ease: 'power2.in' },
                    '+=2' // Wait a bit before exiting
                );
            });

            // Animate the Final Copy & Interaction Reveal
            const tlFinal = gsap.timeline({
                scrollTrigger: {
                    trigger: '.final-copy-section',
                    start: 'center center',
                    end: '+=2000',
                    pin: true,
                    scrub: 1,
                    toggleActions: 'play reverse play reverse'
                }
            });

            // 1. Text Reveal
            tlFinal.fromTo('.final-line-1', { opacity: 0, y: 50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' })
                .fromTo('.final-line-2', { opacity: 0, scale: 0.9, filter: 'blur(15px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }, '-=0.5')
                .fromTo('.final-line-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')

                // 2. Hold for reading
                .to({}, { duration: 3 })

                .add('switch')

                // 3. Text Persists (Animation Removed)

                // 4. Action Bar Reveal
                .fromTo('.next-protocol-btn',
                    { autoAlpha: 0, scale: 0.5, y: 50 },
                    { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)', pointerEvents: 'auto' },
                    'switch+=0.5'
                )
                .to('.interaction-hud', { autoAlpha: 0, duration: 0.5 }, 'switch');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <SEO
                title="Arquitectura Digital"
                description="Diseño de ecosistemas digitales de alto rendimiento. Infraestructura escalable y código puro."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Arquitectura Digital",
                "provider": {
                    "@type": "Organization",
                    "name": "AgencIA"
                },
                "description": "Desarrollo de ecosistemas digitales optimizados para velocidad y escalabilidad extrema."
            }} />

            {/* 1. Fixed WebGL Background */}
            {/* 1. Fixed WebGL Background - touch-action: none ONLY on canvas to not block page scroll */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 1, pointerEvents: isMobile ? 'none' : 'auto' }}>
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    style={{
                        touchAction: 'none',
                        pointerEvents: isMobile ? 'none' : 'auto'
                    }}
                >
                    <color attach="background" args={['#0A001A']} /> {/* Negro Abisal */}
                    <DigitalGrid />
                    {/* Disable OrbitControls on mobile to allow page scroll */}
                    {!isMobile && (
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={true}
                            autoRotate={true}
                            autoRotateSpeed={0.5}
                            enableDamping={true}
                        />
                    )}
                </Canvas>
            </div>

            {/* 2. Scrollable Content
                - Desktop: pointerEvents: 'none' permite que el canvas 3D reciba eventos del mouse (OrbitControls)
                - Mobile: pointerEvents: 'auto' permite scroll táctil nativo (canvas tiene pointer-events: none vía CSS)
            */}
            <div style={{ height: '1600vh', position: 'relative', zIndex: 10, pointerEvents: isMobile ? 'auto' : 'none' }}>

                {/* Interaction HUD */}
                <div className="interaction-hud" style={{ position: 'fixed', bottom: '1rem', width: '100%', zIndex: 20 }}>
                    <InteractionGuide mode="both" />
                </div>

                {/* Text Elements */}
                <div style={{
                    position: 'absolute', top: '40vh', width: '100%', textAlign: 'center',
                    color: '#00f3ff', textShadow: '0 0 20px rgba(0, 243, 255, 0.5)'
                }}>
                    <div style={{ opacity: 0.7, marginBottom: '1rem', color: '#fff' }}>[ INICIAR SECUENCIA ]</div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', textTransform: 'uppercase' }}>
                        Arquitectura Digital
                    </h1>
                </div>

                <div className="arch-section" style={{
                    position: 'absolute', top: '150vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box'
                }}>
                    <div className="blueprint-decoration" style={{
                        opacity: 0.3, // Reduced opacity
                        marginBottom: '1rem',
                        color: '#00FF99',
                        fontSize: '0.8rem', // Smaller size
                        letterSpacing: '0.2em'
                    }}>
                        {'{ ENTROPY_REDUCTION }'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="arch-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 255, 153, 0.4)',
                            textWrap: 'balance',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            padding: isMobile ? '0 1rem' : '0'
                        }}>
                            EXPERIENCIAS WEB DE ALTO IMPACTO
                        </h2>
                    </div>

                    <p className="arch-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        width: '100%',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(10, 0, 26, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 255, 153, 0.1)',
                        borderLeft: '2px solid #00FF99',
                        textAlign: 'left',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        boxSizing: 'border-box'
                    }}>
                        No hacemos páginas web; construimos <strong style={{ color: '#00FF99' }}>embajadas digitales</strong>. Desde Landing Pages psicodélicas que convierten por instinto hasta Portales Corporativos que imponen autoridad. Tu presencia en la web debe ser un evento, no un folleto.
                    </p>
                </div>

                <div className="arch-section" style={{
                    position: 'absolute', top: '550vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box'
                }}>
                    <div className="blueprint-decoration" style={{
                        opacity: 0.3,
                        marginBottom: '1rem',
                        color: '#00FF99',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em'
                    }}>
                        {'[ NEURAL_PATHWAYS ]'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="arch-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 255, 153, 0.4)',
                            textWrap: 'balance',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            padding: isMobile ? '0 1rem' : '0'
                        }}>
                            INGENIERÍA DE SOFTWARE & SaaS
                        </h2>
                    </div>
                    <p className="arch-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        width: '100%',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(10, 0, 26, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 255, 153, 0.1)',
                        borderRight: '2px solid #00FF99',
                        textAlign: isMobile ? 'left' : 'right',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        boxSizing: 'border-box'
                    }}>
                        El código estático murió. Desarrollamos <strong style={{ color: '#00FF99' }}>Aplicaciones Web Progresivas (PWA)</strong> y plataformas **SaaS** que escalan con tu ambición. Dashboards de control, sistemas de gestión y herramientas que se sienten vivas. Si puedes imaginar la lógica, podemos programar el sistema.
                    </p>
                </div>

                <div className="arch-section" style={{
                    position: 'absolute', top: '950vh', width: '100%', textAlign: 'center',
                    color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box',
                    transform: isMobile ? 'translateY(-8vh)' : 'none' // LIFT UP ON MOBILE for spacing
                }}>
                    <div className="blueprint-decoration" style={{
                        opacity: 0.3,
                        marginBottom: '1rem',
                        color: '#00FF99',
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em'
                    }}>
                        {'< SYSTEM_UNITY />'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="arch-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 255, 153, 0.4)',
                            textWrap: 'balance',
                            wordBreak: 'break-word',
                            hyphens: 'auto',
                            padding: isMobile ? '0 1rem' : '0'
                        }}>
                            ARQUITECTURA DE ECOSISTEMAS
                        </h2>
                    </div>
                    <p className="arch-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        width: '100%',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(10, 0, 26, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 255, 153, 0.1)',
                        borderBottom: '2px solid #00FF99',
                        textAlign: isMobile ? 'left' : 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        boxSizing: 'border-box'
                    }}>
                        Un pilar aislado no sostiene nada. Integramos APIs, bases de datos y servicios en la nube para crear un <strong style={{ color: '#00FF99' }}>organismo digital unificado</strong>. Tu frontend habla con tu backend, tu CRM con tu marketing, y todo funciona como una mente colmena eficiente.
                    </p>
                </div>

                {/* FINAL COPY SECTION (Magistral) */}
                <div className="final-copy-section" style={{
                    position: 'absolute', top: '1350vh', width: '100%', textAlign: 'center',
                    color: '#fff', padding: '0 2rem', boxSizing: 'border-box'
                }}>
                    <h3 className="final-line-1" style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: 300,
                        marginBottom: '1rem',
                        opacity: 0,
                        visibility: 'visible', // Ensure toggleable
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        No solo ordenamos el caos...
                    </h3>

                    <h1 className="final-line-2" style={{
                        fontSize: 'clamp(2.5rem, 8vw, 8rem)', // Slightly smaller min to fit mobile
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
                        LO CONVERTIMOS<br />EN ARTE.
                    </h1>

                    <p className="final-line-3" style={{
                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        opacity: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                    }}>
                        En AgencIA, tomamos el ruido digital y lo esculpimos hasta revelar la obra maestra.<br />
                        <strong style={{ color: '#00FF99', fontWeight: 600 }}>Porque la claridad es el nuevo superpoder.</strong>
                    </p>

                    {/* ACTION BAR (Fixed at Bottom Center) */}
                    <div className="action-bar" style={{
                        position: 'fixed',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column-reverse', // Button at bottom, CTA above
                        gap: '1.5rem',
                        alignItems: 'center',
                        pointerEvents: 'none'
                    }}>
                        {/* NEXT PROTOCOL BUTTON (Primary) */}
                        <a href="/inteligencia" className="next-protocol-btn" style={{
                            opacity: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem 4rem', // Larger padding
                            background: '#00FF99', // Solid Neon
                            border: 'none',
                            borderRadius: '50px',
                            color: '#000000', // Black Text
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.2rem', // Larger Text
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            pointerEvents: 'none',
                            boxShadow: '0 0 30px rgba(0, 255, 153, 0.6), 0 0 60px rgba(0, 255, 153, 0.3)', // Massive Glow
                            animation: 'pulse-neon 2s infinite' // Custom pulse
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 0 50px rgba(0, 255, 153, 0.8), 0 0 100px rgba(0, 255, 153, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 153, 0.6), 0 0 60px rgba(0, 255, 153, 0.3)';
                            }}
                        >
                            Siguiente Protocolo &gt;
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Arquitectura;
