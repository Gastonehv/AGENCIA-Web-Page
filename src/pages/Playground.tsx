import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import SEO from '../components/SEO';
import { 
    Activity, 
    ShieldCheck, 
    RefreshCw, 
    Search, 
    Check,
    Sparkles,
    UserCheck,
    ArrowLeft,
    TrendingUp,
    DollarSign,
    CreditCard,
    Cpu,
    Layers,
    Edit3,
    CheckSquare,
    ExternalLink,
    Mail
} from 'lucide-react';
import { useSound } from '../context/SoundContext';

const FONT_BODY = "var(--font-body)";
const FONT_HEADING = "var(--font-heading)";

// 3D Agent coordinates in space for standard layout
const POS_ALMA: [number, number, number] = [0, 2.2, 0];
const POS_INVESTIGADOR: [number, number, number] = [-3.2, 0.4, 0];
const POS_ANALISTA: [number, number, number] = [3.2, 0.4, 0];
const POS_VALIDADOR: [number, number, number] = [-1.7, -1.8, 0];
const POS_EJECUTOR: [number, number, number] = [1.7, -1.8, 0];


// --- NESTED 3D GLASSMORPHIC AGENT CARD COMPONENT ---
interface AgentCard3DProps {
    position: [number, number, number];
    title: string;
    role: string;
    thought: string;
    active: boolean;
    color: string;
    load: number;
    icon: React.ReactNode;
    visible: boolean;
    statusText?: string;
    narrativeTitle?: string;
    narrativeDesc?: string;
    narrativeValue?: string;
}

