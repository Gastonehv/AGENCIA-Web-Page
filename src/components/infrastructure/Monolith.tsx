import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

const Monolith = ({ scrollProgress }: { scrollProgress: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Group>(null);

    // Animación constante + Scroll
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.2 + scrollProgress * Math.PI;
            meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
            
            // Escala cinética
            const s = 1 + scrollProgress * 0.5;
            meshRef.current.scale.set(s, s, s);
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -time * 0.4;
        }
    });

    return (
        <group>
            {/* El Monolito de Cristal */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    <boxGeometry args={[4, 6, 4]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={8}
                        resolution={256}
                        transmission={1}
                        roughness={0.1}
                        thickness={1.5}
                        ior={1.2}
                        chromaticAberration={0.04}
                        anisotropy={0.1}
                        color="#ffffff"
                    />
                    <Edges scale={1} threshold={15} color="#00f3ff" opacity={0.2} transparent />
                </mesh>

                {/* Núcleo de Datos Interno */}
                <group ref={innerRef}>
                    <mesh>
                        <boxGeometry args={[1, 3, 1]} />
                        <meshBasicMaterial color="#00f3ff" toneMapped={false} />
                    </mesh>
                    <pointLight color="#00f3ff" intensity={5} distance={10} />
                </group>

                {/* Etiquetas Técnicas Flotantes */}
                <Text
                    position={[4, 2, 0]}
                    fontSize={0.1}
                    font="https://fonts.gstatic.com/s/robotomono/v12/L0tkDFI83F8P-7u4xXUGL3_p.woff"
                    color="#00f3ff"
                    anchorX="left"
                    opacity={scrollProgress > 0.1 ? 1 : 0}
                >
                    {`[ PROTOCOLO_RAG: ACTIVE ]\n[ LATENCIA: 0.02ms ]\n[ NODOS: 1,024 ]`}
                </Text>
            </Float>
        </group>
    );
};

export default Monolith;
