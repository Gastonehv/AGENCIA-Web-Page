import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Image } from '@react-three/drei';
import * as THREE from 'three';

export interface PanelData {
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    image?: string;
    color: string;
    icon?: string;
}

interface HolographicPanelProps {
    position: [number, number, number];
    data: PanelData;
    index: number;
}

const HolographicPanel: React.FC<HolographicPanelProps> = ({ position, data, index }) => {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Gentle float animation
        const floatOffset = Math.sin(state.clock.elapsedTime * 0.8 + index * 1.5) * 0.3;
        const floatX = Math.cos(state.clock.elapsedTime * 0.5 + index) * 0.1;

        groupRef.current.position.y = position[1] + floatOffset;
        groupRef.current.position.x = position[0] + floatX;

        // Subtle rotation following camera
        const lookAtZ = state.camera.position.z + 15;
        groupRef.current.lookAt(
            state.camera.position.x * 0.3,
            state.camera.position.y * 0.3,
            lookAtZ
        );

        // Glow pulsing
        if (glowRef.current) {
            const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.02;
            glowRef.current.scale.setScalar(pulseScale);
        }
    });

    const panelColor = new THREE.Color(data.color);

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={() => {
                setHovered(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHovered(false);
                document.body.style.cursor = 'auto';
            }}
        >
            {/* Outer Glow Border */}
            <mesh ref={glowRef} position={[0, 0, -0.1]}>
                <planeGeometry args={[13, 8]} />
                <meshBasicMaterial
                    color={data.color}
                    transparent
                    opacity={hovered ? 0.4 : 0.15}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Glass Panel Background */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[12, 7]} />
                <meshPhysicalMaterial
                    color={hovered ? data.color : "#0a0a0a"}
                    transparent
                    opacity={hovered ? 0.25 : 0.7}
                    roughness={0.1}
                    metalness={0.9}
                    transmission={0.4}
                    thickness={1.5}
                    side={THREE.DoubleSide}
                    envMapIntensity={1}
                />
            </mesh>

            {/* Scanline Effect */}
            <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[12, 7]} />
                <shaderMaterial
                    transparent
                    uniforms={{
                        uTime: { value: 0 },
                        uColor: { value: panelColor }
                    }}
                    vertexShader={`
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        uniform float uTime;
                        uniform vec3 uColor;
                        varying vec2 vUv;
                        
                        void main() {
                            float scanline = sin(vUv.y * 100.0) * 0.03;
                            float alpha = scanline * 0.5;
                            gl_FragColor = vec4(uColor, alpha);
                        }
                    `}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Wireframe Border */}
            <mesh position={[0, 0, 0.05]}>
                <planeGeometry args={[12.2, 7.2]} />
                <meshBasicMaterial
                    color={data.color}
                    wireframe
                    transparent
                    opacity={hovered ? 0.8 : 0.4}
                />
            </mesh>

            {/* Corner Accents */}
            {[[-5.8, 3.2], [5.8, 3.2], [-5.8, -3.2], [5.8, -3.2]].map(([x, y], i) => (
                <mesh key={i} position={[x, y, 0.06]}>
                    <circleGeometry args={[0.15, 8]} />
                    <meshBasicMaterial color={data.color} transparent opacity={0.9} />
                </mesh>
            ))}

            {/* Content Layer */}
            <group position={[0, 0, 0.1]}>
                {/* ID Badge */}
                <Text
                    position={[-5, 2.8, 0]}
                    fontSize={0.35}
                    color={data.color}
                    anchorX="left"
                    anchorY="middle"
                    font="/fonts/SpaceMono-Bold.ttf"
                >
                    {'// ' + data.id.toUpperCase()}
                </Text>

                {/* Main Title */}
                <Text
                    position={[0, 1.2, 0]}
                    fontSize={1.4}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={10}
                    textAlign="center"
                    font="/fonts/SpaceMono-Bold.ttf"
                >
                    {data.title}
                </Text>

                {/* Subtitle */}
                <Text
                    position={[0, -0.2, 0]}
                    fontSize={0.55}
                    color={data.color}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/SpaceMono-Regular.ttf"
                >
                    [{data.subtitle}]
                </Text>

                {/* Description */}
                {data.description && (
                    <Text
                        position={[0, -1.2, 0]}
                        fontSize={0.35}
                        color="rgba(255,255,255,0.6)"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={9}
                        textAlign="center"
                    >
                        {data.description}
                    </Text>
                )}

                {/* Image (if provided) */}
                {data.image && (
                    <Image
                        url={data.image}
                        position={[0, -2, 0]}
                        scale={[8, 3.5]}
                        transparent
                        opacity={hovered ? 1 : 0.7}
                        toneMapped={false}
                    />
                )}
            </group>

            {/* Hover Indicator */}
            {hovered && (
                <mesh position={[0, -3.8, 0.1]}>
                    <planeGeometry args={[3, 0.08]} />
                    <meshBasicMaterial color={data.color} />
                </mesh>
            )}
        </group>
    );
};

export default HolographicPanel;
