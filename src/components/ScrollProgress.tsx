import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const trigger = ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
                setProgress(self.progress);
            }
        });

        return () => trigger.kill();
    }, []);

    return (
        <div
            className="scroll-progress-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                zIndex: 9999,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                pointerEvents: 'none'
            }}
        >
            <div
                className="scroll-progress-bar"
                style={{
                    height: '100%',
                    width: `${progress * 100}%`,
                    backgroundColor: '#BB00FF',
                    boxShadow: '0 0 10px #BB00FF, 0 0 20px rgba(187, 0, 255, 0.5)',
                    transition: 'width 0.1s ease-out'
                }}
            />
        </div>
    );
};

export default ScrollProgress;
