import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import ZScrollExperience from '../components/playground/ZScrollExperience';

// Loading screen component
const LoadingScreen = () => (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        fontFamily: 'monospace'
    }}>
        <div style={{
            width: '200px',
            height: '2px',
            background: '#111',
            borderRadius: '2px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '50%',
                height: '100%',
                background: '#00FF99',
                animation: 'loadingBar 1.5s ease-in-out infinite'
            }} />
        </div>
        <p style={{ color: '#00FF99', marginTop: '1rem', fontSize: '0.8rem' }}>
            [ INITIALIZING Z-EXPERIENCE ]
        </p>
        <style>{`
            @keyframes loadingBar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(200%); }
            }
        `}</style>
    </div>
);

// Mobile fallback component
const MobileFallback = () => (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'monospace'
    }}>
        <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 0 20px #00FF99)'
        }}>
            🖥️
        </div>
        <h2 style={{
            color: '#00FF99',
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
            letterSpacing: '0.2em'
        }}>
            [ EXPERIENCIA DESKTOP ]
        </h2>
        <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            maxWidth: '300px',
            lineHeight: 1.6
        }}>
            Esta experiencia 3D inmersiva está optimizada para pantallas grandes.
            Por favor, visita desde un computador para la experiencia completa.
        </p>
        <a
            href="/"
            style={{
                marginTop: '2rem',
                padding: '0.8rem 2rem',
                background: 'transparent',
                border: '1px solid #00FF99',
                color: '#00FF99',
                textDecoration: 'none',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease'
            }}
        >
            ← VOLVER AL INICIO
        </a>
    </div>
);

// HUD Component
const HUD = () => (
    <>
        {/* Top Left - Lab Badge */}
        <div style={{
            position: 'fixed',
            top: 90,
            left: 30,
            color: '#00FF99',
            zIndex: 10,
            fontFamily: 'monospace',
            pointerEvents: 'none'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.3rem'
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#00FF99',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #00FF99',
                    animation: 'pulse 2s infinite'
                }} />
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    AGENCIA_LAB :: PROTOTYPE_Z
                </span>
            </div>
            <div style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                textShadow: '0 0 30px rgba(0,255,153,0.5)'
            }}>
                Z-AXIS NAVIGATION
            </div>
        </div>

        {/* Top Right - Status */}
        <div style={{
            position: 'fixed',
            top: 90,
            right: 30,
            color: 'rgba(255,255,255,0.5)',
            zIndex: 10,
            fontFamily: 'monospace',
            pointerEvents: 'none',
            textAlign: 'right',
            fontSize: '0.7rem'
        }}>
            <div>STATUS: <span style={{ color: '#00FF99' }}>ACTIVE</span></div>
            <div>MODE: EXPLORATION</div>
            <div>DEPTH: INFINITE</div>
        </div>

        {/* Bottom Center - Instructions */}
        <div style={{
            position: 'fixed',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            zIndex: 10,
            fontFamily: 'monospace',
            pointerEvents: 'none',
            textAlign: 'center'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: 0.6
            }}>
                <span style={{ fontSize: '1.5rem' }}>⬇</span>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em' }}>
                    SCROLL PARA AVANZAR
                </span>
                <span style={{ fontSize: '1.5rem' }}>⬇</span>
            </div>
        </div>

        {/* Bottom Left - Back Link */}
        <a
            href="/"
            style={{
                position: 'fixed',
                bottom: 30,
                left: 30,
                color: 'rgba(255,255,255,0.4)',
                zIndex: 10,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.3s ease',
                letterSpacing: '0.1em'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#00FF99'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
            ← REGRESAR
        </a>

        {/* Scanlines overlay */}
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
            zIndex: 5
        }} />

        <style>{`
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `}</style>
    </>
);

const Playground: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Simulate loading time for assets
        const timer = setTimeout(() => setIsLoading(false), 1500);

        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timer);
        };
    }, []);

    // Mobile fallback
    if (isMobile) {
        return <MobileFallback />;
    }

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: '#000',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {isLoading && <LoadingScreen />}

            <HUD />

            <Canvas
                gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
                }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 500 }}
            >
                <color attach="background" args={['#000000']} />

                {/* Exponential fog for depth fading */}
                <fogExp2 attach="fog" args={['#000000', 0.012]} />

                <Suspense fallback={null}>
                    <ScrollControls pages={6} damping={0.15}>
                        <ZScrollExperience />
                    </ScrollControls>
                    <Preload all />
                </Suspense>

                {/* Post Processing Stack */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        height={300}
                        intensity={0.8}
                    />
                    <Noise opacity={0.08} />
                    <Vignette eskil={false} offset={0.1} darkness={1.2} />
                    <ChromaticAberration
                        offset={new THREE.Vector2(0.001, 0.001)}
                        radialModulation={false}
                        modulationOffset={0}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default Playground;
