import React from 'react';
import NeuroIdentity from '../components/identity/NeuroIdentity';
import SEO from '../components/SEO';

const Identidad: React.FC = () => {
    return (
        <div className="identidad-page-root">
            <SEO
                title="Neuro-Glass | La Identidad del Futuro"
                description="Conoce el origen de Neuro-Glass. Una historia de evolución, data y diseño forjada por A.L.M.A."
            />
            <NeuroIdentity />
        </div>
    );
};

export default Identidad;

