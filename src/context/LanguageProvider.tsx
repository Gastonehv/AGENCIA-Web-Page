import React, { useState } from 'react';
import { LanguageContext } from './LanguageContext';
import type { Language } from './LanguageContext';

const translations = {
    es: {
        'nav.services': 'Protocolos',
        'nav.work': 'Legado',
        'nav.contact': 'Iniciación',
        'hero.subtitle': 'Dominio Digital de Alto Nivel',
        'hero.more': 'Entrar a la Singularidad',
        'services.title': 'PROTOCOLOS',
        'services.select': '// SELECCIONA TU VENTAJA COMPETITIVA',
        'service.genesis': 'IDENTIDAD',
        'service.hyper': 'INFRAESTRUCTURA',
        'service.cortex': 'INTELIGENCIA', // Legacy
        'service.nexus': 'AUTOMATIZACIÓN',
        'concept.genesis': 'INGENIERÍA DE PERCEPCIÓN',
        'concept.hyper': 'ARQUITECTURA DE DOMINIO',
        'concept.cortex': 'RED NEURONAL',
        'concept.nexus': 'SISTEMAS AUTÓNOMOS',
        'cat.vision': 'Hacemos que tu marca se vea 10 veces más grande de lo que es.',
        'cat.tech': 'Hacemos aplicaciones que aguantan millones de visitas sin caerse.',
        'cat.ai': 'Cerebros digitales a tu servicio.',
        'cat.auto': 'Tu negocio sigue funcionando aunque tú estés durmiendo.',
        'contact.title': '¿Listo para el Control Total?',
        'contact.name': 'Identidad del Operador',
        'contact.email': 'Canal de Comunicación',
        'contact.details': 'Coordenadas del Objetivo',
        'contact.send': 'Iniciar Protocolo',
        'contact.soon': 'Capacidad Operativa Al Límite',
    },
    en: {
        'nav.services': 'Protocols',
        'nav.work': 'Legacy',
        'nav.contact': 'Initiation',
        'hero.subtitle': 'High-End Digital Dominion',
        'hero.more': 'Enter the Singularity',
        'services.title': 'ASCENSION PROTOCOLS',
        'services.select': 'CHOOSE YOUR POWER',
        'service.genesis': 'Authority Genesis',
        'service.hyper': 'Sovereign Architecture',
        'service.cortex': 'Synthetic Intelligence',
        'service.nexus': 'Autonomous Machinery',
        'concept.genesis': 'POWER & PSYCHOLOGY',
        'concept.hyper': 'INFINITE SCALABILITY',
        'concept.cortex': 'NEURAL NETWORK',
        'concept.nexus': 'OPERATIONAL FREEDOM',
        'cat.vision': 'Identity that is felt, not just seen.',
        'cat.tech': 'Infrastructure that dominates, not just functions.',
        'cat.ai': 'Digital brains at your command.',
        'cat.auto': 'Your business earning while you sleep.',
        'contact.title': 'Ready for Total Control?',
        'contact.name': 'Operator Identity',
        'contact.email': 'Comms Channel',
        'contact.details': 'Mission Coordinates',
        'contact.send': 'Initiate Protocol',
        'contact.soon': 'Operational Capacity at Limit',
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
