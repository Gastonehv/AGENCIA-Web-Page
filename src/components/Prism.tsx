import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';
import gsap from 'gsap';
import './Prism.css';

const Prism = forwardRef(({
    height = 3.5,
    baseWidth = 5.5,
    animationType = 'rotate',
    glow = 1,
    offset = { x: 0, y: 0 },
    noise = 0.5,
    transparent = true,
    scale = 3.6,
    hueShift = 0,
    colorFrequency = 1,
    hoverStrength = 2,
    inertia = 0.1,
    bloom = 1,
    suspendWhenOffscreen = false,
    timeScale = 0.5,
    shape = 0
}: any, ref: any) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const programRef = useRef<any>(null);
    const transitionRef = useRef<any>(null);

    // Initial Setup Effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const H = Math.max(0.001, height);
        const BW = Math.max(0.001, baseWidth);
        const BASE_HALF = BW * 0.5;
        const GLOW = Math.max(0.0, glow);
        const NOISE = Math.max(0.0, noise);
        const offX = offset?.x ?? 0;
        const offY = offset?.y ?? 0;
        const SAT = transparent ? 1.5 : 1;
        const SCALE = Math.max(0.001, scale);
        const HUE = hueShift || 0;
        const CFREQ = Math.max(0.0, colorFrequency || 1);
        const BLOOM = Math.max(0.0, bloom || 1);
        const TS = Math.max(0, timeScale || 1);
        const HOVSTR = Math.max(0, hoverStrength || 1);
        const INERT = Math.max(0, Math.min(1, inertia || 0.12));

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const renderer = new Renderer({ dpr, alpha: transparent, antialias: false });
        const gl = renderer.gl;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        Object.assign(gl.canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
        container.appendChild(gl.canvas);

        const vertex = /* glsl */ `
            attribute vec2 position;
            void main() { gl_Position = vec4(position, 0.0, 1.0); }
        `;

        const fragment = /* glsl */ `
            precision highp float;
            uniform vec2  iResolution;
            uniform float iTime;
            uniform float uHeight;
            uniform float uBaseHalf;
            uniform mat3  uRot;
            uniform int   uUseBaseWobble;
            uniform float uGlow;
            uniform vec2  uOffsetPx;
            uniform float uNoise;
            uniform float uSaturation;
            uniform float uScale;
            uniform float uHueShift;
            uniform float uColorFreq;
            uniform float uBloom;
            uniform float uCenterShift;
            uniform float uInvBaseHalf;
            uniform float uInvHeight;
            uniform float uMinAxis;
            uniform float uPxScale;
            uniform float uTimeScale;
            
            uniform int   uShapeA;
            uniform int   uShapeB;
            uniform float uTransition;
            uniform float uEnergy;

            vec4 tanh4(vec4 x){
                vec4 e2x = exp(2.0*x);
                return (e2x - 1.0) / (e2x + 1.0);
            }

            float rand(vec2 co){
                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
            }

            float sdOctaAnisoInv(vec3 p){
                vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
                float m = q.x + q.y + q.z - 1.0;
                return m * uMinAxis * 0.5773502691896258;
            }

            float sdPyramidUpInv(vec3 p){
                float oct = sdOctaAnisoInv(p);
                float halfSpace = -p.y;
                return max(oct, halfSpace);
            }

            float sdSphere(vec3 p, float r) {
                return length(p) - r;
            }

            float sdBox(vec3 p, vec3 b) {
                vec3 q = abs(p) - b;
                return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
            }

            float sdTorus(vec3 p, vec2 t) {
                vec2 q = vec2(length(p.xz)-t.x,p.y);
                return length(q)-t.y;
            }

            float getShapeD(vec3 p, int shapeId) {
                if (shapeId == 1) return sdSphere(p, uHeight * 0.4);
                if (shapeId == 2) return sdBox(p, vec3(uBaseHalf * 0.8, uHeight * 0.4, uBaseHalf * 0.8));
                if (shapeId == 3) return sdTorus(p, vec2(uBaseHalf * 0.6, uHeight * 0.2));
                return sdPyramidUpInv(p);
            }

            mat3 hueRotation(float a){
                float c = cos(a), s = sin(a);
                mat3 W = mat3(0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114);
                mat3 U = mat3(0.701, -0.587, -0.114, -0.299,  0.413, -0.114, -0.300, -0.588,  0.886);
                mat3 V = mat3(0.168, -0.331,  0.500, 0.328,  0.035, -0.500, -0.497,  0.296,  0.201);
                return W + U * c + V * s;
            }

            void main(){
                vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;
                float z = 5.0;
                float d = 0.0;
                vec3 p;
                vec4 o = vec4(0.0);
                float centerShift = uCenterShift;
                float cf = uColorFreq;
                mat2 wob = mat2(1.0);
                if (uUseBaseWobble == 1) {
                    float t = iTime * uTimeScale;
                    wob = mat2(cos(t), cos(t + 33.0), cos(t + 11.0), cos(t));
                }
                const int STEPS = 64;
                for (int i = 0; i < STEPS; i++) {
                    p = vec3(f, z);
                    p.xz = p.xz * wob;
                    p = uRot * p;
                    vec3 q = p;
                    q.y += centerShift;
                    
                    // --- SPECTACULAR MORPHOLOGICAL CHANGE ---
                    vec3 qTwist = q;
                    // Torsión dinámica más lenta y fluida
                    float twist = uEnergy * 1.8 * sin(q.y * 2.5 + iTime * 1.2);
                    float cT = cos(twist);
                    float sT = sin(twist);
                    qTwist.xz = qTwist.xz * mat2(cT, -sT, sT, cT);
                    
                    float dA = getShapeD(qTwist, uShapeA);
                    float dB = getShapeD(qTwist, uShapeB);
                    
                    // Plasma orgánico más denso y lento (estilo lava)
                    float morphDisplacement = sin(qTwist.x * 12.0 + iTime * 1.5) * sin(qTwist.y * 12.0 - iTime * 1.2) * sin(qTwist.z * 12.0) * uEnergy * 0.15;
                    
                    float dFinal = mix(dA, dB, uTransition) + morphDisplacement;
                    // ----------------------------------------
                    
                    d = 0.05 + 0.3 * abs(dFinal); 
                    z -= d;
                    o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) * (0.01 / d);
                    if (d < 0.001) break; // EARLY EXIT FOR PERFORMANCE
                }
                
                float energyGlow = 1.0 + uEnergy * 2.0;
                o = o * (uGlow * uBloom * energyGlow) / 8.0;
                o = pow(o, vec4(1.2)); 
                o = clamp(o, 0.0, 1.0);

                vec3 col = o.rgb;
                float n = rand(gl_FragCoord.xy + vec2(iTime));
                col += (n - 0.5) * (uNoise * 0.2); 
                col = clamp(col, 0.0, 1.0);
                float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
                col = clamp(mix(vec3(L), col, uSaturation * 0.8), 0.0, 1.0);
                if(abs(uHueShift) > 0.0001) col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
                gl_FragColor = vec4(col, 1.0);
            }
        `;

        const geometry = new Triangle(gl);
        const iResBuf = new Float32Array(2);
        const offsetPxBuf = new Float32Array(2);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                iResolution: { value: iResBuf },
                iTime: { value: 0 },
                uHeight: { value: H },
                uBaseHalf: { value: BASE_HALF },
                uUseBaseWobble: { value: 1 },
                uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
                uGlow: { value: GLOW },
                uOffsetPx: { value: offsetPxBuf },
                uNoise: { value: NOISE },
                uSaturation: { value: SAT },
                uScale: { value: SCALE },
                uHueShift: { value: HUE },
                uColorFreq: { value: CFREQ },
                uBloom: { value: BLOOM },
                uCenterShift: { value: H * 0.25 },
                uInvBaseHalf: { value: 1 / BASE_HALF },
                uInvHeight: { value: 1 / H },
                uMinAxis: { value: Math.min(BASE_HALF, H) },
                uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
                uTimeScale: { value: TS },
                uShapeA: { value: shape },
                uShapeB: { value: shape },
                uTransition: { value: 0 },
                uEnergy: { value: 0 }
            }
        });
        
        programRef.current = program;
        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
            const w = container.clientWidth || 1;
            const h = container.clientHeight || 1;
            renderer.setSize(w, h);
            iResBuf[0] = gl.drawingBufferWidth;
            iResBuf[1] = gl.drawingBufferHeight;
            offsetPxBuf[0] = offX * dpr;
            offsetPxBuf[1] = offY * dpr;
            program.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        const rotBuf = new Float32Array(9);
        const setMat3FromEuler = (yawY: number, pitchX: number, rollZ: number, out: Float32Array) => {
            const cy = Math.cos(yawY), sy = Math.sin(yawY);
            const cx = Math.cos(pitchX), sx = Math.sin(pitchX);
            const cz = Math.cos(rollZ), sz = Math.sin(rollZ);
            out[0] = cy * cz + sy * sx * sz; out[1] = cx * sz; out[2] = -sy * cz + cy * sx * sz;
            out[3] = -cy * sz + sy * sx * cz; out[4] = cx * cz; out[5] = sy * sz + cy * sx * cz;
            out[6] = sy * cx; out[7] = -sx; out[8] = cy * cx;
            return out;
        };

        const rnd = () => Math.random();
        const wX = (0.3 + rnd() * 0.6);
        const wY = (0.2 + rnd() * 0.7);
        const wZ = (0.1 + rnd() * 0.5);
        const phX = rnd() * Math.PI * 2;
        const phZ = rnd() * Math.PI * 2;

        let yaw = 0, pitch = 0, roll = 0;
        let targetYaw = 0, targetPitch = 0;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const pointer = { x: 0, y: 0, inside: true };

        const onMove = (e: MouseEvent) => {
            const cx = window.innerWidth * 0.5;
            const cy = window.innerHeight * 0.5;
            pointer.x = (e.clientX - cx) / (window.innerWidth * 0.5);
            pointer.y = (e.clientY - cy) / (window.innerHeight * 0.5);
            pointer.inside = true;
        };
        
        const onOrientation = (e: DeviceOrientationEvent) => {
            const nx = (e.gamma || 0) / 45; 
            const ny = ((e.beta || 60) - 60) / 45;
            pointer.x = Math.max(-1, Math.min(1, nx));
            pointer.y = Math.max(-1, Math.min(1, ny));
            pointer.inside = true;
        };
        
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', () => pointer.inside = false);
        window.addEventListener('deviceorientation', onOrientation);

        let raf = 0;
        const t0 = performance.now();
        const render = (t: number) => {
            const time = (t - t0) * 0.001;
            program.uniforms.iTime.value = time;
            const tScaled = time * (program.uniforms.uTimeScale.value || TS);

            const driftYaw = tScaled * wY;
            const driftPitch = Math.sin(tScaled * wX + phX) * 0.5;
            const driftRoll = Math.cos(tScaled * wZ + phZ) * 0.4;

            targetYaw = (pointer.inside ? -pointer.x : 0) * (0.6 * HOVSTR);
            targetPitch = (pointer.inside ? pointer.y : 0) * (0.6 * HOVSTR);

            yaw = lerp(yaw, driftYaw + targetYaw, INERT);
            pitch = lerp(pitch, driftPitch + targetPitch, INERT);
            roll = lerp(roll, driftRoll, INERT);

            program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);
            renderer.render({ scene: mesh });
            raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('deviceorientation', onOrientation);
            if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
        };
    }, [height, baseWidth, animationType, glow, noise, offset.x, offset.y, scale, transparent, hueShift, colorFrequency, timeScale, hoverStrength, inertia, bloom, suspendWhenOffscreen]);

    useImperativeHandle(ref, () => ({
        setMorph: (shapeA: number, shapeB: number, transition: number, energy: number) => {
            if (programRef.current) {
                programRef.current.uniforms.uShapeA.value = shapeA;
                programRef.current.uniforms.uShapeB.value = shapeB;
                programRef.current.uniforms.uTransition.value = transition;
                programRef.current.uniforms.uEnergy.value = energy;
                programRef.current.uniforms.uTimeScale.value = timeScale * (1.0 + energy * 2.0);
            }
        }
    }));

    // Morph Transition Effect (Optimized Performance)
    useEffect(() => {
        if (!programRef.current) return;
        
        const prog = programRef.current;
        const prevShape = prog.uniforms.uShapeB.value;
        if (prevShape === shape) return;

        prog.uniforms.uShapeA.value = prevShape;
        prog.uniforms.uShapeB.value = shape;
        prog.uniforms.uTransition.value = 0;

        if (transitionRef.current) transitionRef.current.kill();
        
        const tl = gsap.timeline();
        transitionRef.current = tl;

        // FAST & FLUID SEQUENCE
        tl.to(prog.uniforms.uEnergy, { value: 1, duration: 0.3, ease: "power2.out" });
        tl.to(prog.uniforms.uTimeScale, { value: timeScale * 3.0, duration: 0.4, ease: "power2.inOut" }, 0);
        
        tl.to(prog.uniforms.uTransition, { value: 1, duration: 0.6, ease: "power2.inOut" }, 0.1);

        tl.to(prog.uniforms.uEnergy, { value: 0, duration: 0.6, ease: "power2.inOut" }, 0.4);
        tl.to(prog.uniforms.uTimeScale, { value: timeScale, duration: 0.6, ease: "power2.inOut" }, 0.5);

    }, [shape, timeScale]);

    return <div className="prism-container" ref={containerRef} />;
});

export default Prism;
