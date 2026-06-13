import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Cpu, Send, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { useSound } from '../context/SoundContext';

// --- THREE.JS INTERACTIVE SYNAPSE NET ---
interface Node {
    pos: THREE.Vector3;
    basePos: THREE.Vector3;
    speed: THREE.Vector3;
    phase: number;
}

const SynapseSwarm: React.FC<{
    nodeCount: number;
    color: string;
    speed: number;
    entropy: number;
    gravity: number;
    commandActive: string | null;
}> = ({ nodeCount, color, speed, entropy, gravity, commandActive }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const lineRef = useRef<THREE.LineSegments>(null);
    const mouse = useRef({ x: 0, y: 0 });

    // Generate stable base nodes
    const nodes = useMemo(() => {
        const temp: Node[] = [];
        for (let i = 0; i < 150; i++) {
            const radius = 2.0 + Math.random() * 4.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const pos = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            temp.push({
                pos: pos.clone(),
                basePos: pos.clone(),
                speed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                phase: Math.random() * Math.PI * 2
            });
        }
        return temp;
    }, []);

    // Track mouse movements in 3D scene
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const activeNodes = nodes.slice(0, nodeCount);

        // Update positions based on sliders and physics
        activeNodes.forEach((node, idx) => {
            const noise = Math.sin(t * speed + node.phase) * entropy * 0.002;
            
            // Core gravity pull towards center
            const direction = new THREE.Vector3(0, 0, 0).sub(node.pos).normalize();
            node.pos.addScaledVector(direction, gravity * 0.005);

            // Dynamic float movement
            node.pos.x += node.speed.x * speed + Math.cos(t + idx) * 0.002 * entropy + noise;
            node.pos.y += node.speed.y * speed + Math.sin(t + idx) * 0.002 * entropy + noise;
            node.pos.z += node.speed.z * speed + Math.cos(t - idx) * 0.002 * entropy + noise;

            // React to special commands
            if (commandActive === 'PULSE') {
                const pulseStrength = Math.sin(t * 10 + idx) * 0.05;
                node.pos.addScaledVector(node.pos.clone().normalize(), pulseStrength);
            } else if (commandActive === 'COLLAPSE') {
                node.pos.lerp(new THREE.Vector3(0, 0, 0), 0.08);
            } else if (commandActive === 'SCATTER') {
                const scatterDir = node.pos.clone().normalize();
                node.pos.addScaledVector(scatterDir, 0.1);
            }

            // Mouse attraction / repulsion
            const m3d = new THREE.Vector3(mouse.current.x * 5, mouse.current.y * 5, 0);
            const distToMouse = node.pos.distanceTo(m3d);
            if (distToMouse < 2.5) {
                const forceDir = node.pos.clone().sub(m3d).normalize();
                node.pos.addScaledVector(forceDir, 0.05 * (2.5 - distToMouse));
            }

            // Boundary containment
            if (node.pos.length() > 8.0) {
                node.pos.setLength(8.0);
                node.speed.multiplyScalar(-1);
            }
        });

        // Update Points Buffer Geometry
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
            activeNodes.forEach((node, i) => {
                positions[i * 3] = node.pos.x;
                positions[i * 3 + 1] = node.pos.y;
                positions[i * 3 + 2] = node.pos.z;
            });
            // Fill remaining array spaces with zero or hide
            for (let i = activeNodes.length; i < 150; i++) {
                positions[i * 3] = 9999;
                positions[i * 3 + 1] = 9999;
                positions[i * 3 + 2] = 9999;
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Build Line segments for connections
        if (lineRef.current) {
            const linePositions = [];
            const maxConnections = 4;
            const maxDist = 2.2;

            for (let i = 0; i < activeNodes.length; i++) {
                let connCount = 0;
                for (let j = i + 1; j < activeNodes.length; j++) {
                    if (connCount >= maxConnections) break;
                    const d = activeNodes[i].pos.distanceTo(activeNodes[j].pos);
                    if (d < maxDist) {
                        linePositions.push(
                            activeNodes[i].pos.x, activeNodes[i].pos.y, activeNodes[i].pos.z,
                            activeNodes[j].pos.x, activeNodes[j].pos.y, activeNodes[j].pos.z
                        );
                        connCount++;
                    }
                }
            }

            const geo = lineRef.current.geometry;
            geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            geo.attributes.position.needsUpdate = true;
        }
    });

    // Color conversion
    const threeColor = useMemo(() => new THREE.Color(color), [color]);

    return (
        <group>
            {/* Swarm Points */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array(150 * 3), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color={threeColor}
                    size={0.15}
                    sizeAttenuation
                    transparent
                    opacity={0.9}
                    depthWrite={false}
                />
            </points>

            {/* Neural Connection Lines */}
            <lineSegments ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    color={threeColor}
                    transparent
                    opacity={0.25}
                    depthWrite={false}
                />
            </lineSegments>

            {/* Glow Core Light */}
            <pointLight distance={10} intensity={2.5} color={color} position={[0, 0, 0]} />
        </group>
    );
};

