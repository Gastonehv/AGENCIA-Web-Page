import genesisImg from '../assets/images/genesis-sneaker.jpg';
import digitalArchImg from '../assets/images/architecture-interface.png';
import cognitiveEcoImg from '../assets/images/ai-processor.jpg';
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
        id: 'arquitectura',
        titleKey: 'service.hyper',
        conceptKey: 'concept.hyper',
        descKey: 'cat.tech',
        image: digitalArchImg,
        path: '/arquitectura',
        color: '#05d9e8' // Cyan
    },
    {
        id: 'inteligencia',
        titleKey: 'service.cortex',
        conceptKey: 'concept.cortex',
        descKey: 'cat.ai',
        image: cognitiveEcoImg,
        path: '/ia-generativa',
        color: '#7700ff' // Electric Purple
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
