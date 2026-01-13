import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAHelix from './DNAHelix';

const NeuroIdentity: React.FC = () => {
    return (
        <div className="neuro-identity-master" style={{ width: '100%', position: 'relative', background: '#000' }}>

            {/* 1. SCROLL TRACK (Phantom Height) */}
            {/* This div creates the physical scroll space needed to drive the timeline */}
            <div style={{ height: '1200vh', width: '100%', pointerEvents: 'none' }} />

            {/* 2. THE WINDOW (Canvas) - PURE FIXED POSITIONING */}
            {/* position: fixed ensures it NEVER moves with scroll. It stays pinned to the viewport. */}
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

                    {/* The 3D Scene (Camera logic listens to window.scrollY) */}
                    <DNAHelix />

                    {/* Post-Processing */}
                    <EffectComposer>
                        <Bloom
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            height={300}
                            intensity={1.5}
                        />
                    </EffectComposer>
                </Canvas>

                {/* UI: SCROLL HINT (Fixed on screen) */}
                <div style={{
                    position: 'absolute',
                    bottom: '50px',
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                    mixBlendMode: 'difference'
                }}>
                    <span style={{
                        color: '#fff',
                        fontSize: 'clamp(10px, 3vw, 12px)',
                        letterSpacing: '0.3em',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        opacity: 0.8
                    }}>
                        DESLIZA PARA INICIAR SECUENCIA
                    </span>
                </div>
            </div>

        </div>
    );
};

export default NeuroIdentity;
