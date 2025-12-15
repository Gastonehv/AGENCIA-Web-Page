import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface AIEntityProps {
    isActive: boolean;
}

const AIEntity: React.FC<AIEntityProps> = ({ isActive }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Animación suave de rotación y respiración
    useFrame((state) => {
        if (meshRef.current) {
            // Velocidad variable según estado
            const speed = isActive ? 0.5 : 0.1;
            const dist = isActive ? 0.3 : 0.1;

            meshRef.current.rotation.x += 0.01 * (isActive ? 2 : 1);
            meshRef.current.rotation.y += 0.01 * (isActive ? 3 : 1);

            // "Flotación" más pronunciada si está activo
            meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * speed) * dist;
        }
    });

    return (
        <Sphere args={[1, 64, 64]} ref={meshRef} scale={2}>
            <MeshDistortMaterial
                color={isActive ? "#ffffff" : "#d1e8ff"} // Blanco puro para reflejar mejor el atardecer vs Azul muy pálido
                envMapIntensity={isActive ? 3.0 : 1.0} // Intensidad triple para que el reflejo sea evidente
                clearcoat={1}
                clearcoatRoughness={0.05}
                metalness={1.0} // Metal total
                roughness={0.0} // Espejo perfecto
                distort={isActive ? 0.6 : 0.3} // Más distorsión al "pensar"
                speed={isActive ? 3 : 1}
            />
        </Sphere>
    );
};

export default AIEntity;
