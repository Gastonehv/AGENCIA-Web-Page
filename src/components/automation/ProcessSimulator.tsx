import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    RefreshCw,
    Check,
    DollarSign,
    ExternalLink,
    Mail,
    Globe,
    Database,
    Terminal
} from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const FONT_BODY = "var(--font-body)";
const FONT_HEADING = "var(--font-heading)";

// ─── TYPEWRITER COMPONENT ─────────────────────────────────────────────────────
const Typewriter: React.FC<{ text: string; speed?: number }> = ({ text, speed = 10 }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let i = 0;
        setDisplayedText('');
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, speed]);

    return <span>{displayedText}</span>;
};

// ─── COMMERCIAL METRICS ───────────────────────────────────────────────────────
interface MetricUI { 
    label: string; 
    value: string; 
    benefit: string; 
    status: 'pending' | 'running' | 'success' | 'alert'; 
}

const getCommercialMetrics = (goal: 'LEAD' | 'FINANCE' | 'MARKETING', phase: string, currentStep: number, waitingForSignature: boolean): MetricUI[] => {
    if (goal === 'LEAD') {
        return [
            { label: 'Búsqueda de Prospecto', value: currentStep >= 2 ? 'Acme Corp (450 empl.)' : currentStep === 1 ? 'Buscando...' : 'Espera...', benefit: 'Identifica sector y tamaño sin investigación manual.', status: currentStep >= 2 ? 'success' : currentStep === 1 ? 'running' : 'pending' },
            { label: 'Calificación de Oportunidad', value: currentStep >= 2 ? 'Fit Score: A+ (Alto)' : 'Espera...', benefit: 'Filtra y prioriza leads listos para comprar.', status: currentStep >= 2 ? 'success' : 'pending' },
            { label: 'Auditoría GDPR & Privacidad', value: currentStep >= 3 ? '100% Cumplimiento' : currentStep === 2 ? 'Analizando...' : 'Espera...', benefit: 'Protege tu reputación y cumple normativas.', status: currentStep >= 3 ? 'success' : currentStep === 2 ? 'running' : 'pending' },
            { label: 'Sincronización CRM & Email', value: currentStep >= 4 ? 'Listo en Outbox + CRM' : currentStep === 3 ? 'Preparando...' : 'Espera...', benefit: 'Inserta info en tu embudo para cerrar más rápido.', status: currentStep >= 4 ? 'success' : currentStep === 3 ? 'running' : 'pending' }
        ];
    } else if (goal === 'FINANCE') {
        const isAlert = phase === 'SECURITY_ALERT' || waitingForSignature;
        return [
            { label: 'Monitoreo de Intención', value: currentStep >= 1 ? 'Pricing Visited' : 'Espera...', benefit: 'Identifica prospectos con alta intención de compra.', status: currentStep >= 1 ? 'success' : 'pending' },
            { label: 'Enriquecimiento de Perfil', value: currentStep >= 2 ? 'Cuenta Calificada B2B' : 'Espera...', benefit: 'Analiza el tamaño de la oportunidad en tiempo real.', status: currentStep >= 2 ? 'success' : 'pending' },
            { label: 'Propuesta Comercial', value: currentStep >= 3 ? '$15,000 USD Generada' : 'Espera...', benefit: 'Redacta propuestas dinámicas alineadas al cliente.', status: currentStep >= 3 ? 'success' : 'pending' },
            { label: 'Cierre Comercial (HIL)', value: currentStep >= 4 ? 'Contrato Firmado' : isAlert ? 'Pendiente Firma' : 'Espera...', benefit: 'Valida la transacción de cierre al instante.', status: currentStep >= 4 ? 'success' : isAlert ? 'alert' : 'pending' }
        ];
    } else {
        return [
            { label: 'Estudio de Competencia', value: currentStep >= 2 ? 'Keyword B2B Encontrada' : currentStep === 1 ? 'Buscando Trends...' : 'Espera...', benefit: 'Encuentra tendencias de tu competencia al instante.', status: currentStep >= 2 ? 'success' : currentStep === 1 ? 'running' : 'pending' },
            { label: 'Copies Persuasivos', value: currentStep >= 2 ? '3 Variantes Optimizadas' : 'Espera...', benefit: 'Genera copys orientados a la conversión.', status: currentStep >= 2 ? 'success' : 'pending' },
            { label: 'Simulación de ROI', value: currentStep >= 3 ? 'ROI: 3.1x Estimado' : 'Espera...', benefit: 'Calcula predictivamente el coste por lead.', status: currentStep >= 3 ? 'success' : 'pending' },
            { label: 'Filtro Ad-Policies', value: currentStep >= 4 ? 'Aprobado sin Riesgo' : currentStep === 3 ? 'Analizando...' : 'Espera...', benefit: 'Evita penalizaciones automáticas de Meta Ads.', status: currentStep >= 4 ? 'success' : currentStep === 3 ? 'running' : 'pending' }
        ];
    }
};

