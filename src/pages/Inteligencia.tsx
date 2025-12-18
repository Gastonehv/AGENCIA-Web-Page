import React from 'react';
import IntelligenceScene from '../components/IntelligenceScene';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

const Inteligencia: React.FC = () => {
    return (
        <>
            <SEO
                title="Inteligencia Artificial"
                description="Automatización avanzada y agentes inteligentes para tu negocio. El futuro es ahora."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Inteligencia Artificial",
                "provider": {
                    "@type": "Organization",
                    "name": "AgencIA"
                },
                "description": "Implementación de IA Generativa y agentes autónomos para optimización de procesos."
            }} />
            <IntelligenceScene />
        </>
    );
};

export default Inteligencia;
