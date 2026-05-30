import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import logoAgenciaBlanco from '../assets/logos/Tipografia_agencIA_blanco.png';

const Vortex = () => {
    const groupRef = useRef<THREE.Group>(null);
    const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

    // Load logo image
    useEffect(() => {
        const img = new Image();
        img.src = logoAgenciaBlanco;
        img.onload = () => {
            setLogoImage(img);
        };
    }, []);

    // Helper to generate canvas texture
    const generateTexture = (img: HTMLImageElement, isMirrored: boolean) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return null;

        const aspect = img.width / img.height;
        const logoHeight = 45;
        const logoWidth = logoHeight * aspect;

        const minHorizontalSpacing = 55;
        const cols = Math.floor(1024 / minHorizontalSpacing);
        const horizontalSpacing = 1024 / cols;
        const verticalSpacing = logoWidth * 1.35; // clean spacing between repeated logos

        // Calculate seamless height for tiling
        const rows = Math.round(1024 / verticalSpacing);
        const exactCanvasHeight = rows * verticalSpacing;

        canvas.width = 1024;
        canvas.height = exactCanvasHeight;
        context.imageSmoothingEnabled = true;

        // Black background applied to the resized canvas
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (let x = horizontalSpacing / 2; x < canvas.width; x += horizontalSpacing) {
            for (let y = verticalSpacing / 2; y < canvas.height; y += verticalSpacing) {
                context.save();
                context.translate(x, y);
                context.rotate(Math.PI / 2);
                
                if (isMirrored) {
                    context.scale(-1, 1); // Flip horizontally for back view
                }
                
                // Draw logo centered
                context.drawImage(img, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
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
    };

    // Generate dual textures
    const textures = useMemo(() => {
        if (!logoImage) return null;

        const texFront = generateTexture(logoImage, false);
        const texBack = generateTexture(logoImage, true);

        return { front: texFront, back: texBack };
    }, [logoImage]);

    const textureFrontRef = useRef<THREE.CanvasTexture | null>(null);
    const textureBackRef = useRef<THREE.CanvasTexture | null>(null);

    useEffect(() => {
        if (textures) {
            textureFrontRef.current = textures.front;
            textureBackRef.current = textures.back;
        }
    }, [textures]);

    useFrame((state) => {
        if (!groupRef.current || !textureFrontRef.current || !textureBackRef.current) return;

        const time = state.clock.getElapsedTime();

        // Rotation of the whole group
        groupRef.current.rotation.z = time * 0.2;

        // Animate offset vertically on both textures
        const speed = 0.04;
        const offsetY = -(time * speed) % 1;
        textureFrontRef.current.offset.y = offsetY;
        textureBackRef.current.offset.y = offsetY;
    });

    if (!textures || !textures.front || !textures.back) return null;

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
            <group ref={groupRef}>
                {/* Exterior Torus Surface (FrontSide) */}
                <mesh
                    rotation={[Math.PI * 0.01, 0, 0]}
                    position={[0, 0, 0]}
                >
                    <torusGeometry args={[5, 3.8, 60, 100]} />
                    <meshStandardMaterial
                        map={textures.front}
                        roughness={0.4}
                        metalness={0.6}
                        side={THREE.FrontSide}
                    />
                </mesh>
                {/* Interior Torus Surface (BackSide) */}
                <mesh
                    rotation={[Math.PI * 0.01, 0, 0]}
                    position={[0, 0, 0]}
                >
                    <torusGeometry args={[5, 3.8, 60, 100]} />
                    <meshStandardMaterial
                        map={textures.back}
                        roughness={0.4}
                        metalness={0.6}
                        side={THREE.BackSide}
                    />
                </mesh>
            </group>
        </group>
    );
};

export default Vortex;
