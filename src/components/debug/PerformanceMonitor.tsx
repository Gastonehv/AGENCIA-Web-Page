import { useEffect } from 'react';
import Stats from 'stats.js';

const PerformanceMonitor = () => {
    useEffect(() => {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

        // Style adjustments to fit the "Dev Mode" aesthetic
        stats.dom.style.position = 'fixed';
        stats.dom.style.top = 'auto';
        stats.dom.style.bottom = '10px';
        stats.dom.style.left = '10px';
        stats.dom.style.zIndex = '9999';
        stats.dom.style.opacity = '0.8';
        stats.dom.style.pointerEvents = 'none';

        document.body.appendChild(stats.dom);

        let animationFrameId: number;

        const animate = () => {
            stats.begin();
            // monitored code goes here
            stats.end();
            animationFrameId = requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.body.removeChild(stats.dom);
        };
    }, []);

    return null;
};

export default PerformanceMonitor;