// ─── CHAT LOG TEMPLATES ───────────────────────────────────────────────────────
const CHAT_LOGS: Record<string, Record<number, { sender: string; color: string; text: string; }[]>> = {
    LEAD: {
        0: [{ sender: 'Orquestador', color: '#4285F4', text: '¡Alerta! Un cliente interesado ha dejado su contacto: jperez@acme.com' }],
        1: [{ sender: 'Orquestador', color: '#4285F4', text: 'Iniciando plan de atención personalizado...' }, { sender: 'Orquestador', color: '#4285F4', text: 'Asignando tareas: [1] Investigar empresa, [2] Evaluar interés, [3] Revisar redacción.' }],
        2: [{ sender: 'Investigador', color: '#00F3FF', text: 'Buscando datos de jperez@acme.com...' }, { sender: 'Investigador', color: '#00F3FF', text: 'Resultado: Juan Pérez es Director de Operaciones en Acme Corp.' }, { sender: 'Analista', color: '#9B51E0', text: 'Falta dato clave: ¿tamaño y sector de Acme Corp?' }, { sender: 'Investigador', color: '#00F3FF', text: '¡Encontrado! Acme Corp tiene 450 empleados. Sector: Logística B2B.' }, { sender: 'Analista', color: '#9B51E0', text: 'Datos completos. Prospecto de alto valor.' }],
        3: [{ sender: 'Analista', color: '#9B51E0', text: 'Redactando propuesta enfocada en optimización logística...' }, { sender: 'Validador', color: '#FF3D00', text: 'Revisando propuesta. Tono profesional, sin errores.' }, { sender: 'Validador', color: '#FF3D00', text: 'Verificando lineamientos de privacidad corporativos. Aprobado.' }],
        4: [{ sender: 'Ejecutor', color: '#FF8A00', text: 'Sincronizando datos del prospecto en la base de datos...' }, { sender: 'Ejecutor', color: '#FF8A00', text: 'Ficha de Acme Corp creada en CRM.' }, { sender: 'Orquestador', color: '#4285F4', text: '¡Flujo completado! Propuesta lista para envío inmediato.' }]
    },
    FINANCE: {
        0: [{ sender: 'Orquestador', color: '#4285F4', text: 'Iniciando ciclo de monitoreo comercial. Escaneando visitas de alta intención.' }],
        1: [{ sender: 'Orquestador', color: '#4285F4', text: 'Oportunidad detectada. Comportamiento del lead indica alto interés en plan corporativo.' }],
        2: [{ sender: 'Investigador', color: '#00F3FF', text: 'Enriqueciendo datos: Lead es Director Comercial en constructora con 200 empleados.' }, { sender: 'Analista', color: '#9B51E0', text: 'Generando propuesta a la medida por un valor de $15,000 USD.' }],
        3: [{ sender: 'Validador', color: '#10B981', text: 'Cierre comercial en pausa para aprobación final (HIL).' }, { sender: 'Orquestador', color: '#4285F4', text: 'Esperando confirmación del director para procesar cobro de $15,000 USD...' }],
        4: [{ sender: 'Validador', color: '#10B981', text: 'Aprobación recibida. Propuesta enviada y aceptada.' }, { sender: 'Ejecutor', color: '#FF8A00', text: 'Procesando cobro de la primera mensualidad de forma segura.' }, { sender: 'Orquestador', color: '#4285F4', text: '¡Nueva venta de $15,000 USD captada! Operación cerrada en piloto automático.' }]
    },
    MARKETING: {
        0: [{ sender: 'Orquestador', color: '#4285F4', text: 'Recopilando métricas y CTRs de campañas activas.' }],
        1: [{ sender: 'Orquestador', color: '#4285F4', text: 'Estrategia definida: Lanzar campaña para captar prospectos maximizando CTR.' }],
        2: [{ sender: 'Investigador', color: '#00F3FF', text: 'Analizando tendencias de anuncios de la competencia...' }, { sender: 'Investigador', color: '#00F3FF', text: 'Tendencia: "automatización de tareas diarias".' }, { sender: 'Analista', color: '#9B51E0', text: 'Escribiendo 3 variantes de textos persuasivos...' }],
        3: [{ sender: 'Analista', color: '#9B51E0', text: 'ROI predictivo estimado: 3.1x.' }, { sender: 'Validador', color: '#FF3D00', text: 'Validando políticas de privacidad y uso de marca. OK.' }],
        4: [{ sender: 'Ejecutor', color: '#FF8A00', text: 'Enviando paquete de anuncios a la API de publicidad...' }, { sender: 'Orquestador', color: '#4285F4', text: '¡Campaña publicada! Sistema en fase de monitoreo de ROI.' }]
    }
};

/*
const STEP_DETAILS: Record<string, Record<number, { title: string; desc: string; agentName: string; businessValue: string; }>> = {
    LEAD: {
        0: { title: 'Cliente Interesado', desc: 'Un nuevo prospecto ingresa sus datos en tu sitio web.', agentName: 'Lector de Formularios', businessValue: 'Detecta al interesado al instante para responderle sin hacerlo esperar.' },
        1: { title: 'Plan de Respuesta', desc: 'El Orquestador analiza el mensaje y organiza al equipo digital.', agentName: 'Orquestador Cognitivo', businessValue: 'Determina en segundos qué especialistas deben atender la solicitud.' },
        2: { title: 'Investigación Autónoma', desc: 'Los asistentes buscan en internet datos clave de la empresa del cliente.', agentName: 'Asistentes de Búsqueda', businessValue: 'Encuentra información del cliente de forma automática para personalizar tu oferta.' },
        3: { title: 'Control de Calidad', desc: 'El supervisor revisa la propuesta para garantizar un tono impecable.', agentName: 'Asistente Supervisor', businessValue: 'Evita errores de redacción y asegura el cumplimiento de normas de privacidad.' },
        4: { title: 'Propuesta Enviada', desc: 'El Asistente guarda todo en el CRM y le envía el correo personalizado al cliente.', agentName: 'Asistente de Envíos', businessValue: 'Sincroniza tu base de datos y envía la propuesta al instante.' }
    },
    FINANCE: {
        0: { title: 'Detección de Oportunidad', desc: 'El sistema detecta a un tomador de decisiones clave investigando en tu web.', agentName: 'Lector de Intención', businessValue: 'Identifica clientes de alto valor en el momento de intención de compra.' },
        1: { title: 'Enriquecimiento de Cuenta', desc: 'Los módulos investigan el perfil comercial y estiman el presupuesto disponible.', agentName: 'Perfilador Comercial', businessValue: 'Conoce el tamaño de la oportunidad antes de enviar una propuesta.' },
        2: { title: 'Propuesta y Negociación', desc: 'El asistente redacta y envía una propuesta a la medida del cliente.', agentName: 'Negociador de Propuestas', businessValue: 'Presenta ofertas automatizadas que aumentan el ratio de conversión.' },
        3: { title: 'Cierre de Venta (HIL)', desc: 'El cliente aceptó la propuesta de $15,000 USD. Confirma para procesar el cobro.', agentName: 'Filtro de Aprobación', businessValue: 'Aprueba transacciones y contratos con un solo clic.' },
        4: { title: 'Venta Completada', desc: '¡Ingreso registrado! El sistema emite la factura y notifica a tu equipo.', agentName: 'Ejecutor de Ingresos', businessValue: 'Genera flujo de caja y arranca la entrega del servicio en piloto automático.' }
    },
    MARKETING: {
        0: { title: 'Estudio de Mercado', desc: 'Los asistentes analizan el rendimiento histórico de tus anuncios.', agentName: 'Asistente de Mercado', businessValue: 'Identifica qué mensajes atraen más ventas.' },
        1: { title: 'Plan de Campaña', desc: 'El Orquestador organiza la estrategia y define el presupuesto diario.', agentName: 'Orquestador Cognitivo', businessValue: 'Controla la inversión publicitaria para exprimir cada centavo.' },
        2: { title: 'Diseño y Redacción', desc: 'Los asistentes creativos generan variaciones de anuncios llamativos.', agentName: 'Asistentes Creativos', businessValue: 'Crea textos publicitarios orientados a la conversión en tiempo récord.' },
        3: { title: 'Verificación de Anuncios', desc: 'El supervisor valida que los anuncios cumplan normativas de redes sociales.', agentName: 'Asistente Supervisor', businessValue: 'Evita que bloqueen tu cuenta publicitaria por error.' },
        4: { title: 'Anuncios en Marcha', desc: 'El Ejecutor publica la campaña y activa el panel de medición en vivo.', agentName: 'Asistente de Envíos', businessValue: 'Activa tus anuncios y muestra el retorno de inversión de inmediato.' }
    }
};
*/

