import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';
import HolographicPanel from './HolographicPanel';
import type { PanelData } from './HolographicPanel';
import SpeedParticles from './SpeedParticles';

// Import service images
import genesisImg from '../../assets/images/genesis-sneaker.jpg';
import digitalArchImg from '../../assets/images/architecture-interface.png';
import cognitiveEcoImg from '../../assets/images/ai-processor.jpg';
import processSyncImg from '../../assets/images/automation-growth.jpg';

const SECTION_Z_SPACING = 35;

// Real content based on AgencIA services
const contentData: PanelData[] = [
    {
        id: 'genesis',
        title: 'IDENTIDAD VISUAL',
        subtitle: 'DISEÑO DE MARCA',
        description: 'Creamos identidades que trascienden lo visual. Marcas vivas que evolucionan.',
        image: genesisImg,
        color: '#ff2a6d'
    },
    {
        id: 'hyperstructure',
        title: 'ARQUITECTURA DIGITAL',
        subtitle: 'INFRAESTRUCTURA INFINITA',
        description: 'Sistemas escalables. Aplicaciones que crecen con tu visión.',
        image: digitalArchImg,
        color: '#05d9e8'
    },
    {
        id: 'cortex',
        title: 'INTELIGENCIA ARTIFICIAL',
        subtitle: 'ECOSISTEMA COGNITIVO',
        description: 'IA generativa. Automatización inteligente. El futuro, hoy.',
        image: cognitiveEcoImg,
        color: '#7700ff'
    },
    {
        id: 'nexus',
        title: 'AUTOMATIZACIÓN',
        subtitle: 'SINCRONIZACIÓN TOTAL',
        description: 'Flujos de trabajo optimizados. Eficiencia sin límites.',
        image: processSyncImg,
        color: '#00ff9d'
    },
    {
        id: 'symbiosis',
        title: 'ECOSISTEMAS',
        subtitle: 'INTEGRACIÓN ORGÁNICA',
        description: 'Conexiones que multiplican. Plataformas que colaboran.',
        color: '#FFD700'
    },
    {
        id: 'nucleus',
        title: 'EL NÚCLEO',
        subtitle: 'DONDE TODO CONVERGE',
        description: 'Tu visión + nuestra ejecución = Resultados extraordinarios.',
        color: '#FF6B35'
    }
];

const TOTAL_SECTIONS = contentData.length;

// Animated Grid Floor with depth
const AnimatedGrid = () => {
    const gridRef = useRef<THREE.GridHelper>(null);

    useFrame((state) => {
        if (gridRef.current) {
            // Subtle wave animation
            gridRef.current.position.z = -100 + Math.sin(state.clock.elapsedTime * 0.2) * 5;
        }
    });

    return (
        <group>
            {/* Floor Grid */}
            <gridHelper
                ref={gridRef}
                args={[400, 150, 0x0a0a0a, 0x050505]}
                position={[0, -12, -100]}
            />
            {/* Ceiling Grid */}
            <gridHelper
                args={[400, 150, 0x0a0a0a, 0x050505]}
                position={[0, 12, -100]}
            />
            {/* Side walls (subtle) */}
            <gridHelper
                args={[400, 100, 0x080808, 0x030303]}
                position={[-25, 0, -100]}
                rotation={[0, 0, Math.PI / 2]}
            />
            <gridHelper
                args={[400, 100, 0x080808, 0x030303]}
                position={[25, 0, -100]}
                rotation={[0, 0, Math.PI / 2]}
            />
        </group>
    );
};



// Entrance text animation
const EntranceText = () => {
    const textRef = useRef<THREE.Group>(null);
    const scroll = useScroll();

    useFrame(() => {
        if (!textRef.current) return;
        // Fade out as we scroll
        const opacity = Math.max(0, 1 - scroll.offset * 5);
        textRef.current.children.forEach((child) => {
            if ((child as THREE.Mesh).material) {
                ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacity;
            }
        });
    });

    return (
        <group ref={textRef} position={[0, 0, 5]}>
            <Text
                position={[0, 2, 0]}
                fontSize={0.4}
                color="#00FF99"
                anchorX="center"
                font="/fonts/SpaceMono-Regular.ttf"
            >
                [ AGENCIA_LAB ]
            </Text>
            <Text
                position={[0, 0.5, 0]}
                fontSize={1.5}
                color="#ffffff"
                anchorX="center"
                font="/fonts/SpaceMono-Bold.ttf"
            >
                Z-AXIS EXPERIENCE
            </Text>
            <Text
                position={[0, -1, 0]}
                fontSize={0.35}
                color="rgba(255,255,255,0.5)"
                anchorX="center"
            >
                Scroll para navegar a través de nuestros servicios
            </Text>
        </group>
    );
};

const ZScrollExperience = () => {
    const scroll = useScroll();
    const { camera } = useThree();

    useFrame((state, delta) => {
        // Calculate target Z based on scroll
        const maxZ = TOTAL_SECTIONS * SECTION_Z_SPACING;
        const targetZ = -scroll.offset * maxZ;

        // Smooth camera movement along Z
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ + 15, delta * 2.5);

        // Mouse parallax for immersion
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 3, delta * 3);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.pointer.y * 2, delta * 3);

        // Subtle camera tilt based on mouse
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -state.pointer.x * 0.05, delta * 2);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, state.pointer.y * 0.03, delta * 2);
    });

    // Generate panels with varied positioning
    const panels = useMemo(() => {
        return contentData.map((data, i) => {
            const z = -i * SECTION_Z_SPACING - 20; // Start after entrance
            const x = (i % 2 === 0 ? -1 : 1) * (4 + Math.random() * 2);
            const y = (Math.random() - 0.5) * 3;

            return (
                <HolographicPanel
                    key={data.id}
                    index={i}
                    position={[x, y, z]}
                    data={data}
                />
            );
        });
    }, []);

    return (
        <group>
            {/* Speed particles for warp effect */}
            <SpeedParticles count={1500} speed={0.3} spread={40} depth={250} />

            {/* Entrance */}
            <EntranceText />

            {/* Content panels */}
            {panels}

            {/* Tunnel structure */}
            <AnimatedGrid />

            {/* Ambient lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
            <pointLight position={[-10, -10, -50]} intensity={0.3} color="#00FF99" />
            <pointLight position={[0, 0, -100]} intensity={0.4} color="#7700ff" />
            <pointLight position={[0, 0, -180]} intensity={0.4} color="#ff2a6d" />
        </group>
    );
};

export default ZScrollExperience;
