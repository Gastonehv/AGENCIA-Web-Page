import React, { useEffect, useState } from 'react';
import { useScroll } from '../context/ScrollContext';

interface Section {
    id: string;
    label: string;
}

const SECTIONS: Section[] = [
    { id: 'hero', label: 'INICIO' },
    { id: 'capacidades', label: 'EJECUCIÓN' },
    { id: 'esencia', label: 'ESENCIA' }, // This might need anchor matching
    { id: 'manifesto', label: 'GÉNESIS' },
    { id: 'nucleo', label: 'NÚCLEO' },
    { id: 'simbiosis', label: 'SIMBIOSIS' },
    { id: 'contacto', label: 'CONTACTO' }
];

const SideNav: React.FC = () => {
    const { lenis } = useScroll();
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;

            for (const section of SECTIONS) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element && lenis) {
            lenis.scrollTo(element, { offset: 0, duration: 1.5 });
        }
    };

    return (
        <div
            className="side-nav"
            style={{
                position: 'fixed',
                left: '20px',
                bottom: '80px', // Just above the depth meter
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '1.2rem 0.6rem',
                borderRadius: '40px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            {SECTIONS.map((section) => (
                <div
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                    title={section.label}
                >
                    {/* DOT */}
                    <div style={{
                        width: activeSection === section.id ? '8px' : '3px',
                        height: activeSection === section.id ? '8px' : '3px',
                        borderRadius: '50%',
                        backgroundColor: activeSection === section.id ? '#00FF99' : 'rgba(255,255,255,0.4)',
                        border: activeSection === section.id ? 'none' : '1px solid rgba(0,0,0,0.2)',
                        boxShadow: activeSection === section.id ? '0 0 15px #00FF99' : 'none',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }} />

                    {/* LABEL ON HOVER (Emerges from the right) */}
                    <span style={{
                        position: 'absolute',
                        left: '120%',
                        color: activeSection === section.id ? '#00FF99' : '#FFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.1em',
                        opacity: 0,
                        transform: 'translateX(-10px)',
                        transition: 'all 0.3s ease',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        fontWeight: 800,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: '1px solid rgba(0,255,153,0.2)'
                    }} className="side-nav-label">
                        {section.label}
                    </span>

                    <style>{`
                        .side-nav > div:hover .side-nav-label {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        .side-nav > div:hover div {
                            background-color: #00FF99;
                            scale: 1.5;
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
};

export default SideNav;
