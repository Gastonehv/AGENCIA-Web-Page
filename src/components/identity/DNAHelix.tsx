import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHADERS: NOLAN V4 (INSTANT FLIGHT & IDLE LIFE) ---

const vertexShader = `
  uniform float uTime;
  uniform float uScroll;
  
  attribute float size;
  attribute vec3 color;
  attribute float shape; 
  attribute float random;
  attribute vec3 linePos; 
  
  varying vec3 vColor;
  varying float vShape;
  varying float vOpacity;
  
  void main() {
    vColor = color;
    vShape = shape;

    // 1. MORPHING (Ultra fast morph now)
    float morph = smoothstep(0.0, 0.10, uScroll); 
    vec3 currentPos = mix(linePos, position, morph);

    // 2. ASCENT SCAN
    float scanY = mix(-50.0, 50.0, uScroll); 
    
    // Bridge Reveal
    bool isBridge = (color.r > 0.9 && color.g > 0.9 && color.b > 0.9);
    float alpha = 1.0;
    
    if (isBridge) {
        float bridgeReveal = smoothstep(scanY + 20.0, scanY + 5.0, currentPos.y);
        alpha *= bridgeReveal;
    }
    vOpacity = alpha;

    // 3. FREQUENCIES (High Energy V3.1)
    if (shape < 0.5) { 
        // LOGIC: Data Rain
        float dataFlow = sin(currentPos.y * 1.5 + uTime * 12.0); 
        if (dataFlow > 0.85) currentPos.x += 0.5; 
        else if (dataFlow < -0.85) currentPos.x -= 0.5; 
    } 
    else { 
        // SOUL: Active Flow
        float flow = sin(currentPos.y * 1.5 + uTime * 5.0);
        currentPos += normalize(currentPos) * flow * 0.6; 
    }

    // 4. PROJECTION
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 5. BOKEH
    float dist = length(mvPosition.xyz);
    float dof = smoothstep(50.0, 5.0, dist); 
    float baseSize = size * (400.0 / dist); 
    gl_PointSize = baseSize * (0.4 + 0.6 * dof);
    
    if (isBridge) gl_PointSize *= 2.0; // Brighter bridges
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vShape;
  varying float vOpacity;
  
  void main() {
    if (vOpacity < 0.01) discard;

    if (vShape < 0.5) { 
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (abs(coord.x) > 0.45 || abs(coord.y) > 0.45) discard;
        float center = 1.0 - length(coord * 2.5); 
        gl_FragColor = vec4(vColor + center * 0.6, vOpacity);
    } 
    else { 
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float r = dot(cxy, cxy);
        if (r > 1.0) discard;
        float glow = 1.0 - r;
        glow = pow(glow, 1.2); 
        gl_FragColor = vec4(vColor, glow * vOpacity);
    }
  }
`;

