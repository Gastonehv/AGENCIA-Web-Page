import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Points, PointMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GenerativeNexusProps {
    scrollProgress: number;
}

const NeuralMesh = ({ scrollProgress }: { scrollProgress: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 4000;

    // Generar posiciones estables
    const [sphere, cube, plane] = useMemo(() => {
        const s = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        const p = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            
            // Esfera
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            s[i3] = 8 * Math.cos(theta) * Math.sin(phi);
            s[i3 + 1] = 8 * Math.sin(theta) * Math.sin(phi);
            s[i3 + 2] = 8 * Math.cos(phi);

            // Cubo
            c[i3] = (Math.random() - 0.5) * 12;
            c[i3 + 1] = (Math.random() - 0.5) * 12;
            c[i3 + 2] = (Math.random() - 0.5) * 12;

            // Plano
            p[i3] = (Math.random() - 0.5) * 30;
            p[i3 + 1] = (Math.random() - 0.5) * 20;
            p[i3 + 2] = (Math.random() - 0.5) * 2;
        }
        return [s, c, p];
    }, []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const time = clock.getElapsedTime();
        const array = pointsRef.current.geometry.attributes.position.array as Float32Array;

        let targetA = sphere;
        let targetB = cube;
        let t = scrollProgress * 2;

        if (scrollProgress > 0.5) {
            targetA = cube;
            targetB = plane;
            t = (scrollProgress - 0.5) * 2;
        }

        const lerpT = THREE.MathUtils.smoothstep(t, 0, 1);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            array[i3] += (THREE.MathUtils.lerp(targetA[i3], targetB[i3], lerpT) - array[i3]) * 0.1;
            array[i3 + 1] += (THREE.MathUtils.lerp(targetA[i3 + 1], targetB[i3 + 1], lerpT) - array[i3 + 1]) * 0.1;
            array[i3 + 2] += (THREE.MathUtils.lerp(targetA[i3 + 2], targetB[i3 + 2], lerpT) - array[i3 + 2]) * 0.1;
            
            // Animación de onda sutil
            array[i3 + 2] += Math.sin(time + array[i3] * 0.5) * 0.005;
        }
        
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y = time * 0.05 + scrollProgress * Math.PI;
    });

    return (
        <Points ref={pointsRef} positions={sphere} stride={3}>
            <PointMaterial
                transparent
                color="#00ffff"
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.4}
            />
        </Points>
    );
};

const IntelligenceNode = ({ position, label, active }: { position: [number, number, number], label: string, active: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const time = clock.getElapsedTime();
        const s = active ? 1.2 + Math.sin(time * 2) * 0.1 : 0.8;
        meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, s, 0.1));
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    <octahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={8}
                        resolution={256}
                        transmission={1}
                        roughness={0.1}
                        thickness={1}
                        ior={1.2}
                        chromaticAberration={0.1}
                        color={active ? "#00ffff" : "#0044ff"}
                    />
                </mesh>
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={0.15}
                    color={active ? "#ffffff" : "#00ffff"}
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={active ? 1 : 0.2}
                >
                    {label}
                </Text>
            </Float>
        </group>
    );
};

const GenerativeNexus: React.FC<GenerativeNexusProps> = ({ scrollProgress }) => {
    const nodes = useMemo(() => [
        { label: 'NÚCLEO_MEMORIA', pos: [0, 0, 0] as [number, number, number], trigger: 0 },
        { label: 'MOTOR_GEN_UI', pos: [-5, 4, -4] as [number, number, number], trigger: 0.3 },
        { label: 'INFERENCIA_EDGE', pos: [5, -4, -4] as [number, number, number], trigger: 0.6 },
    ], []);

    return (
        <group>
            <NeuralMesh scrollProgress={scrollProgress} />
            
            {nodes.map((node, i) => (
                <IntelligenceNode 
                    key={i}
                    position={node.pos}
                    label={node.label}
                    active={scrollProgress > node.trigger && scrollProgress < node.trigger + 0.3}
                />
            ))}

            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#0066ff" />
            <fog attach="fog" args={['#030308', 5, 40]} />
        </group>
    );
};

export default GenerativeNexus;
