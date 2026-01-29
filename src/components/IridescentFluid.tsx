import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FluidShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vDisplacement;
    
    uniform float uTime;
    uniform vec2 uMouse;

    // Simplex Noise (Lightweight)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
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
      vNormal = normal;
      
      // ORGANIC MOVEMENT LOGIC
      // Base slow ripple
      float noise = snoise(uv * 3.0 + uTime * 0.2); 
      // Detail ripple
      float detail = snoise(uv * 10.0 - uTime * 0.4) * 0.1;
      
      // Mouse interaction influence (Distance field)
      float dist = distance(uv, uMouse);
      float mouseWave = smoothstep(0.5, 0.0, dist) * sin(dist * 20.0 - uTime * 2.0) * 0.2;

      float displacement = noise + detail + mouseWave;
      vDisplacement = displacement;

      vec3 newPos = position + normal * (displacement * 0.5);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vDisplacement;
    
    uniform float uTime;

    // COSINE PALETTE (Iridiscent Logic)
    // Based on Inigo Quilez
    vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b*cos( 6.28318*(c*t+d) );
    }

    void main() {
        // LIQUID CHROME / PEARL PALETTE
        // This mix creates that "oil on water" rainbow effect over a silver base
        vec3 a = vec3(0.5, 0.5, 0.5); // Base grey
        vec3 b = vec3(0.5, 0.5, 0.5); // Contrast
        vec3 c = vec3(1.0, 1.0, 1.0); // Frequency
        vec3 d = vec3(0.00, 0.33, 0.67); // Phase shift (Rainbow)

        // Calculate color based on displacement height
        // The more displaced, the more colorful
        float iridescence = vDisplacement * 2.5 + uTime * 0.1;
        
        vec3 col = palette(iridescence, a, b, c, d);
        
        // Add "Wet" Highlight (Specular)
        float highlight = smoothstep(0.4, 0.6, vDisplacement);
        col += vec3(highlight) * 0.5;

        // Darken the deep parts (AO fake)
        col *= smoothstep(-0.5, 1.0, vDisplacement + 0.2);

        gl_FragColor = vec4(col, 1.0);
    }
  `
};

const FluidMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Track mouse for interaction
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Smooth mouse interpolation
      const targetX = (state.mouse.x + 1) / 2;
      const targetY = (state.mouse.y + 1) / 2;
      
      mouseRef.current.lerp(new THREE.Vector2(targetX, targetY), 0.05);
      materialRef.current.uniforms.uMouse.value = mouseRef.current;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* High segment plane for smooth liquid waves */}
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={FluidShader.vertexShader}
        fragmentShader={FluidShader.fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

const IridescentFluid = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <Canvas camera={{ position: [0, 2, 3], fov: 75 }}>
        <FluidMesh />
      </Canvas>
    </div>
  );
};

export default IridescentFluid;
