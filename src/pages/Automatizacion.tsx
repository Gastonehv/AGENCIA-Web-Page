import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import WarpTunnel from '../components/WarpTunnel';

const Automatizacion: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh', backgroundColor: 'black', overflow: 'hidden' }}>

            {/* 1. 3D Background - Absolute Position */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: false }}>
                    <color attach="background" args={['#000500']} />
                    <fog attach="fog" args={['#000000', 5, 40]} />
                    <WarpTunnel />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={2.0} radius={0.8} />
                        <ChromaticAberration offset={[0.002, 0.002]} />
                        <Noise opacity={0.05} />
                    </EffectComposer>
                </Canvas>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, black, transparent, black)', opacity: 0.6 }} />
            </div>

            {/* 2. Content - Relative Position, Z-Index 10, White Text */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', pointerEvents: 'none' }}>
                <h1 style={{ fontSize: '5rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                    AUTOMATIZACIÓN
                </h1>
            </div>

        </div>
    );
};

export default Automatizacion;
