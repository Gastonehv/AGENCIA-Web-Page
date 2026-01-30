import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHADER GLSL (Matemática Pura) ---
const FluidShader = {
    vertexShader: `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform vec2 uMouse;

    // Ruido Simplex para movimiento orgánico
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vUv = uv;
      // Ondas base + detalle + interacción mouse
      float noise = snoise(uv * 2.5 + uTime * 0.15); 
      float dist = distance(uv, uMouse);
      float mouseWave = smoothstep(0.5, 0.0, dist) * sin(dist * 15.0 - uTime * 3.0) * 0.15;
      
      float displacement = noise + mouseWave;
      vDisplacement = displacement;

      vec3 newPos = position + normal * (displacement * 0.4);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;

    // Paleta de colores BLANCO con iridiscencia visible
    vec3 palette( in float t ) {
        // Base clara
        vec3 a = vec3(0.92, 0.92, 0.94);
        // Variación iridiscente más visible
        vec3 b = vec3(0.08, 0.08, 0.10);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.00, 0.20, 0.45); // Fase arcoiris más pronunciada
        return a + b*cos( 6.28318*(c*t+d) );
    }

    void main() {
        // El color depende de la altura de la onda - más sensible
        float iridescence = vDisplacement * 4.0 + uTime * 0.15 + vUv.x * 0.5;
        vec3 col = palette(iridescence);
        
        // Brillo especular más visible (efecto perla)
        float highlight = smoothstep(0.15, 0.45, vDisplacement);
        col += vec3(highlight) * 0.12;

        // Sombras suaves en valles
        col *= smoothstep(-0.7, 1.0, vDisplacement + 0.4);
        
        // Mantener claro pero permitir más variación
        col = clamp(col, vec3(0.80), vec3(1.0));

        gl_FragColor = vec4(col, 1.0);
    }
  `
};

const FluidPlane = () => {
    const meshRef = useRef(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    }), []);


    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
            // Interpolación suave del mouse
            mouseRef.current.lerp(new THREE.Vector2((state.mouse.x + 1) / 2, (state.mouse.y + 1) / 2), 0.1);
            materialRef.current.uniforms.uMouse.value = mouseRef.current;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 12, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={FluidShader.vertexShader}
                fragmentShader={FluidShader.fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

interface Props {
    paused?: boolean;
}

const EssenceBackground: React.FC<Props> = ({ paused }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1, background: '#fff' }}>
            <Canvas camera={{ position: [0, 4, 0], fov: 60 }}>
                {!paused && <FluidPlane />}
            </Canvas>
        </div>
    );
};

export default EssenceBackground;
