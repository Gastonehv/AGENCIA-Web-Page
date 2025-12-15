import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface CanvasSequenceHandle {
    drawFrame: (progress: number) => void;
}

interface CanvasSequenceProps {
    imageUrls?: string[];
    width?: number;
    height?: number;
}

const CanvasSequence = forwardRef<CanvasSequenceHandle, CanvasSequenceProps>(({ imageUrls = [] }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const imagesLoadedRef = useRef<number>(0);
    const totalFrames = imageUrls.length || 100; // Default to 100 for debug mode

    // Preload Images
    useEffect(() => {
        if (imageUrls.length === 0) return;

        imageUrls.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                imagesLoadedRef.current++;
            };
            imagesRef.current[i] = img;
        });
    }, [imageUrls]);

    // Resize Handler (Object-Fit: Cover Logic)
    const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Match screen pixel density for sharpness
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);

        // Force redraw of current frame (not cached here, but handled by next tick usually)
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useImperativeHandle(ref, () => ({
        drawFrame: (progress: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            // Clamp progress 0-1
            const safeProgress = Math.max(0, Math.min(1, progress));
            const frameIndex = Math.floor(safeProgress * (totalFrames - 1));

            // Clear
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            // DRAW IMAGE (If available)
            if (imageUrls.length > 0 && imagesRef.current[frameIndex]) {
                const img = imagesRef.current[frameIndex];
                if (img.complete) {
                    // Calculate "cover" dimensions
                    const imgRatio = img.width / img.height;
                    const canvasRatio = w / h;
                    let renderW, renderH, offsetX, offsetY;

                    if (canvasRatio > imgRatio) {
                        renderW = w;
                        renderH = w / imgRatio;
                        offsetX = 0;
                        offsetY = (h - renderH) / 2;
                    } else {
                        renderH = h;
                        renderW = h * imgRatio;
                        offsetX = (w - renderW) / 2;
                        offsetY = 0;
                    }
                    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
                }
            }
            // DEBUG MODE (If no images)
            else {
                // Background cycle
                const hue = Math.floor(safeProgress * 360);
                ctx.fillStyle = `hsl(${hue}, 50%, 20%)`; // Dark dynamic background
                ctx.fillRect(0, 0, w, h);

                // Grid
                ctx.strokeStyle = `rgba(255,255,255,0.1)`;
                ctx.beginPath();
                for (let i = 0; i < w; i += 100) { ctx.moveTo(i, 0); ctx.lineTo(i, h); }
                ctx.stroke();

                // Text info
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 40px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`SEQUENCE PLACEHOLDER`, w / 2, h / 2 - 40);
                ctx.fillText(`FRAME: ${frameIndex} / ${totalFrames}`, w / 2, h / 2 + 40);
                ctx.fillText(`(Add images to imageUrls prop)`, w / 2, h / 2 + 90);
            }
        }
    }));

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'block'
            }}
        />
    );
});

export default CanvasSequence;
