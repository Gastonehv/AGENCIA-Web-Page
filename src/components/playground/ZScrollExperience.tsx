import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Image, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const SECTION_Z_SPACING = 30;
const TOTAL_SECTIONS = 6;

// Fake Data for Content Panels
const contentData = [
    { title: "INFRAESTRUCTURA", subtitle: "ESCALABILIDAD ILIMITADA", type: "text" },
    { title: "SAAS & PLATFORMS", subtitle: "MOTORES DE INGRESO", type: "image", src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" },
    { title: "ECOSISTEMAS", subtitle: "ORGANISMO UNIFICADO", type: "text" },
    { title: "DASHBOARDS", subtitle: "CONTROL TOTAL", type: "image", src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" },
    { title: "SEGURIDAD", subtitle: "BLINDAJE DE DATOS", type: "text" },
    { title: "INTEGRACIONES", subtitle: "CONECTIVIDAD TOTAL", type: "image", src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" }
];

interface PanelData {
    title: string;
    subtitle: string;
    type: string;
    src?: string;
}

const HolographicPanel = ({ position, data, index }: { position: [number, number, number], data: PanelData, index: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Gentle float
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;

        // Look at camera (billboard effect but damped)
        groupRef.current.lookAt(0, 0, state.camera.position.z + 20); // Always face forward slightly
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Glass Panel Background */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[12, 7]} />
                <meshPhysicalMaterial
                    color={hovered ? "#00FF99" : "#000"}
                    transparent
                    opacity={hovered ? 0.2 : 0.5}
                    roughness={0}
                    metalness={0.8}
                    transmission={0.5}
                    thickness={2}
                    wireframe={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Border Glow */}
            <mesh position={[0, 0, 0.05]}>
                <planeGeometry args={[12.1, 7.1]} />
                <meshBasicMaterial color="#00FF99" wireframe transparent opacity={0.3} />
            </mesh>

            {/* Content */}
            <group position={[0, 0, 0.1]}>
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={1.2}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                // font="/fonts/Inter-Bold.ttf" // Commented out to fallback to default if missing
                >
                    {data.title}
                </Text>

                <Text
                    position={[0, 0.5, 0]}
                    fontSize={0.5}
                    color="#00FF99"
                    anchorX="center"
                    anchorY="middle"
                >
                    [{data.subtitle}]
                </Text>

                {data.type === 'image' && (
                    <Image
                        url={data.src || ''}
                        position={[0, -1.5, 0]}
                        scale={[6, 3]}
                        transparent
                        opacity={0.8}
                        toneMapped={false}
                    />
                )}
            </group>
        </group>
    );
};

const ZScrollExperience = () => {
    const scroll = useScroll();
    const { camera } = useThree();

    useFrame((state, delta) => {
        // Move camera along Z axis based on scroll
        // Range: 0 to TOTAL_SECTIONS * SECTION_Z_SPACING
        const targetZ = -scroll.offset * (TOTAL_SECTIONS * SECTION_Z_SPACING);

        // Smooth lerp camera z
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ + 10, delta * 2);

        // Add some mouse parallax
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.mouse.x * 2, delta * 2);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.mouse.y * 2, delta * 2);
    });

    // Generate panels along the path
    const panels = useMemo(() => {
        return contentData.map((data, i) => {
            const z = -i * SECTION_Z_SPACING;
            const x = (i % 2 === 0 ? -1 : 1) * 4; // Alternate Left/Right
            const y = (Math.random() - 0.5) * 4; // Random Height variation
            return <HolographicPanel key={i} index={i} position={[x, y, z]} data={data} />;
        });
    }, []);

    return (
        <group>
            {panels}

            {/* Floor Grid (Tron style) to give speed reference */}
            <gridHelper
                args={[300, 100, 0x111111, 0x050505]}
                position={[0, -10, -100]}
                rotation={[0, 0, 0]}
            />
            {/* Ceiling Grid */}
            <gridHelper
                args={[300, 100, 0x111111, 0x050505]}
                position={[0, 10, -100]}
                rotation={[0, 0, 0]}
            />
        </group>
    );
};

export default ZScrollExperience;