// --- MAIN SANDBOX COMPONENT ---
const Playground: React.FC = () => {
    const navigate = useNavigate();
    const { playClick, playHover } = useSound();

    // Sandbox Custom Control State
    const [nodesCount, setNodesCount] = useState<number>(85);
    const [networkColor, setNetworkColor] = useState<string>('#00ff99');
    const [synapseSpeed, setSynapseSpeed] = useState<number>(1.2);
    const [entropyLevel, setEntropyLevel] = useState<number>(0.8);
    const [gravityForce, setGravityForce] = useState<number>(0.3);

    // Interactive Terminal State
    const [terminalLogs, setTerminalLogs] = useState<string[]>([
        '[ALMA OS]: Synaptic controller initialized.',
        '[ALMA OS]: Mode: Creative Sandbox ready.'
    ]);
    const [terminalInput, setTerminalInput] = useState<string>('');
    const [activeCommand, setActiveCommand] = useState<string | null>(null);

    const handleCommand = (cmdText: string) => {
        const cleanCmd = cmdText.trim().toUpperCase();
        setTerminalLogs(prev => [`[USER_EXEC]: ${cleanCmd}`, ...prev]);

        if (cleanCmd === 'HELP') {
            setTerminalLogs(prev => [
                '[ALMA OS]: Available commands -> PULSE, COLLAPSE, SCATTER, COLOR <HEX>, NODES <INT>, RESET',
                ...prev
            ]);
        } else if (cleanCmd === 'PULSE') {
            setActiveCommand('PULSE');
            setTerminalLogs(prev => ['[ALMA OS]: Sending high-frequency synapse pulse...', ...prev]);
            setTimeout(() => setActiveCommand(null), 1500);
        } else if (cleanCmd === 'COLLAPSE') {
            setActiveCommand('COLLAPSE');
            setTerminalLogs(prev => ['[ALMA OS]: Simulating gravitational singularity collapse...', ...prev]);
            setTimeout(() => setActiveCommand(null), 1800);
        } else if (cleanCmd === 'SCATTER') {
            setActiveCommand('SCATTER');
            setTerminalLogs(prev => ['[ALMA OS]: Releasing node quantum kinetic scatter...', ...prev]);
            setTimeout(() => setActiveCommand(null), 1500);
        } else if (cleanCmd.startsWith('COLOR ')) {
            const targetColor = cleanCmd.replace('COLOR ', '').toLowerCase();
            setNetworkColor(targetColor);
            setTerminalLogs(prev => [`[ALMA OS]: Synapse network color shifted to ${targetColor}`, ...prev]);
        } else if (cleanCmd.startsWith('NODES ')) {
            const count = parseInt(cleanCmd.replace('NODES ', ''));
            if (!isNaN(count) && count >= 10 && count <= 150) {
                setNodesCount(count);
                setTerminalLogs(prev => [`[ALMA OS]: Synapse nodes set to ${count}`, ...prev]);
            } else {
                setTerminalLogs(prev => ['[ALMA OS]: Error: Node range must be 10 - 150.', ...prev]);
            }
        } else if (cleanCmd === 'RESET') {
            setNodesCount(85);
            setNetworkColor('#00ff99');
            setSynapseSpeed(1.2);
            setEntropyLevel(0.8);
            setGravityForce(0.3);
            setTerminalLogs(prev => ['[ALMA OS]: Resetting synaptic parameters to defaults.', ...prev]);
        } else {
            setTerminalLogs(prev => [`[ALMA OS]: Unknown sequence "${cleanCmd}". Type HELP.`, ...prev]);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!terminalInput.trim()) return;
        playClick();
        handleCommand(terminalInput);
        setTerminalInput('');
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#020306',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
            display: 'flex',
            flexDirection: 'row'
        }}>
            <SEO
                title="A.L.M.A. Synapse Sandbox"
                description="Simulador interactivo del enjambre y sinapsis de A.L.M.A. Ajusta parámetros cuánticos en tiempo real."
            />

            {/* EXIT ARROW */}
            <button
                onClick={() => { playClick(); navigate('/'); }}
                onMouseEnter={playHover}
                style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '30px',
                    padding: '8px 16px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}
            >
                <ArrowLeft size={14} /> VOLVER AL INICIO
            </button>

            {/* THREE.JS INTERACTIVE VIEWPORT */}
            <div style={{ flex: 1, height: '100%', position: 'relative', zIndex: 10 }}>
                <Canvas camera={{ position: [0, 0, 7.5], fov: 60 }}>
                    <ambientLight intensity={0.15} />
                    <SynapseSwarm
                        nodeCount={nodesCount}
                        color={networkColor}
                        speed={synapseSpeed}
                        entropy={entropyLevel}
                        gravity={gravityForce}
                        commandActive={activeCommand}
                    />
                    <OrbitControls
                        enableZoom={true}
                        maxDistance={12}
                        minDistance={4}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.3}
                    />
                </Canvas>

                {/* PROXIMITY MOUSE HINT */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    pointerEvents: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: networkColor, borderRadius: '50%', boxShadow: `0 0 10px ${networkColor}` }} />
                    ACCIÓN: ARRASTRAR PARA ROTAR // ROLAR MOUSE PARA ZOOM
                </div>
            </div>

            {/* GLASSMORPHIC CONTROL PANEL (RIGHT SIDEBAR) */}
            <aside style={{
                width: '420px',
                height: '100%',
                background: 'rgba(5, 7, 14, 0.82)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.5)'
            }}>
                {/* Panel Header */}
                <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <Cpu size={18} color={networkColor} style={{ filter: `drop-shadow(0 0 8px ${networkColor})` }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 800, color: networkColor, letterSpacing: '0.2em' }}>
                            [ ALMA_SANDBOX_V2 ]
                        </span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
                        Synapse Sandbox
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px', lineHeight: '1.4' }}>
                        Interactúa directamente con la arquitectura neuronal cuántica de A.L.M.A. Ajusta los parámetros de energía e inestabilidad a continuación.
                    </p>
                </div>

                {/* Adjustments Controls */}
                <div style={{
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {/* Node count slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            <span>CANTIDAD DE NODOS</span>
                            <span style={{ color: networkColor, fontWeight: 'bold' }}>{nodesCount}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="150"
                            value={nodesCount}
                            onChange={e => { playHover(); setNodesCount(parseInt(e.target.value)); }}
                            style={{
                                width: '100%',
                                accentColor: networkColor,
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.1)',
                                height: '4px',
                                borderRadius: '2px'
                            }}
                        />
                    </div>

                    {/* Speed slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            <span>VELOCIDAD DE SINAPSIS</span>
                            <span style={{ color: networkColor, fontWeight: 'bold' }}>{synapseSpeed}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={synapseSpeed}
                            onChange={e => { playHover(); setSynapseSpeed(parseFloat(e.target.value)); }}
                            style={{
                                width: '100%',
                                accentColor: networkColor,
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.1)',
                                height: '4px',
                                borderRadius: '2px'
                            }}
                        />
                    </div>

                    {/* Entropy slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            <span>ENTROPÍA (INESTABILIDAD)</span>
                            <span style={{ color: networkColor, fontWeight: 'bold' }}>{entropyLevel}</span>
                        </div>
                        <input
                            type="range"
                            min="0.0"
                            max="2.0"
                            step="0.1"
                            value={entropyLevel}
                            onChange={e => { playHover(); setEntropyLevel(parseFloat(e.target.value)); }}
                            style={{
                                width: '100%',
                                accentColor: networkColor,
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.1)',
                                height: '4px',
                                borderRadius: '2px'
                            }}
                        />
                    </div>

                    {/* Gravity slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            <span>GRAVEDAD NUCLEICA</span>
                            <span style={{ color: networkColor, fontWeight: 'bold' }}>{gravityForce}</span>
                        </div>
                        <input
                            type="range"
                            min="0.0"
                            max="1.0"
                            step="0.05"
                            value={gravityForce}
                            onChange={e => { playHover(); setGravityForce(parseFloat(e.target.value)); }}
                            style={{
                                width: '100%',
                                accentColor: networkColor,
                                cursor: 'pointer',
                                background: 'rgba(255,255,255,0.1)',
                                height: '4px',
                                borderRadius: '2px'
                            }}
                        />
                    </div>

                    {/* Color picker presets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                            LONGITUD DE ONDA (COLOR)
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['#00ff99', '#00f3ff', '#ff00aa', '#9d00ff', '#ffffff'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => { playClick(); setNetworkColor(c); }}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: c,
                                        border: networkColor === c ? '2px solid #fff' : 'none',
                                        cursor: 'pointer',
                                        boxShadow: `0 0 10px ${c}`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Embedded Interactive Shell Terminal */}
                <div style={{
                    padding: '24px 30px',
                    background: '#040609',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '8px', color: networkColor }}>
                        <Activity size={14} className="animate-pulse" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                            CANAL DE SINAPSIS ACTIVO
                        </span>
                    </div>

                    {/* Logs Stream */}
                    <div style={{
                        height: '110px',
                        backgroundColor: '#010204',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.7)'
                    }}>
                        {terminalLogs.map((log, idx) => (
                            <span key={idx} style={{ color: log.startsWith('[USER') ? '#00f3ff' : log.includes('Error') ? '#ff3333' : 'rgba(255,255,255,0.6)' }}>
                                {log}
                            </span>
                        ))}
                    </div>

                    {/* Shell Input */}
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={terminalInput}
                            onChange={e => setTerminalInput(e.target.value)}
                            placeholder="Comando (HELP, PULSE, SCATTER, RESET)..."
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                color: '#fff',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.75rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            onMouseEnter={playHover}
                            style={{
                                backgroundColor: networkColor,
                                border: 'none',
                                borderRadius: '6px',
                                width: '36px',
                                height: '34px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            <Send size={14} color="#000" />
                        </button>
                    </form>
                </div>
            </aside>
        </div>
    );
};

export default Playground;
