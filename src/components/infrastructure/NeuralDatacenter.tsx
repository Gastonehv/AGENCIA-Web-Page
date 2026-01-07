import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NeuralDatacenterProps {
    scrollProgress: number;
}

// Server rack configuration - positioned in a datacenter formation
const RACK_CONFIG = [
    // Front row (most visible)
    { id: 'core-1', position: [-2.5, 0, 2] as const, type: 'primary' },
    { id: 'core-2', position: [0, 0, 2] as const, type: 'master' },
    { id: 'core-3', position: [2.5, 0, 2] as const, type: 'primary' },
    // Middle row
    { id: 'data-1', position: [-3, 0, 0] as const, type: 'storage' },
    { id: 'data-2', position: [-1, 0, 0] as const, type: 'compute' },
    { id: 'data-3', position: [1, 0, 0] as const, type: 'compute' },
    { id: 'data-4', position: [3, 0, 0] as const, type: 'storage' },
    // Back row
    { id: 'edge-1', position: [-2, 0, -2] as const, type: 'edge' },
    { id: 'edge-2', position: [0, 0, -2] as const, type: 'edge' },
    { id: 'edge-3', position: [2, 0, -2] as const, type: 'edge' },
];

// Color palette by type
const RACK_COLORS: Record<string, string> = {
    master: '#00FF99',   // Verde neón - nodo central
    primary: '#00E5FF',  // Cyan - nodos principales
    storage: '#8F00FF',  // Púrpura - almacenamiento
    compute: '#FF6B35',  // Naranja - cómputo
    edge: '#FFD700',     // Dorado - edge nodes
};

