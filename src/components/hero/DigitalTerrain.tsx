import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DigitalTerrain: React.FC = () => {
    const terrainRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (terrainRef.current) {
            // Move position to simulate flight
            terrainRef.current.position.z += delta * 10;
            if (terrainRef.current.position.z > 10) {
                terrainRef.current.position.z = 0;
            }
        }
    });

    return (
        <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[100, 100, 40, 40]} />
            <meshBasicMaterial
                color="#00f3ff"
                wireframe
                transparent
                opacity={0.2}
            />
        </mesh>
    );
};

export default DigitalTerrain;
