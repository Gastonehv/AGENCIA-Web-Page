import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, MeshTransmissionMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface SovereignMonolithProps {
    scrollProgress: number;
}

const CrystallineSpire = ({ scrollProgress }: { scrollProgress: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const time = clock.getElapsedTime();
        
        // Organic morphing
        meshRef.current.rotation.y = time * 0.1 + scrollProgress * Math.PI;
        meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        
        // Scale pulse based on scroll
        const scale = 1 + Math.pow(scrollProgress, 2) * 0.5;
        meshRef.current.scale.setScalar(scale);
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef}>
                <octahedronGeometry args={[4, 2]} />
                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    resolution={512}
                    transmission={0.95}
                    roughness={0.1}
                    thickness={2}
                    ior={1.5}
                    chromaticAberration={0.5}
                    anisotropy={1}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.2}
                    color="#00FF99"
                    attenuationDistance={5}
                    attenuationColor="#ffffff"
                />
            </mesh>
            {/* Inner Core Glow */}
            <mesh scale={0.4}>
                <icosahedronGeometry args={[1, 15]} />
                <MeshDistortMaterial
                    color="#00FF99"
                    speed={2}
                    distort={0.6}
                    radius={1}
                    emissive="#00FF99"
                    emissiveIntensity={2}
                />
            </mesh>
        </Float>
    );
};

const NeuralFlow = ({ scrollProgress }: { scrollProgress: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 3000;
    
    const [positions, phases] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const pha = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
            pha[i] = Math.random() * Math.PI * 2;
        }
        return [pos, pha];
    }, []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const time = clock.getElapsedTime();
        const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const phase = phases[i];
            
            // Flow field motion
            pos[i3] += Math.sin(time * 0.2 + pos[i3 + 1] * 0.1) * 0.01;
            pos[i3 + 1] += Math.cos(time * 0.3 + pos[i3] * 0.1) * 0.01;
            pos[i3 + 2] += Math.sin(time * 0.1 + phase) * 0.01;
            
            // Pull towards center based on scroll
            const pull = Math.pow(scrollProgress, 2) * 0.05;
            pos[i3] -= pos[i3] * pull;
            pos[i3 + 1] -= pos[i3 + 1] * pull;
            pos[i3 + 2] -= pos[i3 + 2] * pull;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y = time * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#00E5FF"
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
};

const SovereignMonolith: React.FC<SovereignMonolithProps> = ({ scrollProgress }) => {
    return (
        <group>
            <CrystallineSpire scrollProgress={scrollProgress} />
            <NeuralFlow scrollProgress={scrollProgress} />
            
            {/* Environment */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00FF99" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#00E5FF" />
            
            <fog attach="fog" args={['#030308', 5, 40]} />
        </group>
    );
};

export default SovereignMonolith;
