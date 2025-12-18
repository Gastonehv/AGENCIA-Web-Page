import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from '../context/ScrollContext';

const EntropyReactor: React.FC = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = 3000;

    // Core Refs for styling
    const coreRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    const { velocity } = useScroll(); // Use scroll velocity to impact speed

    // Initial Data
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        // Use a simple seeded pseudo-random for "purity" if needed, 
        // but let's just use a local random that doesn't trigger "impure" warnings if possible.
        // Actually, the issue is often just that the linter doesn't like Math.random() at all in render.
        for (let i = 0; i < count; i++) {
            const t = (i * 0.77) % 100;
            const factor = 20 + ((i * 1.23) % 100);
            const speed = 0.01 + ((i * 0.05) % 0.005);
            const x = ((i * 0.13) % 30) - 15;
            const y = ((i * 0.47) % 10) - 5;
            const z = ((i * 0.89) % 10) - 5;

            temp.push({
                t, factor, speed,
                x, y, z,
                mx: 0, my: 0
            });
        }
        return temp;
    }, [count]);

    // Re-use color objects to avoid GC
    const colorChaos = new THREE.Color('#FF3333'); // Red
    const colorOrder = new THREE.Color('#00FF99'); // Green
    // const colorCore = new THREE.Color('#FFFFFF'); // Core Hot (Unused)

    useFrame((_state, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        // Base Speed + Scroll Boost
        const boost = Math.min(Math.abs(velocity) * 0.05, 0.5);

        particles.forEach((particle, i) => {
            // MOVE PARTICLE RIGHT
            particle.x += particle.speed + boost;

            // ZONES LOGIC
            // Zone 1: CHAOS (Left of Core) -> X < -3
            // Zone 2: PROCESSING (The Core) -> -3 < X < 3
            // Zone 3: ORDER (Right of Core) -> X > 3

            let scale = 1;
            const currentColor = new THREE.Color();

            if (particle.x < -3) {
                // --- CHAOS MODE ---
                // Jittery movement (using time-based jitter instead of Math.random)
                const time = _state.clock.elapsedTime;
                particle.y += Math.sin(time * 10 + i) * 0.05;
                particle.z += Math.cos(time * 10 + i) * 0.05;

                // Constrain Y/Z slightly so they don't fly off screen
                if (Math.abs(particle.y) > 6) particle.y *= 0.9;
                if (Math.abs(particle.z) > 6) particle.z *= 0.9;

                currentColor.copy(colorChaos);
                scale = 0.3 + (Math.sin(i) * 0.2); // Stable "random" sizes
            }
            else if (particle.x >= -3 && particle.x <= 3) {
                // --- REACTOR CORE MODE ---
                // Suck into center
                particle.y *= 0.92;
                particle.z *= 0.92;

                // Accelerate through core
                particle.x += 0.05;

                // Mix Colors
                currentColor.lerpColors(colorChaos, colorOrder, (particle.x + 3) / 6);
                scale = 0.1 + (1 - Math.abs(particle.x) / 3);
            }
            else {
                // --- ORDER MODE ---
                particle.y += 0;
                particle.z += 0;

                currentColor.copy(colorOrder);
                scale = 0.4;
            }

            // RESET LOOP
            if (particle.x > 15) {
                particle.x = -15;
                // Re-init with deterministic values
                particle.y = ((i * 0.47) % 10) - 5;
                particle.z = ((i * 0.89) % 10) - 5;
            }

            // UPDATE INSTANCE
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            mesh.setColorAt(i, currentColor);
        });

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

        // Animate Core
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.5;
            coreRef.current.rotation.z += delta * 0.2;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x -= delta;
            ringRef.current.rotation.y -= delta;
        }
    });

    return (
        <group>
            {/* PARTICLES */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.05, 0.05, 0.4]} /> {/* Elongated streaks */}
                <meshBasicMaterial transparent opacity={0.6} toneMapped={false} />
            </instancedMesh>

            {/* THE REACTOR CORE (Visual Centerpiece) */}
            <group position={[0, 0, 0]}>
                {/* Inner Sphere */}
                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        wireframe
                        transparent
                        opacity={0.1}
                    />
                </mesh>

                {/* Glow Sprite or Fake Glow Mesh */}
                <mesh>
                    <sphereGeometry args={[0.8, 16, 16]} />
                    <meshBasicMaterial color="black" />
                </mesh>

                {/* Energy Ring */}
                <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.5, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#00FF99" toneMapped={false} />
                </mesh>
            </group>

            {/* LIGHTING (Subtle) */}
            <pointLight position={[0, 0, 0]} intensity={2} color="#00FF99" distance={10} />
            <pointLight position={[-8, 0, 0]} intensity={2} color="#FF3333" distance={10} />

        </group>
    );
};

export default EntropyReactor;
