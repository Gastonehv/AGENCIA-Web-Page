import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, PerspectiveCamera, Scroll } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import DataParticles from './DataParticles';

const SceneContent = () => {
    const scroll = useScroll();
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        // Camera Movement Logic
        // As we scroll (0 to 1), move camera closer to the center
        const t = scroll.offset; // 0 to 1

        if (cameraRef.current) {
            // Start far, move close
            cameraRef.current.position.z = THREE.MathUtils.lerp(30, 8, t);

            // Add some subtle sway based on mouse or time
            cameraRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
        }

        if (coreRef.current) {
            // Core rotates and pulses
            coreRef.current.rotation.y += delta * 0.5;
            coreRef.current.rotation.z += delta * 0.2;

            // Reveals itself as order is established (t > 0.5)
            const coreScale = THREE.MathUtils.smoothstep(t, 0.5, 0.8) * 2;
            coreRef.current.scale.setScalar(coreScale);
        }
    });

    return (
        <>
            <color attach="background" args={['#000000']} />

            {/* Camera */}
            <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 30]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00FF99" />

            {/* The Particles System */}
            <DataParticles />

            {/* The Central Core (The "Brain") */}
            <mesh ref={coreRef} position={[0, 0, 0]} scale={[0, 0, 0]}>
                <icosahedronGeometry args={[1, 2]} />
                <meshStandardMaterial
                    color="#000"
                    emissive="#00FF99"
                    emissiveIntensity={1}
                    wireframe
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Post Processing */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                <Noise opacity={0.3} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
            </EffectComposer>
        </>
    );
};

const AutomationScene: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
            <Canvas gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }} dpr={[1, 1.5]}>
                <Suspense fallback={null}>
                    <ScrollControls pages={4} damping={0.2}>
                        <SceneContent />
                        <Scroll html style={{ width: '100%' }}>
                            {/* STAGE 0: CHAOS */}
                            <div style={{ position: 'absolute', top: '40vh', left: '10vw', width: '80vw' }}>
                                <h1 style={{ color: '#FF4D4D', fontFamily: 'var(--font-mono)', fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                                    [ 001_CAOS_OPERATIVO ]
                                </h1>
                                <p style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.5, textShadow: '0 0 10px rgba(255, 77, 77, 0.5)' }}>
                                    Datos dispersos. Procesos manuales. La entropía consume tus recursos. Sin un sistema central, el crecimiento es solo ruido.
                                </p>
                            </div>

                            {/* STAGE 1: ANALYSIS */}
                            <div style={{ position: 'absolute', top: '140vh', right: '10vw', width: '80vw', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <h1 style={{ color: '#00F3FF', fontFamily: 'var(--font-mono)', fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                                    [ 002_ANÁLISIS_IA ]
                                </h1>
                                <p style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.5, textShadow: '0 0 10px rgba(0, 243, 255, 0.5)' }}>
                                    El Núcleo despierta. Nuestros algoritmos detectan patrones invisibles en tus operaciones. Convertimos información cruda en inteligencia accionable.
                                </p>
                            </div>

                            {/* STAGE 2: STRUCTURE */}
                            <div style={{ position: 'absolute', top: '240vh', left: '10vw', width: '80vw' }}>
                                <h1 style={{ color: '#00FF99', fontFamily: 'var(--font-mono)', fontSize: 'clamp(2rem, 5vw, 4rem)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                                    [ 003_ARQUITECTURA_LÓGICA ]
                                </h1>
                                <p style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.5, textShadow: '0 0 10px rgba(0, 255, 153, 0.5)' }}>
                                    Implementación de flujos autónomos. Cada pieza de tu negocio encuentra su lugar en una retícula perfecta de eficiencia ininterrumpida.
                                </p>
                            </div>

                            {/* STAGE 3: DOMINION */}
                            <div style={{ position: 'absolute', top: '330vh', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h1 style={{
                                    color: '#fff',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    marginBottom: '2rem',
                                    textShadow: '0 0 20px rgba(255,255,255,0.5)'
                                }}>
                                    SUPREMACÍA<br />DIGITAL
                                </h1>
                                <p style={{ color: '#00FF99', fontFamily: 'var(--font-mono)', fontSize: '1.5rem', letterSpacing: '0.1em' }}>
                                    [ SYSTEM_OPTIMIZED_AT_100% ]
                                </p>
                                <div style={{ marginTop: '3rem', padding: '1rem 3rem', border: '1px solid #00FF99', color: '#00FF99', fontFamily: 'var(--font-mono)', cursor: 'pointer', background: 'rgba(0, 255, 153, 0.1)' }}>
                                    INICIAR TRANSFORMACIÓN
                                </div>
                            </div>
                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default AutomationScene;
