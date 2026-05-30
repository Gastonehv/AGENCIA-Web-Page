import React, { useState, useEffect, useRef } from 'react';

import SEO from '../components/SEO';
import InteractionGuide from '../components/InteractionGuide';
import { Terminal, Activity, Cpu, ShieldCheck, Zap, RefreshCw, Send } from 'lucide-react';
import { useSound } from '../context/SoundContext';
import LiquidContactCTA from '../components/LiquidContactCTA';
import officialTypography from '../assets/logos/agencia_typography_official.png';

// --- STAGE DATA FOR B2B PREMIUM SOFTWARE ANATOMY ---
const STAGES_INFO = [
    {
        id: '01',
        name: 'PLANIFICACIÓN',
        tag: 'ARQUITECTURA DE INFORMACIÓN',
        title: 'Estructura y Flujo Digital',
        desc: 'Diseñamos la estructura digital de tu plataforma analizando objetivos comerciales específicos. Desarrollamos mapas de navegación y diagramas de flujo optimizados para asegurar una experiencia de usuario fluida, intuitiva y orientada a la conversión.',
        metrics: ['PLANIFICACIÓN: DE NEGOCIO', 'UX: OPTIMIZADA', 'ESTRUCTURA: MÓVIL Y ESCRITORIO'],
        color: '#00FF99',
        align: 'left'
    },
    {
        id: '02',
        name: 'DESARROLLO',
        tag: 'CÓDIGO DE ALTO RENDIMIENTO',
        title: 'Programación y Lógica Modular',
        desc: 'Implementamos las funcionalidades de tu plataforma utilizando tecnologías modernas y estables (como React, TypeScript y Node.js). Escribimos código limpio, modular y con tipado estricto que garantiza un funcionamiento ágil, escalable y fácil de mantener.',
        metrics: ['TECNOLOGÍA: MODERNA', 'CÓDIGO: LIMPIO Y ORDENADO', 'ARQUITECTURA: ESCALABLE'],
        color: '#00F3FF',
        align: 'right'
    },
    {
        id: '03',
        name: 'INFRAESTRUCTURA',
        tag: 'SEGURIDAD DE INFORMACIÓN',
        title: 'Integración y Protección de Datos',
        desc: 'Configuramos conexiones de datos seguras y protocolos de protección de nivel empresarial (AES-256). Aseguramos que la infraestructura resista altos volúmenes de visitas y transacciones simultáneas de forma estable.',
        metrics: ['ESTABILIDAD: GARANTIZADA', 'ENCRIPTACIÓN: AES-256', 'DATOS: PROTEGIDOS'],
        color: '#0066FF',
        align: 'left'
    },
    {
        id: '04',
        name: 'INTERFAZ',
        tag: 'DISEÑO CORPORATIVO',
        title: 'Diseño Visual Premium',
        desc: 'Aplicamos un diseño visual moderno, limpio y profesional. Utilizamos tipografías elegantes, transiciones fluidas y una estructura adaptada a cualquier dispositivo que genera confianza en tus clientes y facilita la navegación.',
        metrics: ['DISEÑO: RESPONSIVO', 'ESTILO: PREMIUM B2B', 'USABILIDAD: DE ALTO NIVEL'],
        color: '#8F00FF',
        align: 'right'
    },
    {
        id: '05',
        name: 'PRODUCTO EN VIVO',
        tag: 'SISTEMA LISTO PARA OPERACIÓN',
        title: 'Plataforma Corporativa Operativa',
        desc: 'La integración total de estructura, código, seguridad y diseño visual. Al completar el recorrido, la plataforma queda 100% operativa. Interactúa con el panel de administración de ejemplo para conocer el alcance del sistema.',
        metrics: ['DESPLIEGUE: LISTO', 'OPERATIVIDAD: INMEDIATA', 'MANTENIMIENTO: INCLUIDO'],
        color: '#FF00AA',
        align: 'center'
    }
];

// --- GENERACIÓN DETERMINISTA DE PARTÍCULAS (FUERA DEL RENDER PARA REACT 19 PURITY) ---
const INITIAL_PARTICLES = [...Array(25)].map((_, i) => ({
    id: i,
    left: `${Math.abs(Math.sin(i * 123.45)) * 100}%`,
    top: `${Math.abs(Math.cos(i * 678.90)) * 100}%`,
    duration: 6 + Math.abs(Math.sin(i * 345.67)) * 10,
    color: i % 2 === 0 ? '#00FF99' : '#00F3FF'
}));

