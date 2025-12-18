import React, { useState } from 'react';
import { LanguageContext } from './LanguageContext';
import type { Language } from './LanguageContext';

const translations = {
    es: {
        'nav.services': 'Soluciones',
        'nav.work': 'Portafolio',
        'nav.contact': 'Contacto',
        'hero.subtitle': 'Transformación Digital de Alto Nivel',
        'hero.more': 'Descubre el Futuro',
        'services.title': 'SELECCIÓN DE ESENCIA',
        'services.select': 'DEFINE TU REALIDAD',
        'service.genesis': 'Identidad & Estrategia',
        'service.hyper': 'Arquitectura Digital',
        'service.cortex': 'Inteligencia Artificial',
        'service.nexus': 'Automatización de Negocios',
        'concept.genesis': 'CÓDIGO GENÉTICO DE MARCA',
        'concept.hyper': 'INFRAESTRUCTURA ESCALABLE',
        'concept.cortex': 'RED NEURONAL CORPORATIVA',
        'concept.nexus': 'SINCRONIZACIÓN PERPETUA',
        'cat.vision': 'Branding Corporativo & Posicionamiento',
        'cat.tech': 'Desarrollo Web & Plataformas Escalables',
        'cat.ai': 'Soluciones de IA & Modelos Predictivos',
        'cat.auto': 'Optimización de Flujos & Eficiencia',
        'contact.title': 'Inicia tu Transformación',
        'contact.name': 'Nombre Completo',
        'contact.email': 'Correo Corporativo',
        'contact.details': 'Cuéntanos tu Visión',
        'contact.send': 'Solicitar Consultoría',
        'contact.soon': 'Agenda Cerrada Temporalmente',
    },
    en: {
        'nav.services': 'Solutions',
        'nav.work': 'Portfolio',
        'nav.contact': 'Contact',
        'hero.subtitle': 'High-End Digital Transformation',
        'hero.more': 'Discover the Future',
        'services.title': 'STRATEGIC DIVISIONS',
        'services.select': 'EXPLORE OUR EXPERTISE',
        'service.genesis': 'Identity & Strategy',
        'service.hyper': 'Digital Architecture',
        'service.cortex': 'Artificial Intelligence',
        'service.nexus': 'Business Automation',
        'cat.vision': 'Corporate Branding & Positioning',
        'cat.tech': 'Web Development & Scalable Platforms',
        'cat.ai': 'AI Solutions & Predictive Models',
        'cat.auto': 'Workflow Optimization & Efficiency',
        'contact.title': 'Start Your Transformation',
        'contact.name': 'Full Name',
        'contact.email': 'Business Email',
        'contact.details': 'Tell Us Your Vision',
        'contact.send': 'Request Consultation',
        'contact.soon': 'Schedule Temporarily Closed',
    }
} as const;

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    const t = (key: string) => {
        const currentLang = translations[language];
        // @ts-expect-error - Suppress indexing error for dynamic keys
        return currentLang[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
