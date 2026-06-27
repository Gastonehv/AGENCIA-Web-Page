import React from 'react';
import NeuroIdentity from '../components/identity/NeuroIdentity';
import SEO from '../components/SEO';

const Identidad: React.FC = () => {
    return (
        <div className="identidad-page-root">
            <SEO
                title="Identidad visual premium y estrategia de marca"
                description="AgencIA crea identidad visual, narrativa y dirección artística premium para marcas que necesitan verse memorables, elegantes y diferentes."
                keywords="identidad visual premium, branding con IA, estrategia de marca, dirección artística, AgencIA"
                url="https://agenciamx.app/identidad"
                canonical="https://agenciamx.app/identidad"
            />
            <NeuroIdentity />
        </div>
    );
};

export default Identidad;

