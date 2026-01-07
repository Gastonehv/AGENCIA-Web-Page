import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';

const particleCount = 2000;
const tempObject = new THREE.Object3D();

const DataParticles: React.FC = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const scroll = useScroll();

    // Generate random start positions (Chaos) AND grid target positions (Order)
    const { chaosPositions, orderPositions, colors } = useMemo(() => {
        const chaos = new Float32Array(particleCount * 3);
        const order = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const gridSize = Math.cbrt(particleCount);
        const spacing = 1.5;

        for (let i = 0; i < particleCount; i++) {
            // Chaos: Random wide distribution
            chaos[i * 3] = (Math.random() - 0.5) * 50;
            chaos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            chaos[i * 3 + 2] = (Math.random() - 0.5) * 50;

            // Order: Cubic Grid
            const x = (i % gridSize) * spacing - (gridSize * spacing) / 2;
            const y = (Math.floor(i / gridSize) % gridSize) * spacing - (gridSize * spacing) / 2;
            const z = Math.floor(i / (gridSize * gridSize)) * spacing - (gridSize * spacing) / 2;

            order[i * 3] = x;
            order[i * 3 + 1] = y;
            order[i * 3 + 2] = z;

            // Colors: Neon Green to White gradient based on index
            const c = new THREE.Color().setHSL(0.4, 1, 0.5 + Math.random() * 0.5); // Green-ish
            if (Math.random() > 0.9) c.setHex(0xffffff); // Sparkles
            c.toArray(colors, i * 3);
        }
        return { chaosPositions: chaos, orderPositions: order, colors };
    }, []);

    useLayoutEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < particleCount; i++) {
                tempObject.position.set(chaosPositions[i * 3], chaosPositions[i * 3 + 1], chaosPositions[i * 3 + 2]);
                tempObject.updateMatrix();
                meshRef.current.setMatrixAt(i, tempObject.matrix);
                meshRef.current.setColorAt(i, new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]));
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [chaosPositions, colors]);


    // Color Palettes
    const paletteChaos = useMemo(() => new THREE.Color('#FF4D4D'), []);
    const paletteAnalysis = useMemo(() => new THREE.Color('#00F3FF'), []);
    const paletteStructure = useMemo(() => new THREE.Color('#00FF99'), []);

    // Temp color object for calculations
    const tempColor = new THREE.Color();

    useFrame((state) => {
        if (!meshRef.current) return;

        const t = scroll.offset; // 0 to 1
        const time = state.clock.elapsedTime;

        // --- STAGE LOGIC ---
        // 0.0 - 0.25: Chaos (Red)
        // 0.25 - 0.5: Analysis (Cyan) -> Transition to Order
        // 0.5 - 0.75: Structure (Green) -> Grid Lock
        // 0.75 - 1.0: Dominion (Green) -> Scale Up

        // Color Logic
        let mixFactor = 0;

        if (t < 0.2) {
            tempColor.copy(paletteChaos);
        } else if (t < 0.4) {
            mixFactor = (t - 0.2) / 0.2; // 0 to 1 transition to cyan
            tempColor.lerpColors(paletteChaos, paletteAnalysis, mixFactor);
        } else if (t < 0.6) {
            mixFactor = (t - 0.4) / 0.2; // 0 to 1 transition to green
            tempColor.lerpColors(paletteAnalysis, paletteStructure, mixFactor);
        } else {
            tempColor.copy(paletteStructure);
        }

        // Calculate Position Progress (Chaos -> Order)
        // Start transitioning at 0.3, finish at 0.6
        const orderProgress = THREE.MathUtils.smoothstep(t, 0.3, 0.6);

        for (let i = 0; i < particleCount; i++) {
            // Lerp Position
            const cx = chaosPositions[i * 3];
            const cy = chaosPositions[i * 3 + 1];
            const cz = chaosPositions[i * 3 + 2];

            const ox = orderPositions[i * 3];
            const oy = orderPositions[i * 3 + 1];
            const oz = orderPositions[i * 3 + 2];

            // Vibration/Noise
            let vibrationAmplitude = 0.5 * (1 - orderProgress); // Stops when ordered
            if (t < 0.2) vibrationAmplitude = 2.0; // High chaos initially

            const vx = Math.sin(time * 5 + i) * vibrationAmplitude;
            const vy = Math.cos(time * 3 + i) * vibrationAmplitude;
            const vz = Math.sin(time * 4 + i) * vibrationAmplitude;

            tempObject.position.set(
                THREE.MathUtils.lerp(cx, ox, orderProgress) + vx,
                THREE.MathUtils.lerp(cy, oy, orderProgress) + vy,
                THREE.MathUtils.lerp(cz, oz, orderProgress) + vz
            );

            // Scale & Rotation
            const scaleBase = 0.2 + (orderProgress * 0.3); // Grow slightly when ordered
            tempObject.scale.setScalar(scaleBase);

            // In chaos, random rotation. In order, aligned.
            if (orderProgress < 0.5) {
                tempObject.rotation.set(
                    time + i,
                    time * 0.5 + i,
                    0
                );
            } else {
                // Smooth snap to zero rotation
                tempObject.rotation.set(
                    THREE.MathUtils.lerp(time + i, 0, (orderProgress - 0.5) * 2),
                    THREE.MathUtils.lerp(time * 0.5 + i, 0, (orderProgress - 0.5) * 2),
                    0
                );
            }

            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);

            // COLOR UPDATE
            if (t < 0.4) {
                // Flicker in chaos
                meshRef.current.setColorAt(i, tempColor);
            } else {
                // Stable in order
                if (colors[i * 3] === 1) { // Was white/sparkle originally?
                    meshRef.current.setColorAt(i, new THREE.Color(1, 1, 1));
                } else {
                    meshRef.current.setColorAt(i, paletteStructure);
                }
            }
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                toneMapped={false}
                emissive="#00FF99"
                emissiveIntensity={2}
                roughness={0.1}
            />
        </instancedMesh>
    );
};

export default DataParticles;
