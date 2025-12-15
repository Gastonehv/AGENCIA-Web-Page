import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TheCore: React.FC = () => {
    const coreRef = useRef<THREE.Group>(null);
    const sphereRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.1;
        }
        if (sphereRef.current) {
            sphereRef.current.rotation.x -= delta * 0.2;
            sphereRef.current.rotation.z += delta * 0.1;
        }
        if (ringsRef.current) {
            ringsRef.current.rotation.x += delta * 0.15;
            ringsRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={coreRef} position={[0, 2, -5]}>
            {/* Inner Core */}
            <mesh ref={sphereRef}>
                <icosahedronGeometry args={[2, 2]} />
                <meshStandardMaterial
                    color="#00f3ff"
                    emissive="#00f3ff"
                    emissiveIntensity={2}
                    wireframe
                />
            </mesh>

            {/* Outer Glow Sphere (Fake Volumetric) */}
            <mesh scale={[2.2, 2.2, 2.2]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#0066ff"
                    transparent
                    opacity={0.1}
                    wireframe
                />
            </mesh>

            {/* Rotating Rings */}
            <group ref={ringsRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3.5, 0.05, 16, 100]} />
                    <meshBasicMaterial color="#ff00ff" />
                </mesh>
                <mesh rotation={[0, Math.PI / 4, 0]}>
                    <torusGeometry args={[4.2, 0.05, 16, 100]} />
                    <meshBasicMaterial color="#00f3ff" />
                </mesh>
            </group>
        </group>
    );
};

export default TheCore;