const DUMMY_LOGS = [
    "[ALMA Core]: Swarm orchestration initialized at 4096 nodes.",
    "[Security]: Quantum zero-trust mesh verified (AES-GCM-256).",
    "[Telemetry]: Edge latency stabilized at 3.2ms.",
    "[Memory]: GC swept 1.2GB successfully.",
    "[Network]: BGP anycast route optimized for NA-East."
];

const Arquitectura: React.FC = () => {
    const { playClick, playWhoosh, playHover } = useSound();
    
    // Scroll orchestration state
    const [activeStage, setActiveStage] = useState(0);
    const [isFullyConverged, setIsFullyConverged] = useState(false);
    
    // Live Dashboard Interactive State
    const [activeTab, setActiveTab] = useState<'FINANCIAL' | 'AGENTS' | 'SECURITY'>('FINANCIAL');
    const [chartMultiplier, setChartMultiplier] = useState(1);
    const [agentNodesCount, setAgentNodesCount] = useState(4096);
    const [dashboardLogs, setDashboardLogs] = useState<string[]>([DUMMY_LOGS[0]]);
    const [terminalInput, setTerminalInput] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const fixedViewportRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const animFrameRef = useRef<number>(0);
    
    // Refs for 3D elements
    const sceneRef = useRef<HTMLDivElement>(null);
    const layer1Ref = useRef<HTMLDivElement>(null); // Wireframe
    const layer2Ref = useRef<HTMLDivElement>(null); // Code
    const layer3Ref = useRef<HTMLDivElement>(null); // Data
    const layer4Ref = useRef<HTMLDivElement>(null); // Premium UI / Live Dashboard

    // Simulate real-time logs arriving in background
    useEffect(() => {
        const interval = setInterval(() => {
            if (isFullyConverged) {
                setDashboardLogs(prev => {
                    const nextLog = DUMMY_LOGS[Math.floor((prev.length * 7) % DUMMY_LOGS.length)];
                    return [nextLog, ...prev.slice(0, 5)];
                });
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [isFullyConverged]);

    // 3D Scroll Orchestration Loop
    useEffect(() => {
        const updateAnimation = () => {
            if (!containerRef.current || !sceneRef.current) return;
            
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const totalScrollHeight = containerRef.current.scrollHeight - viewportHeight;
            const rawProgress = Math.max(0, Math.min(1, scrollY / (totalScrollHeight || 1)));
            
            // Smooth interpolation (lerp)
            progressRef.current += (rawProgress - progressRef.current) * 0.1;
            const p = progressRef.current;

            // Calculate active stage for UI
            const newStage = Math.min(4, Math.floor(rawProgress * 5.0));
            if (newStage !== activeStage) {
                setActiveStage(newStage);
                if (Math.abs(newStage - activeStage) === 1) playWhoosh();
            }

            // Convergence check (Phase 5 is reached when progress > 0.85)
            const converged = rawProgress > 0.85;
            if (converged !== isFullyConverged) {
                setIsFullyConverged(converged);
            }

            // --- 3D SCENE ORCHESTRATION ---
            // Base isometric rotation: rotates from isometric to flat frontal (0deg) as p approaches 1.0
            const rotX = 35 - (p * 35); // 35deg -> 0deg
            const rotZ = -25 + (p * 25); // -25deg -> 0deg
            
            // Global scale: Zooms in to full screen view as it converges
            const scale = 0.8 + (p * 0.25);

            sceneRef.current.style.transform = `scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;

            // --- LAYER DEPTH COMPRESSION ---
            // Gap between layers shrinks as p approaches 1.0 (Convergence)
            const maxGap = 350;
            const currentGap = maxGap * (1 - Math.pow(p, 3)); // Stays separated until the end, then snaps tight

            // Enable pointer events on master viewport when converged
            if (fixedViewportRef.current) {
                fixedViewportRef.current.style.pointerEvents = converged ? 'auto' : 'none';
            }

            // Layer positioning & pointer isolation
            if (layer1Ref.current) {
                layer1Ref.current.style.transform = `translateZ(0px)`;
                layer1Ref.current.style.opacity = '1';
                layer1Ref.current.style.pointerEvents = 'none';
            }
            if (layer2Ref.current) {
                layer2Ref.current.style.transform = `translateZ(${currentGap}px)`;
                layer2Ref.current.style.opacity = p > 0.1 ? Math.min(1, (p - 0.1) * 4).toString() : '0';
                layer2Ref.current.style.pointerEvents = 'none';
            }
            if (layer3Ref.current) {
                layer3Ref.current.style.transform = `translateZ(${currentGap * 2}px)`;
                layer3Ref.current.style.opacity = p > 0.3 ? Math.min(1, (p - 0.3) * 4).toString() : '0';
                layer3Ref.current.style.pointerEvents = 'none';
            }
            if (layer4Ref.current) {
                layer4Ref.current.style.transform = `translateZ(${currentGap * 3}px)`;
                layer4Ref.current.style.opacity = p > 0.5 ? Math.min(1, (p - 0.5) * 4).toString() : '0';
                layer4Ref.current.style.pointerEvents = converged ? 'auto' : 'none';
            }

            animFrameRef.current = requestAnimationFrame(updateAnimation);
        };

        animFrameRef.current = requestAnimationFrame(updateAnimation);

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [activeStage, isFullyConverged, playWhoosh]);

    const handleStepClick = (index: number) => {
        playClick();
        const targetScrollY = index * window.innerHeight;
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!terminalInput.trim()) return;
        playClick();
        setDashboardLogs(prev => [`[USER_EXEC]: ${terminalInput}`, ...prev]);
        setTerminalInput('');
    };

    return (
        <div 
            ref={containerRef}
            style={{
                backgroundColor: '#030308',
                color: '#ffffff',
                minHeight: '500vh',
                width: '100%',
                position: 'relative',
                overflowX: 'hidden'
            }}
        >
            <SEO 
                title="Arquitectura de Software y Sistemas a Medida | AgencIA" 
                description="Desarrollo e infraestructura de software robusto para empresas. Diseñamos sistemas escalables, seguros y listos para operar desde el primer día." 
            />

            {/* FIXED 3D VIEWPORT */}
            <div ref={fixedViewportRef} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                perspective: '1600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(12, 18, 36, 1) 0%, rgba(3, 3, 8, 1) 100%)'
            }}>
                
                {/* AMBIENT PARTICLES (CSS) */}
                <div className="particles-container" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.35 }}>
                    {INITIAL_PARTICLES.map((p) => (
                        <div key={p.id} className="particle" style={{
                            position: 'absolute',
                            left: p.left,
                            top: p.top,
                            width: '4px',
                            height: '4px',
                            backgroundColor: p.color,
                            borderRadius: '50%',
                            boxShadow: `0 0 12px ${p.color}`,
                            animation: `float ${p.duration}s infinite ease-in-out alternate`
                        }} />
                    ))}
                </div>

                {/* MASTER 3D SCENE CONTAINER */}
                <div 
                    ref={sceneRef}
                    style={{
                        position: 'relative',
                        width: 'min(92vw, 900px)',
                        minHeight: '480px',
                        maxHeight: '85vh',
                        aspectRatio: '16/10',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.1s linear',
                        willChange: 'transform',
                        pointerEvents: isFullyConverged ? 'auto' : 'none'
                    }}
                >
                    {/* LAYER 1: SINTESIS MATRIX (Z: 0) */}
                    <div ref={layer1Ref} className="scene-layer" style={{
                        position: 'absolute', width: '100%', height: '100%',
                        border: '1px solid rgba(0, 255, 153, 0.4)',
                        backgroundColor: 'rgba(0, 15, 8, 0.25)',
                        boxShadow: '0 0 50px rgba(0, 255, 153, 0.15), inset 0 0 30px rgba(0, 255, 153, 0.2)',
                        backgroundImage: 'linear-gradient(rgba(0, 255, 153, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 153, 0.15) 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                        padding: 'clamp(15px, 3vw, 30px)',
                        boxSizing: 'border-box',
                        display: 'flex', flexDirection: 'column', gap: '15px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#00FF99', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 1.2vw, 12px)' }}>
                            <span>[ ALMA_AUTONOMOUS_SYNTHESIS ]</span>
                            <span className="hide-on-mobile">[ NEURAL_INFERENCE: ACTIVE ]</span>
                        </div>
                        <div style={{ flex: 1, border: '1px dashed rgba(0, 255, 153, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0, 255, 153, 0.6)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1.5vw, 14px)', letterSpacing: '0.1em', textAlign: 'center', padding: '10px' }}>
                            [ GENERATING REAL-TIME CONVERSION PATH ]
                        </div>
                        <div style={{ display: 'flex', gap: '15px', height: '25%' }}>
                            <div style={{ flex: 1, border: '1px dashed rgba(0, 255, 153, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0, 255, 153, 0.6)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 1vw, 10px)' }}>[ CLUSTER_01 ]</div>
                            <div style={{ flex: 3, border: '1px dashed rgba(0, 255, 153, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0, 255, 153, 0.6)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(8px, 1vw, 10px)' }}>[ SYNTHETIC_VIEWPORT_RENDERER ]</div>
                        </div>
                    </div>

                    {/* LAYER 2: CODE ENGINE (Z: +GAP) */}
                    <div ref={layer2Ref} className="scene-layer" style={{
                        position: 'absolute', width: '100%', height: '100%',
                        border: '1px solid rgba(0, 243, 255, 0.5)',
                        backgroundColor: 'rgba(5, 10, 22, 0.88)',
                        backdropFilter: 'blur(8px)',
                        padding: 'clamp(15px, 3vw, 30px)',
                        boxSizing: 'border-box',
                        fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1.2vw, 13px)', lineHeight: '1.6',
                        color: '#E2E8F0',
                        overflowX: 'auto',
                        boxShadow: '0 0 50px rgba(0, 243, 255, 0.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,243,255,0.3)', paddingBottom: '10px', marginBottom: '15px' }}>
                            <span style={{ color: '#00F3FF', fontWeight: 'bold' }}>IDE // ALMACore_Controller.tsx</span>
                            <span className="hide-on-mobile" style={{ color: '#8F00FF', fontSize: '10px' }}>TypeScript 5.8 // Strict</span>
                        </div>
                        <span style={{ color: '#FF00AA' }}>import</span> {'{ ALMASwarm, ZeroTrustMesh, PremiumUI }'} <span style={{ color: '#FF00AA' }}>from</span> <span style={{ color: '#00FF99' }}>'@agencia/architect'</span>;<br/><br/>
                        <span style={{ color: '#FF00AA' }}>const</span> <span style={{ color: '#00F3FF' }}>orchestrator</span> = <span style={{ color: '#FF00AA' }}>new</span> ALMASwarm({'{'}<br/>
                        &nbsp;&nbsp;clusterNodes: <span style={{ color: '#8F00FF' }}>{agentNodesCount}</span>,<br/>
                        &nbsp;&nbsp;autoScale: <span style={{ color: '#8F00FF' }}>true</span>,<br/>
                        &nbsp;&nbsp;encryption: <span style={{ color: '#00FF99' }}>'AES-GCM-256'</span><br/>
                        {'}'});<br/><br/>
                        <span style={{ color: '#FF00AA' }}>export</span> <span style={{ color: '#FF00AA' }}>default</span> <span style={{ color: '#FF00AA' }}>function</span> <span style={{ color: '#00F3FF' }}>EnterpriseDashboard</span>() {'{'}<br/>
                        &nbsp;&nbsp;<span style={{ color: '#FF00AA' }}>return</span> (<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: '#00F3FF' }}>ZeroTrustMesh</span> provider={'{orchestrator}'}&gt;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style={{ color: '#00F3FF' }}>PremiumUI</span> fps={'{120}'} glowColor=<span style={{ color: '#00FF99' }}>"#00FF99"</span> /&gt;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span style={{ color: '#00F3FF' }}>ZeroTrustMesh</span>&gt;<br/>
                        &nbsp;&nbsp;);<br/>
                        {'}'}
                    </div>

                    {/* LAYER 3: DATA FLOW & TELEMETRY (Z: +GAP*2) */}
                    <div ref={layer3Ref} className="scene-layer" style={{
                        position: 'absolute', width: '100%', height: '100%',
                        border: '1px solid rgba(0, 102, 255, 0.6)',
                        backgroundColor: 'rgba(2, 6, 18, 0.8)',
                        backdropFilter: 'blur(12px)',
                        padding: 'clamp(15px, 3vw, 30px)',
                        boxSizing: 'border-box',
                        display: 'flex', flexDirection: 'column', gap: '15px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#0066FF', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 1.2vw, 12px)' }}>
                            <span>[ LIVE_TELEMETRY_PIPELINE ]</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00FF99' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: '#00FF99', borderRadius: '50%', boxShadow: '0 0 10px #00FF99' }} />
                                EDGE: ONLINE
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', flex: 1 }}>
                            <div style={{ flex: '1 1 120px', backgroundColor: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.3)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span style={{ color: '#A0AEC0', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>THROUGHPUT</span>
                                <span style={{ color: '#00F3FF', fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>12.4 GB/s</span>
                            </div>
                            <div style={{ flex: '1 1 120px', backgroundColor: 'rgba(143,0,255,0.1)', border: '1px solid rgba(143,0,255,0.3)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span style={{ color: '#A0AEC0', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>EDGE LATENCY</span>
                                <span style={{ color: '#FF00AA', fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>1.8 ms</span>
                            </div>
                            <div style={{ flex: '1 1 120px', backgroundColor: 'rgba(0,255,153,0.1)', border: '1px solid rgba(0,255,153,0.3)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <span style={{ color: '#A0AEC0', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>ZERO-TRUST</span>
                                <span style={{ color: '#00FF99', fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>SECURE</span>
                            </div>
                        </div>
                        <div style={{ border: '1px solid #0066FF', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0066FF', fontFamily: 'var(--font-mono)', fontSize: 'clamp(9px, 1.2vw, 12px)', background: 'rgba(0,102,255,0.05)' }}>
                            <span>ENCRYPTION: AES-GCM-256</span>
                            <ShieldCheck size={18} color="#00FF99" />
                        </div>
                    </div>

                    {/* LAYER 4: PREMIUM UI // LIVE INTERACTIVE COMMAND DASHBOARD (Z: +GAP*3) */}
                    <div ref={layer4Ref} className="scene-layer" style={{
                        position: 'absolute', width: '100%', height: '100%',
                        border: '1px solid rgba(0, 255, 153, 0.6)',
                        backgroundColor: 'rgba(10, 16, 28, 0.85)',
                        backdropFilter: 'blur(24px)',
                        borderRadius: '24px',
                        padding: 'clamp(15px, 3vw, 30px)',
                        boxSizing: 'border-box',
                        boxShadow: isFullyConverged ? '0 40px 100px rgba(0,255,153,0.3), inset 0 0 40px rgba(0,255,153,0.2)' : '0 30px 70px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column', gap: '15px',
                        transition: 'all 0.5s ease',
                        overflowY: 'auto'
                    }}>
                        {/* Dashboard Top Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: isFullyConverged ? '#00FF99' : '#00F3FF', boxShadow: isFullyConverged ? '0 0 20px #00FF99' : 'none', animation: 'pulse 2s infinite' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <img 
                                        src={officialTypography} 
                                        alt="AgencIA" 
                                        style={{ height: 'clamp(1rem, 2.5vw, 1.3rem)', width: 'auto', objectFit: 'contain' }} 
                                    />
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', fontWeight: 900, letterSpacing: '0.05em', color: '#fff' }}>
                                        // EXECUTIVE SUITE
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.65rem, 1vw, 0.75rem)', padding: '4px 10px', borderRadius: '50px', backgroundColor: isFullyConverged ? 'rgba(0,255,153,0.15)' : 'rgba(255,255,255,0.1)', border: `1px solid ${isFullyConverged ? '#00FF99' : 'rgba(255,255,255,0.2)'}`, color: isFullyConverged ? '#00FF99' : '#fff' }}>
                                    {isFullyConverged ? '● SISTEMA VIVO' : 'ENSAMBLANDO...'}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Navigation Tabs */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            <button
                                onClick={() => { playClick(); setActiveTab('FINANCIAL'); }}
                                onMouseEnter={playHover}
                                style={{
                                    flex: '1 1 140px', padding: '10px', borderRadius: '10px',
                                    backgroundColor: activeTab === 'FINANCIAL' ? '#00FF99' : 'rgba(255,255,255,0.05)',
                                    color: activeTab === 'FINANCIAL' ? '#000' : '#fff',
                                    border: `1px solid ${activeTab === 'FINANCIAL' ? '#00FF99' : 'rgba(255,255,255,0.1)'}`,
                                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === 'FINANCIAL' ? '0 0 25px rgba(0,255,153,0.5)' : 'none'
                                }}
                            >
                                <Activity size={16} /> METRICAS & CONVERSIÓN
                            </button>
                            <button
                                onClick={() => { playClick(); setActiveTab('AGENTS'); }}
                                onMouseEnter={playHover}
                                style={{
                                    flex: '1 1 140px', padding: '10px', borderRadius: '10px',
                                    backgroundColor: activeTab === 'AGENTS' ? '#00F3FF' : 'rgba(255,255,255,0.05)',
                                    color: activeTab === 'AGENTS' ? '#000' : '#fff',
                                    border: `1px solid ${activeTab === 'AGENTS' ? '#00F3FF' : 'rgba(255,255,255,0.1)'}`,
                                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === 'AGENTS' ? '0 0 25px rgba(0,243,255,0.5)' : 'none'
                                }}
                            >
                                <Cpu size={16} /> ENJAMBRE ALMA
                            </button>
                            <button
                                onClick={() => { playClick(); setActiveTab('SECURITY'); }}
                                onMouseEnter={playHover}
                                style={{
                                    flex: '1 1 140px', padding: '10px', borderRadius: '10px',
                                    backgroundColor: activeTab === 'SECURITY' ? '#FF00AA' : 'rgba(255,255,255,0.05)',
                                    color: activeTab === 'SECURITY' ? '#000' : '#fff',
                                    border: `1px solid ${activeTab === 'SECURITY' ? '#FF00AA' : 'rgba(255,255,255,0.1)'}`,
                                    fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: activeTab === 'SECURITY' ? '0 0 25px rgba(255,0,170,0.5)' : 'none'
                                }}
                            >
                                <ShieldCheck size={16} /> AUDITORÍA ZERO-TRUST
                            </button>
                        </div>

                        {/* Interactive Tab Content Viewport */}
                        <div style={{ flex: 1, minHeight: '200px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: 'clamp(15px, 2vw, 25px)', display: 'flex', flexDirection: 'column', gap: '15px', overflow: 'hidden' }}>
                            {activeTab === 'FINANCIAL' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <span style={{ color: '#E2E8F0', fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 'bold' }}>Conversión B2B Proyectada</span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => { playClick(); setChartMultiplier(1); }} onMouseEnter={playHover} style={{ background: chartMultiplier === 1 ? '#00FF99' : 'transparent', color: chartMultiplier === 1 ? '#000' : '#fff', border: '1px solid #00FF99', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', cursor: 'pointer' }}>1X</button>
                                            <button onClick={() => { playClick(); setChartMultiplier(5); }} onMouseEnter={playHover} style={{ background: chartMultiplier === 5 ? '#00F3FF' : 'transparent', color: chartMultiplier === 5 ? '#000' : '#fff', border: '1px solid #00F3FF', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', cursor: 'pointer' }}>5X</button>
                                            <button onClick={() => { playClick(); setChartMultiplier(10); }} onMouseEnter={playHover} style={{ background: chartMultiplier === 10 ? '#FF00AA' : 'transparent', color: chartMultiplier === 10 ? '#000' : '#fff', border: '1px solid #FF00AA', padding: '4px 10px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', cursor: 'pointer' }}>10X</button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(10px, 2vw, 25px)', flex: 1, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                        {[40, 65, 85, 110, 145, 195].map((val, idx) => {
                                            const heightPercent = Math.min(100, (val * chartMultiplier) / 2.2);
                                            return (
                                                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%' }}>
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '3px' }}>
                                                        <div style={{
                                                            width: '100%',
                                                            height: `${heightPercent}%`,
                                                            background: chartMultiplier === 10 ? 'linear-gradient(180deg, #FF00AA, #8F00FF)' : chartMultiplier === 5 ? 'linear-gradient(180deg, #00F3FF, #0066FF)' : 'linear-gradient(180deg, #00FF99, #00F3FF)',
                                                            borderRadius: '4px',
                                                            transition: 'height 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                                            boxShadow: `0 0 15px ${chartMultiplier === 10 ? '#FF00AA' : '#00FF99'}`
                                                        }} />
                                                    </div>
                                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#A0AEC0' }}>Q{idx + 1}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'AGENTS' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', overflowY: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <span style={{ color: '#E2E8F0', fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 'bold' }}>Topología del Enjambre IA</span>
                                        <button onClick={() => { playWhoosh(); setAgentNodesCount(prev => prev === 4096 ? 16384 : 4096); }} onMouseEnter={playHover} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,243,255,0.15)', color: '#00F3FF', border: '1px solid #00F3FF', padding: '4px 12px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer' }}>
                                            <RefreshCw size={12} /> Rebalancear Nodos
                                        </button>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', flex: 1 }}>
                                        {['Ingestión Web', 'Inferencia Lógica', 'Auto-Sanación', 'Despliegue Continuo'].map((nodeName, nidx) => (
                                            <div key={nidx} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,243,255,0.3)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <Zap size={14} color="#00F3FF" />
                                                    <span style={{ color: '#00FF99', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>[ACTIVO]</span>
                                                </div>
                                                <span style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 'bold', fontSize: '0.85rem' }}>{nodeName}</span>
                                                <span style={{ color: '#A0AEC0', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginTop: '4px' }}>{agentNodesCount / 4} Nodos</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'SECURITY' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', fontFamily: 'var(--font-mono)' }}>
                                    <span style={{ color: '#E2E8F0', fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', fontWeight: 'bold' }}>Terminal de Auditoría en Tiempo Real</span>
                                    <div style={{ flex: 1, minHeight: '100px', backgroundColor: '#020408', borderRadius: '8px', border: '1px solid rgba(255,0,170,0.3)', padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                                        {dashboardLogs.map((log, lidx) => (
                                            <span key={lidx} style={{ color: log.startsWith('[USER_') ? '#00FF99' : '#00F3FF' }}>
                                                <span style={{ color: '#A0AEC0' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                                            </span>
                                        ))}
                                    </div>
                                    <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={terminalInput}
                                            onChange={(e) => setTerminalInput(e.target.value)}
                                            placeholder="Ingresa comando (/audit, /scale)..."
                                            style={{ flex: 1, padding: '10px 14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', outline: 'none' }}
                                        />
                                        <button type="submit" onMouseEnter={playHover} style={{ padding: '0 16px', backgroundColor: '#FF00AA', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                            <Send size={14} /> Ejecutar
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* B2B Call to Action at Bottom of Dashboard */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>¿Listo para construir tu plataforma corporativa?</span>
                                <span style={{ color: '#A0AEC0', fontFamily: 'var(--font-body)', fontSize: 'clamp(0.75rem, 1vw, 0.85rem)' }}>Despliegue inmediato con arquitectura garantizada.</span>
                            </div>
                            <div onClick={playClick} onMouseEnter={playHover} style={{ cursor: 'pointer' }}>
                                <LiquidContactCTA text="INICIAR MI PROYECTO" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* PERSISTENT B2B CYBER HUD HEADER */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                padding: 'clamp(1rem, 2vw, 2rem) 4vw',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                zIndex: 30,
                pointerEvents: 'none',
                fontFamily: 'var(--font-mono)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: STAGES_INFO[activeStage].color, borderRadius: '50%', boxShadow: `0 0 15px ${STAGES_INFO[activeStage].color}`, animation: 'pulse 2s infinite' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <img 
                            src={officialTypography} 
                            alt="AgencIA" 
                            style={{ height: 'clamp(0.7rem, 1.5vw, 0.95rem)', width: 'auto', objectFit: 'contain' }} 
                        />
                        <span style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.8rem)', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            _DEV // ARCHITECTURE_V9_FLUID
                        </span>
                    </div>
                </div>
                <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)', letterSpacing: '0.15em', color: STAGES_INFO[activeStage].color, borderBottom: `1px solid ${STAGES_INFO[activeStage].color}`, paddingBottom: '4px', textShadow: `0 0 10px ${STAGES_INFO[activeStage].color}` }}>
                    [ ORGANIC_BUILD_SEQUENCE ]
                </div>
            </div>

            {/* PERSISTENT SIDE STEP NAVIGATION */}
            <div style={{
                position: 'fixed',
                right: '3vw',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                zIndex: 30,
                pointerEvents: 'auto',
                alignItems: 'flex-end',
                fontFamily: 'var(--font-mono)'
            }}>
                {STAGES_INFO.map((st, i) => (
                    <div
                        key={st.id}
                        onClick={() => handleStepClick(i)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            opacity: activeStage === i ? 1 : 0.4,
                            transition: 'all 0.3s ease',
                            padding: '0.5rem'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={(e) => { if (activeStage !== i) e.currentTarget.style.opacity = '0.4'; }}
                    >
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', color: activeStage === i ? st.color : '#fff', display: activeStage === i ? 'block' : 'none', textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                            {st.name}
                        </span>
                        <div style={{
                            width: activeStage === i ? '28px' : '10px',
                            height: '10px',
                            backgroundColor: activeStage === i ? st.color : '#fff',
                            borderRadius: '5px',
                            boxShadow: activeStage === i ? `0 0 20px ${st.color}` : 'none',
                            transition: 'all 0.3s ease'
                        }} />
                    </div>
                ))}
            </div>

            {/* SCROLLABLE HTML SECTIONS (100vh each) FOR CARDS NARRATIVE */}
            <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
                {STAGES_INFO.map((stage, i) => {
                    const isActive = activeStage === i && !isFullyConverged;
                    return (
                        <section
                            key={stage.id}
                            style={{
                                height: '100vh',
                                width: '100vw',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: stage.align === 'left' ? 'flex-start' : stage.align === 'right' ? 'flex-end' : 'center',
                                paddingLeft: stage.align === 'left' ? '5vw' : '0',
                                paddingRight: stage.align === 'right' ? '5vw' : '0',
                                boxSizing: 'border-box',
                                pointerEvents: 'none'
                            }}
                        >
                            <div
                                style={{
                                    width: 'min(90vw, 500px)',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    pointerEvents: isActive ? 'auto' : 'none',
                                    backgroundColor: 'rgba(3, 5, 10, 0.75)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: `1px solid ${stage.color}`,
                                    borderRadius: '16px',
                                    padding: 'clamp(1.5rem, 4vh, 2.5rem)',
                                    boxShadow: `0 30px 70px rgba(0,0,0,0.85), inset 0 0 30px rgba(${i === 0 ? '0,255,153' : i === 1 ? '0,243,255' : i === 2 ? '0,102,255' : i === 3 ? '143,0,255' : '255,0,170'}, 0.2)`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                    opacity: isActive ? 1 : 0,
                                    transform: isActive ? 'translateY(0) scale(1)' : `translateY(${i < activeStage ? '-40px' : '40px'}) scale(0.95)`
                                }}
                            >
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    padding: '0.35rem 1rem',
                                    backgroundColor: `rgba(${i === 0 ? '0,255,153' : i === 1 ? '0,243,255' : i === 2 ? '0,102,255' : i === 3 ? '143,0,255' : '255,0,170'}, 0.15)`,
                                    border: `1px solid ${stage.color}`,
                                    borderRadius: '50px',
                                    color: stage.color,
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    marginBottom: '1.2rem',
                                    textTransform: 'uppercase'
                                }}>
                                    <Terminal size={14} />
                                    {`[ ${stage.id} // ${stage.tag} ]`}
                                </div>

                                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#ffffff', marginBottom: '1.2rem', textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
                                    {stage.title}
                                </h1>

                                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 1.6vh, 1.05rem)', lineHeight: 1.6, color: '#E2E8F0', marginBottom: '1.8rem', textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}>
                                    {stage.desc}
                                </p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                    {stage.metrics.map((m, midx) => (
                                        <span key={midx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${stage.color}`, padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '6px', height: '6px', backgroundColor: stage.color, borderRadius: '50%', boxShadow: `0 0 10px ${stage.color}` }} />
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* GUÍA DE INTERACCIÓN PRINCIPAL */}
            <InteractionGuide
                items={[
                    { type: 'scroll', text: 'DESLIZAR PARA ENSAMBLAR' }
                ]}
                style={{ zIndex: 9999, bottom: '3rem' }}
            />

            <style>{`
                .scene-layer {
                    transform-style: preserve-3d;
                    will-change: transform, opacity;
                    backface-visibility: hidden;
                }
                @media (max-width: 768px) {
                    .hide-on-mobile {
                        display: none !important;
                    }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(12px); }
                }
                @keyframes float {
                    0% { transform: translateY(0px) translateX(0px); }
                    100% { transform: translateY(-80px) translateX(40px); }
                }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Arquitectura;
