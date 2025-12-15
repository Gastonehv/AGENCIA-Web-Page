import React, { createContext, useContext, useState } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const translations = {
    es: {
        // Navbar
        'nav.services': 'Soluciones',
        'nav.work': 'Portafolio',
        'nav.contact': 'Contacto',

        // Hero
        'hero.subtitle': 'Transformación Digital de Alto Nivel',
        'hero.more': 'Descubre el Futuro',

        // Services - Fusion Titles
        'services.title': 'SELECCIÓN DE ESENCIA',
        'services.select': 'DEFINE TU REALIDAD',
        'service.genesis': 'Identidad & Estrategia',
        'service.hyper': 'Arquitectura Digital',
        'service.cortex': 'Inteligencia Artificial',
        'service.nexus': 'Automatización de Negocios',

        // Visual Concepts (Metaphors)
        'concept.genesis': 'CÓDIGO GENÉTICO DE MARCA',
        'concept.hyper': 'INFRAESTRUCTURA ESCALABLE',
        'concept.cortex': 'RED NEURONAL CORPORATIVA',
        'concept.nexus': 'SINCRONIZACIÓN PERPETUA',

        // Categories
        'cat.vision': 'Branding Corporativo & Posicionamiento',
        'cat.tech': 'Desarrollo Web & Plataformas Escalables',
        'cat.ai': 'Soluciones de IA & Modelos Predictivos',
        'cat.auto': 'Optimización de Flujos & Eficiencia',

        // Contact
        'contact.title': 'Inicia tu Transformación',
        'contact.name': 'Nombre Completo',
        'contact.email': 'Correo Corporativo',
        'contact.details': 'Cuéntanos tu Visión',
        'contact.send': 'Solicitar Consultoría',
        'contact.soon': 'Agenda Cerrada Temporalmente',
    },
    en: {
        // Navbar
        'nav.services': 'Solutions',
        'nav.work': 'Portfolio',
        'nav.contact': 'Contact',

        // Hero
        'hero.subtitle': 'High-End Digital Transformation',
        'hero.more': 'Discover the Future',

        // Services
        'services.title': 'STRATEGIC DIVISIONS',
        'services.select': 'EXPLORE OUR EXPERTISE',
        'service.genesis': 'Identity & Strategy',
        'service.hyper': 'Digital Architecture',
        'service.cortex': 'Artificial Intelligence',
        'service.nexus': 'Business Automation',

        // Categories
        'cat.vision': 'Corporate Branding & Positioning',
        'cat.tech': 'Web Development & Scalable Platforms',
        'cat.ai': 'AI Solutions & Predictive Models',
        'cat.auto': 'Workflow Optimization & Efficiency',

        // Contact
        'contact.title': 'Start Your Transformation',
        'contact.name': 'Full Name',
        'contact.email': 'Business Email',
        'contact.details': 'Tell Us Your Vision',
        'contact.send': 'Request Consultation',
        'contact.soon': 'Schedule Temporarily Closed',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es'); // Default to Spanish as requested

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    const t = (key: string) => {
        // console.log('t called with:', key); // Commented out to reduce noise
        if (!translations) return key;

        const currentLang = translations[language];
        if (!currentLang) return key;

        // @ts-ignore - Suppress indexing error for dynamic keys
        return currentLang[key] || key;
    };

    console.log('LanguageProvider rendering, t is:', typeof t, t);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