const AgentCard3D: React.FC<AgentCard3DProps> = ({ 
    position, 
    title, 
    role, 
    thought, 
    active, 
    color, 
    load, 
    icon,
    visible,
    statusText,
    narrativeTitle,
    narrativeDesc,
    narrativeValue
}) => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        // Floating hover animation
        if (groupRef.current) {
            groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.04;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Soft point light glow behind active agents */}
            {active && visible && <pointLight distance={6} intensity={2.8} color={color} />}
            
            <Html 
                transform 
                distanceFactor={18}
                scale={0.16}
                pointerEvents={visible ? 'auto' : 'none'}
            >
                <div 
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'scale(1)' : 'scale(0.85)',
                        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s',
                        pointerEvents: visible ? 'auto' : 'none',
                        width: '340px',
                        fontFamily: FONT_BODY,
                        color: '#ffffff',
                        backgroundColor: active ? 'rgba(9, 11, 20, 0.98)' : 'rgba(5, 7, 12, 0.94)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: active ? `1px solid ${color}` : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '20px',
                        padding: '20px 24px',
                        boxShadow: active 
                             ? `0 25px 50px rgba(0, 0, 0, 0.85), 0 0 40px ${color}30, inset 0 0 15px ${color}15`
                            : '0 10px 35px rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                    }}
                >
                    {/* Header: Icon, Role and Status indicator */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: active ? `${color}18` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${active ? `${color}38` : 'rgba(255,255,255,0.08)'}`,
                                color: active ? color : 'rgba(255, 255, 255, 0.4)',
                                transition: 'all 0.3s ease'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    {icon}
                                </span>
                            </div>
                            <span style={{ 
                                fontSize: '11px', 
                                letterSpacing: '0.08em', 
                                fontWeight: 800, 
                                color: active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.45)', 
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                {role}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span 
                                style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: active ? color : 'rgba(255, 255, 255, 0.2)',
                                    boxShadow: active ? `0 0 10px ${color}` : 'none',
                                    transition: 'all 0.3s ease'
                                }} 
                            />
                            <span style={{ 
                                fontSize: '10px', 
                                fontWeight: 800, 
                                color: active ? '#fff' : 'rgba(255,255,255,0.3)', 
                                letterSpacing: '0.04em',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                {statusText || (active ? 'ACTIVO' : 'ESPERA')}
                            </span>
                        </div>
                    </div>

                    {/* Agent Name */}
                    <div style={{ 
                        fontFamily: FONT_HEADING,
                        fontSize: '17px', 
                        fontWeight: 800, 
                        color: active ? '#fff' : 'rgba(255, 255, 255, 0.75)', 
                        letterSpacing: '-0.02em',
                        textTransform: 'none'
                    }}>
                        {title}
                    </div>

                    {/* Process Narrative or Standby status */}
                    <div style={{
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: active ? '#f1f5f9' : 'rgba(255,255,255,0.45)',
                        backgroundColor: active ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        borderLeft: `3px solid ${active ? color : 'rgba(255, 255, 255, 0.15)'}`,
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {active && narrativeTitle ? (
                            <>
                                <div style={{ 
                                    fontSize: '11px', 
                                    fontWeight: 800, 
                                    color: color, 
                                    fontFamily: 'var(--font-mono)', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {narrativeTitle}
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: 400, color: '#fff', lineHeight: '1.4' }}>
                                    {narrativeDesc}
                                </div>
                                {narrativeValue && (
                                    <div style={{ 
                                        fontSize: '12px', 
                                        fontWeight: 600, 
                                        color: '#00f3ff', 
                                        display: 'flex', 
                                        alignItems: 'flex-start',
                                        gap: '4px',
                                        marginTop: '4px',
                                        lineHeight: '1.3'
                                    }}>
                                        <span>•</span>
                                        <span>{narrativeValue}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <span style={{ fontWeight: 500 }}>{thought}</span>
                        )}
                    </div>

                    {/* Workload Progress Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                            <span>CARGA COGNITIVA</span>
                            <span>{active ? `${load}%` : '0%'}</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                width: active ? `${load}%` : '0%',
                                height: '100%',
                                backgroundColor: color,
                                transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                            }} />
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    );
};

// --- 3D CONNECTION LINES WITH TRAVELING ENERGY PULSES ---
interface ConnectionLineProps {
    start: [number, number, number];
    end: [number, number, number];
    active: boolean;
    color: string;
    speed?: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ start, end, active, color, speed = 0.6 }) => {
    const particleRef = useRef<THREE.Mesh>(null);

    const points = useMemo(() => {
        return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    }, [start, end]);

    const lineGeometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [points]);

    useFrame(({ clock }) => {
        if (!particleRef.current || !active) return;
        const t = (clock.getElapsedTime() * speed) % 1.0;
        const pos = new THREE.Vector3().lerpVectors(points[0], points[1], t);
        particleRef.current.position.copy(pos);
    });

    return (
        <group>
            <line {...({ geometry: lineGeometry } as any)}>
                <lineBasicMaterial 
                    color={color} 
                    opacity={active ? 0.4 : 0.08} 
                    transparent 
                    linewidth={1}
                />
            </line>
            
            {active && (
                <mesh ref={particleRef}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
};

// --- HELPER PARA OBTENER MÉTRICAS COMERCIALES DINÁMICAS ---
interface MetricUI {
    label: string;
    value: string;
    benefit: string;
    status: 'pending' | 'running' | 'success' | 'alert';
}

const getCommercialMetrics = (
    goal: 'LEAD' | 'FINANCE' | 'MARKETING', 
    phase: string, 
    currentStep: number,
    waitingForSignature: boolean
): MetricUI[] => {
    if (goal === 'LEAD') {
        return [
            {
                label: 'Enriquecimiento de Prospecto',
                value: currentStep >= 2 ? 'Acme Corp (450 empl., Logística)' : currentStep === 1 ? 'Extrayendo datos...' : 'Espera...',
                benefit: 'Identifica el sector y tamaño del prospecto sin investigación manual.',
                status: currentStep >= 2 ? 'success' : currentStep === 1 ? 'running' : 'pending'
            },
            {
                label: 'Calificación de Oportunidad',
                value: currentStep >= 2 ? 'Fit Score: A+ (Alto Valor)' : 'Espera...',
                benefit: 'Filtra y prioriza leads listos para comprar de forma autónoma.',
                status: currentStep >= 2 ? 'success' : 'pending'
            },
            {
                label: 'Auditoría GDPR & Privacidad',
                value: currentStep >= 3 ? '100% Cumplimiento Verificado' : currentStep === 2 ? 'Analizando redactado...' : 'Espera...',
                benefit: 'Protege tu reputación de dominio y cumple normativas de privacidad.',
                status: currentStep >= 3 ? 'success' : currentStep === 2 ? 'running' : 'pending'
            },
            {
                label: 'Acción CRM y Email',
                value: currentStep >= 4 ? 'Borrador en Outbox + Ficha en CRM' : currentStep === 3 ? 'Preparando payload...' : 'Espera...',
                benefit: 'Inserta la información de inmediato en tu embudo para cerrar más rápido.',
                status: currentStep >= 4 ? 'success' : currentStep === 3 ? 'running' : 'pending'
            }
        ];
    } else if (goal === 'FINANCE') {
        const isAlert = phase === 'SECURITY_ALERT' || waitingForSignature;
        return [
            {
                label: 'Monitoreo de Intención',
                value: currentStep >= 1 ? 'Visita clave detectada en pricing' : 'Espera...',
                benefit: 'Identifica prospectos navegando con alta intención de compra.',
                status: currentStep >= 1 ? 'success' : 'pending'
            },
            {
                label: 'Enriquecimiento de Perfil',
                value: currentStep >= 2 ? 'Cuenta B2B calificada y analizada' : 'Espera...',
                benefit: 'Analiza el tamaño de la oportunidad en tiempo real.',
                status: currentStep >= 2 ? 'success' : 'pending'
            },
            {
                label: 'Propuesta y Negociación',
                value: currentStep >= 3 ? 'Oferta de $15,000 USD pre-aprobada' : 'Espera...',
                benefit: 'Redacta propuestas comerciales dinámicas alineadas al cliente.',
                status: currentStep >= 3 ? 'success' : 'pending'
            },
            {
                label: 'Cierre de Venta (HIL)',
                value: currentStep >= 4 ? 'Contrato cerrado y cobrado' : isAlert ? 'Pendiente: Aprobación de director ($15,000 USD)' : 'Espera...',
                benefit: 'Valida la transacción de cierre de manera instantánea desde cualquier dispositivo.',
                status: currentStep >= 4 ? 'success' : isAlert ? 'alert' : 'pending'
            }
        ];
    } else { // MARKETING
        return [
            {
                label: 'Estudio de Mercado A/B',
                value: currentStep >= 2 ? 'Keyword: "automatización B2B"' : currentStep === 1 ? 'Buscando Google Trends...' : 'Espera...',
                benefit: 'Encuentra las tendencias de búsqueda de tu competencia de inmediato.',
                status: currentStep >= 2 ? 'success' : currentStep === 1 ? 'running' : 'pending'
            },
            {
                label: 'Copies Publicitarios',
                value: currentStep >= 2 ? '3 Variantes optimizadas CTR' : 'Espera...',
                benefit: 'Genera múltiples copys orientados a la conversión del cliente.',
                status: currentStep >= 2 ? 'success' : 'pending'
            },
            {
                label: 'Simulación de ROI',
                value: currentStep >= 3 ? 'ROI Estimado: 3.1x' : 'Espera...',
                benefit: 'Calcula predictivamente el coste por lead antes de invertir.',
                status: currentStep >= 3 ? 'success' : 'pending'
            },
            {
                label: 'Filtro de Políticas de Anuncios',
                value: currentStep >= 4 ? 'Aprobado sin riesgo de baneo' : currentStep === 3 ? 'Analizando términos...' : 'Espera...',
                benefit: 'Evita penalizaciones automáticas de Meta Ads mediante auditoría previa.',
                status: currentStep >= 4 ? 'success' : currentStep === 3 ? 'running' : 'pending'
            }
        ];
    }
};

// --- 3D CONSTELACIÓN DE PARTICULAS DINÁMICAS (ENJAMBRE DE BOIDS) ---
interface SwarmParticlesProps {
    color: string;
    speed: number;
}

const SwarmParticles: React.FC<SwarmParticlesProps> = ({ color, speed }) => {
    const groupRef = useRef<THREE.Group>(null);
    const count = 45;

    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const radius = 7.0 + Math.random() * 8.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            temp.push({
                position: [
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta) * 0.7 + 2.0,
                    radius * Math.cos(phi)
                ] as [number, number, number],
                scale: 0.06 + Math.random() * 0.06
            });
        }
        return temp;
    }, []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.05 * speed;
            groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.05 * speed;
        }
    });

    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <mesh key={i} position={node.position} scale={node.scale}>
                    <sphereGeometry args={[0.3, 8, 8]} />
                    <meshBasicMaterial 
                        color={color} 
                        opacity={0.06 + Math.random() * 0.06} 
                        transparent 
                    />
                </mesh>
            ))}
        </group>
    );
};

// --- ENTERPRISE CINEMATIC CAMERA DIRECTOR (DINÁMICO POR CASO DE USO) ---
const CameraManager: React.FC<{ phase: string; currentStep: number; activeGoal: 'LEAD' | 'FINANCE' | 'MARKETING' | null }> = ({ phase, currentStep, activeGoal }) => {
    useFrame((state) => {
        const camera = state.camera;
        const targetPos = new THREE.Vector3(0, 0.4, 9.8);
        const targetLook = new THREE.Vector3(0, 0.4, 0);

        if (activeGoal === 'LEAD') {
            if (phase === 'INGRESS') {
                targetPos.set(0, 2.3, 6.5);
                targetLook.set(0, 2.3, 0);
            } else if (phase === 'ORQUESTACION') {
                targetPos.set(-1.6, 1.3, 7.5);
                targetLook.set(-1.6, 1.3, 0);
            } else if (phase === 'SWARM_RUNNING') {
                if (currentStep === 2) {
                    targetPos.set(0, 0.4, 9.5);
                    targetLook.set(0, 0.4, 0);
                } else if (currentStep === 3) {
                    targetPos.set(-1.7, -1.8, 6.5);
                    targetLook.set(-1.7, -1.8, 0);
                }
            } else if (phase === 'COMPLETED') {
                targetPos.set(1.7, -1.8, 6.5);
                targetLook.set(1.7, -1.8, 0);
            }
        } else if (activeGoal === 'FINANCE') {
            if (phase === 'INGRESS') {
                targetPos.set(0, 2.3, 6.5);
                targetLook.set(0, 2.3, 0);
            } else if (phase === 'ORQUESTACION') {
                targetPos.set(0, 0.8, 9.5);
                targetLook.set(0, 0.8, 0);
            } else if (phase === 'SWARM_RUNNING') {
                targetPos.set(0, 0.2, 11.5);
                targetLook.set(0, 0.2, 0);
            } else if (phase === 'SECURITY_ALERT') {
                targetPos.set(-1.7, -1.8, 5.5);
                targetLook.set(-1.7, -1.8, 0);
            } else if (phase === 'COMPLETED') {
                targetPos.set(0, 0.2, 10.0);
                targetLook.set(0, 0.2, 0);
            }
        } else if (activeGoal === 'MARKETING') {
            const time = state.clock.getElapsedTime();
            if (phase === 'INGRESS') {
                targetPos.set(0, 1.2, 8.0);
                targetLook.set(0, 2.3, 0);
            } else if (phase === 'ORQUESTACION') {
                targetPos.set(1.6, 1.3, 8.0);
                targetLook.set(1.6, 1.3, 0);
            } else if (phase === 'SWARM_RUNNING') {
                if (currentStep === 2) {
                    const posX = Math.sin(time * 0.2) * 1.2;
                    targetPos.set(posX, 0.4, 10.0);
                    targetLook.set(0, 0.4, 0);
                } else if (currentStep === 3) {
                    targetPos.set(-1.7, -1.8, 6.5);
                    targetLook.set(-1.7, -1.8, 0);
                }
            } else if (phase === 'COMPLETED') {
                const angle = time * 0.15;
                const radius = 11.0;
                targetPos.set(Math.sin(angle) * radius, 0.4, Math.cos(angle) * radius);
                targetLook.set(0, 0.4, 0);
            }
        }

        const lerpFactor = phase === 'SECURITY_ALERT' ? 0.22 : 0.025;
        camera.position.lerp(targetPos, lerpFactor);
        const curLook = state.camera.userData.lookTarget || new THREE.Vector3(0, 0.0, 0);
        curLook.lerp(targetLook, lerpFactor);
        camera.lookAt(curLook);
        state.camera.userData.lookTarget = curLook;
    });
    return null;
};

// --- SIMULATION DATA & HUMANIZED BENEFIT-DRIVEN NARRATION ---
interface StepDetail {
    title: string;
    desc: string;
    agentName: string;
    businessValue: string;
}

const STEP_DETAILS: Record<string, Record<number, StepDetail>> = {
    LEAD: {
        0: {
            title: 'Cliente Interesado',
            desc: 'Un nuevo prospecto ingresa sus datos pidiendo información en tu sitio web.',
            agentName: 'Lector de Formularios',
            businessValue: 'Detecta al interesado al instante para responderle de inmediato sin hacerlo esperar.'
        },
        1: {
            title: 'Plan de Respuesta',
            desc: 'El Orquestador analiza el mensaje y organiza al equipo digital para preparar la propuesta.',
            agentName: 'Orquestador Cognitivo',
            businessValue: 'Determina en segundos qué especialistas digitales deben atender la solicitud.'
        },
        2: {
            title: 'Investigación Autónoma',
            desc: 'Los asistentes digitales buscan en internet datos clave de la empresa del cliente.',
            agentName: 'Asistentes de Búsqueda',
            businessValue: 'Encuentra información útil del cliente de forma automática para personalizar tu oferta.'
        },
        3: {
            title: 'Control de Calidad',
            desc: 'El supervisor digital revisa la propuesta para garantizar un tono impecable y profesional.',
            agentName: 'Asistente Supervisor',
            businessValue: 'Evita errores de redacción y asegura el cumplimiento estricto de las normas de privacidad.'
        },
        4: {
            title: 'Propuesta Enviada',
            desc: 'El Asistente guarda todo en el CRM y le envía el correo personalizado al cliente.',
            agentName: 'Asistente de Envíos',
            businessValue: 'Sincroniza tu base de datos y envía la propuesta al instante para que no pierdas la venta.'
        }
    },
    FINANCE: {
        0: {
            title: 'Detección de Oportunidad',
            desc: 'El sistema inteligente detecta a un tomador de decisiones clave investigando servicios en tu web.',
            agentName: 'Lector de Intención',
            businessValue: 'Identifica clientes de alto valor justo en el momento en que tienen intención de compra.'
        },
        1: {
            title: 'Enriquecimiento de Cuenta',
            desc: 'Los módulos investigan el perfil comercial del cliente y estiman su presupuesto disponible.',
            agentName: 'Perfilador Comercial',
            businessValue: 'Conoce el tamaño de la oportunidad antes de enviar una propuesta comercial.'
        },
        2: {
            title: 'Propuesta y Negociación',
            desc: 'El asistente redacta y envía una propuesta a la medida, alineada con las necesidades del cliente.',
            agentName: 'Negociador de Propuestas',
            businessValue: 'Presenta ofertas automatizadas personalizadas que aumentan el ratio de conversión.'
        },
        3: {
            title: 'Cierre de Venta (HIL)',
            desc: 'El cliente ha aceptado la propuesta por $15,000 USD. Confirma con un toque para procesar el cobro.',
            agentName: 'Filtro de Aprobación',
            businessValue: 'Control total: aprueba transacciones y contratos con un solo clic y agiliza el flujo de cobros.'
        },
        4: {
            title: 'Venta Completada',
            desc: '¡Ingreso registrado! El sistema inteligente emite la factura, firma el contrato y notifica a tu equipo de operaciones.',
            agentName: 'Ejecutor de Ingresos',
            businessValue: 'Genera flujo de caja y arranca la entrega del servicio en piloto automático sin burocracia.'
        }
    },
    MARKETING: {
        0: {
            title: 'Estudio de Mercado',
            desc: 'Los asistentes analizan el rendimiento histórico de tus anuncios en Facebook y Google.',
            agentName: 'Asistente de Mercado',
            businessValue: 'Identifica qué mensajes atraen más ventas para que no gastes presupuesto a ciegas.'
        },
        1: {
            title: 'Plan de Campaña',
            desc: 'El Orquestador organiza la estrategia y define el presupuesto diario sugerido.',
            agentName: 'Orquestador Cognitivo',
            businessValue: 'Controla la inversión publicitaria para exprimir cada centavo de tu inversión.'
        },
        2: {
            title: 'Diseño y Redacción',
            desc: 'Los asistentes creativos generan variaciones de anuncios llamativos.',
            agentName: 'Asistentes Creativos',
            businessValue: 'Crea textos publicitarios atractivos orientados a la conversión en tiempo récord.'
        },
        3: {
            title: 'Verificación de Anuncios',
            desc: 'El supervisor valida que los anuncios cumplan las normativas de las redes sociales.',
            agentName: 'Asistente Supervisor',
            businessValue: 'Protege tu negocio evitando que bloqueen tu cuenta publicitaria por error.'
        },
        4: {
            title: 'Anuncios en Marcha',
            desc: 'El Ejecutor publica la campaña y activa el panel de medición en vivo.',
            agentName: 'Asistente de Envíos',
            businessValue: 'Activa tus anuncios y te muestra los resultados de retorno de inversión de inmediato.'
        }
    }
};

interface ChatLogTemplate {
    sender: 'Orquestador' | 'Investigador' | 'Analista' | 'Validador' | 'Ejecutor' | 'Sistema';
    color: string;
    text: string;
}

const CHAT_LOGS: Record<string, Record<number, ChatLogTemplate[]>> = {
    LEAD: {
        0: [
            { sender: 'Orquestador', color: '#4285F4', text: '¡Alerta! Un cliente interesado ha dejado su contacto: jperez@acme.com' }
        ],
        1: [
            { sender: 'Orquestador', color: '#4285F4', text: 'Iniciando plan de atención personalizado...' },
            { sender: 'Orquestador', color: '#4285F4', text: 'Asignando tareas: [1] Investigar empresa, [2] Evaluar interés, [3] Revisar redacción.' }
        ],
        2: [
            { sender: 'Investigador', color: '#00F3FF', text: 'Buscando datos de jperez@acme.com en Google y redes sociales...' },
            { sender: 'Investigador', color: '#00F3FF', text: 'Resultado: Juan Pérez es Director de Operaciones en Acme Corp.' },
            { sender: 'Analista', color: '#9B51E0', text: 'Falta un dato clave: ¿cuál es el tamaño y sector de Acme Corp?' },
            { sender: 'Analista', color: '#9B51E0', text: 'SOLICITANDO AYUDA: Asistente Investigador, ¿puedes buscar el tamaño de Acme Corp?' },
            { sender: 'Investigador', color: '#00F3FF', text: '¡Encontrado! Acme Corp tiene 450 empleados y opera en el sector de Logística B2B.' },
            { sender: 'Analista', color: '#9B51E0', text: 'Datos completos. Es un prospecto de alto valor para nuestro negocio.' }
        ],
        3: [
            { sender: 'Analista', color: '#9B51E0', text: 'Redactando propuesta comercial enfocada en la optimización logística...' },
            { sender: 'Validador', color: '#FF3D00', text: 'Revisando propuesta escrita. Tono profesional, claro y sin errores.' },
            { sender: 'Validador', color: '#FF3D00', text: 'Verificando que cumpla con los lineamientos de privacidad corporativos. Aprobado.' },
            { sender: 'Validador', color: '#FF3D00', text: 'Propuesta validada al 100%. Autorizando despacho final.' }
        ],
        4: [
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Sincronizando los datos del prospecto con la base de datos...' },
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Ficha de Acme Corp creada exitosamente en el CRM.' },
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Borrador de email guardado en la bandeja de salida para envío inmediato.' },
            { sender: 'Orquestador', color: '#4285F4', text: '¡Flujo completado! El sistema inteligente atendió al cliente de forma oportuna.' }
        ]
    },
    FINANCE: {
        0: [
            { sender: 'Orquestador', color: '#4285F4', text: 'Iniciando ciclo de monitoreo comercial. Escaneando visitas de alta intención en la plataforma.' }
        ],
        1: [
            { sender: 'Orquestador', color: '#4285F4', text: 'Oportunidad detectada. Comportamiento del lead indica alto interés en el plan corporativo.' }
        ],
        2: [
            { sender: 'Investigador', color: '#00F3FF', text: 'Enriqueciendo datos de la cuenta: Lead es Director Comercial en constructora con 200 empleados.' },
            { sender: 'Analista', color: '#9B51E0', text: 'Generando propuesta de automatización comercial a la medida por un valor estimado de $15,000 USD.' },
            { sender: 'Analista', color: '#9B51E0', text: 'Propuesta comercial estructurada y validada por el sistema.' }
        ],
        3: [
            { sender: 'Validador', color: '#10B981', text: 'Cierre comercial en pausa para aprobación final (HIL).' },
            { sender: 'Orquestador', color: '#4285F4', text: 'Esperando confirmación del director para firmar la propuesta comercial de $15,000 USD...' }
        ],
        4: [
            { sender: 'Validador', color: '#10B981', text: 'Aprobación recibida. Propuesta enviada y aceptada por el cliente.' },
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Procesando el cobro de la primera mensualidad de forma segura.' },
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Actualizando CRM, enviando contrato de servicios y programando onboarding.' },
            { sender: 'Orquestador', color: '#4285F4', text: '¡Nueva venta de $15,000 USD captada con éxito! Operación cerrada en piloto automático.' }
        ]
    },
    MARKETING: {
        0: [
            { sender: 'Orquestador', color: '#4285F4', text: 'Recopilando métricas y CTRs de campañas de anuncios activas.' }
        ],
        1: [
            { sender: 'Orquestador', color: '#4285F4', text: 'Estrategia definida: Lanzar campaña para captar prospectos maximizando CTR.' },
            { sender: 'Orquestador', color: '#4285F4', text: 'Distribuyendo subtareas de redacción creativa y segmentación de audiencia.' }
        ],
        2: [
            { sender: 'Investigador', color: '#00F3FF', text: 'Analizando tendencias de anuncios de la competencia...' },
            { sender: 'Investigador', color: '#00F3FF', text: 'Tendencia identificada: "consejos para automatizar tareas diarias".' },
            { sender: 'Analista', color: '#9B51E0', text: 'Escribiendo 3 variantes de textos persuasivos basados en la tendencia...' }
        ],
        3: [
            { sender: 'Analista', color: '#9B51E0', text: 'Calculando estimaciones de visitas. ROI predictivo estimado: 3.1x.' },
            { sender: 'Validador', color: '#FF3D00', text: 'Validando cumplimiento de las políticas de privacidad y uso de marca.' },
            { sender: 'Validador', color: '#FF3D00', text: 'Límite de inversión aprobado: $350 USD/día.' }
        ],
        4: [
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Enviando el paquete de anuncios a la API de publicidad...' },
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Campaña activada y lista en la plataforma publicitaria.' },
            { sender: 'Ejecutor', color: '#FF8A00', text: 'Desplegando panel para monitorear el retorno de inversión en vivo.' },
            { sender: 'Orquestador', color: '#4285F4', text: '¡Campaña publicada! El sistema inteligente entra en fase de monitoreo.' }
        ]
    }
};


// --- MOBILE FALLBACK COMPONENT ---
const MobileFallback = () => (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #030407 0%, #07090E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        textAlign: 'center',
        fontFamily: 'var(--font-body)',
        zIndex: 9999
    }}>
        <div style={{
            fontSize: '4.5rem',
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 0 25px rgba(0, 243, 255, 0.45))'
        }}>
            🖥️
        </div>
        <h2 style={{
            color: '#fff',
            fontSize: '1.3rem',
            marginBottom: '0.8rem',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            textTransform: 'uppercase'
        }}>
            Experiencia Desktop
        </h2>
        <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            maxWidth: '320px',
            lineHeight: 1.6,
            marginBottom: '2rem'
        }}>
            Este simulador 3D interactivo de agentes autónomos está optimizado para pantallas grandes. Por favor, ingresa desde una computadora.
        </p>
        <a
            href="/"
            style={{
                padding: '0.9rem 2.2rem',
                background: 'rgba(0, 243, 255, 0.08)',
                border: '1px solid #00f3ff',
                borderRadius: '12px',
                color: '#00f3ff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = '#00f3ff';
                e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0, 243, 255, 0.08)';
                e.currentTarget.style.color = '#00f3ff';
            }}
        >
            ← VOLVER AL INICIO
        </a>
    </div>
);

// --- PLAYGROUND CORE VIEW ---
const Playground: React.FC = () => {
    const navigate = useNavigate();
    const { playClick, playWhoosh } = useSound();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // States
    const [phase, setPhase] = useState<'IDLE' | 'INGRESS' | 'ORQUESTACION' | 'SWARM_RUNNING' | 'SECURITY_ALERT' | 'COMPLETED'>('IDLE');
    const [activeGoal, setActiveGoal] = useState<'LEAD' | 'FINANCE' | 'MARKETING' | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<'LEAD' | 'FINANCE' | 'MARKETING'>('LEAD');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [waitingForSignature, setWaitingForSignature] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ sender: 'Orquestador' | 'Investigador' | 'Analista' | 'Validador' | 'Ejecutor' | 'Sistema'; color: string; text: string; timestamp: string; }[]>([]);
    const [loopActive, setLoopActive] = useState<'none' | 'researcher' | 'analyst'>('none');
    const [swarmSpeed, setSwarmSpeed] = useState<number>(0.6);
    const [showManifesto, setShowManifesto] = useState<boolean>(true);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [simSubStep, setSimSubStep] = useState<number>(-1);
    const activeTimeoutsRef = useRef<number[]>([]);

    // Dynamic statuses of agents mapped on each step for 3D card display
    const agentStatuses = useMemo(() => {
        if (phase === 'IDLE') {
            return {
                orchestrator: 'STANDBY',
                researcher: 'STANDBY',
                analyst: 'STANDBY',
                validator: 'STANDBY',
                executor: 'STANDBY'
            };
        }
        const goal = activeGoal || selectedGoal;
        if (goal === 'LEAD') {
            switch (phase) {
                case 'INGRESS':
                    return {
                        orchestrator: 'CARGANDO',
                        researcher: 'STANDBY',
                        analyst: 'STANDBY',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                case 'ORQUESTACION':
                    return {
                        orchestrator: 'PLANIFICANDO',
                        researcher: 'INICIANDO',
                        analyst: 'STANDBY',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                case 'SWARM_RUNNING':
                    if (currentStep === 2) {
                        return {
                            orchestrator: 'SUPERVISANDO',
                            researcher: loopActive === 'researcher' ? 'EXTRAYENDO' : 'LISTO',
                            analyst: loopActive === 'analyst' ? 'ANALIZANDO' : 'ESPERANDO',
                            validator: 'STANDBY',
                            executor: 'STANDBY'
                        };
                    } else {
                        return {
                            orchestrator: 'SUPERVISANDO',
                            researcher: 'COMPLETADO',
                            analyst: 'APROBANDO',
                            validator: 'STANDBY',
                            executor: 'STANDBY'
                        };
                    }
                case 'COMPLETED':
                    return {
                        orchestrator: 'COMPLETADO',
                        researcher: 'COMPLETADO',
                        analyst: 'ENVIADO',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                default:
                    break;
            }
        }
        if (goal === 'FINANCE') {
            switch (phase) {
                case 'INGRESS':
                    return {
                        orchestrator: 'INGRESANDO',
                        researcher: 'STANDBY',
                        analyst: 'STANDBY',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                case 'ORQUESTACION':
                    return {
                        orchestrator: 'ANALIZANDO',
                        researcher: 'RASTREANDO',
                        analyst: 'STANDBY',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                case 'SWARM_RUNNING':
                    return {
                        orchestrator: 'MONITORIZANDO',
                        researcher: 'PERFILANDO',
                        analyst: 'PROSPECTANDO',
                        validator: 'VALIDANDO',
                        executor: 'STANDBY'
                    };
                case 'SECURITY_ALERT':
                    return {
                        orchestrator: 'PAUSADO',
                        researcher: 'EN ESPERA',
                        analyst: 'STANDBY',
                        validator: 'APROBACIÓN',
                        executor: 'EN ESPERA'
                    };
                case 'COMPLETED':
                    return {
                        orchestrator: 'CERRADO',
                        researcher: 'COMPLETADO',
                        analyst: 'STANDBY',
                        validator: 'APROBADO',
                        executor: 'COBRADO'
                    };
                default:
                    break;
            }
        }
        if (goal === 'MARKETING') {
            switch (phase) {
                case 'INGRESS':
                    return {
                        orchestrator: 'CARGANDO',
                        researcher: 'STANDBY',
                        analyst: 'STANDBY',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                case 'ORQUESTACION':
                    return {
                        orchestrator: 'ESTRATEGIA',
                        researcher: 'STANDBY',
                        analyst: 'STANDBY',
                        validator: 'STANDBY',
                        executor: 'STANDBY'
                    };
                case 'SWARM_RUNNING':
                    if (currentStep === 2) {
                        return {
                            orchestrator: 'SUPERVISANDO',
                            researcher: 'KEYWORDS',
                            analyst: 'CREATIVO',
                            validator: 'STANDBY',
                            executor: 'STANDBY'
                        };
                    } else {
                        return {
                            orchestrator: 'SUPERVISANDO',
                            researcher: 'COMPLETADO',
                            analyst: 'COMPLETADO',
                            validator: 'AUDITANDO',
                            executor: 'STANDBY'
                        };
                    }
                case 'COMPLETED':
                    return {
                        orchestrator: 'COMPLETADO',
                        researcher: 'COMPLETADO',
                        analyst: 'CREATIVO OK',
                        validator: 'APROBADO',
                        executor: 'EN VIVO'
                    };
                default:
                    break;
            }
        }
        return {
            orchestrator: 'STANDBY',
            researcher: 'STANDBY',
            analyst: 'STANDBY',
            validator: 'STANDBY',
            executor: 'STANDBY'
        };
    }, [phase, selectedGoal, activeGoal, currentStep, loopActive]);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    const getTimestamp = () => {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    };

    // Dynamic Agent configurations mapping based on use cases
    const currentAgentConfig = useMemo(() => {
        const goal = selectedGoal;
        switch (goal) {
            case 'LEAD':
                return {
                    color: '#4285F4',
                    orchestrator: {
                        title: 'Orquestador ALMA',
                        role: 'Orquestador Cognitivo',
                        color: '#4285F4',
                        icon: <Activity size={16} />
                    },
                    researcher: {
                        title: 'Asistente de Búsqueda',
                        role: 'Investigador de Datos',
                        color: '#00F3FF',
                        icon: <Search size={16} />
                    },
                    analyst: {
                        title: 'Asistente de Ventas',
                        role: 'Redactor de Propuestas',
                        color: '#9B51E0',
                        icon: <Sparkles size={16} />
                    },
                    validator: {
                        title: 'Asistente Supervisor',
                        role: 'Validador de Calidad',
                        color: '#FF3D00',
                        icon: <ShieldCheck size={16} />
                    },
                    executor: {
                        title: 'Asistente de Envíos',
                        role: 'Ejecutor de Procesos',
                        color: '#FF8A00',
                        icon: <Mail size={16} />
                    }
                };
            case 'FINANCE':
                return {
                    color: '#10B981',
                    orchestrator: {
                        title: 'Orquestador de Ventas ALMA',
                        role: 'Director Comercial AI',
                        color: '#4285F4',
                        icon: <Cpu size={16} />
                    },
                    researcher: {
                        title: 'Analista de Intención',
                        role: 'Rastreador de Oportunidades',
                        color: '#00F3FF',
                        icon: <Search size={16} />
                    },
                    analyst: {
                        title: 'Redactor de Ofertas',
                        role: 'Diseñador de Propuestas',
                        color: '#9B51E0',
                        icon: <Sparkles size={16} />
                    },
                    validator: {
                        title: 'Filtro de Aprobación',
                        role: 'Supervisor de Contratos',
                        color: '#10B981',
                        icon: <ShieldCheck size={16} />
                    },
                    executor: {
                        title: 'Ejecutor de Ingresos',
                        role: 'Cierre Contable y CRM',
                        color: '#FF8A00',
                        icon: <CreditCard size={16} />
                    }
                };
            case 'MARKETING':
                return {
                    color: '#FF8A00',
                    orchestrator: {
                        title: 'Director Creativo ALMA',
                        role: 'Director de Arte AI',
                        color: '#4285F4',
                        icon: <Layers size={16} />
                    },
                    researcher: {
                        title: 'Analista de Tendencias',
                        role: 'Investigador de Keywords',
                        color: '#00F3FF',
                        icon: <Search size={16} />
                    },
                    analyst: {
                        title: 'Redactor Creativo',
                        role: 'Copywriter Publicitario',
                        color: '#9B51E0',
                        icon: <Edit3 size={16} />
                    },
                    validator: {
                        title: 'Filtro de Políticas',
                        role: 'Supervisor de Reglas Ad',
                        color: '#FF3D00',
                        icon: <CheckSquare size={16} />
                    },
                    executor: {
                        title: 'Publicador de Anuncios',
                        role: 'API Ads Manager',
                        color: '#FF8A00',
                        icon: <ExternalLink size={16} />
                    }
                };
            default:
                return null;
        }
    }, [activeGoal]);



    // Auto-scroll chat box
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chatMessages]);

    // Initial message
    useEffect(() => {
        setChatMessages([
            { sender: 'Sistema', color: '#718096', text: 'Sistema en espera. Selecciona un caso en el panel izquierdo para iniciar la simulación.', timestamp: '--:--:--' }
        ]);
    }, []);

    // Swarm static array removed in favor of dynamic SwarmParticles component.

    // Active states for each Agent Node based on simulation phase and step
    const isOrchestratorActive = useMemo(() => {
        if (phase === 'IDLE') return false;
        if (activeGoal === 'LEAD') {
            return currentStep === 0 || currentStep === 1 || currentStep === 3 || currentStep === 4;
        }
        if (activeGoal === 'FINANCE') {
            return currentStep === 0 || currentStep === 1;
        }
        if (activeGoal === 'MARKETING') {
            return currentStep === 1;
        }
        return false;
    }, [phase, activeGoal, currentStep]);

    const isResearcherActive = useMemo(() => {
        if (phase === 'IDLE') return false;
        if (activeGoal === 'LEAD') {
            return currentStep === 2 && loopActive !== 'analyst';
        }
        if (activeGoal === 'FINANCE') {
            return currentStep === 2;
        }
        if (activeGoal === 'MARKETING') {
            return currentStep === 0;
        }
        return false;
    }, [phase, activeGoal, currentStep, loopActive]);

    const isAnalystActive = useMemo(() => {
        if (phase === 'IDLE') return false;
        if (activeGoal === 'LEAD') {
            return currentStep === 2 && loopActive !== 'researcher';
        }
        if (activeGoal === 'FINANCE') {
            return false;
        }
        if (activeGoal === 'MARKETING') {
            return currentStep === 2;
        }
        return false;
    }, [phase, activeGoal, currentStep, loopActive]);

    const isValidatorActive = useMemo(() => {
        if (phase === 'IDLE') return false;
        if (activeGoal === 'LEAD') {
            return false;
        }
        if (activeGoal === 'FINANCE') {
            return currentStep === 3;
        }
        if (activeGoal === 'MARKETING') {
            return currentStep === 3;
        }
        return false;
    }, [phase, activeGoal, currentStep]);

    const isExecutorActive = useMemo(() => {
        if (phase === 'IDLE') return false;
        if (activeGoal === 'LEAD') {
            return false;
        }
        if (activeGoal === 'FINANCE') {
            return currentStep === 4;
        }
        if (activeGoal === 'MARKETING') {
            return currentStep === 4;
        }
        return false;
    }, [phase, activeGoal, currentStep]);

    const currentStepNarrative = useMemo(() => {
        if (!activeGoal) return null;
        return STEP_DETAILS[activeGoal]?.[currentStep] || null;
    }, [activeGoal, currentStep]);

    // Active Agent Thought computations
    const agentThoughts = useMemo(() => {
        if (phase === 'IDLE') {
            return {
                orchestrator: 'Esperando metas de negocio...',
                researcher: 'Asistentes de búsqueda listos.',
                analyst: 'Módulos de redacción y análisis listos.',
                validator: 'Gateway de supervisión de calidad activo.',
                executor: 'Sistemas de envío listos para publicar.'
            };
        }
        if (activeGoal === 'LEAD') {
            switch (phase) {
                case 'INGRESS':
                    return {
                        orchestrator: 'Leyendo datos ingresados: jperez@acme.com...',
                        researcher: 'Módulos listos.',
                        analyst: 'Listo.',
                        validator: 'Listo.',
                        executor: 'Listo.'
                    };
                case 'ORQUESTACION':
                    return {
                        orchestrator: 'Diseñando el plan de atención para el prospecto...',
                        researcher: 'Preparando motores de búsqueda en internet...',
                        analyst: 'En espera.',
                        validator: 'En espera.',
                        executor: 'En espera.'
                    };
                case 'SWARM_RUNNING':
                    return {
                        orchestrator: 'Supervisando la investigación de Acme Corp...',
                        researcher: 'Buscando datos sobre Acme Corp y Juan Pérez...',
                        analyst: 'Analizando... Falta tamaño de empresa. Solicitando re-búsqueda.',
                        validator: 'Listo.',
                        executor: 'En espera.'
                    };
                case 'COMPLETED':
                    return {
                        orchestrator: 'Flujo cerrado. Propuesta redactada y cliente guardado.',
                        researcher: 'Búsqueda completada.',
                        analyst: 'Propuesta optimizada lista.',
                        validator: 'Calidad aprobada sin fallas.',
                        executor: 'Datos guardados en CRM. Correo en bandeja de salida.'
                    };
                default:
                    break;
            }
        }
        if (activeGoal === 'FINANCE') {
            switch (phase) {
                case 'INGRESS':
                    return {
                        orchestrator: 'Escaneando visitas de alta intención de compra...',
                        researcher: 'Módulos listos.',
                        analyst: 'Listo.',
                        validator: 'Listo.',
                        executor: 'Listo.'
                    };
                case 'ORQUESTACION':
                    return {
                        orchestrator: 'Identificando oportunidades de venta de alto valor...',
                        researcher: 'Rastreando comportamiento del lead en la web...',
                        analyst: 'Listo.',
                        validator: 'Listo.',
                        executor: 'Listo.'
                    };
                case 'SWARM_RUNNING':
                    return {
                        orchestrator: 'Supervisando perfilamiento y redacción de oferta...',
                        researcher: 'Investigando perfil: Director Comercial, Constructora...',
                        analyst: 'Propuesta de automatización redactada por $15,000 USD.',
                        validator: 'Verificando rentabilidad y cotización...',
                        executor: 'En espera de aprobación.'
                    };
                case 'SECURITY_ALERT':
                    return {
                        orchestrator: 'Contrato listo. Esperando validación del director.',
                        researcher: 'Pausado.',
                        analyst: 'Propuesta comercial finalizada al 100%.',
                        validator: 'Pausado: Esperando confirmación para cerrar la venta.',
                        executor: 'Borrador de contrato listo para firmar.'
                    };
                case 'COMPLETED':
                    return {
                        orchestrator: '¡Venta de $15,000 USD captada y completada con éxito!',
                        researcher: 'Datos guardados.',
                        analyst: 'Contrato firmado digitalmente.',
                        validator: 'Aprobación del director registrada.',
                        executor: 'CRM actualizado. Cobro realizado y factura enviada.'
                    };
                default:
                    break;
            }
        }
        if (activeGoal === 'MARKETING') {
            switch (phase) {
                case 'INGRESS':
                    return {
                        orchestrator: 'Leyendo el rendimiento de tus anuncios activos...',
                        researcher: 'Listo.',
                        analyst: 'Listo.',
                        validator: 'Listo.',
                        executor: 'Listo.'
                    };
                case 'ORQUESTACION':
                    return {
                        orchestrator: 'Diseñando el presupuesto y la estrategia publicitaria...',
                        researcher: 'Conectando con herramientas de tendencias comerciales...',
                        analyst: 'Listo.',
                        validator: 'Listo.',
                        executor: 'Listo.'
                    };
                case 'SWARM_RUNNING':
                    return {
                        orchestrator: 'Supervisando redacción creativa y segmentación...',
                        researcher: 'Rastreando temas y palabras clave de la competencia...',
                        analyst: 'Redactando 3 variaciones de textos para tus anuncios...',
                        validator: 'Revisando normas de las plataformas...',
                        executor: 'Listo.'
                    };
                case 'COMPLETED':
                    return {
                        orchestrator: 'Anuncios publicados con éxito. Campaña en vivo.',
                        researcher: 'Estudio de mercado completado.',
                        analyst: 'Textos de anuncios terminados.',
                        validator: 'Reglas de privacidad aprobadas.',
                        executor: 'Campaña activa en la plataforma. Panel de resultados configurado.'
                    };
                default:
                    break;
            }
        }
        return {
            orchestrator: 'Standby.',
            researcher: 'Standby.',
            analyst: 'Standby.',
            validator: 'Standby.',
            executor: 'Standby.'
        };
    }, [phase, activeGoal]);

    interface SimStep {
        phase?: 'IDLE' | 'INGRESS' | 'ORQUESTACION' | 'SWARM_RUNNING' | 'SECURITY_ALERT' | 'COMPLETED';
        currentStep?: number;
        swarmSpeed?: number;
        loopActive?: 'none' | 'researcher' | 'analyst';
        waitingForSignature?: boolean;
        chatMsgs?: { sender: 'Orquestador' | 'Investigador' | 'Analista' | 'Validador' | 'Ejecutor' | 'Sistema'; color: string; text: string; }[];
        duration: number; // in ms
    }

    const leadSteps = useMemo<SimStep[]>(() => [
        {
            phase: 'INGRESS',
            currentStep: 0,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 4500,
            chatMsgs: CHAT_LOGS['LEAD']?.[0] || []
        },
        {
            phase: 'ORQUESTACION',
            currentStep: 1,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 5000,
            chatMsgs: CHAT_LOGS['LEAD']?.[1] || []
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 1.2,
            loopActive: 'researcher',
            duration: 2200,
            chatMsgs: CHAT_LOGS['LEAD']?.[2] || []
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 1.2,
            loopActive: 'analyst',
            duration: 2200
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 1.2,
            loopActive: 'researcher',
            duration: 2200
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 1.2,
            loopActive: 'analyst',
            duration: 3000
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 3,
            swarmSpeed: 1.2,
            loopActive: 'none',
            duration: 6000,
            chatMsgs: CHAT_LOGS['LEAD']?.[3] || []
        },
        {
            phase: 'COMPLETED',
            currentStep: 4,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 0,
            chatMsgs: CHAT_LOGS['LEAD']?.[4] || []
        }
    ], []);

    const financeSteps = useMemo<SimStep[]>(() => [
        {
            phase: 'INGRESS',
            currentStep: 0,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 4500,
            chatMsgs: CHAT_LOGS['FINANCE']?.[0] || []
        },
        {
            phase: 'ORQUESTACION',
            currentStep: 1,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 5000,
            chatMsgs: CHAT_LOGS['FINANCE']?.[1] || []
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 3.0,
            loopActive: 'none',
            duration: 5500,
            chatMsgs: CHAT_LOGS['FINANCE']?.[2] || []
        },
        {
            phase: 'SECURITY_ALERT',
            currentStep: 3,
            swarmSpeed: 0.08,
            loopActive: 'none',
            waitingForSignature: true,
            duration: 999999, // HIL modal blocks
            chatMsgs: CHAT_LOGS['FINANCE']?.[3] || []
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 1.2,
            loopActive: 'none',
            duration: 3000,
            chatMsgs: [
                { sender: 'Validador', color: '#10B981', text: 'Aprobación de conciliación y registro de facturas autorizada por el supervisor.' }
            ]
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 3,
            swarmSpeed: 1.2,
            loopActive: 'none',
            duration: 3500,
            chatMsgs: [
                { sender: 'Ejecutor', color: '#FF8A00', text: 'Registrando facturas omitidas en el sistema ERP e integrando conciliación final.' }
            ]
        },
        {
            phase: 'COMPLETED',
            currentStep: 4,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 0,
            chatMsgs: [
                { sender: 'Orquestador', color: '#4285F4', text: '¡Conciliación mensual finalizada y firmada criptográficamente con éxito!' }
            ]
        }
    ], []);

    const marketingSteps = useMemo<SimStep[]>(() => [
        {
            phase: 'INGRESS',
            currentStep: 0,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 4500,
            chatMsgs: CHAT_LOGS['MARKETING']?.[0] || []
        },
        {
            phase: 'ORQUESTACION',
            currentStep: 1,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 5500,
            chatMsgs: CHAT_LOGS['MARKETING']?.[1] || []
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 2,
            swarmSpeed: 0.9,
            loopActive: 'none',
            duration: 6500,
            chatMsgs: CHAT_LOGS['MARKETING']?.[2] || []
        },
        {
            phase: 'SWARM_RUNNING',
            currentStep: 3,
            swarmSpeed: 0.9,
            loopActive: 'none',
            duration: 6000,
            chatMsgs: CHAT_LOGS['MARKETING']?.[3] || []
        },
        {
            phase: 'COMPLETED',
            currentStep: 4,
            swarmSpeed: 0.6,
            loopActive: 'none',
            duration: 0,
            chatMsgs: CHAT_LOGS['MARKETING']?.[4] || []
        }
    ], []);

    const clearAllTimeouts = () => {
        activeTimeoutsRef.current.forEach(clearTimeout);
        activeTimeoutsRef.current = [];
    };

    useEffect(() => {
        return () => {
            clearAllTimeouts();
        };
    }, []);

    const executeStep = (goal: 'LEAD' | 'FINANCE' | 'MARKETING', stepIdx: number) => {
        clearAllTimeouts();
        setSimSubStep(stepIdx);

        const steps = goal === 'LEAD' ? leadSteps : goal === 'FINANCE' ? financeSteps : marketingSteps;
        if (stepIdx < 0 || stepIdx >= steps.length) return;

        const currentStepConfig = steps[stepIdx];

        // Execute state changes
        if (currentStepConfig.phase) setPhase(currentStepConfig.phase);
        if (currentStepConfig.currentStep !== undefined) setCurrentStep(currentStepConfig.currentStep);
        if (currentStepConfig.swarmSpeed !== undefined) setSwarmSpeed(currentStepConfig.swarmSpeed);
        if (currentStepConfig.loopActive !== undefined) setLoopActive(currentStepConfig.loopActive);
        if (currentStepConfig.waitingForSignature !== undefined) setWaitingForSignature(currentStepConfig.waitingForSignature);

        // Add sound cues
        if (currentStepConfig.phase === 'INGRESS' || currentStepConfig.phase === 'SWARM_RUNNING' || currentStepConfig.phase === 'SECURITY_ALERT') {
            playWhoosh();
        } else {
            playClick();
        }

        // Handle chat messages
        if (currentStepConfig.chatMsgs) {
            const time = getTimestamp();
            const msgsWithTime = currentStepConfig.chatMsgs.map(m => ({ ...m, timestamp: time }));
            if (stepIdx === 0) {
                setChatMessages(msgsWithTime);
            } else {
                setChatMessages(prev => [...prev, ...msgsWithTime]);
            }
        }

        // Schedule next step if we are not in manual/paused mode and it's not the last step
        if (!isPaused && currentStepConfig.duration > 0 && !currentStepConfig.waitingForSignature) {
            const tId = window.setTimeout(() => {
                executeStep(goal, stepIdx + 1);
            }, currentStepConfig.duration);
            activeTimeoutsRef.current.push(tId);
        }
    };

    const togglePause = () => {
        if (phase === 'IDLE' || phase === 'COMPLETED') return;
        playClick();
        const goal = activeGoal || selectedGoal;
        if (!goal) return;

        if (isPaused) {
            // Unpausing: resume simulation
            setIsPaused(false);
            const steps = goal === 'LEAD' ? leadSteps : goal === 'FINANCE' ? financeSteps : marketingSteps;
            const nextIdx = simSubStep + 1;
            
            // Only auto-advance if we're not currently waiting for a signature
            const currentStepConfig = steps[simSubStep];
            if (currentStepConfig && currentStepConfig.waitingForSignature) {
                // Keep waiting for signature, do not auto-advance
            } else if (nextIdx < steps.length) {
                executeStep(goal, nextIdx);
            }
        } else {
            // Pausing: clear active timeouts
            setIsPaused(true);
            clearAllTimeouts();
        }
    };

    const handleNextStep = () => {
        const goal = activeGoal || selectedGoal;
        if (!goal) return;
        playClick();
        const steps = goal === 'LEAD' ? leadSteps : goal === 'FINANCE' ? financeSteps : marketingSteps;
        const nextIdx = simSubStep + 1;
        if (nextIdx < steps.length) {
            executeStep(goal, nextIdx);
        }
    };

    // Handle flow sequences (Custom choreographies for each business use case)
    const runSimulation = (goal: 'LEAD' | 'FINANCE' | 'MARKETING') => {
        if (phase !== 'IDLE' && phase !== 'COMPLETED') return;
        playClick();
        setActiveGoal(goal);
        setSelectedGoal(goal);
        setWaitingForSignature(false);
        setLoopActive('none');
        setSwarmSpeed(0.6);
        setIsPaused(false);
        setSimSubStep(0);
        executeStep(goal, 0);
    };

    // Human Validation Click Override
    const handleSignAuthorize = () => {
        if (!waitingForSignature) return;
        playClick();
        setWaitingForSignature(false);
        executeStep('FINANCE', 4);
    };

    const handleReset = () => {
        playClick();
        clearAllTimeouts();
        setPhase('IDLE');
        setActiveGoal(null);
        setCurrentStep(0);
        setWaitingForSignature(false);
        setLoopActive('none');
        setSwarmSpeed(0.6);
        setIsPaused(false);
        setSimSubStep(-1);
        setChatMessages([
            { sender: 'Sistema', color: '#718096', text: 'Sistema en espera. Selecciona un caso en la cabecera superior para comenzar la simulación.', timestamp: '--:--:--' }
        ]);
    };

    // Goals config list for sidebar tabs
    const goalsConfig = [
        { id: 'LEAD', label: 'Ventas y CRM', icon: <UserCheck size={18} />, color: '#4285F4', desc: 'Atención personalizada e investigación de prospectos.' },
        { id: 'FINANCE', label: 'Piloto Comercial', icon: <DollarSign size={18} />, color: '#10B981', desc: 'Monitoreo de intención de compra y cierre automático de contratos de alto valor.' },
        { id: 'MARKETING', label: 'Anuncios y Creativos', icon: <Sparkles size={18} />, color: '#FF8A00', desc: 'Estudio de mercado, copies y publicación automatizada.' }
    ];

    if (isMobile) {
        return <MobileFallback />;
    }

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            backgroundColor: '#030407',
            overflow: 'hidden',
            fontFamily: FONT_BODY,
            position: 'relative'
        }}>
            {/* Alert Vignette Overlay for SECURITY_ALERT (HIL validation) */}
            {phase === 'SECURITY_ALERT' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    boxShadow: activeGoal === 'FINANCE'
                        ? 'inset 0 0 100px rgba(16, 185, 129, 0.3)'
                        : 'inset 0 0 100px rgba(255, 61, 0, 0.4)',
                    border: activeGoal === 'FINANCE'
                        ? '3px solid rgba(16, 185, 129, 0.35)'
                        : '3px solid rgba(255, 61, 0, 0.45)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    animation: activeGoal === 'FINANCE'
                        ? 'pulseGreenBorder 2s infinite alternate'
                        : 'pulseRedBorder 2s infinite alternate'
                }} />
            )}

            <SEO 
                title="Simulador de Automatización Inteligente | agencIA"
                description="Experimenta en tiempo real cómo nuestros flujos de trabajo inteligentes automatizan la prospección, el cierre comercial y las campañas sin fricciones."
            />

            {/* FLOATING GLASS HEADER */}
            <div style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                right: '24px',
                height: '64px',
                backgroundColor: 'rgba(7, 9, 14, 0.65)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '32px',
                padding: '0 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 100,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                {/* Brand / Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontWeight: 900, 
                        fontSize: '15px', 
                        letterSpacing: '0.15em', 
                        color: '#fff',
                        textTransform: 'uppercase'
                    }}>
                        agenc<span style={{ color: '#00f3ff' }}>IA</span>
                    </span>
                    <span style={{ 
                        fontSize: '11px', 
                        color: 'rgba(255, 255, 255, 0.35)', 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.05em'
                    }}>
                        LAB
                    </span>
                </div>

                {/* Use Case Floating Tab Selector */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '24px',
                    padding: '4px',
                    gap: '4px',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05)'
                }}>
                    {goalsConfig.map((goal) => {
                        const active = selectedGoal === goal.id;
                        const isSimRunning = phase !== 'IDLE' && phase !== 'COMPLETED';
                        const activeColor = goal.color;
                        return (
                            <button
                                key={goal.id}
                                disabled={isSimRunning && activeGoal !== goal.id}
                                onClick={() => runSimulation(goal.id as 'LEAD' | 'FINANCE' | 'MARKETING')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 18px',
                                    borderRadius: '20px',
                                    fontSize: '13px',
                                    fontWeight: 650,
                                    fontFamily: FONT_HEADING,
                                    color: active ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: active ? `${activeColor}22` : 'transparent',
                                    border: active ? `1px solid ${activeColor}44` : '1px solid transparent',
                                    boxShadow: active ? `0 4px 15px ${activeColor}15` : 'none',
                                    cursor: (isSimRunning && activeGoal !== goal.id) ? 'not-allowed' : 'pointer',
                                    opacity: (isSimRunning && activeGoal !== goal.id) ? 0.3 : 1,
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                    outline: 'none'
                                }}
                            >
                                <span style={{ color: active ? activeColor : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}>
                                    {goal.icon}
                                </span>
                                <span>{goal.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Back / Navigation Action */}
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'rgba(255, 255, 255, 0.55)',
                        fontFamily: 'var(--font-mono)',
                        transition: 'color 0.2s',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        letterSpacing: '0.05em'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)'}
                >
                    <ArrowLeft size={13} /> VOLVER
                </button>
            </div>

            {/* WELCOME INTRO CARD FOR IDLE STATE */}
            {phase === 'IDLE' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '450px',
                    backgroundColor: 'rgba(8, 10, 16, 0.75)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '28px',
                    padding: '44px 40px',
                    textAlign: 'center',
                    zIndex: 10,
                    boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.02)',
                    animation: 'fadeInUpCenter 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {/* Animated Core Orb */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #00f3ff 0%, rgba(0,243,255,0) 70%)',
                        margin: '0 auto 24px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}>
                        <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#00f3ff',
                            boxShadow: '0 0 20px #00f3ff, 0 0 40px #00f3ff',
                            animation: 'pulseGlowSpeed 2s infinite alternate'
                        }} />
                    </div>

                    <h1 style={{
                        fontFamily: FONT_HEADING,
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#fff',
                        margin: '0 0 12px 0',
                        letterSpacing: '-0.02em'
                    }}>
                        Simulador de Procesos
                    </h1>

                    <p style={{
                        fontFamily: FONT_BODY,
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.55)',
                        lineHeight: '1.6',
                        margin: '0 0 32px 0'
                    }}>
                        Automatización inteligente y flujos B2B sin fricciones. Descubre cómo cooperan nuestros módulos inteligentes en tareas operativas complejas de forma ágil y segura.
                    </p>

                    <div style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: '#00f3ff',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(0, 243, 255, 0.25)',
                        backgroundColor: 'rgba(0, 243, 255, 0.03)',
                        padding: '12px 24px',
                        borderRadius: '16px',
                        display: 'inline-block',
                        animation: 'pulseGlow 2s infinite alternate'
                    }}>
                        ▲ SELECCIONA UN CASO DE USO ARRIBA
                    </div>
                </div>
            )}

            {/* FLOATING STATUS/RESTART CONTROLS PILL */}
            {phase === 'COMPLETED' && (
                <div style={{
                    position: 'absolute',
                    bottom: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(9, 11, 20, 0.95)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: `1px solid ${selectedGoal === 'LEAD' ? '#4285F444' : selectedGoal === 'FINANCE' ? '#10B98144' : '#FF8A0044'}`,
                    borderRadius: '24px',
                    padding: '8px 8px 8px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    zIndex: 100,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    animation: 'fadeInUpBottomCenter 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Check size={16} color={selectedGoal === 'LEAD' ? '#4285F4' : selectedGoal === 'FINANCE' ? '#10B981' : '#FF8A00'} />
                        <span style={{ 
                            fontSize: '13px', 
                            fontWeight: 600, 
                            color: '#fff', 
                            fontFamily: FONT_HEADING,
                            letterSpacing: '-0.01em'
                        }}>
                            {selectedGoal === 'LEAD' 
                                ? 'Ventas: Prospecto calificado, CRM actualizado y borrador de email creado.' 
                                : selectedGoal === 'FINANCE' 
                                ? 'Piloto Comercial: Oportunidad de venta cerrada de $15,000 USD y cobro procesado sin fricción.' 
                                : 'Marketing: Campaña publicada con éxito y panel de ROI activo.'}
                        </span>
                    </div>
                    <button
                        onClick={handleReset}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            borderRadius: '16px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            fontFamily: FONT_BODY,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            outline: 'none'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }}
                    >
                        <RefreshCw size={13} /> VOLVER A EMPEZAR
                    </button>
                </div>
            )}

            {phase !== 'IDLE' && phase !== 'COMPLETED' && (
                <div style={{
                    position: 'absolute',
                    bottom: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(7, 9, 14, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '8px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    zIndex: 100,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    animation: 'fadeInUpBottomCenter 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    {isPaused ? (
                        <span 
                            style={{
                                width: '12px',
                                height: '12px',
                                border: `2px solid ${selectedGoal === 'LEAD' ? '#4285F4' : selectedGoal === 'FINANCE' ? '#10B981' : '#FF8A00'}`,
                                borderRadius: '50%',
                                display: 'inline-block',
                                opacity: 0.6
                            }}
                        />
                    ) : (
                        <span 
                            className="spinning-loader"
                            style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid rgba(255,255,255,0.15)',
                                borderTop: `2px solid ${selectedGoal === 'LEAD' ? '#4285F4' : selectedGoal === 'FINANCE' ? '#10B981' : '#FF8A00'}`,
                                borderRadius: '50%',
                                display: 'inline-block',
                                animation: 'spin 1s linear infinite'
                            }}
                        />
                    )}
                    <span style={{ 
                        fontSize: '12.5px', 
                        fontWeight: 500, 
                        color: 'rgba(255, 255, 255, 0.85)', 
                        fontFamily: FONT_BODY,
                        letterSpacing: '-0.01em'
                    }}>
                        Simulación: <strong>{activeGoal === 'LEAD' ? 'Ventas B2B' : activeGoal === 'FINANCE' ? 'Piloto Comercial' : 'Marketing'}</strong> {isPaused ? 'pausada' : 'activa'}.
                    </span>

                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePause}
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            borderRadius: '16px',
                            padding: '6px 14px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            outline: 'none',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                    >
                        {isPaused ? '▶ REANUDAR' : '❚❚ PAUSAR'}
                    </button>

                    {/* Next Step Button */}
                    {isPaused && !waitingForSignature && (
                        <button
                            onClick={handleNextStep}
                            style={{
                                background: selectedGoal === 'LEAD' ? 'rgba(66, 133, 244, 0.2)' : selectedGoal === 'FINANCE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 138, 0, 0.2)',
                                border: `1px solid ${selectedGoal === 'LEAD' ? '#4285F4' : selectedGoal === 'FINANCE' ? '#10B981' : '#FF8A00'}`,
                                color: '#fff',
                                borderRadius: '16px',
                                padding: '6px 14px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono)',
                                letterSpacing: '0.05em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = selectedGoal === 'LEAD' ? 'rgba(66, 133, 244, 0.3)' : selectedGoal === 'FINANCE' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 138, 0, 0.3)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = selectedGoal === 'LEAD' ? 'rgba(66, 133, 244, 0.2)' : selectedGoal === 'FINANCE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 138, 0, 0.2)';
                            }}
                        >
                            AVANZAR →
                        </button>
                    )}

                    <button
                        onClick={handleReset}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.4)',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.05em',
                            padding: '4px',
                            outline: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                        DETENER
                    </button>
                </div>
            )}

            {/* FLOATING COLLAPSIBLE MANIFESTO CAPSULE */}
            {phase === 'COMPLETED' && (
                showManifesto ? (
                    <div style={{
                        position: 'absolute',
                        bottom: '120px',
                        left: '24px',
                        width: '350px',
                        backgroundColor: 'rgba(9, 11, 20, 0.9)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '24px',
                        zIndex: 10,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={15} color="#00f3ff" />
                                <span style={{ 
                                    fontSize: '11px', 
                                    fontWeight: 800, 
                                    fontFamily: 'var(--font-mono)', 
                                    letterSpacing: '0.08em', 
                                    color: '#00f3ff', 
                                    textTransform: 'uppercase' 
                                }}>
                                    Diferencia Operativa
                                </span>
                            </div>
                            <button 
                                onClick={() => setShowManifesto(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-mono)',
                                    padding: '4px',
                                    outline: 'none'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                            >
                                OCULTAR
                            </button>
                        </div>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.55', margin: 0, fontFamily: FONT_BODY }}>
                            La automatización tradicional ejecuta tareas rígidas sin analizar el contexto. Nuestro sistema integra flujos de trabajo inteligentes que investigan, validan y personalizan cada acción, eliminando errores operativos.
                        </p>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#EF4444', fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' }}>
                                AUTOMATIZACIÓN TRADICIONAL
                            </div>
                            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)', lineHeight: '1.4', fontFamily: FONT_BODY }}>
                                {selectedGoal === 'LEAD' 
                                    ? 'Envíos masivos genéricos que no conocen las necesidades reales del cliente.' 
                                    : selectedGoal === 'FINANCE' 
                                    ? 'Procesos manuales lentos que retrasan la facturación y el flujo de caja.' 
                                    : 'Generación de contenidos repetitivos y sin filtros de cumplimiento de marca.'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowManifesto(true)}
                        style={{
                            position: 'absolute',
                            bottom: '120px',
                            left: '24px',
                            backgroundColor: 'rgba(7, 9, 14, 0.75)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '20px',
                            padding: '12px 18px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            zIndex: 10,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                            transition: 'all 0.3s',
                            outline: 'none'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(7, 9, 14, 0.75)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        <Sparkles size={13} color="#00f3ff" /> DIFERENCIA OPERATIVA
                    </button>
                )
            )}

            {/* FLOATING HUMAN VALIDATION SIGNATURE POPUP */}
            {waitingForSignature && activeGoal === 'FINANCE' && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12%',
                    transform: 'translateY(-50%)',
                    width: '380px',
                    backgroundColor: 'rgba(7, 9, 14, 0.9)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '24px',
                    padding: '32px',
                    zIndex: 100,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    animation: 'pulseGreenGlow 3s infinite alternate, fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={18} color="#10B981" />
                        <span style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            color: '#10B981', 
                            fontFamily: 'var(--font-mono)', 
                            letterSpacing: '0.08em' 
                        }}>
                            REQUERIMIENTO DE APROBACIÓN
                        </span>
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.55, fontFamily: FONT_BODY }}>
                        El sistema inteligente detectó una oportunidad comercial lista para cierre y estructuró una propuesta de $15,000 USD. Aprueba la transacción de forma inmediata y segura con un solo clic desde tu dispositivo para cobrar y activar el servicio.
                    </p>
                    <button
                        onClick={handleSignAuthorize}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#10B981',
                            color: '#fff',
                            borderRadius: '14px',
                            fontWeight: 700,
                            fontSize: '13px',
                            fontFamily: FONT_BODY,
                            letterSpacing: '0.02em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            outline: 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <DollarSign size={14} /> COBRAR Y CAPTAR VENTA
                    </button>
                </div>
            )}

            {/* FULL SCREEN 3D VIEWPORT CANVAS */}
            <div style={{
                flex: 1,
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box'
            }}>
                {/* Floating radial glow backgrounds responsive to active goal */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: selectedGoal === 'LEAD'
                        ? 'radial-gradient(circle at 50% 50%, rgba(66, 133, 244, 0.08) 0%, rgba(3, 4, 7, 1) 75%)'
                        : selectedGoal === 'FINANCE'
                        ? 'radial-gradient(circle at 50% 50%, rgba(255, 61, 0, 0.06) 0%, rgba(3, 4, 7, 1) 75%)'
                        : selectedGoal === 'MARKETING'
                        ? 'radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.08) 0%, rgba(3, 4, 7, 1) 75%)'
                        : 'radial-gradient(circle at 50% 50%, rgba(112, 0, 255, 0.06) 0%, rgba(3, 4, 7, 1) 75%)',
                    transition: 'background 1.2s ease',
                    zIndex: 0
                }} />

                {/* 3D viewport canvas */}
                <Canvas
                    gl={{ antialias: true }}
                    dpr={[1, 2]}
                    camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 500 }}
                    style={{ zIndex: 1 }}
                >
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[2, 8, 4]} intensity={2.5} />

                    <CameraManager phase={phase} currentStep={currentStep} activeGoal={activeGoal} />

                    {/* Constelación de partículas dinámicas del enjambre */}
                    <SwarmParticles 
                        color={selectedGoal === 'LEAD' ? '#4285F4' : selectedGoal === 'FINANCE' ? '#10B981' : selectedGoal === 'MARKETING' ? '#FF8A00' : '#7000ff'} 
                        speed={swarmSpeed} 
                    />

                    {/* --- 3D AGENT CARDS --- */}
                    {/* ALMA - Orchestrator */}
                    {/* ALMA - Orchestrator */}
                    <AgentCard3D
                        position={POS_ALMA}
                        title={currentAgentConfig?.orchestrator.title || "Orquestador ALMA"}
                        role={currentAgentConfig?.orchestrator.role || "Orquestador Cognitivo"}
                        thought={agentThoughts.orchestrator}
                        active={isOrchestratorActive}
                        color={currentAgentConfig?.orchestrator.color || "#4285F4"}
                        load={isOrchestratorActive ? 95 : 0}
                        icon={currentAgentConfig?.orchestrator.icon}
                        visible={phase !== 'IDLE'}
                        statusText={agentStatuses.orchestrator}
                        narrativeTitle={isOrchestratorActive ? currentStepNarrative?.title : undefined}
                        narrativeDesc={isOrchestratorActive ? currentStepNarrative?.desc : undefined}
                        narrativeValue={isOrchestratorActive ? currentStepNarrative?.businessValue : undefined}
                    />

                    {/* Agent Researcher */}
                    <AgentCard3D
                        position={POS_INVESTIGADOR}
                        title={currentAgentConfig?.researcher.title || "Asistente de Búsqueda"}
                        role={currentAgentConfig?.researcher.role || "Investigador de Datos"}
                        thought={agentThoughts.researcher}
                        active={isResearcherActive}
                        color={currentAgentConfig?.researcher.color || "#00F3FF"}
                        load={isResearcherActive ? 90 : 0}
                        icon={currentAgentConfig?.researcher.icon}
                        visible={phase !== 'IDLE' && phase !== 'INGRESS'}
                        statusText={agentStatuses.researcher}
                        narrativeTitle={isResearcherActive ? currentStepNarrative?.title : undefined}
                        narrativeDesc={isResearcherActive ? currentStepNarrative?.desc : undefined}
                        narrativeValue={isResearcherActive ? currentStepNarrative?.businessValue : undefined}
                    />

                    {/* Agent Analyst */}
                    <AgentCard3D
                        position={POS_ANALISTA}
                        title={currentAgentConfig?.analyst.title || "Asistente de Ventas"}
                        role={currentAgentConfig?.analyst.role || "Redactor de Propuestas"}
                        thought={agentThoughts.analyst}
                        active={isAnalystActive}
                        color={currentAgentConfig?.analyst.color || "#9B51E0"}
                        load={isAnalystActive ? 85 : 0}
                        icon={currentAgentConfig?.analyst.icon}
                        visible={phase !== 'IDLE' && phase !== 'INGRESS' && (activeGoal || selectedGoal) !== 'FINANCE'}
                        statusText={agentStatuses.analyst}
                        narrativeTitle={isAnalystActive ? currentStepNarrative?.title : undefined}
                        narrativeDesc={isAnalystActive ? currentStepNarrative?.desc : undefined}
                        narrativeValue={isAnalystActive ? currentStepNarrative?.businessValue : undefined}
                    />

                    {/* Agent Validator */}
                    <AgentCard3D
                        position={POS_VALIDADOR}
                        title={currentAgentConfig?.validator.title || "Asistente Supervisor"}
                        role={currentAgentConfig?.validator.role || "Validador de Calidad"}
                        thought={agentThoughts.validator}
                        active={isValidatorActive}
                        color={currentAgentConfig?.validator.color || "#FF3D00"}
                        load={isValidatorActive ? (waitingForSignature ? 100 : 85) : 0}
                        icon={currentAgentConfig?.validator.icon}
                        visible={phase !== 'IDLE' && phase !== 'INGRESS' && phase !== 'ORQUESTACION' && (activeGoal || selectedGoal) !== 'LEAD'}
                        statusText={agentStatuses.validator}
                        narrativeTitle={isValidatorActive ? currentStepNarrative?.title : undefined}
                        narrativeDesc={isValidatorActive ? currentStepNarrative?.desc : undefined}
                        narrativeValue={isValidatorActive ? currentStepNarrative?.businessValue : undefined}
                    />

                    {/* Agent Executor */}
                    <AgentCard3D
                        position={POS_EJECUTOR}
                        title={currentAgentConfig?.executor.title || "Asistente de Envíos"}
                        role={currentAgentConfig?.executor.role || "Ejecutor de Procesos"}
                        thought={agentThoughts.executor}
                        active={isExecutorActive}
                        color={currentAgentConfig?.executor.color || "#FF8A00"}
                        load={isExecutorActive ? 95 : 0}
                        icon={currentAgentConfig?.executor.icon}
                        visible={phase !== 'IDLE' && phase !== 'INGRESS' && phase !== 'ORQUESTACION' && (activeGoal || selectedGoal) !== 'LEAD'}
                        statusText={agentStatuses.executor}
                        narrativeTitle={isExecutorActive ? currentStepNarrative?.title : undefined}
                        narrativeDesc={isExecutorActive ? currentStepNarrative?.desc : undefined}
                        narrativeValue={isExecutorActive ? currentStepNarrative?.businessValue : undefined}
                    />

                    {/* --- 3D INTER-AGENT LOGICAL CONNECTIONS --- */}
                    {activeGoal === 'LEAD' && (
                        <group>
                            {/* Step 1: Orchestrator -> Investigator */}
                            <ConnectionLine start={POS_ALMA} end={POS_INVESTIGADOR} active={phase === 'ORQUESTACION'} color={currentAgentConfig?.orchestrator.color || "#4285F4"} />
                            {/* Step 2: Investigator <-> Analyst (Bucle cerrado de calificación) */}
                            <ConnectionLine 
                                start={POS_INVESTIGADOR} 
                                end={POS_ANALISTA} 
                                active={phase === 'SWARM_RUNNING' && currentStep === 2 && loopActive === 'researcher'} 
                                color={currentAgentConfig?.researcher.color || "#00F3FF"} 
                                speed={1.3} 
                            />
                            <ConnectionLine 
                                start={POS_ANALISTA} 
                                end={POS_INVESTIGADOR} 
                                active={phase === 'SWARM_RUNNING' && currentStep === 2 && loopActive === 'analyst'} 
                                color={currentAgentConfig?.analyst.color || "#9B51E0"} 
                                speed={1.3} 
                            />
                            {/* Step 3: Analyst -> Orchestrator (Feedback to Orquestador since Validator/Executor are hidden!) */}
                            <ConnectionLine start={POS_ANALISTA} end={POS_ALMA} active={phase === 'SWARM_RUNNING' && currentStep === 3} color={currentAgentConfig?.analyst.color || "#9B51E0"} />
                        </group>
                    )}

                    {activeGoal === 'FINANCE' && (
                        <group>
                            {/* Step 1: Orchestrator -> Investigator */}
                            <ConnectionLine start={POS_ALMA} end={POS_INVESTIGADOR} active={phase === 'ORQUESTACION' || (phase === 'SWARM_RUNNING' && currentStep === 2)} color={currentAgentConfig?.orchestrator.color || "#4285F4"} />
                            {/* Step 2: Investigator -> Validator (Direct bypass of Analyst!) */}
                            <ConnectionLine start={POS_INVESTIGADOR} end={POS_VALIDADOR} active={phase === 'SWARM_RUNNING' && currentStep === 2} color={currentAgentConfig?.researcher.color || "#00F3FF"} speed={2.5} />
                            {/* Step 3: Interceptor Lock Active */}
                            <ConnectionLine start={POS_INVESTIGADOR} end={POS_VALIDADOR} active={phase === 'SECURITY_ALERT' || (phase === 'SWARM_RUNNING' && currentStep === 3)} color={currentAgentConfig?.validator.color || "#FF3D00"} />
                            {/* Step 4: Validator -> Executor */}
                            <ConnectionLine start={POS_VALIDADOR} end={POS_EJECUTOR} active={phase === 'COMPLETED'} color={currentAgentConfig?.validator.color || "#FF3D00"} />
                        </group>
                    )}

                    {activeGoal === 'MARKETING' && (
                        <group>
                            {/* Step 1: Orchestrator -> Investigator & Analyst in parallel */}
                            <ConnectionLine start={POS_ALMA} end={POS_INVESTIGADOR} active={phase === 'ORQUESTACION' || (phase === 'SWARM_RUNNING' && currentStep === 2)} color={currentAgentConfig?.orchestrator.color || "#4285F4"} />
                            <ConnectionLine start={POS_ALMA} end={POS_ANALISTA} active={phase === 'ORQUESTACION' || (phase === 'SWARM_RUNNING' && currentStep === 2)} color={currentAgentConfig?.orchestrator.color || "#4285F4"} />
                            {/* Step 2: Investigator -> Analyst */}
                            <ConnectionLine start={POS_INVESTIGADOR} end={POS_ANALISTA} active={phase === 'SWARM_RUNNING' && currentStep === 2} color={currentAgentConfig?.researcher.color || "#00F3FF"} />
                            {/* Step 3: Analyst -> Validator */}
                            <ConnectionLine start={POS_ANALISTA} end={POS_VALIDADOR} active={phase === 'SWARM_RUNNING' && currentStep === 3} color={currentAgentConfig?.analyst.color || "#9B51E0"} />
                            {/* Step 4: Validator -> Executor */}
                            <ConnectionLine start={POS_VALIDADOR} end={POS_EJECUTOR} active={phase === 'COMPLETED'} color={currentAgentConfig?.validator.color || "#FF3D00"} />
                        </group>
                    )}
                </Canvas>

                {/* Cyber HUD Overlays */}
                <div style={{
                    position: 'absolute',
                    top: '32px',
                    right: '32px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.3)',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 2,
                    pointerEvents: 'none'
                }}>
                    <div>SIMULADOR: <span style={{ color: '#00f3ff', fontWeight: 700 }}>ACTIVO</span></div>
                    <div>RESOLUCIÓN: REAL-TIME 3D</div>
                    <div>ZOOM-STAGE: {phase}</div>
                </div>

                {/* FLOATING HUD: VERIFICADOR DE IMPACTO Y VALOR COMERCIAL */}
                {activeGoal && (
                    <div style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '24px',
                        right: '24px',
                        backgroundColor: 'rgba(7, 9, 14, 0.85)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '14px 20px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        zIndex: 2,
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.02)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                            <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>TELEMETRÍA EN TIEMPO REAL</span>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', fontFamily: FONT_HEADING }}>Valor Comercial</span>
                        </div>

                        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                        <div className="hud-scrollable-container" style={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            gap: '12px', 
                            flex: 1, 
                            justifyContent: 'flex-start', 
                            overflowX: 'auto', 
                            paddingBottom: '2px' 
                        }}>
                            {getCommercialMetrics(activeGoal || selectedGoal, phase, currentStep, waitingForSignature).map((metric, index) => {
                                let statusColor = '#4a5568';
                                let bgPulse = 'rgba(255,255,255,0.01)';
                                let isPulsing = false;
                                
                                if (metric.status === 'running') {
                                    statusColor = selectedGoal === 'LEAD' ? '#4285F4' : selectedGoal === 'FINANCE' ? '#10B981' : '#FF8A00';
                                    bgPulse = `${statusColor}10`;
                                    isPulsing = true;
                                } else if (metric.status === 'success') {
                                    statusColor = '#10B981';
                                } else if (metric.status === 'alert') {
                                    statusColor = selectedGoal === 'FINANCE' ? '#10B981' : '#EF4444';
                                    bgPulse = selectedGoal === 'FINANCE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
                                    isPulsing = true;
                                }

                                return (
                                    <div 
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            padding: '8px 12px',
                                            borderRadius: '10px',
                                            backgroundColor: isPulsing ? bgPulse : 'rgba(255,255,255,0.02)',
                                            border: `1px solid ${isPulsing ? statusColor : 'rgba(255,255,255,0.04)'}`,
                                            minWidth: '155px',
                                            maxWidth: '220px',
                                            opacity: metric.status === 'pending' ? 0.35 : 1,
                                            transition: 'all 0.3s ease',
                                            flexShrink: 0
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT_BODY }}>
                                                {metric.label}
                                            </span>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor, fontFamily: 'var(--font-mono)' }}>
                                                {metric.value === 'Espera...' ? 'ESPERA' : metric.value === 'Extrayendo datos...' ? 'CARGANDO' : metric.value === 'Analizando redactado...' ? 'AUDITANDO' : metric.value}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.25', fontFamily: FONT_BODY }}>
                                            {metric.benefit}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

                        <div style={{ 
                            fontSize: '9px', 
                            fontFamily: 'var(--font-mono)', 
                            color: 'rgba(255, 255, 255, 0.25)', 
                            flexShrink: 0,
                            letterSpacing: '0.06em',
                            textAlign: 'right'
                        }}>
                            © agencIA LAB :: SISTEMA COGNITIVO
                        </div>
                    </div>
                )}
            </div>

            {/* Global animations style injections */}
            <style>{`
                @keyframes pulseGlow {
                    from {
                        box-shadow: 0 0 20px rgba(255, 61, 0, 0.15);
                        border-color: rgba(255, 61, 0, 0.25);
                    }
                    to {
                        box-shadow: 0 0 35px rgba(255, 61, 0, 0.35);
                        border-color: rgba(255, 61, 0, 0.55);
                    }
                }
                @keyframes pulseGreenGlow {
                    from {
                        box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 20px rgba(16, 185, 129, 0.15);
                        border-color: rgba(16, 185, 129, 0.25);
                    }
                    to {
                        box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 35px rgba(16, 185, 129, 0.35);
                        border-color: rgba(16, 185, 129, 0.55);
                    }
                }
                @keyframes pulseRedBorder {
                    from {
                        border-color: rgba(255, 61, 0, 0.35);
                        box-shadow: inset 0 0 80px rgba(255, 61, 0, 0.25);
                    }
                    to {
                        border-color: rgba(255, 61, 0, 0.8);
                        box-shadow: inset 0 0 140px rgba(255, 61, 0, 0.6);
                    }
                }
                @keyframes pulseGreenBorder {
                    from {
                        border-color: rgba(16, 185, 129, 0.25);
                        box-shadow: inset 0 0 80px rgba(16, 185, 129, 0.25);
                    }
                    to {
                        border-color: rgba(16, 185, 129, 0.7);
                        box-shadow: inset 0 0 140px rgba(16, 185, 129, 0.55);
                    }
                }
                @keyframes pulseGlowSpeed {
                    from {
                        opacity: 0.35;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 15px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }
                @keyframes fadeInUpCenter {
                    from {
                        opacity: 0;
                        transform: translate(-50%, calc(-50% + 20px));
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
                @keyframes fadeInUpBottomCenter {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 15px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }

                /* Custom Premium Scrollbar for Left Sidebar */
                .sidebar-scrollable-container::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-scrollable-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-scrollable-container::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                }
                .sidebar-scrollable-container::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.18);
                }

                /* Hide scrollbar for HUD telemetry cards container but allow horizontal scroll */
                .hud-scrollable-container::-webkit-scrollbar {
                    display: none;
                }
                .hud-scrollable-container {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default Playground;
