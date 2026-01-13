import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DNAHelix from '../components/identity/DNAHelix';

const NarrativePrototype: React.FC = () => {
    return (
        <div style={{ background: '#020202', minHeight: '1200vh', position: 'relative' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', zIndex: 1, pointerEvents: 'auto' }}>
                <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
                    <color attach="background" args={['#020202']} />
                    <DNAHelix />
                    {/* POST-PROCESSING: THE "WOW" GLOW */}
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                    </EffectComposer>
                    <ambientLight intensity={0.5} />
                </Canvas>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: 20, right: 20, color: 'cyan', fontSize: '10px', fontFamily: 'monospace', opacity: 0.5 }}>
                         // PROTOCOL_GENESIS_V0.5_CANON_GEOMETRY
                    </div>
                </div>
            </div>

            <div style={{ zIndex: 10, position: 'relative', pointerEvents: 'none' }}>
                {/* Text overlays removed to allow 3D Narrative to take center stage */}
                <div style={{ height: '400vh' }}></div>
            </div>
        </div>
    );
};

export default NarrativePrototype;