const DNAHelixContent = () => {
    // 1. GEOMETRY (Majestic / Untwisted)
    const { positions, linePositions, colors, sizes, shapes, randoms } = useMemo(() => {
        const pointsCount = 1600;
        const height = 140;
        const radius = 7.0;
        const turns = 2.0; // Majestic Twist
        const lineWidth = 120;

        const pos = [];
        const linePos = [];
        const col = [];
        const siz = [];
        const sha = [];
        const rnd = [];

        const cLogic = new THREE.Color("#00FFFF");
        const cSoul = new THREE.Color("#FF0080");
        const cBridge = new THREE.Color("#FFFFFF");

        for (let i = 0; i < pointsCount; i++) {
            const t = i / pointsCount;
            const angle = t * Math.PI * 2 * turns;
            const y = (t - 0.5) * height;

            // Logic
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const lx1 = -15; const lz1 = 0; // Wider initial separation

            pos.push(x1, y, z1);
            linePos.push(lx1, y, lz1);
            col.push(cLogic.r, cLogic.g, cLogic.b);
            siz.push(Math.random() * 2.0 + 1.2);
            sha.push(0.0);
            rnd.push(Math.random());

            // Particles
            for (let j = 0; j < 2; j++) {
                pos.push(x1 + (Math.random() - 0.5) * 1.5, y + (Math.random() - 0.5), z1 + (Math.random() - 0.5) * 1.5);
                linePos.push(lx1 + (Math.random() - 0.5) * 3, y + (Math.random() - 0.5), lz1);
                col.push(cLogic.r, cLogic.g, cLogic.b);
                siz.push(Math.random() * 1.0);
                sha.push(0.0);
                rnd.push(Math.random());
            }

            // Soul
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;
            const lx2 = 15; const lz2 = 0;

            pos.push(x2, y, z2);
            linePos.push(lx2, y, lz2);
            col.push(cSoul.r, cSoul.g, cSoul.b);
            siz.push(Math.random() * 3.0 + 1.8);
            sha.push(1.0);
            rnd.push(Math.random());

            // Particles
            for (let j = 0; j < 2; j++) {
                pos.push(x2 + (Math.random() - 0.5) * 2.5, y + (Math.random() - 0.5), z2 + (Math.random() - 0.5) * 2.5);
                linePos.push(lx2 + (Math.random() - 0.5) * 5, y + (Math.random() - 0.5), lz2);
                col.push(cSoul.r, cSoul.g, cSoul.b);
                siz.push(Math.random() * 1.5);
                sha.push(1.0);
                rnd.push(Math.random());
            }

            // Bridges
            if (i % 35 === 0) {
                const steps = 15;
                for (let k = 0; k <= steps; k++) {
                    const f = k / steps;
                    const bx = THREE.MathUtils.lerp(x1, x2, f);
                    const bz = THREE.MathUtils.lerp(z1, z2, f);
                    const blx = THREE.MathUtils.lerp(lx1, lx2, f);

                    pos.push(bx, y, bz);
                    linePos.push(blx, y, 0);
                    col.push(cBridge.r, cBridge.g, cBridge.b);
                    siz.push(1.5);
                    sha.push(1.0);
                    rnd.push(Math.random());
                }
            }
        }

        return {
            positions: new Float32Array(pos),
            linePositions: new Float32Array(linePos),
            colors: new Float32Array(col),
            sizes: new Float32Array(siz),
            shapes: new Float32Array(sha),
            randoms: new Float32Array(rnd)
        };
    }, []);

    const shaderRef = useRef<THREE.ShaderMaterial>(null);
    const groupRef = useRef<THREE.Group>(null);
    const scrollRef = useRef(0);

    // Camera
    const camTarget = useRef(new THREE.Vector3(0, 0, 60));
    const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

    React.useEffect(() => {
        const handleScroll = () => { scrollRef.current = window.scrollY; };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // 1. ROTATE WHOLE GROUP (IDLE ANIMATION)
        // Even if scroll is 0, the helix rotates slowly. 
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.05; // Slow cinematic spin
        }

        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = time;

            // Normalize Scroll
            const maxScroll = window.innerHeight * 8;
            let nScroll = Math.min(Math.max(scrollRef.current / maxScroll, 0), 1);

            shaderRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
                shaderRef.current.uniforms.uScroll.value,
                nScroll,
                0.1
            );

            let tx = 0, ty = 0, tz = 60;
            let lx = 0, ly = 0, lz = 0;
            let roll = 0;

            const START_Y = -40;
            const END_Y = 40;
            const FLIGHT_TURNS = 2.0;
            const FLIGHT_RADIUS = 3.0;

            // COMPRESSED TIMELINE FOR INSTANT GRATIFICATION
            if (nScroll < 0.05) {
                // PHASE 1: REVEAL (Fast: 0% - 5%)
                const t = nScroll / 0.05;
                tx = 0; ty = 0;
                tz = THREE.MathUtils.lerp(80, 50, t);
                lx = 0; ly = 0; lz = 0;

            } else if (nScroll < 0.15) {
                // PHASE 2: DIVE (Fast: 5% - 15%)
                const t = (nScroll - 0.05) / 0.10;
                const easeT = t * t * (3 - 2 * t);

                ty = THREE.MathUtils.lerp(0, START_Y, easeT);

                const currentRadius = THREE.MathUtils.lerp(0, FLIGHT_RADIUS, easeT);
                const entryAngle = easeT * Math.PI * 0.5;

                tx = Math.cos(entryAngle) * currentRadius;
                tz = THREE.MathUtils.lerp(50, Math.sin(entryAngle) * currentRadius, easeT);

                lx = 0; ly = THREE.MathUtils.lerp(0, START_Y + 10, easeT); lz = 0;
                roll = easeT * -0.15;

            } else if (nScroll < 0.85) {
                // PHASE 3: VOYAGE (Long: 15% - 85%)
                const t = (nScroll - 0.15) / 0.70; // Adjusted denominator
                const flightY = THREE.MathUtils.lerp(START_Y, END_Y, t);

                const angle = (Math.PI * 0.5) + (t * Math.PI * 2 * FLIGHT_TURNS);

                const drift = Math.sin(time * 0.5) * 1.5; // Stronger drift
                const r = FLIGHT_RADIUS + drift;

                tx = Math.cos(angle) * r;
                tz = Math.sin(angle) * r;
                ty = flightY;

                const lookAngle = angle + 0.3;
                lx = Math.cos(lookAngle) * r;
                lz = Math.sin(lookAngle) * r;
                ly = flightY + 10;

                roll = Math.sin(time * 0.3) * 0.05 + (drift * -0.05);

            } else {
                // PHASE 4: EXIT
                const t = (nScroll - 0.85) / 0.15;
                const easeT = t * t;

                ty = THREE.MathUtils.lerp(END_Y, 60, easeT);

                const endAngle = (Math.PI * 0.5) + (Math.PI * 2 * FLIGHT_TURNS);
                const currentRadius = THREE.MathUtils.lerp(FLIGHT_RADIUS, 0, easeT);

                tx = Math.cos(endAngle) * currentRadius;
                tz = THREE.MathUtils.lerp(Math.sin(endAngle) * currentRadius, 70, easeT);

                lx = 0; ly = ty; lz = 0;
                roll = THREE.MathUtils.lerp(0, 0, easeT);
            }

            camTarget.current.set(tx, ty, tz);
            state.camera.position.lerp(camTarget.current, 0.06);

            lookTarget.current.set(lx, ly, lz);
            const currentLook = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
            currentLook.lerp(lookTarget.current, 0.08);
            state.camera.lookAt(currentLook);

            state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, roll, 0.04);
        }
    });

    return (
        <group ref={groupRef}>
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-linePos" args={[linePositions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                    <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
                    <bufferAttribute attach="attributes-shape" args={[shapes, 1]} />
                    <bufferAttribute attach="attributes-random" args={[randoms, 1]} />
                </bufferGeometry>
                <shaderMaterial
                    ref={shaderRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{ uTime: { value: 0 }, uScroll: { value: 0 } }}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

const DNAHelix = () => {
    return (
        <mesh>
            <DNAHelixContent />
        </mesh>
    );
};

export default DNAHelix;
