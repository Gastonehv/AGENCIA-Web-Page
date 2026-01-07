import React from 'react';
import AutomationScene from '../components/automation/AutomationScene';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

const Automatizacion: React.FC = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000' }}>
            <SEO title="Automatización & Plataforma 360" description="Eficiencia imposible para humanos. Ecosistema de gestión total y agentes autónomos." />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Automatización",
                "description": "Sistemas de gestión empresarial 360 y agentes de IA autónomos."
            }} />

            {/* 3D SCENE & NARRATIVE OVERLAY */}
            <AutomationScene />
        </div>
    );
};

export default Automatizacion;
