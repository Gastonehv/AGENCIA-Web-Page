import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import boldiniUrl from '../assets/fonts/Boldini Bold.ttf';

const Vortex = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const [fontLoaded, setFontLoaded] = useState(false);

    // Load Font
    useEffect(() => {
        const font = new FontFace('Boldini', `url(${boldiniUrl})`);
        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
            setFontLoaded(true);
        }).catch((err) => {
            console.error('Failed to load Boldini font:', err);
            setFontLoaded(true);
        });
    }, []);

    // Generate texture programmatically
    const texture = useMemo(() => {
        if (!fontLoaded) return null;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return null;

        canvas.width = 1024;
        canvas.height = 1024;
        context.imageSmoothingEnabled = true;

        // Fondo negro
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Configuración inicial para medir
        context.font = '45px Boldini, Arial, sans-serif';
        const text = 'AGENCIA   ';
        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;

        // --- CÁLCULO DE ALTURA PERFECTA PARA TILING ---
        const targetHeight = 1024;
        const rows = Math.round(targetHeight / textWidth);
        const exactCanvasHeight = rows * textWidth;

        // Redimensionamos el canvas
        canvas.width = 1024;
        canvas.height = exactCanvasHeight;

        // Re-aplicamos configuración tras resize
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'white';
        context.font = '45px Boldini, Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // --- AJUSTES DE ESPACIADO ---
        const minHorizontalSpacing = 40;
        const cols = Math.floor(canvas.width / minHorizontalSpacing);
        const horizontalSpacing = canvas.width / cols;
        const verticalSpacing = textWidth;

        for (let x = horizontalSpacing / 2; x < canvas.width; x += horizontalSpacing) {
            for (let y = verticalSpacing / 2; y < canvas.height; y += verticalSpacing) {
                context.save();
                context.translate(x, y);
                context.rotate(Math.PI / 2);
                context.fillText(text, 0, 0);
                context.restore();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(3, 3);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;

        return tex;
    }, [fontLoaded]);

    useFrame((state) => {
        if (!meshRef.current || !materialRef.current || !texture) return;

        const time = state.clock.getElapsedTime();

        // Rotation
        meshRef.current.rotation.z = time * 0.2;

        // Texture Offset
        const speed = 0.04;
        texture.offset.y = -(time * speed) % 1;
    });

    if (!texture) return null;

    return (
        <group position={[0, 0, 0]}>
            <spotLight
                position={[0, -0.2, 9]}
                angle={Math.PI / 4.3}
                penumbra={1}
                intensity={100}
                color="#ffffff"
                castShadow={false}
            />
            <ambientLight intensity={0.5} color={0x404040} />
            <mesh
                ref={meshRef}
                rotation={[Math.PI * 0.01, 0, 0]}
                position={[0, 0, 0]}
            >
                <torusGeometry args={[5, 3.8, 60, 100]} />
                <meshStandardMaterial
                    ref={materialRef}
                    map={texture}
                    roughness={0.4}
                    metalness={0.6}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

export default Vortex;
