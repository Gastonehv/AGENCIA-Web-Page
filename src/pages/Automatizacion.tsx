import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import ProcessSimulator from '../components/automation/ProcessSimulator';
import LiquidContactCTA from '../components/LiquidContactCTA';

// ─── COPY DINÁMICO POR CASO ───────────────────────────────────────────────────
const GOAL_COPY: Record<string, {
    label: string;
    headline: string[];
    accent: string;
    accentColor: string;
    stats: { value: string; label: string }[];
    ctaText: string;
    ctaPost: string;
    completedMsg: string;
}> = {
    default: {
        label: 'IA OPERATIVA',
        headline: ['AUTOMATIZACIÓN', 'TOTAL'],
        accent: 'linear-gradient(90deg, #00FF99, #00E5FF)',
        accentColor: '#00FF99',
        stats: [
            { value: '−73%', label: 'Errores operativos' },
            { value: '10×', label: 'Velocidad de respuesta' },
            { value: '24/7', label: 'Sin intervención humana' },
        ],
        ctaText: 'INICIAR MI PROYECTO',
        ctaPost: 'SOLICITAR CONSULTA',
        completedMsg: '',
    },
    LEAD: {
        label: 'VENTAS Y CRM',
        headline: ['VENTAS EN', 'PILOTO AUTOMÁTICO'],
        accent: 'linear-gradient(90deg, #4285F4, #00F3FF)',
        accentColor: '#4285F4',
        stats: [
            { value: '90 seg', label: 'Respuesta al prospecto' },
            { value: '−85%', label: 'Investigación manual' },
            { value: '3×', label: 'Propuestas por día' },
        ],
        ctaText: 'AUTOMATIZAR MIS VENTAS',
        ctaPost: 'AUTOMATIZAR MIS VENTAS',
        completedMsg: 'Viste cómo cerramos el ciclo de un prospecto en 90 segundos. ¿Lo hacemos para tu empresa?',
    },
    FINANCE: {
        label: 'PILOTO COMERCIAL',
        headline: ['CIERRA VENTAS DE', '$15,000 USD'],
        accent: 'linear-gradient(90deg, #10B981, #00F3FF)',
        accentColor: '#10B981',
        stats: [
            { value: '$15K', label: 'Ticket por oportunidad' },
            { value: '−95%', label: 'Ciclo de venta' },
            { value: '1 clic', label: 'Para aprobar y cobrar' },
        ],
        ctaText: 'CERRAR VENTAS EN AUTOMÁTICO',
        ctaPost: 'CERRAR VENTAS EN AUTOMÁTICO',
        completedMsg: 'Viste cómo se cierra y cobra una venta de $15,000 USD en automático. ¿Lo implementamos?',
    },
    MARKETING: {
        label: 'CAMPAÑAS AUTÓNOMAS',
        headline: ['CAMPAÑAS QUE SE', 'GESTIONAN SOLAS'],
        accent: 'linear-gradient(90deg, #FF8A00, #FFD700)',
        accentColor: '#FF8A00',
        stats: [
            { value: '3.1×', label: 'ROI vs campañas manuales' },
            { value: '3 min', label: 'De brief a publicación' },
            { value: '0', label: 'Cuentas bloqueadas' },
        ],
        ctaText: 'ACTIVAR MIS CAMPAÑAS',
        ctaPost: 'ACTIVAR MIS CAMPAÑAS',
        completedMsg: 'Viste cómo se lanza una campaña desde cero sin tocar una sola plataforma. ¿Activamos la tuya?',
    },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Automatizacion: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [isMobile, setIsMobile] = useState(false);
    const [activeGoal, setActiveGoal] = useState<'LEAD' | 'FINANCE' | 'MARKETING' | null>(null);
    const [isSimRunning, setIsSimRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [shareToast, setShareToast] = useState(false);

    const demoParam = searchParams.get('demo') as 'LEAD' | 'FINANCE' | 'MARKETING' | null;
    const autoStart = demoParam || 'FINANCE';

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 900);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleGoalChange = useCallback((goal: 'LEAD' | 'FINANCE' | 'MARKETING' | null) => {
        setActiveGoal(goal);
        if (goal) setIsCompleted(false);
    }, []);

    const handlePhaseChange = useCallback((phase: string) => {
        setIsSimRunning(phase !== 'IDLE' && phase !== 'COMPLETED');
        if (phase === 'COMPLETED') setIsCompleted(true);
    }, []);

    const handleShare = () => {
        const goal = activeGoal || autoStart;
        const url = `${window.location.origin}/automatizacion?demo=${goal}`;
        navigator.clipboard.writeText(url).then(() => {
            setShareToast(true);
            setTimeout(() => setShareToast(false), 2500);
        });
    };

    const copy = GOAL_COPY[activeGoal || 'default'];
    const accentColor = copy.accentColor;

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#030407',
            fontFamily: 'var(--font-body)',
            overflowX: 'hidden',
        }}>
            <SEO
                title="Automatización de procesos con IA para empresas"
                description="Automatiza atención, ventas, seguimiento y operaciones con agentes de IA. AgencIA diseña flujos inteligentes para operar 24/7 y escalar con menos fricción."
                keywords="automatización con IA, agentes de IA, automatización de procesos, IA para empresas, workflows, México"
                url="https://agenciamx.app/automatizacion"
                canonical="https://agenciamx.app/automatizacion"
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Automatización de Procesos con IA",
                "serviceType": "Automatización de procesos empresariales con inteligencia artificial",
                "provider": {
                    "@type": "Organization",
                    "name": "AgencIA",
                    "url": "https://agenciamx.app/"
                },
                "areaServed": "MX",
                "url": "https://agenciamx.app/automatizacion",
                "description": "Automatización de atención, ventas, seguimiento y operaciones con agentes de IA para empresas."
            }} />

            {/* SHARE TOAST */}
            {shareToast && (
                <div style={{
                    position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#10B981', color: '#fff',
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                    letterSpacing: '0.1em', padding: '10px 22px', borderRadius: '30px',
                    zIndex: 9999, boxShadow: '0 10px 30px rgba(16,185,129,0.4)',
                    animation: 'autFadeIn 0.3s ease',
                }}>
                    ✓ ENLACE COPIADO
                </div>
            )}

            {/* ── GRID LAYOUT ──────────────────────────────────────────────── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : `${isSimRunning ? '64px' : '380px'} 1fr`,
                minHeight: '100vh',
                transition: 'grid-template-columns 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>

                {/* ── LEFT PANEL ───────────────────────────────────────────── */}
                <aside style={{
                    position: isMobile ? 'relative' : 'sticky',
                    top: 0,
                    height: isMobile ? 'auto' : '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',  // NUNCA scrollbar
                    padding: isMobile ? '5rem 1.5rem 2.5rem' : '0',
                    zIndex: 10,
                }}>

                    {/* COLLAPSED PILL — while sim running */}
                    {isSimRunning && !isMobile ? (
                        <div style={{
                            height: '100%', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '20px',
                        }}>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                backgroundColor: accentColor,
                                boxShadow: `0 0 16px ${accentColor}, 0 0 32px ${accentColor}40`,
                                animation: 'autPulse 1.5s infinite alternate',
                            }} />
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
                                letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)',
                                writingMode: 'vertical-rl', textTransform: 'uppercase',
                            }}>SIMULANDO</span>
                        </div>
                    ) : (
                        /* ── BILLBOARD ── */
                        <div style={{
                            position: 'relative',
                            height: isMobile ? 'auto' : '100%',
                            margin: isMobile ? '0' : '20px 0 20px 24px',
                            padding: '32px 28px 100px', // 100px bottom para el CTA absoluto
                            background: isMobile ? 'transparent' : 'rgba(8,10,18,0.72)',
                            backdropFilter: isMobile ? 'none' : 'blur(32px)',
                            WebkitBackdropFilter: isMobile ? 'none' : 'blur(32px)',
                            borderRadius: isMobile ? '0' : '20px',
                            border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
                            boxShadow: isMobile ? 'none' : '0 24px 60px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            overflow: 'hidden',
                        }}>

                            {/* BACK */}
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    alignSelf: 'flex-start',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.10)',
                                    borderRadius: '30px',
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: '0.68rem',
                                    fontFamily: 'var(--font-mono)',
                                    letterSpacing: '0.14em',
                                    padding: '6px 14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                            >
                                ← VOLVER
                            </button>

                            {/* LABEL */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    backgroundColor: accentColor,
                                    boxShadow: `0 0 10px ${accentColor}`,
                                    transition: 'all 0.4s',
                                    flexShrink: 0,
                                }} />
                                <span style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                                    letterSpacing: '0.22em', color: 'rgba(255,255,255,0.4)',
                                    textTransform: 'uppercase', transition: 'all 0.4s',
                                }}>
                                    {copy.label}
                                </span>
                            </div>

                            {/* HEADLINE */}
                            <div>
                                <h1 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: 'clamp(1.8rem, 2.6vw, 2.8rem)',
                                    fontWeight: 900,
                                    lineHeight: 1.04,
                                    letterSpacing: '-0.03em',
                                    color: '#fff',
                                    margin: '0 0 12px',
                                }}>
                                    {copy.headline[0]}<br />
                                    <span style={{
                                        background: copy.accent,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        transition: 'all 0.5s',
                                    }}>
                                        {copy.headline[1]}
                                    </span>
                                </h1>
                                <div style={{
                                    width: '32px', height: '2px',
                                    background: copy.accent,
                                    borderRadius: '2px',
                                    transition: 'background 0.5s',
                                }} />
                            </div>

                            {/* STATS — las 3 únicas, compactas */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {copy.stats.map(s => (
                                    <div key={s.label} style={{
                                        padding: '14px 8px',
                                        background: `${accentColor}09`,
                                        border: `1px solid ${accentColor}22`,
                                        borderRadius: '12px',
                                        display: 'flex', flexDirection: 'column',
                                        gap: '5px', textAlign: 'center',
                                        transition: 'all 0.5s',
                                    }}>
                                        <span style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                                            fontWeight: 900,
                                            color: accentColor,
                                            lineHeight: 1,
                                            transition: 'color 0.5s',
                                        }}>
                                            {s.value}
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.53rem',
                                            color: 'rgba(255,255,255,0.38)',
                                            letterSpacing: '0.04em',
                                            lineHeight: 1.35,
                                        }}>
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* POST-COMPLETION MESSAGE */}
                            {isCompleted && activeGoal && copy.completedMsg && (
                                <div style={{
                                    padding: '14px 16px',
                                    background: `${accentColor}10`,
                                    border: `1px solid ${accentColor}28`,
                                    borderRadius: '14px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.82rem',
                                    color: 'rgba(255,255,255,0.78)',
                                    lineHeight: 1.6,
                                    animation: 'autFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                                }}>
                                    ✅ {copy.completedMsg}
                                </div>
                            )}

                            {/* CTA — anclado al fondo, posición absoluta */}
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '28px',
                                right: '28px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}>
                                <LiquidContactCTA
                                    text={isCompleted && activeGoal ? copy.ctaPost : copy.ctaText}
                                />
                                {isCompleted && activeGoal && (
                                    <button
                                        onClick={handleShare}
                                        style={{
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: '6px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            borderRadius: '10px', padding: '8px',
                                            color: 'rgba(255,255,255,0.38)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.62rem', letterSpacing: '0.1em',
                                            cursor: 'pointer', transition: 'all 0.25s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}40`; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}
                                    >
                                        🔗 COMPARTIR ESTA DEMO
                                    </button>
                                )}
                            </div>

                        </div>
                    )}
                </aside>

                {/* ── RIGHT PANEL: SIMULATOR ───────────────────────────────── */}
                <section style={{
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    overflow: 'hidden',
                }}>
                    <ProcessSimulator
                        hideHeader={false}
                        autoStart={autoStart}
                        onNavigateBack={() => navigate('/')}
                        onGoalChange={handleGoalChange}
                        onPhaseChange={handlePhaseChange}
                    />
                </section>

            </div>

            <style>{`
                @keyframes autFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes autPulse {
                    from { opacity: 0.4; box-shadow: 0 0 8px ${accentColor}; }
                    to   { opacity: 1;   box-shadow: 0 0 20px ${accentColor}; }
                }
            `}</style>
        </div>
    );
};

export default Automatizacion;
