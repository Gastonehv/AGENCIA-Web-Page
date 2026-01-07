import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Service node definitions - representing a real software ecosystem
const SERVICES = [
    { id: 'api', label: 'API Gateway', position: [0, 0, 0] as const, color: '#00FF99', size: 1.2 },
    { id: 'auth', label: 'Auth Service', position: [-3, 2, -1] as const, color: '#8F00FF', size: 0.8 },
    { id: 'db', label: 'Database', position: [3, -2, -2] as const, color: '#00E5FF', size: 1.0 },
    { id: 'cache', label: 'Cache Layer', position: [-2, -2, 1] as const, color: '#FF6B35', size: 0.7 },
    { id: 'storage', label: 'Cloud Storage', position: [4, 1, -1] as const, color: '#00D4FF', size: 0.9 },
    { id: 'queue', label: 'Message Queue', position: [-4, 0, -2] as const, color: '#FFD700', size: 0.7 },
    { id: 'analytics', label: 'Analytics', position: [2, 3, 0] as const, color: '#FF00AA', size: 0.8 },
    { id: 'cdn', label: 'CDN Edge', position: [-3, -3, 2] as const, color: '#00FF99', size: 0.6 },
    { id: 'ml', label: 'ML Engine', position: [0, -3, -3] as const, color: '#8F00FF', size: 0.9 },
    { id: 'monitor', label: 'Monitoring', position: [4, -1, 2] as const, color: '#00E5FF', size: 0.6 },
];

// Connections between services (data flows)
const CONNECTIONS = [
    { from: 'api', to: 'auth' },
    { from: 'api', to: 'db' },
    { from: 'api', to: 'cache' },
    { from: 'api', to: 'storage' },
    { from: 'api', to: 'queue' },
    { from: 'auth', to: 'db' },
    { from: 'cache', to: 'db' },
    { from: 'queue', to: 'ml' },
    { from: 'db', to: 'analytics' },
    { from: 'storage', to: 'cdn' },
    { from: 'ml', to: 'db' },
    { from: 'monitor', to: 'api' },
    { from: 'analytics', to: 'monitor' },
];

interface EcosystemGraphProps {
    scrollProgress: number;
}

// Individual service node
const ServiceNode = ({
    position,
    color,
    size,
    index,
    scrollProgress
}: {
    position: readonly [number, number, number];
    color: string;
    size: number;
    index: number;
    scrollProgress: number;
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    // Staggered activation based on scroll
    const activationThreshold = index * 0.08;
    const isActive = scrollProgress > activationThreshold;
    const localProgress = Math.max(0, Math.min(1, (scrollProgress - activationThreshold) / 0.15));

    useFrame(({ clock }) => {
        if (!meshRef.current || !glowRef.current) return;

        const time = clock.getElapsedTime();

        // Pulse when active
        if (isActive) {
            const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
            meshRef.current.scale.setScalar(size * localProgress * pulse);
            glowRef.current.scale.setScalar(size * localProgress * (1.8 + Math.sin(time * 3) * 0.3));

            // Subtle float
            meshRef.current.position.y = position[1] + Math.sin(time + index * 0.5) * 0.1;
            glowRef.current.position.y = meshRef.current.position.y;
        } else {
            meshRef.current.scale.setScalar(0.01);
            glowRef.current.scale.setScalar(0.01);
        }
    });

    return (
        <group position={[position[0], position[1], position[2]]}>
            {/* Core node */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.8 : 0}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Outer glow */}
            <mesh ref={glowRef}>
                <icosahedronGeometry args={[0.35, 1]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={isActive ? 0.2 : 0}
                    wireframe
                />
            </mesh>
        </group>
    );
};

// Connection with data pulse
const Connection = ({
    fromPos,
    toPos,
    scrollProgress,
    index
}: {
    fromPos: readonly [number, number, number];
    toPos: readonly [number, number, number];
    scrollProgress: number;
    index: number;
}) => {
    const pulseRef = useRef<THREE.Mesh>(null);

    // Activation timing
    const activationThreshold = 0.15 + index * 0.05;
    const isActive = scrollProgress > activationThreshold;

    const points = useMemo(() => [
        [fromPos[0], fromPos[1], fromPos[2]] as [number, number, number],
        [toPos[0], toPos[1], toPos[2]] as [number, number, number]
    ], [fromPos, toPos]);

    useFrame(({ clock }) => {
        if (!pulseRef.current) return;

        const time = clock.getElapsedTime();

        if (isActive) {
            // Pulse animation along the line
            const progress = ((time * 0.5 + index * 0.3) % 1);

            // Interpolate pulse position
            const x = fromPos[0] + (toPos[0] - fromPos[0]) * progress;
            const y = fromPos[1] + (toPos[1] - fromPos[1]) * progress;
            const z = fromPos[2] + (toPos[2] - fromPos[2]) * progress;

            pulseRef.current.position.set(x, y, z);
            pulseRef.current.scale.setScalar(0.1 + Math.sin(time * 10) * 0.03);
            pulseRef.current.visible = true;
        } else {
            pulseRef.current.visible = false;
        }
    });

    return (
        <group>
            {/* Connection line using drei's Line */}
            <Line
                points={points}
                color="#00FF99"
                lineWidth={1}
                transparent
                opacity={isActive ? 0.4 : 0}
            />

            {/* Data pulse traveling along the line */}
            <mesh ref={pulseRef} visible={false}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.9}
                />
            </mesh>
        </group>
    );
};

// Main ecosystem visualization
const EcosystemGraph: React.FC<EcosystemGraphProps> = ({ scrollProgress }) => {
    const groupRef = useRef<THREE.Group>(null);

    // Slow rotation of the entire system
    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const time = clock.getElapsedTime();

        groupRef.current.rotation.y = time * 0.05 + scrollProgress * Math.PI;
        groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    });

    // Get position by service ID
    const getPosition = (id: string) => {
        const service = SERVICES.find(s => s.id === id);
        return service?.position ?? [0, 0, 0] as const;
    };

    return (
        <group ref={groupRef}>
            {/* Ambient particles for depth */}
            <AmbientParticles scrollProgress={scrollProgress} />

            {/* Service nodes */}
            {SERVICES.map((service, index) => (
                <ServiceNode
                    key={service.id}
                    position={service.position}
                    color={service.color}
                    size={service.size}
                    index={index}
                    scrollProgress={scrollProgress}
                />
            ))}

            {/* Connections */}
            {CONNECTIONS.map((conn, index) => (
                <Connection
                    key={`${conn.from}-${conn.to}`}
                    fromPos={getPosition(conn.from)}
                    toPos={getPosition(conn.to)}
                    scrollProgress={scrollProgress}
                    index={index}
                />
            ))}

            {/* Central glow */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5 + scrollProgress * 0.5, 16, 16]} />
                <meshBasicMaterial
                    color="#00FF99"
                    transparent
                    opacity={scrollProgress * 0.15}
                />
            </mesh>
        </group>
    );
};

// Ambient floating particles
const AmbientParticles = ({ scrollProgress }: { scrollProgress: number }) => {
    const pointsRef = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const count = 200;
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        return geo;
    }, []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const time = clock.getElapsedTime();

        // Gentle rotation
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.x = time * 0.01;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                size={0.03}
                color="#00FF99"
                transparent
                opacity={scrollProgress * 0.3}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default EcosystemGraph;