// Individual Server Rack with animated LEDs and glowing effects
const ServerRack = ({
    position,
    type,
    index,
    scrollProgress
}: {
    position: readonly [number, number, number];
    type: string;
    index: number;
    scrollProgress: number;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const ledsRef = useRef<THREE.InstancedMesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    const color = RACK_COLORS[type] || '#00FF99';

    // Staggered activation based on scroll
    const activationThreshold = index * 0.06;
    const isActive = scrollProgress > activationThreshold;
    const localProgress = Math.max(0, Math.min(1, (scrollProgress - activationThreshold) / 0.2));

    // LED configuration - 6 LEDs per rack
    const ledCount = 6;
    const ledPositions = useMemo(() => {
        const positions: [number, number, number][] = [];
        for (let i = 0; i < ledCount; i++) {
            positions.push([0.35, -0.6 + i * 0.25, 0.51]);
        }
        return positions;
    }, []);

    // Chaos -> Order transformation
    const chaosOffset = useMemo(() => ({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 15,
        rotX: (Math.random() - 0.5) * Math.PI * 2,
        rotY: (Math.random() - 0.5) * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * Math.PI * 2,
    }), []);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const time = clock.getElapsedTime();

        // CHAOS -> ORDER transition
        const orderProgress = Math.pow(scrollProgress, 0.7); // Ease out
        const chaos = 1 - orderProgress;

        // Position interpolation
        groupRef.current.position.x = position[0] + chaosOffset.x * chaos;
        groupRef.current.position.y = position[1] + chaosOffset.y * chaos + Math.sin(time * 0.5 + index) * 0.05 * orderProgress;
        groupRef.current.position.z = position[2] + chaosOffset.z * chaos;

        // Rotation interpolation
        groupRef.current.rotation.x = chaosOffset.rotX * chaos;
        groupRef.current.rotation.y = chaosOffset.rotY * chaos + time * 0.1 * chaos;
        groupRef.current.rotation.z = chaosOffset.rotZ * chaos;

        // Scale breathing effect when active
        const breathe = isActive ? 1 + Math.sin(time * 2 + index) * 0.02 : 0.8;
        groupRef.current.scale.setScalar(localProgress * breathe);

        // Glow pulsing
        if (glowRef.current) {
            const material = glowRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = isActive ? 0.15 + Math.sin(time * 3 + index) * 0.05 : 0;
        }

        // LED blinking patterns
        if (ledsRef.current) {
            const dummy = new THREE.Object3D();
            for (let i = 0; i < ledCount; i++) {
                const ledPos = ledPositions[i];
                const blinkPattern = Math.sin(time * (5 + i * 0.7) + index * 0.5) > 0.3;
                const isLit = isActive && (blinkPattern || scrollProgress > 0.7);

                dummy.position.set(ledPos[0], ledPos[1], ledPos[2]);
                dummy.scale.setScalar(isLit ? 1.2 : 0.5);
                dummy.updateMatrix();
                ledsRef.current.setMatrixAt(i, dummy.matrix);
            }
            ledsRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <group ref={groupRef} position={[position[0], position[1], position[2]]}>
            {/* Main rack body */}
            <mesh>
                <boxGeometry args={[0.8, 1.8, 1]} />
                <meshStandardMaterial
                    color="#0a0a12"
                    metalness={0.9}
                    roughness={0.3}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.1 : 0}
                />
            </mesh>

            {/* Rack frame/border */}
            <mesh>
                <boxGeometry args={[0.85, 1.85, 1.02]} />
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={isActive ? 0.3 : 0.05}
                />
            </mesh>

            {/* Front panel with ventilation pattern */}
            <mesh position={[0, 0, 0.51]}>
                <planeGeometry args={[0.7, 1.6]} />
                <meshStandardMaterial
                    color="#050510"
                    metalness={0.8}
                    roughness={0.2}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.05 : 0}
                />
            </mesh>

            {/* Server units (horizontal lines) */}
            {[-0.5, -0.25, 0, 0.25, 0.5].map((yPos, i) => (
                <mesh key={i} position={[0, yPos, 0.52]}>
                    <boxGeometry args={[0.65, 0.02, 0.01]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={isActive ? 0.6 : 0.1}
                    />
                </mesh>
            ))}

            {/* LED indicators - instanced for performance */}
            <instancedMesh ref={ledsRef} args={[undefined, undefined, ledCount]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color={color} />
            </instancedMesh>

            {/* Outer glow */}
            <mesh ref={glowRef}>
                <boxGeometry args={[1.2, 2.2, 1.4]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

// Data flow particle system - pulses traveling between racks
const DataFlowParticles = ({ scrollProgress }: { scrollProgress: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 500;

    const { positions, velocities, colors, phases } = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        const col = new Float32Array(particleCount * 3);
        const pha = new Float32Array(particleCount);

        const colorOptions = [
            new THREE.Color('#00FF99'),
            new THREE.Color('#00E5FF'),
            new THREE.Color('#8F00FF'),
        ];

        for (let i = 0; i < particleCount; i++) {
            // Start scattered, will be animated to flow paths
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

            vel[i * 3] = (Math.random() - 0.5) * 0.02;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;

            pha[i] = Math.random() * Math.PI * 2;
        }

        return { positions: pos, velocities: vel, colors: col, phases: pha };
    }, []);

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const time = clock.getElapsedTime();
        const geo = pointsRef.current.geometry;
        const posAttr = geo.attributes.position as THREE.BufferAttribute;

        const orderProgress = Math.pow(scrollProgress, 0.5);

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const phase = phases[i];

            if (orderProgress > 0.3) {
                // Organized flow patterns
                const flowSpeed = 0.5 + Math.sin(phase) * 0.3;
                const flowRadius = 3 + Math.sin(phase * 2) * 1.5;
                const flowHeight = Math.sin(time * flowSpeed + phase) * 1.5;

                const targetX = Math.cos(time * flowSpeed + phase) * flowRadius;
                const targetY = flowHeight;
                const targetZ = Math.sin(time * flowSpeed + phase) * flowRadius;

                // Interpolate toward organized flow
                const flowFactor = (orderProgress - 0.3) / 0.7;
                positions[ix] += (targetX - positions[ix]) * 0.02 * flowFactor;
                positions[ix + 1] += (targetY - positions[ix + 1]) * 0.02 * flowFactor;
                positions[ix + 2] += (targetZ - positions[ix + 2]) * 0.02 * flowFactor;
            } else {
                // Chaotic movement
                positions[ix] += velocities[ix] + Math.sin(time + phase) * 0.01;
                positions[ix + 1] += velocities[ix + 1] + Math.cos(time * 1.3 + phase) * 0.01;
                positions[ix + 2] += velocities[ix + 2] + Math.sin(time * 0.7 + phase) * 0.01;

                // Boundary reset
                if (Math.abs(positions[ix]) > 10) positions[ix] *= -0.9;
                if (Math.abs(positions[ix + 1]) > 5) positions[ix + 1] *= -0.9;
                if (Math.abs(positions[ix + 2]) > 10) positions[ix + 2] *= -0.9;
            }

            posAttr.setXYZ(i, positions[ix], positions[ix + 1], positions[ix + 2]);
        }

        posAttr.needsUpdate = true;

        // Rotate the entire particle system slowly
        pointsRef.current.rotation.y = time * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.6 + scrollProgress * 0.4}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// Central holographic core
const HolographicCore = ({ scrollProgress }: { scrollProgress: number }) => {
    const coreRef = useRef<THREE.Group>(null);
    const ringRefs = useRef<THREE.Mesh[]>([]);

    useFrame(({ clock }) => {
        if (!coreRef.current) return;
        const time = clock.getElapsedTime();

        // Core rotation
        coreRef.current.rotation.y = time * 0.3;
        coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

        // Scale based on scroll
        const scale = scrollProgress > 0.5 ? 0.5 + (scrollProgress - 0.5) * 1.5 : scrollProgress;
        coreRef.current.scale.setScalar(scale);

        // Animate rings
        ringRefs.current.forEach((ring, i) => {
            if (ring) {
                ring.rotation.x = time * (0.5 + i * 0.2);
                ring.rotation.z = time * (0.3 - i * 0.1);
            }
        });
    });

    return (
        <group ref={coreRef} position={[0, 0, 0]}>
            {/* Central sphere */}
            <mesh>
                <icosahedronGeometry args={[0.5, 2]} />
                <meshBasicMaterial
                    color="#00FF99"
                    transparent
                    opacity={scrollProgress * 0.8}
                    wireframe
                />
            </mesh>

            {/* Inner glow */}
            <mesh>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshBasicMaterial
                    color="#00FF99"
                    transparent
                    opacity={scrollProgress * 0.3}
                />
            </mesh>

            {/* Orbital rings */}
            {[0.8, 1.1, 1.4].map((radius, i) => (
                <mesh
                    key={i}
                    ref={(el) => { if (el) ringRefs.current[i] = el; }}
                    rotation={[Math.PI / 2 + i * 0.3, 0, i * 0.5]}
                >
                    <torusGeometry args={[radius, 0.02, 8, 64]} />
                    <meshBasicMaterial
                        color={i === 0 ? '#00FF99' : i === 1 ? '#00E5FF' : '#8F00FF'}
                        transparent
                        opacity={scrollProgress > 0.4 ? 0.6 : 0}
                    />
                </mesh>
            ))}

            {/* Outer glow sphere */}
            <mesh>
                <sphereGeometry args={[1.8, 16, 16]} />
                <meshBasicMaterial
                    color="#00FF99"
                    transparent
                    opacity={scrollProgress > 0.6 ? (scrollProgress - 0.6) * 0.15 : 0}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

// Grid floor for depth perception
const GridFloor = ({ scrollProgress }: { scrollProgress: number }) => {
    const gridRef = useRef<THREE.GridHelper>(null);

    useFrame(({ clock }) => {
        if (!gridRef.current) return;
        const time = clock.getElapsedTime();

        // Subtle wave effect
        gridRef.current.position.y = -2 + Math.sin(time * 0.3) * 0.1;

        // Fade in with scroll
        const material = gridRef.current.material as THREE.Material;
        if ('opacity' in material) {
            (material as THREE.MeshBasicMaterial).opacity = scrollProgress * 0.3;
        }
    });

    return (
        <gridHelper
            ref={gridRef}
            args={[20, 40, '#00FF99', '#0a2020']}
            position={[0, -2, 0]}
            rotation={[0, 0, 0]}
        />
    );
};

// Main Neural Datacenter Component
const NeuralDatacenter: React.FC<NeuralDatacenterProps> = ({ scrollProgress }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const time = clock.getElapsedTime();

        // Slow orbital rotation of entire scene
        groupRef.current.rotation.y = time * 0.03 + scrollProgress * Math.PI * 0.5;

        // Subtle tilt based on scroll
        groupRef.current.rotation.x = scrollProgress * 0.1 - 0.2;
    });

    return (
        <group ref={groupRef}>
            {/* Ambient lighting variations */}
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 5]} intensity={0.8} color="#00FF99" />
            <pointLight position={[-5, -3, -5]} intensity={0.4} color="#8F00FF" />
            <pointLight position={[5, 2, -3]} intensity={0.5} color="#00E5FF" />

            {/* Grid floor */}
            <GridFloor scrollProgress={scrollProgress} />

            {/* Holographic core */}
            <HolographicCore scrollProgress={scrollProgress} />

            {/* Server racks */}
            {RACK_CONFIG.map((rack, index) => (
                <ServerRack
                    key={rack.id}
                    position={rack.position}
                    type={rack.type}
                    index={index}
                    scrollProgress={scrollProgress}
                />
            ))}

            {/* Data flow particles */}
            <DataFlowParticles scrollProgress={scrollProgress} />

            {/* Fog for depth */}
            <fog attach="fog" args={['#030308', 8, 25]} />
        </group>
    );
};

export default NeuralDatacenter;
