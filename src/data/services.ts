import genesisImg from '../assets/images/genesis-sneaker.jpg';
import digitalArchImg from '../assets/images/architecture-interface.png';

import processSyncImg from '../assets/images/automation-growth.jpg';

export interface ServicePortal {
    id: string;
    titleKey: string;
    conceptKey: string;
    descKey: string;
    image: string;
    path: string;
    color: string;
}

export const servicesData: ServicePortal[] = [
    {
        id: 'identidad',
        titleKey: 'service.genesis',
        conceptKey: 'concept.genesis',
        descKey: 'cat.vision',
        image: genesisImg,
        path: '/identidad',
        color: '#ff2a6d' // Neon Red
    },
    {
        id: 'infraestructura',
        titleKey: 'service.hyper',
        conceptKey: 'concept.hyper',
        descKey: 'cat.tech',
        image: digitalArchImg,
        path: '/infraestructura',
        color: '#05d9e8' // Cyan
    },

    {
        id: 'automatizacion',
        titleKey: 'service.nexus',
        conceptKey: 'concept.nexus',
        descKey: 'cat.auto',
        image: processSyncImg,
        path: '/automatizacion',
        color: '#00ff9d' // Neon Green
    }
];
