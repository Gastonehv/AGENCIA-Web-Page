import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpeedParticlesProps {
    count?: number;
    speed?: number;
    spread?: number;
    depth?: number;
}

const SpeedParticles: React.FC<SpeedParticlesProps> = ({
    count = 2000,
    speed = 0.5,
    spread = 50,
    depth = 200
}) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate particle positions and velocities
    const { velocities, geometry } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * spread;
            pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
            pos[i * 3 + 2] = -Math.random() * depth;
            vel[i] = 0.5 + Math.random() * 1.5;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('velocity', new THREE.BufferAttribute(vel, 1));

        return { positions: pos, velocities: vel, geometry: geo };
    }, [count, spread, depth]);

    // Shader material
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#00FF99') },
                uOpacity: { value: 0.6 }
            },
            vertexShader: `
                attribute float velocity;
                varying float vVelocity;
                varying float vZ;
                
                void main() {
                    vVelocity = velocity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vZ = -mvPosition.z;
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = (2.0 + velocity * 2.0) * (200.0 / -mvPosition.z);
                    gl_PointSize = clamp(gl_PointSize, 1.0, 8.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                uniform float uOpacity;
                varying float vVelocity;
                varying float vZ;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    if (dist > 0.5) discard;
                    
                    float alpha = (1.0 - dist * 2.0) * uOpacity;
                    alpha *= smoothstep(0.0, 30.0, vZ);
                    alpha *= smoothstep(200.0, 100.0, vZ);
                    vec3 color = mix(uColor * 0.5, uColor, vVelocity);
                    gl_FragColor = vec4(color, alpha * vVelocity);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const posAttr = pointsRef.current.geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            posArray[i * 3 + 2] += velocities[i] * speed * delta * 60;

            if (posArray[i * 3 + 2] > 10) {
                posArray[i * 3 + 2] = -depth;
                posArray[i * 3] = (Math.random() - 0.5) * spread;
                posArray[i * 3 + 1] = (Math.random() - 0.5) * spread;
            }
        }

        posAttr.needsUpdate = true;
        material.uniforms.uTime.value = state.clock.elapsedTime;
    });

    return <points ref={pointsRef} geometry={geometry} material={material} />;
};

export default SpeedParticles;
