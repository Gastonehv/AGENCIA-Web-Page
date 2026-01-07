import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import ZScrollExperience from '../components/playground/ZScrollExperience';

const Playground: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100vh', background: '#000', position: 'relative' }}>
            {/* HUD / LABEL */}
            <div style={{ position: 'fixed', top: 30, left: 30, color: '#00FF99', zIndex: 10, fontFamily: 'monospace', pointerEvents: 'none' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>[ AGENCIA_LAB :: PROTOTYPE_Z ]</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Z-AXIS NAVIGATION</div>
            </div>

            <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', color: '#fff', zIndex: 10, fontFamily: 'monospace', pointerEvents: 'none', opacity: 0.5 }}>
                SCROLL TO ADVANCE
            </div>

            <Canvas gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping }} dpr={[1, 1.5]}>
                <color attach="background" args={['#000000']} />

                {/* Fog for depth fading */}
                <fog attach="fog" args={['#000000', 5, 60]} />

                <Suspense fallback={null}>
                    <ScrollControls pages={6} damping={0.2}>
                        <ZScrollExperience />
                    </ScrollControls>
                </Suspense>

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.0} />
                    <Noise opacity={0.15} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default Playground;
