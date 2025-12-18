import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const warpVertexShader = `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aSize;
  
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    
    // Infinite Tunnel Movement
    // Move towards camera (+z)
    float zPos = mod(position.z + uTime * aSpeed + aOffset, 200.0) - 150.0;
    pos.z = zPos;
    
    // Warp/Curve Effect
    float curveX = sin(uTime * 0.5 + pos.z * 0.02) * 10.0;
    float curveY = cos(uTime * 0.3 + pos.z * 0.02) * 10.0;
    
    pos.x += curveX;
    pos.y += curveY;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Color based on speed and depth
    vec3 colorFast = vec3(0.0, 1.0, 0.6); // Neon Green
    vec3 colorSlow = vec3(0.0, 0.4, 0.2); // Dark Green
    vColor = mix(colorSlow, colorFast, aSpeed / 50.0);
    
    // Fade in/out
    vAlpha = smoothstep(-150.0, -100.0, pos.z) * (1.0 - smoothstep(0.0, 50.0, pos.z));
  }
`;

const warpFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

const WarpTunnel: React.FC = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = 4000; // High density

    const { speeds, offsets, sizes, matrices } = useMemo(() => {
        const speeds = new Float32Array(count);
        const offsets = new Float32Array(count);
        const sizes = new Float32Array(count);
        const matrices: THREE.Matrix4[] = [];

        const tempObj = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            // Deterministic tunnel distribution
            const r = 15 + ((i * 0.77) % 30);
            const theta = (i * 0.13) * Math.PI * 2;

            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            const z = ((i * 1.23) % 200) - 100;

            tempObj.position.set(x, y, z);
            tempObj.lookAt(0, 0, 100);

            // Scale: Long streaks
            const length = ((i * 0.47) % 20) + 5;
            const thickness = ((i * 0.01) % 0.2) + 0.05;
            tempObj.scale.set(thickness, thickness, length);

            tempObj.updateMatrix();
            matrices.push(tempObj.matrix.clone());

            speeds[i] = 30.0 + ((i * 1.57) % 50.0);
            offsets[i] = (i * 0.89) % 200.0;
            sizes[i] = (i * 0.31) % 1.0;
        }
        return { speeds, offsets, sizes, matrices };
    }, []);

    useLayoutEffect(() => {
        if (meshRef.current) {
            matrices.forEach((matrix, i) => {
                meshRef.current!.setMatrixAt(i, matrix);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [matrices]);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Safely access uniforms
        const material = meshRef.current.material as THREE.ShaderMaterial;
        if (material.uniforms) {
            material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 1, 1]}>
                <instancedBufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
                <instancedBufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
                <instancedBufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
            </boxGeometry>
            <shaderMaterial
                vertexShader={warpVertexShader}
                fragmentShader={warpFragmentShader}
                uniforms={{ uTime: { value: 0 } }}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    );
};

export default WarpTunnel;
