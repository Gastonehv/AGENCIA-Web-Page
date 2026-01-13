import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import NebulaBackground from './NebulaBackground';

const Background3D: React.FC = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -5,
            background: '#000',
            pointerEvents: 'none' // Allow clicks to pass through to content
        }}>
            <Canvas camera={{ position: [0, 0, 20], fov: 75 }} gl={{ alpha: true, antialias: false }}>
                <Suspense fallback={null}>
                    <NebulaBackground />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Background3D;

// End of file