interface ProcessSimulatorProps {
    hideHeader?: boolean;
    onNavigateBack?: () => void;
    autoStart?: 'LEAD' | 'FINANCE' | 'MARKETING';
    onGoalChange?: (goal: 'LEAD' | 'FINANCE' | 'MARKETING' | null) => void;
    onPhaseChange?: (phase: string, step: number) => void;
    forceMobile?: boolean;
}

const ProcessSimulator: React.FC<ProcessSimulatorProps> = ({
    hideHeader: _hideHeader = false,
    onNavigateBack,
    autoStart,
    onGoalChange,
    onPhaseChange,
    forceMobile: _forceMobile
}) => {
    const { playClick, playWhoosh } = useSound();
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 900);
        check();
        window.addEventListener('resize', check);
        const t = window.setTimeout(() => setIsLoading(false), 800);
        return () => { window.removeEventListener('resize', check); clearTimeout(t); };
    }, []);

    // ── State ──
    const [phase, setPhase] = useState<'IDLE' | 'INGRESS' | 'ORQUESTACION' | 'SWARM_RUNNING' | 'SECURITY_ALERT' | 'COMPLETED'>('IDLE');
    const [activeGoal, setActiveGoal] = useState<'LEAD' | 'FINANCE' | 'MARKETING' | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<'LEAD' | 'FINANCE' | 'MARKETING'>('LEAD');
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [waitingForSignature, setWaitingForSignature] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ sender: string; color: string; text: string; timestamp: string; }[]>([]);
    const [loopActive, setLoopActive] = useState<'none' | 'researcher' | 'analyst'>('none');
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [simSubStep, setSimSubStep] = useState<number>(-1);
    const activeTimeoutsRef = useRef<number[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [chatMessages]);

    // Init chat
    useEffect(() => {
        setChatMessages([{ sender: 'Sistema', color: '#718096', text: 'Centro de Misión listo. Elige un flujo comercial para iniciar la orquestación de agentes.', timestamp: '--:--:--' }]);
    }, []);

    useEffect(() => { return () => { activeTimeoutsRef.current.forEach(clearTimeout); }; }, []);

    const getTimestamp = () => new Date().toTimeString().split(' ')[0];

    // Listeners for external components
    useEffect(() => { onGoalChange?.(activeGoal); }, [activeGoal, onGoalChange]);
    useEffect(() => { onPhaseChange?.(phase, currentStep); }, [phase, currentStep, onPhaseChange]);

    // Auto-start
    useEffect(() => {
        if (autoStart && phase === 'IDLE' && !isLoading) {
            const t = window.setTimeout(() => runSimulation(autoStart), 800);
            return () => clearTimeout(t);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const clearAllTimeouts = () => { activeTimeoutsRef.current.forEach(clearTimeout); activeTimeoutsRef.current = []; };

    interface SimStep {
        phase?: 'IDLE' | 'INGRESS' | 'ORQUESTACION' | 'SWARM_RUNNING' | 'SECURITY_ALERT' | 'COMPLETED';
        currentStep?: number;
        loopActive?: 'none' | 'researcher' | 'analyst';
        waitingForSignature?: boolean;
        chatMsgs?: { sender: string; color: string; text: string; }[];
        duration: number;
    }

    const leadSteps = useMemo<SimStep[]>(() => [
        { phase: 'INGRESS', currentStep: 0, loopActive: 'none', duration: 4000, chatMsgs: CHAT_LOGS['LEAD']?.[0] || [] },
        { phase: 'ORQUESTACION', currentStep: 1, loopActive: 'none', duration: 4500, chatMsgs: CHAT_LOGS['LEAD']?.[1] || [] },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'researcher', duration: 3000, chatMsgs: CHAT_LOGS['LEAD']?.[2] || [] },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'analyst', duration: 2500 },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'researcher', duration: 2500 },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'analyst', duration: 3000 },
        { phase: 'SWARM_RUNNING', currentStep: 3, loopActive: 'none', duration: 5000, chatMsgs: CHAT_LOGS['LEAD']?.[3] || [] },
        { phase: 'COMPLETED', currentStep: 4, loopActive: 'none', duration: 0, chatMsgs: CHAT_LOGS['LEAD']?.[4] || [] }
    ], []);

    const financeSteps = useMemo<SimStep[]>(() => [
        { phase: 'INGRESS', currentStep: 0, loopActive: 'none', duration: 4000, chatMsgs: CHAT_LOGS['FINANCE']?.[0] || [] },
        { phase: 'ORQUESTACION', currentStep: 1, loopActive: 'none', duration: 4500, chatMsgs: CHAT_LOGS['FINANCE']?.[1] || [] },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'none', duration: 5000, chatMsgs: CHAT_LOGS['FINANCE']?.[2] || [] },
        { phase: 'SECURITY_ALERT', currentStep: 3, loopActive: 'none', waitingForSignature: true, duration: 999999, chatMsgs: CHAT_LOGS['FINANCE']?.[3] || [] },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'none', duration: 2500, chatMsgs: [{ sender: 'Validador', color: '#10B981', text: 'Firma electrónica del Director autorizada y registrada en Blockchain.' }] },
        { phase: 'SWARM_RUNNING', currentStep: 3, loopActive: 'none', duration: 3000, chatMsgs: [{ sender: 'Ejecutor', color: '#FF8A00', text: 'Emitiendo factura INV-2026-9041 y despachando al cliente.' }] },
        { phase: 'COMPLETED', currentStep: 4, loopActive: 'none', duration: 0, chatMsgs: CHAT_LOGS['FINANCE']?.[4] || [] }
    ], []);

    const marketingSteps = useMemo<SimStep[]>(() => [
        { phase: 'INGRESS', currentStep: 0, loopActive: 'none', duration: 4000, chatMsgs: CHAT_LOGS['MARKETING']?.[0] || [] },
        { phase: 'ORQUESTACION', currentStep: 1, loopActive: 'none', duration: 4500, chatMsgs: CHAT_LOGS['MARKETING']?.[1] || [] },
        { phase: 'SWARM_RUNNING', currentStep: 2, loopActive: 'none', duration: 5500, chatMsgs: CHAT_LOGS['MARKETING']?.[2] || [] },
        { phase: 'SWARM_RUNNING', currentStep: 3, loopActive: 'none', duration: 5000, chatMsgs: CHAT_LOGS['MARKETING']?.[3] || [] },
        { phase: 'COMPLETED', currentStep: 4, loopActive: 'none', duration: 0, chatMsgs: CHAT_LOGS['MARKETING']?.[4] || [] }
    ], []);

    const executeStep = (goal: 'LEAD' | 'FINANCE' | 'MARKETING', stepIdx: number) => {
        clearAllTimeouts();
        setSimSubStep(stepIdx);
        const steps = goal === 'LEAD' ? leadSteps : goal === 'FINANCE' ? financeSteps : marketingSteps;
        if (stepIdx < 0 || stepIdx >= steps.length) return;
        const cfg = steps[stepIdx];
        if (cfg.phase) setPhase(cfg.phase);
        if (cfg.currentStep !== undefined) setCurrentStep(cfg.currentStep);
        if (cfg.loopActive !== undefined) setLoopActive(cfg.loopActive);
        if (cfg.waitingForSignature !== undefined) setWaitingForSignature(cfg.waitingForSignature);
        
        if (cfg.phase === 'INGRESS' || cfg.phase === 'SWARM_RUNNING' || cfg.phase === 'SECURITY_ALERT') {
            playWhoosh();
        } else {
            playClick();
        }

        if (cfg.chatMsgs) {
            const time = getTimestamp();
            const msgs = cfg.chatMsgs.map(m => ({ ...m, timestamp: time }));
            if (stepIdx === 0) setChatMessages(msgs); else setChatMessages(prev => [...prev, ...msgs]);
        }
        if (!isPaused && cfg.duration > 0 && !cfg.waitingForSignature) {
            const tId = window.setTimeout(() => executeStep(goal, stepIdx + 1), cfg.duration);
            activeTimeoutsRef.current.push(tId);
        }
    };

    const runSimulation = (goal: 'LEAD' | 'FINANCE' | 'MARKETING') => {
        if (phase !== 'IDLE' && phase !== 'COMPLETED') return;
        playClick();
        setActiveGoal(goal); 
        setSelectedGoal(goal); 
        setWaitingForSignature(false);
        setLoopActive('none'); 
        setIsPaused(false); 
        setSimSubStep(0);
        executeStep(goal, 0);
    };

    const handleReset = () => {
        playClick(); 
        clearAllTimeouts();
        setPhase('IDLE'); 
        setActiveGoal(null); 
        setCurrentStep(0);
        setWaitingForSignature(false); 
        setLoopActive('none');
        setIsPaused(false); 
        setSimSubStep(-1);
        setChatMessages([{ sender: 'Sistema', color: '#718096', text: 'Centro de Misión reiniciado. Listo para nueva asignación.', timestamp: '--:--:--' }]);
    };

    const togglePause = () => {
        if (phase === 'IDLE' || phase === 'COMPLETED') return;
        playClick();
        const goal = activeGoal || selectedGoal;
        if (isPaused) {
            setIsPaused(false);
            const steps = goal === 'LEAD' ? leadSteps : goal === 'FINANCE' ? financeSteps : marketingSteps;
            const cfg = steps[simSubStep];
            if (cfg && !cfg.waitingForSignature && simSubStep + 1 < steps.length) {
                executeStep(goal, simSubStep + 1);
            }
        } else { 
            setIsPaused(true); 
            clearAllTimeouts(); 
        }
    };

    const handleNextStep = () => {
        const goal = activeGoal || selectedGoal;
        if (!goal) return;
        playClick();
        const steps = goal === 'LEAD' ? leadSteps : goal === 'FINANCE' ? financeSteps : marketingSteps;
        if (simSubStep + 1 < steps.length) executeStep(goal, simSubStep + 1);
    };

    const handleSignAuthorize = () => {
        if (!waitingForSignature) return;
        playClick(); 
        setWaitingForSignature(false); 
        executeStep('FINANCE', 4);
    };

    // Color definitions
    const activeColor = useMemo(() => {
        if (selectedGoal === 'LEAD') return '#4285F4';
        if (selectedGoal === 'FINANCE') return '#10B981';
        return '#FF8A00';
    }, [selectedGoal]);

    // ─── RENDER MOBILE FALLBACK ───────────────────────────────────────────────
    if (isMobile) {
        const cases = [
            { color: '#4285F4', icon: '🎯', title: 'Ventas y CRM', desc: 'Un prospecto llega por web. ALMA investiga su empresa, califica su intención y redacta una propuesta personalizada en segundos. Tu CRM se actualiza solo.', kpi: 'Tiempo de respuesta: 90 seg vs 4 horas humanas' },
            { color: '#10B981', icon: '💰', title: 'Piloto Comercial', desc: 'El sistema detecta intención de compra alta. Genera propuesta de $15,000 USD, espera tu aprobación con un clic y procesa el cobro automáticamente.', kpi: 'Ciclo de venta: 1 día vs 3 semanas' },
            { color: '#FF8A00', icon: '📣', title: 'Anuncios y Creativos', desc: 'Analiza tendencias de tu competencia, redacta 3 variantes de anuncios con CTR optimizado y los publica en la plataforma previo filtro de políticas.', kpi: 'ROI estimado: 3.1× vs campañas manuales' },
        ];
        return (
            <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#020617', fontFamily: FONT_BODY, padding: '80px 20px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {onNavigateBack && (
                    <button onClick={onNavigateBack} style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', padding: '6px 14px', cursor: 'pointer' }}>← VOLVER</button>
                )}
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', color: '#00ff99', marginBottom: '12px' }}>HUD OPERATIVO · MÓVIL</div>
                    <h1 style={{ fontFamily: FONT_HEADING, fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>Simulación de Procesos Autónomos</h1>
                </div>
                {cases.map(c => (
                    <div key={c.title} style={{ background: 'rgba(8,10,18,0.8)', backdropFilter: 'blur(20px)', border: `1px solid ${c.color}25`, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                            <span style={{ fontFamily: FONT_HEADING, fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{c.title}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                        <div style={{ background: `${c.color}10`, border: `1px solid ${c.color}25`, borderRadius: '10px', padding: '8px 12px', fontSize: '0.75rem', color: c.color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>⚡ {c.kpi}</div>
                    </div>
                ))}
            </div>
        );
    }

    // ─── RENDER DESKTOP HUD ───────────────────────────────────────────────────
    return (
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#020617', 
            color: '#F8FAFC',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: FONT_BODY,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 24, 48, 0.25) 0%, rgba(2, 6, 23, 1) 100%), linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}>
            {/* Top Telemetry Header */}
            <div style={{ 
                height: '52px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0 24px', 
                backgroundColor: 'rgba(3, 7, 18, 0.5)',
                backdropFilter: 'blur(10px)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: phase === 'IDLE' ? '#ef4444' : phase === 'SECURITY_ALERT' ? '#f59e0b' : '#00ff99', 
                            boxShadow: `0 0 10px ${phase === 'IDLE' ? '#ef4444' : phase === 'SECURITY_ALERT' ? '#f59e0b' : '#00ff99'}`
                        }} />
                        {phase !== 'IDLE' && !isPaused && (
                            <span style={{ 
                                position: 'absolute',
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                backgroundColor: activeColor, 
                                transform: 'scale(1)',
                                animation: 'simSpin 1.5s infinite ease-out',
                                border: `1px solid ${activeColor}`
                            }} />
                        )}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', opacity: 0.8, textTransform: 'uppercase' }}>
                        SYSTEM HUD // {phase === 'IDLE' ? 'STANDBY' : `COGNITIVE RUN: ${selectedGoal}`}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', opacity: 0.5 }}>
                    <div>TELEMETRY RATE: 240Hz</div>
                    <div>LATENCY: 12ms</div>
                    <div>PORT: 8080/TLS</div>
                </div>
            </div>

            {/* Main Interactive Screen */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    {phase === 'IDLE' ? (
                        /* STANDBY IDLE HUD */
                        <motion.div 
                            key="idle"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            style={{ 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '24px',
                                zIndex: 1
                            }}
                        >
                            {/* Graphic core representing AI ready state */}
                            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="44" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="3 5" fill="none" opacity="0.1" />
                                    <circle cx="50" cy="50" r="30" stroke="#00ff99" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3" style={{ animation: 'simSpin 15s linear infinite' }} />
                                    <circle cx="50" cy="50" r="8" fill="#00ff99" opacity="0.8" style={{ animation: 'simPulseGlowSpeed 2s infinite alternate' }} />
                                </svg>
                                <div style={{ position: 'absolute', width: '100%', height: '100%', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '50%', animation: 'simSpin 30s linear infinite' }} />
                            </div>

                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', color: '#00ff99', textTransform: 'uppercase' }}>
                                    ORQUESTADOR DE PROCESOS EMPRESARIALES
                                </div>
                                <h2 style={{ fontFamily: FONT_HEADING, fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                                    Listo para iniciar simulación
                                </h2>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.5 }}>
                                    Selecciona uno de los 3 casos en la barra lateral para ver en tiempo real cómo coordinamos nuestros agentes de IA.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        /* ACTIVE MISSION CONTROL WINDOWS */
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ 
                                flex: 1, 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '20px', 
                                padding: '24px',
                                overflow: 'hidden',
                                zIndex: 1
                            }}
                        >
                            {/* WINDOW 1: AGENT BROWSER & SCROLLER */}
                            <div style={{ 
                                backgroundColor: 'rgba(8, 10, 18, 0.55)', 
                                backdropFilter: 'blur(20px)',
                                border: currentStep === 2 && loopActive === 'researcher' ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.06)',
                                boxShadow: currentStep === 2 && loopActive === 'researcher' ? `0 0 25px ${activeColor}15` : 'none',
                                borderRadius: '16px', 
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Globe size={13} color={currentStep === 2 ? activeColor : 'rgba(255,255,255,0.4)'} />
                                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.05em', color: currentStep === 2 ? '#fff' : 'rgba(255,255,255,0.5)' }}>🌐 NAVEGADOR IA</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'none' }}>
                                    {/* Mock address bar */}
                                    <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '6px 10px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {selectedGoal === 'LEAD' && (currentStep >= 2 ? 'https://linkedin.com/in/juan-perez-acme-logistics' : 'https://google.com/search?q=jperez+acme')}
                                        {selectedGoal === 'FINANCE' && (currentStep >= 2 ? 'https://stripe.com/api/v1/customers/acme' : 'https://agencia.web/pricing?ref=acme')}
                                        {selectedGoal === 'MARKETING' && (currentStep >= 2 ? 'https://google.com/trends?q=automatizacion+B2B' : 'https://facebook.com/ads/manager')}
                                    </div>

                                    {/* Active crawler visualization */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                        {selectedGoal === 'LEAD' && (
                                            <>
                                                {currentStep >= 1 && <div style={{ color: activeColor }}><span style={{ opacity: 0.4 }}>[CRAWLER]</span> Inicializando crawler seguro headless...</div>}
                                                {currentStep >= 2 && (
                                                    <>
                                                        <div><span style={{ opacity: 0.4 }}>[GET]</span> linkedin.com/in/jperez <span style={{ color: '#00ff99' }}>(200 OK)</span></div>
                                                        <div style={{ color: '#00ff99' }}>✓ Datos encontrados: Juan Pérez</div>
                                                        <div style={{ color: '#00f3ff' }}>• Cargo: Dir. de Operaciones B2B</div>
                                                        <div style={{ color: '#00f3ff' }}>• Empresa: Acme Corp</div>
                                                        <div style={{ color: '#00f3ff' }}>• Dotación: 450 empleados</div>
                                                        <div style={{ color: '#00f3ff' }}>• Sector: Logística Integrada</div>
                                                    </>
                                                )}
                                                {currentStep >= 3 && <div style={{ color: 'rgba(255,255,255,0.3)' }}><span style={{ opacity: 0.4 }}>[SYSTEM]</span> Extracción de perfil guardada en buffer temporal.</div>}
                                            </>
                                        )}

                                        {selectedGoal === 'FINANCE' && (
                                            <>
                                                {currentStep >= 1 && (
                                                    <>
                                                        <div style={{ color: '#f59e0b' }}><span style={{ opacity: 0.4 }}>[TRACK]</span> Oportunidad comercial detectada.</div>
                                                        <div><span style={{ opacity: 0.4 }}>[USER]</span> IP 189.12.90.41 visitando /pricing</div>
                                                        <div><span style={{ opacity: 0.4 }}>[INFO]</span> Sesión activa: 4m 12s, 3 clics en Planes</div>
                                                    </>
                                                )}
                                                {currentStep >= 2 && (
                                                    <>
                                                        <div style={{ color: activeColor }}><span style={{ opacity: 0.4 }}>[GET]</span> db.company_registry/info <span style={{ color: '#00ff99' }}>(200 OK)</span></div>
                                                        <div style={{ color: '#00ff99' }}>✓ Cuenta: Constructora Delta</div>
                                                        <div style={{ color: '#00f3ff' }}>• Empleados: 200 (Corporativo)</div>
                                                        <div style={{ color: '#00f3ff' }}>• Intención: Comportamiento A+</div>
                                                    </>
                                                )}
                                                {currentStep >= 3 && <div style={{ color: 'rgba(255,255,255,0.3)' }}><span style={{ opacity: 0.4 }}>[SYSTEM]</span> Perfil comercial unificado con Salesforce.</div>}
                                            </>
                                        )}

                                        {selectedGoal === 'MARKETING' && (
                                            <>
                                                {currentStep >= 1 && <div style={{ color: activeColor }}><span style={{ opacity: 0.4 }}>[SPY]</span> Escaneando tendencias históricas en Ads...</div>}
                                                {currentStep >= 2 && (
                                                    <>
                                                        <div><span style={{ opacity: 0.4 }}>[GET]</span> google.trends/api <span style={{ color: '#00ff99' }}>(200 OK)</span></div>
                                                        <div style={{ color: '#00ff99' }}>✓ Tendencia: "automatización diaria" (+140%)</div>
                                                        <div><span style={{ opacity: 0.4 }}>[SPY]</span> Meta Ads AdLibrary analizada.</div>
                                                        <div style={{ color: '#00f3ff' }}>• CTR promedio del sector: 1.8%</div>
                                                        <div style={{ color: '#00f3ff' }}>• CTR objetivo campaña: 3.4%</div>
                                                    </>
                                                )}
                                                {currentStep >= 3 && <div style={{ color: 'rgba(255,255,255,0.3)' }}><span style={{ opacity: 0.4 }}>[SYSTEM]</span> Keywords de alta conversión agregadas al prompt.</div>}
                                            </>
                                        )}
                                    </div>
                                    
                                    {/* Small visual pulsing grid overlay */}
                                    {currentStep === 2 && (
                                        <div style={{ 
                                            height: '35px', 
                                            border: `1px solid ${activeColor}30`, 
                                            borderRadius: '8px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            backgroundColor: `${activeColor}05`,
                                            gap: '8px',
                                            animation: 'simPulseGlowSpeed 1.5s infinite alternate'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeColor }} />
                                            <span style={{ fontSize: '9px', fontWeight: 700, color: activeColor }}>RASTREANDO DATOS EN VIVO</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* WINDOW 2: CORE DATA & CRM */}
                            <div style={{ 
                                backgroundColor: 'rgba(8, 10, 18, 0.55)', 
                                backdropFilter: 'blur(20px)',
                                border: currentStep === 3 && waitingForSignature ? '1px solid #ef4444' : (currentStep >= 2 && currentStep < 4 ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.06)'),
                                boxShadow: currentStep === 3 && waitingForSignature ? '0 0 25px rgba(239, 68, 68, 0.15)' : (currentStep >= 2 && currentStep < 4 ? `0 0 25px ${activeColor}15` : 'none'),
                                borderRadius: '16px', 
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Database size={13} color={currentStep >= 2 ? activeColor : 'rgba(255,255,255,0.4)'} />
                                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.05em', color: currentStep >= 2 ? '#fff' : 'rgba(255,255,255,0.5)' }}>📊 CORE DATA CRM</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                                    {/* Mock Salesforce Database Record Card */}
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', opacity: 0.4 }}>PIPELINE RECORD</span>
                                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: activeColor, fontWeight: 700 }}>
                                                {selectedGoal === 'LEAD' && 'LEAD_ID: #ACM-450'}
                                                {selectedGoal === 'FINANCE' && 'OPP_ID: #CON-200'}
                                                {selectedGoal === 'MARKETING' && 'CAMP_ID: #MKT-3.1x'}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.75rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ opacity: 0.5 }}>Cuenta:</span>
                                                <span style={{ fontWeight: 600 }}>
                                                    {currentStep < 2 ? '---' : (selectedGoal === 'LEAD' ? 'Acme Corp' : selectedGoal === 'FINANCE' ? 'Constructora Delta' : 'Meta Ads Campaign')}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ opacity: 0.5 }}>Fit Score:</span>
                                                <span style={{ fontWeight: 700, color: currentStep >= 2 ? '#00ff99' : 'rgba(255,255,255,0.2)' }}>
                                                    {currentStep < 2 ? 'Calculando...' : 'A+ (Alto Valor)'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ opacity: 0.5 }}>Ticket:</span>
                                                <span style={{ fontWeight: 600 }}>
                                                    {selectedGoal === 'LEAD' ? '$4,500 USD / mes' : selectedGoal === 'FINANCE' ? '$15,000 USD' : '$150 USD / día'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ opacity: 0.5 }}>Etapa Comercial:</span>
                                                <span style={{ 
                                                    fontWeight: 700, 
                                                    color: currentStep === 4 ? '#00ff99' : (currentStep === 3 && waitingForSignature ? '#f59e0b' : activeColor)
                                                }}>
                                                    {currentStep === 0 && 'INGRESO'}
                                                    {currentStep === 1 && 'ASIGNACIÓN'}
                                                    {currentStep === 2 && 'PROPUESTA'}
                                                    {currentStep === 3 && (waitingForSignature ? 'FIRMA EN PAUSA' : 'APROBACIÓN')}
                                                    {currentStep === 4 && 'CONTRATO CERRADO'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GDPR and Audit Status Card */}
                                    <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <ShieldCheck size={12} color={currentStep >= 3 ? '#00ff99' : 'rgba(255,255,255,0.3)'} />
                                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, opacity: 0.6 }}>AUDITORÍA DE PRIVACIDAD & SEGURIDAD</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                                            <span style={{ opacity: 0.5 }}>GDPR Compliance:</span>
                                            <span style={{ color: currentStep >= 3 ? '#00ff99' : 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                                                {currentStep >= 3 ? 'VERIFICADO' : 'PENDIENTE'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                                            <span style={{ opacity: 0.5 }}>Firma Humana (HIL):</span>
                                            <span style={{ 
                                                color: currentStep === 4 ? '#00ff99' : (currentStep === 3 && waitingForSignature ? '#ef4444' : 'rgba(255,255,255,0.2)'), 
                                                fontWeight: 600,
                                                animation: currentStep === 3 && waitingForSignature ? 'simPulseGlowSpeed 1s infinite alternate' : 'none'
                                            }}>
                                                {currentStep === 4 ? 'APROBADO' : (currentStep === 3 && waitingForSignature ? 'REQUERIDA' : 'ESPERA')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WINDOW 3: SMTP WRITER & API TRANSMITTER */}
                            <div style={{ 
                                backgroundColor: 'rgba(8, 10, 18, 0.55)', 
                                backdropFilter: 'blur(20px)',
                                border: currentStep === 4 ? '1px solid #00ff99' : (currentStep === 3 ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.06)'),
                                boxShadow: currentStep === 4 ? '0 0 25px rgba(0, 255, 153, 0.15)' : (currentStep === 3 ? `0 0 25px ${activeColor}15` : 'none'),
                                borderRadius: '16px', 
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {selectedGoal === 'MARKETING' ? (
                                            <ExternalLink size={13} color={currentStep >= 3 ? activeColor : 'rgba(255,255,255,0.4)'} />
                                        ) : (
                                            <Mail size={13} color={currentStep >= 3 ? activeColor : 'rgba(255,255,255,0.4)'} />
                                        )}
                                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.05em', color: currentStep >= 3 ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                                            {selectedGoal === 'MARKETING' ? '🚀 API PUBLICIDAD' : '📧 EMISOR DE PROPUESTAS'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                                    
                                    {selectedGoal === 'MARKETING' ? (
                                        /* MARKETING: API TRANSMITTER VIEW */
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                                            <div><span style={{ opacity: 0.4 }}>API Target:</span> https://graph.facebook.com/v18.0</div>
                                            {currentStep >= 2 ? (
                                                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px', fontSize: '0.65rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                    <div style={{ color: activeColor, fontWeight: 700 }}>CREATIVE PAYLOAD:</div>
                                                    <div>"Ad1": "Automatiza tu B2B en piloto automático."</div>
                                                    <div>"Ad2": "Elimina el 73% de tus errores operativos hoy."</div>
                                                    <div>"CTR_Target": "3.4%"</div>
                                                </div>
                                            ) : (
                                                <div style={{ opacity: 0.3 }}>[Esperando variantes creativas...]</div>
                                            )}
                                            {currentStep >= 3 && <div style={{ color: '#00ff99' }}>✓ Políticas Ads verificadas sin riesgos de bloqueo.</div>}
                                            {currentStep >= 4 && (
                                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ color: '#00ff99', fontWeight: 700 }}>STATUS: CAMPAÑA EN VIVO (201 Created)</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.5)' }}>Presupuesto: $150 USD/día. ROI tracker iniciado.</div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* SALES/CRM & FINANCE: MAIL COMPOSER VIEW */
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div><span style={{ opacity: 0.4 }}>Para:</span> {selectedGoal === 'LEAD' ? 'jperez@acme.com' : 'director@constructoradelta.com'}</div>
                                                <div><span style={{ opacity: 0.4 }}>Asunto:</span> {selectedGoal === 'LEAD' ? 'Propuesta Comercial AgencIA - Acme Corp' : 'Factura y Contrato de Cierre - Delta'}</div>
                                            </div>
                                            
                                            <div style={{ flex: 1, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontSize: '0.68rem', backgroundColor: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                                {currentStep < 2 ? (
                                                    <span style={{ opacity: 0.3 }}>[Esperando análisis de perfil para redactar propuesta...]</span>
                                                ) : currentStep === 2 ? (
                                                    <Typewriter 
                                                        text={selectedGoal === 'LEAD' 
                                                            ? 'Hola Juan,\nAnalizamos el sector logístico de Acme Corp (450 empleados).\nProponemos un piloto comercial para automatizar tu CRM con IA y acelerar respuestas...' 
                                                            : 'Hola Director,\nDe acuerdo a su interés en el Plan Corporativo, adjuntamos la propuesta formal por un total de $15,000 USD para el desarrollo del ecosistema autónomo...'
                                                        } 
                                                        speed={8} 
                                                    />
                                                ) : (
                                                    /* Typed finished text */
                                                    <span>
                                                        {selectedGoal === 'LEAD' 
                                                            ? 'Hola Juan,\nAnalizamos el sector logístico de Acme Corp (450 empleados).\nProponemos un piloto comercial para automatizar tu CRM con IA y acelerar respuestas...' 
                                                            : 'Hola Director,\nDe acuerdo a su interés en el Plan Corporativo, adjuntamos la propuesta formal por un total de $15,000 USD para el desarrollo del ecosistema autónomo...'
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {currentStep === 4 && (
                                                <div style={{ color: '#00ff99', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', animation: 'simFadeInUp 0.3s ease-out' }}>
                                                    <Check size={14} /> PROPUESTA ENVIADA (SMTP 250 OK)
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Terminal Console Log Panel */}
            <div style={{ 
                height: '190px', 
                borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                backgroundColor: 'rgba(2, 6, 23, 0.88)', 
                display: 'flex', 
                flexDirection: 'column',
                zIndex: 10
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '8px 24px', 
                    backgroundColor: 'rgba(3, 7, 18, 0.5)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={12} color="#00ff99" />
                        <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.8 }}>
                            TERMINAL CONSOLE LOGS
                        </span>
                    </div>
                    <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', opacity: 0.4 }}>
                        STDOUT_REDIRECT // BUF_SIZE: 1024KB
                    </span>
                </div>
                <div 
                    ref={chatContainerRef} 
                    style={{ 
                        flex: 1, 
                        padding: '12px 24px', 
                        overflowY: 'auto', 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.72rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '6px',
                        scrollbarWidth: 'none'
                    }}
                >
                    {chatMessages.map((msg, index) => (
                        <div key={index} style={{ display: 'flex', gap: '12px', lineHeight: 1.4, opacity: index === chatMessages.length - 1 ? 1 : 0.65 }}>
                            <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>[{msg.timestamp}]</span>
                            <span style={{ color: msg.color, fontWeight: 700, flexShrink: 0 }}>{msg.sender}:</span>
                            <span style={{ color: '#fff' }}>{msg.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* COMPLETED OVERLAYS & HUD PILLS */}
            {phase === 'COMPLETED' && (
                <div style={{ 
                    position: 'absolute', 
                    bottom: '220px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                    backdropFilter: 'blur(30px)', 
                    WebkitBackdropFilter: 'blur(30px)', 
                    border: `1px solid ${activeColor}55`, 
                    borderRadius: '20px', 
                    padding: '8px 8px 8px 22px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '18px', 
                    zIndex: 100, 
                    boxShadow: `0 20px 45px rgba(0,0,0,0.8), 0 0 25px ${activeColor}15`, 
                    animation: 'simFadeInUpBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Check size={16} color="#00ff99" />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff', fontFamily: FONT_HEADING }}>
                            {selectedGoal === 'LEAD' && 'Prospecto calificado, CRM actualizado y borrador de email listo.'}
                            {selectedGoal === 'FINANCE' && 'Venta de $15,000 USD cerrada y cobro procesado sin fricción.'}
                            {selectedGoal === 'MARKETING' && 'Campaña publicada con éxito y panel de ROI activo.'}
                        </span>
                    </div>
                    <button onClick={handleReset} style={{ padding: '9px 18px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '14px', fontSize: '11px', fontWeight: 700, fontFamily: FONT_BODY, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s', outline: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}>
                        <RefreshCw size={12} /> VOLVER A EMPEZAR
                    </button>
                </div>
            )}

            {/* ACTIVE SIMULATION HUD CONTROLS */}
            {phase !== 'IDLE' && phase !== 'COMPLETED' && (
                <div style={{ 
                    position: 'absolute', 
                    bottom: '220px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    backgroundColor: 'rgba(3, 7, 18, 0.9)', 
                    backdropFilter: 'blur(20px)', 
                    WebkitBackdropFilter: 'blur(20px)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '20px', 
                    padding: '8px 22px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    zIndex: 100, 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                    animation: 'simFadeInUpBottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                }}>
                    <span style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        border: isPaused ? `2px solid ${activeColor}` : '2px solid rgba(255,255,255,0.15)', 
                        borderTop: isPaused ? 'none' : `2px solid ${activeColor}`, 
                        display: 'inline-block', 
                        animation: isPaused ? 'none' : 'simSpin 1s linear infinite', 
                        opacity: isPaused ? 0.6 : 1 
                    }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: FONT_BODY }}>
                        Simulación: <strong>{activeGoal === 'LEAD' ? 'Ventas B2B' : activeGoal === 'FINANCE' ? 'Piloto Comercial' : 'Marketing'}</strong> {isPaused ? 'pausada' : 'activa'}.
                    </span>
                    <button onClick={togglePause} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '10px', padding: '5px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '5px', outline: 'none', transition: 'all 0.2s' }}>
                        {isPaused ? '▶ REANUDAR' : '❚❚ PAUSAR'}
                    </button>
                    {isPaused && !waitingForSignature && (
                        <button onClick={handleNextStep} style={{ background: `${activeColor}25`, border: `1px solid ${activeColor}`, color: '#fff', borderRadius: '10px', padding: '5px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', outline: 'none' }}>
                            AVANZAR →
                        </button>
                    )}
                    <button onClick={handleReset} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', padding: '4px', outline: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                        DETENER
                    </button>
                </div>
            )}

            {/* HUMAN-IN-THE-LOOP SIGNATURE POPUP */}
            {waitingForSignature && activeGoal === 'FINANCE' && (
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: '380px', 
                    backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                    backdropFilter: 'blur(30px)', 
                    WebkitBackdropFilter: 'blur(30px)', 
                    border: '1px solid rgba(16,185,129,0.35)', 
                    borderRadius: '24px', 
                    padding: '32px', 
                    zIndex: 110, 
                    boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16,185,129,0.15)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '18px', 
                    animation: 'simPulseGreenGlow 3s infinite alternate, simFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={18} color="#10B981" />
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>REQUERIMIENTO DE AUTORIZACIÓN</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.55, fontFamily: FONT_BODY }}>
                        El sistema detectó una oportunidad comercial calificada B2B y estructuró la propuesta por <strong style={{ color: '#10B981' }}>$15,000 USD</strong>. Aprueba el cobro y la firma de contrato con un clic.
                    </p>
                    <button onClick={handleSignAuthorize} style={{ width: '100%', padding: '14px', backgroundColor: '#10B981', color: '#fff', borderRadius: '14px', fontWeight: 800, fontSize: '13px', fontFamily: FONT_BODY, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '2px solid rgba(16,185,129,0.6)', cursor: 'pointer', boxShadow: '0 0 20px rgba(16,185,129,0.3)', outline: 'none', animation: 'simSignaturePulse 1.1s ease-in-out infinite alternate', letterSpacing: '0.04em' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.animationPlayState = 'paused'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.animationPlayState = 'running'; }}>
                        <DollarSign size={15} /> FIRMAR Y COBRAR EN AUTOMÁTICO
                    </button>
                </div>
            )}

            {/* TELEMETRY HUD BAR */}
            {activeGoal && (
                <div style={{ 
                    backgroundColor: 'rgba(3, 7, 18, 0.9)', 
                    backdropFilter: 'blur(20px)', 
                    WebkitBackdropFilter: 'blur(20px)', 
                    borderTop: '1px solid rgba(255,255,255,0.06)', 
                    padding: '12px 24px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '14px', 
                    zIndex: 10, 
                    boxShadow: '0 -10px 30px rgba(0,0,0,0.3)' 
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                        <span style={{ fontSize: '8px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>TELEMETRÍA EN TIEMPO REAL</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', fontFamily: FONT_HEADING }}>Valor Comercial</span>
                    </div>
                    <div style={{ width: '1px', height: '22px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                    <div className="hud-scrollable-container" style={{ display: 'flex', flexDirection: 'row', gap: '10px', flex: 1, overflowX: 'auto', paddingBottom: '2px' }}>
                        {getCommercialMetrics(activeGoal || selectedGoal, phase, currentStep, waitingForSignature).map((metric, index) => {
                            let statusColor = '#4a5568';
                            let bgPulse = 'rgba(255,255,255,0.01)';
                            let isPulsing = false;
                            if (metric.status === 'running') { 
                                statusColor = activeColor; 
                                bgPulse = `${statusColor}10`; 
                                isPulsing = true; 
                            } else if (metric.status === 'success') { 
                                statusColor = '#10B981'; 
                            } else if (metric.status === 'alert') { 
                                statusColor = '#ef4444'; 
                                bgPulse = 'rgba(239,68,68,0.1)'; 
                                isPulsing = true; 
                            }
                            return (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '7px 12px', borderRadius: '10px', backgroundColor: isPulsing ? bgPulse : 'rgba(255,255,255,0.02)', border: `1px solid ${isPulsing ? statusColor : 'rgba(255,255,255,0.04)'}`, minWidth: '150px', maxWidth: '210px', opacity: metric.status === 'pending' ? 0.35 : 1, transition: 'all 0.3s ease', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT_BODY }}>{metric.label}</span>
                                        <span style={{ fontSize: '9px', fontWeight: 700, color: statusColor, fontFamily: 'var(--font-mono)' }}>{metric.value === 'Espera...' ? 'ESPERA' : metric.value}</span>
                                    </div>
                                    <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.3', fontFamily: FONT_BODY }}>{metric.benefit}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ width: '1px', height: '22px', backgroundColor: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.2)', flexShrink: 0, letterSpacing: '0.05em' }}>© agencIA LAB</span>
                </div>
            )}

            {/* GLOBAL ANIMATIONS */}
            <style>{`
                @keyframes simFadeInUp { from { opacity: 0; transform: translate3d(0,15px,0); } to { opacity: 1; transform: translate3d(0,0,0); } }
                @keyframes simFadeInUpBottom { from { opacity: 0; transform: translate(-50%, 15px); } to { opacity: 1; transform: translate(-50%, 0); } }
                @keyframes simPulseGlowSpeed { from { opacity: 0.35; } to { opacity: 1; } }
                @keyframes simSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes simPulseGreenGlow { from { box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 20px rgba(16,185,129,0.15); border-color: rgba(16,185,129,0.25); } to { box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 35px rgba(16,185,129,0.35); border-color: rgba(16,185,129,0.55); } }
                @keyframes simSignaturePulse { from { box-shadow: 0 0 15px rgba(16,185,129,0.4), 0 0 30px rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.5); } to { box-shadow: 0 0 35px rgba(16,185,129,1), 0 0 70px rgba(16,185,129,0.5), 0 0 0 5px rgba(16,185,129,0.15); border-color: rgba(16,185,129,1); } }
                .hud-scrollable-container::-webkit-scrollbar { display: none; }
                .hud-scrollable-container { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProcessSimulator;
