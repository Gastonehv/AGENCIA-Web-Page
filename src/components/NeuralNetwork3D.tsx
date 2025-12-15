import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Line } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNetwork3D = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState<number | null>(null);

    // Generate random nodes
    const count = 70; // Increased density
    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 4 + Math.random() * 3; // Radius between 4 and 7

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, []);

    // Generate connections (nearest neighbors)
    const connections = useMemo(() => {
        const lines: THREE.Vector3[][] = [];
        nodes.forEach((node, i) => {
            // Connect to 3-4 nearest neighbors for denser web
            const neighbors = nodes
                .map((n, index) => ({ index, dist: node.distanceTo(n) }))
                .filter(n => n.index !== i)
                .sort((a, b) => a.dist - b.dist)
                .slice(0, 4);

            neighbors.forEach(n => {
                lines.push([node, nodes[n.index]]);
            });
        });
        return lines;
    }, [nodes]);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Gentle rotation
        groupRef.current.rotation.y += 0.001;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

        // Mouse interaction (parallax)
        const { mouse } = state;
        groupRef.current.rotation.y += mouse.x * 0.001;
        groupRef.current.rotation.x -= mouse.y * 0.001;
    });

    return (
        <group ref={groupRef}>
            {/* Nodes (Instances for performance) */}
            <Instances range={count}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial
                    emissive="#00ffff"
                    emissiveIntensity={4}
                    color="#00ffff"
                    toneMapped={false}
                />
                {nodes.map((pos, i) => (
                    <Instance
                        key={i}
                        position={pos}
                        scale={hovered === i ? 1.8 : 1}
                        onPointerOver={() => setHover(i)}
                        onPointerOut={() => setHover(null)}
                    />
                ))}
            </Instances>

            {/* Connections (Lines) */}
            {connections.map((line, i) => (
                <Line
                    key={i}
                    points={line}
                    color={hovered !== null ? "#ffffff" : "#0088aa"} // Highlight on hover
                    opacity={0.3}
                    transparent
                    lineWidth={1}
                />
            ))}

            {/* Central Core Glow */}
            <pointLight position={[0, 0, 0]} intensity={2} color="#00ffff" distance={10} />
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.8} />
            </mesh>
        </group>
    );
};

export default NeuralNetwork3D;
