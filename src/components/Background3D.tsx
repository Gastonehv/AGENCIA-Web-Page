import React, { useEffect, useRef } from 'react';
// @ts-expect-error - external lib without types
import attraction from 'threejs-components/build/cursors/attraction1.min.js';

const Background3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let cursor: { destroy?: () => void; dispose?: () => void } | null = null;

        try {
            // Handle both default and named exports
            // Some builds might export the class as default, others as a named export
            const AttractionCursor = attraction.AttractionCursor || attraction;

            if (typeof AttractionCursor !== 'function') {
                console.error("AttractionCursor is not a constructor:", AttractionCursor);
                return;
            }

            console.log("Initializing AttractionCursor on canvas:", canvasRef.current);
            cursor = new AttractionCursor(canvasRef.current, {
                particles: {
                    size: 1.5 / 8, // 1/8th of the reference size (1.5)
                    number: 40, // Slightly reduced to avoid clutter in tight space
                    color: 0xffffff // White particles
                },
                attractionIntensity: 5.0, // Extreme attraction
                radius: 100, // Minimal radius: tight orbit
                maxSpeed: 20, // Very fast response
            });
            console.log("Cursor initialized:", cursor);
        } catch (e) {
            console.error("Failed to initialize AttractionCursor:", e);
        }

        return () => {
            if (cursor) {
                try {
                    // Attempt cleanup if available
                    if (typeof cursor.destroy === 'function') cursor.destroy();
                    else if (typeof cursor.dispose === 'function') cursor.dispose();
                } catch (cleanupError) {
                    console.warn("Error during cursor cleanup:", cleanupError);
                }
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -5,
                background: '#000',
                pointerEvents: 'auto' // Ensure it captures interactions
            }}
        />
    );
};

export default Background3D;
