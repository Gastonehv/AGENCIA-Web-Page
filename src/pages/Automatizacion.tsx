import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CrystalScroller from '../components/CrystalScroller';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

gsap.registerPlugin(ScrollTrigger);

const Automatizacion: React.FC = () => {
    return (
        <div style={{ backgroundColor: '#000', width: '100%', minHeight: '100vh' }}>
            <SEO
                title="Automatización de Procesos"
                description="Delegue lo repetitivo a la IA. Automatización de flujos de trabajo y CRMs inteligentes."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Automatización",
                "provider": {
                    "@type": "Organization",
                    "name": "AgencIA"
                },
                "description": "Sistemas autónomos que operan 24/7 para maximizar la productividad empresarial."
            }} />

            {/* VIDEO SCROLLER AS THE STAGE */}
            {/* Note: CrystalScroller creates a pinned section 500% height. 
                 We need to position content relative to that pin or overlay it.
                 Currently CrystalScroller returns a div that IS the pin.
             */}
            <div style={{ position: 'relative' }}>

                {/* 1. THE ENGINE (Video Scrub) */}
                <CrystalScroller />

                {/* 2. THE NARRATIVE (Overlay) - Needs to be tied to same scroll timeline or fixed */}
                {/* Since CrystalScroller Pins itself, we can put fixed elements inside it if we modify it, 
                    OR we can just overlay absolutely on top of the pinned container? 
                    Actually, React children is best. Let's update CrystalScroller to accept children? 
                    Or just float text here.
                    
                    Wait, CrystalScroller has `overflow: hidden` and `height: 100vh`. 
                    If I put content *after* it, it will appear after the scroll is done.
                    
                    For this "Scrollytelling" experience, the text should appear WHILE scrubbing.
                    The easiest way is to overlay fixed text that changes based on ScrollTrigger milestones 
                    tied to the same trigger as the video.
                */}

                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // CENTERED = MAX OVERLAP
                    alignItems: 'center',
                }}>
                    {/* GLASSMORPHIC CARD */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.05)', // Slightly more visible
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '1.5rem 3rem',
                        borderRadius: '24px',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        textAlign: 'center'
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: 'clamp(1.5rem, 4vw, 4rem)', // SMALLER TEXT
                            fontWeight: 900,
                            color: '#FFF',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            margin: 0,
                            textShadow: '0 0 30px rgba(255,255,255,0.2)'
                        }}>
                            LA AUTOMATIZACIÓN<br />ES ARTE
                        </h2>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Automatizacion;
