import React from 'react';

import HeroOverlay from './hero/HeroOverlay';

const Hero: React.FC = () => {
    return (
        <section id="hero-section" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {/* Scene removed to allow global Background3D to show through */}
            <HeroOverlay />
        </section>
    );
};

export default Hero;
