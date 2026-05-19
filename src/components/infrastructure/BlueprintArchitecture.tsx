import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Line, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface BlueprintArchitectureProps {
    scrollProgress: number;
}

// Technical grid with "+" markers
const BlueprintGrid = ({ scrollProgress }: { scrollProgress: number }) => {
    const gridRef = useRef<THREE.Group>(null);
    const size = 100;
    const divisions = 50;

    useFrame(() => {
        if (!gridRef.current) return;
        // Subtle parallax movement
        gridRef.current.position.z = (scrollProgress * 20) % (size / divisions);
    });

    return (
        <group ref={gridRef}>
            <gridHelper args={[size, divisions, '#0044ff', '#001144']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -10]} />
            {/* Add tiny "+" markers at intersections */}
            {Array.from({ length: 11 }).map((_, i) => (
                Array.from({ length: 11 }).map((_, j) => (
                    <Text
                        key={`${i}-${j}`}
                        position={[(i - 5) * 10, (j - 5) * 10, -9.9]}
                        fontSize={0.2}
                        color="#0066ff"
                        fillOpacity={0.3}
                    >
                        +
                    </Text>
                ))
            ))}
        </group>
    );
};

// Modular architectural block
const SystemModule = ({ position, label, scrollProgress, index }: { position: [number, number, number], label: string, scrollProgress: number, index: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const lineRef = useRef<any>(null);
    const [hovered, setHovered] = React.useState(false);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const time = clock.getElapsedTime();
        
        // Assemble effect based on scroll
        const startThreshold = index * 0.1;
        const localProgress = Math.max(0, Math.min(1, (scrollProgress - startThreshold) / 0.2));
        
        const hoverScale = hovered ? 1.2 : 1;
        meshRef.current.scale.setScalar(localProgress * hoverScale);
        meshRef.current.position.y = position[1] + (1 - localProgress) * 5 + Math.sin(time + index) * 0.1;
        
        if (lineRef.current) {
            lineRef.current.opacity = localProgress * 0.5;
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh 
                    ref={meshRef}
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                    onPointerOut={() => setHovered(false)}
                >
                    <boxGeometry args={[2, 2, 0.5]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={8}
                        resolution={256}
                        transmission={0.9}
                        roughness={0.1}
                        thickness={1}
                        ior={1.2}
                        chromaticAberration={0.1}
                        color={hovered ? "#00ffff" : "#0088ff"}
                    />
                </mesh>
                {/* Wireframe overlay */}
                <mesh scale={1.01}>
                    <boxGeometry args={[2, 2, 0.5]} />
                    <meshBasicMaterial color={hovered ? "#ffffff" : "#00ffff"} wireframe transparent opacity={hovered ? 0.8 : 0.2} />
                </mesh>
                
                {/* Label HUD */}
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={0.15}
                    color={hovered ? "#ffffff" : "#00ffff"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {`[ NODE_${index.toString().padStart(2, '0')} ]\n${label}`}
                </Text>
            </Float>
        </group>
    );
};

const BlueprintArchitecture: React.FC<BlueprintArchitectureProps> = ({ scrollProgress }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        // Tilt scene based on mouse
        const targetRotationX = -state.mouse.y * 0.1;
        const targetRotationY = state.mouse.x * 0.1;
        
        groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
    });

    const modules = useMemo(() => [
        { label: 'CORE_ORCHESTRATOR', pos: [0, 0, 0] as [number, number, number] },
        { label: 'DISTRIBUTED_EDGE', pos: [-5, 3, -2] as [number, number, number] },
        { label: 'SCALABLE_DB_CLUSTER', pos: [5, -3, -1] as [number, number, number] },
        { label: 'HIGH_AVAILABILITY_PROXY', pos: [-4, -4, 2] as [number, number, number] },
        { label: 'QUANTUM_ENCRYPTION_LAYER', pos: [6, 4, 1] as [number, number, number] },
    ], []);

    return (
        <group ref={groupRef}>
            <BlueprintGrid scrollProgress={scrollProgress} />
            
            {modules.map((m, i) => (
                <SystemModule 
                    key={i} 
                    index={i} 
                    position={m.pos} 
                    label={m.label} 
                    scrollProgress={scrollProgress} 
                />
            ))}

            {/* Connecting Lines */}
            {modules.slice(1).map((m, i) => (
                <Line
                    key={i}
                    points={[[0, 0, 0], m.pos]}
                    color="#00ffff"
                    lineWidth={0.5}
                    transparent
                    opacity={Math.max(0, scrollProgress - 0.2)}
                />
            ))}

            {/* Atmosphere */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#0066ff" />
            <spotLight position={[-10, 20, 10]} angle={0.3} penumbra={1} intensity={2} color="#00ffff" />
            
            <fog attach="fog" args={['#030308', 10, 50]} />
        </group>
    );
};

export default BlueprintArchitecture;
