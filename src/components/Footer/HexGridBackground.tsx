import React, { useEffect, useRef } from 'react';

const HexGridBackground: React.FC = () => {
    const canvasRef1 = useRef<HTMLCanvasElement>(null);
    const canvasRef2 = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const c1 = canvasRef1.current;
        const c2 = canvasRef2.current;
        if (!c1 || !c2) return;

        const ctx1 = c1.getContext('2d');
        const ctx2 = c2.getContext('2d');
        if (!ctx1 || !ctx2) return;

        // --- CONSTANTS & VARS FROM ORIGINAL CODE ---
        const HEX_CRAD = 32;
        const HEX_BG = '#171717';
        const HEX_HL = '#2a2a2a';
        const HEX_HLW = 2;
        const HEX_GAP = 4;
        const NEON_PALETE = [
            '#0000ff', // Azul (Electric)
            '#7F00FF'  // Morado (User Specified)
        ];
        const T_SWITCH = 32; // Faster transition (Heartbeat rhythm)

        const unit_x = 3 * HEX_CRAD + HEX_GAP * Math.sqrt(3);
        const unit_y = HEX_CRAD * Math.sqrt(3) * 0.5 + 0.5 * HEX_GAP;
        const off_x = 1.5 * HEX_CRAD + HEX_GAP * Math.sqrt(3) * 0.5;

        // Extract work palette
        const wp = NEON_PALETE.map(function (c) {
            const num = parseInt(c.replace('#', ''), 16);
            return {
                'r': num >> 16 & 0xFF,
                'g': num >> 8 & 0xFF,
                'b': num & 0xFF
            };
        });

        const nwp = wp.length;
        let csi = 0;
        const f = 1 / T_SWITCH;

        let w = 0;
        let h = 0;
        let _min = 0;
        let source: { x: number, y: number } | null = null;
        let t = 0;
        let request_id: number | null = null;

        // --- CLASSES ---

        class GridItem {
            x: number;
            y: number;
            points: { hex: { x: number, y: number }[], hl: { x: number, y: number }[] };

            constructor(x: number, y: number) {
                this.x = x || 0;
                this.y = y || 0;
                this.points = { 'hex': [], 'hl': [] };
                this.init();
            }

            init() {
                let x, y, a;
                const ba = Math.PI / 3;
                const ri = HEX_CRAD - 0.5 * HEX_HLW;

                for (let i = 0; i < 6; i++) {
                    a = i * ba;
                    x = this.x + HEX_CRAD * Math.cos(a);
                    y = this.y + HEX_CRAD * Math.sin(a);

                    this.points.hex.push({ 'x': x, 'y': y });

                    if (i > 2) {
                        x = this.x + ri * Math.cos(a);
                        y = this.y + ri * Math.sin(a);
                        this.points.hl.push({ 'x': x, 'y': y });
                    }
                }
            }

            draw(ct: CanvasRenderingContext2D) {
                for (let i = 0; i < 6; i++) {
                    if (i === 0) {
                        ct.moveTo(this.points.hex[i].x, this.points.hex[i].y);
                    } else {
                        ct.lineTo(this.points.hex[i].x, this.points.hex[i].y);
                    }
                }
            }

            highlight(ct: CanvasRenderingContext2D) {
                for (let i = 0; i < 3; i++) {
                    if (i === 0) {
                        ct.moveTo(this.points.hl[i].x, this.points.hl[i].y);
                    } else {
                        ct.lineTo(this.points.hl[i].x, this.points.hl[i].y);
                    }
                }
            }
        }

        class Grid {
            cols: number;
            rows: number;
            items: GridItem[];
            n: number;

            constructor(rows: number, cols: number) {
                this.cols = cols || 16;
                this.rows = rows || 16;
                this.items = [];
                this.n = 0;
                this.init();
            }

            init() {
                let x, y;
                for (let row = 0; row < this.rows; row++) {
                    y = row * unit_y;
                    for (let col = 0; col < this.cols; col++) {
                        x = ((row % 2 === 0) ? 0 : off_x) + col * unit_x;
                        this.items.push(new GridItem(x, y));
                    }
                }
                this.n = this.items.length;
            }

            draw(ct: CanvasRenderingContext2D) {
                ct.fillStyle = HEX_BG;
                ct.beginPath();
                for (let i = 0; i < this.n; i++) {
                    this.items[i].draw(ct);
                }
                ct.closePath();
                ct.fill();

                ct.strokeStyle = HEX_HL;
                ct.beginPath();
                for (let i = 0; i < this.n; i++) {
                    this.items[i].highlight(ct);
                }
                ct.closePath();
                ct.stroke();
            }
        }

        let grid: Grid | null = null;

        // --- FUNCTIONS ---

        const fillBackground = (bg_fill: string | CanvasGradient) => {
            ctx1.fillStyle = bg_fill;
            ctx1.beginPath();
            ctx1.rect(0, 0, w, h);
            ctx1.closePath();
            ctx1.fill();
        };

        const neon = () => {
            const k = (t % T_SWITCH) * f;
            const rgb = {
                'r': Math.floor(wp[csi].r * (1 - k) + wp[(csi + 1) % nwp].r * k),
                'g': Math.floor(wp[csi].g * (1 - k) + wp[(csi + 1) % nwp].g * k),
                'b': Math.floor(wp[csi].b * (1 - k) + wp[(csi + 1) % nwp].b * k)
            };
            const rgb_str = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';

            const light = ctx1.createRadialGradient(
                source?.x || w / 2, source?.y || h / 2, 0,
                source?.x || w / 2, source?.y || h / 2, 0.875 * _min
            );

            const stp = 0.5 - 0.5 * Math.sin(7 * t * f) * Math.cos(5 * t * f) * Math.sin(3 * t * f);

            light.addColorStop(0, rgb_str);
            light.addColorStop(stp, 'rgba(0,0,0,.03)');

            fillBackground('rgba(0,0,0,.02)');
            fillBackground(light);

            t++;

            if (t % T_SWITCH === 0) {
                csi++;
                if (csi === nwp) {
                    csi = 0;
                    t = 0;
                }
            }

            request_id = requestAnimationFrame(neon);
        };

        const init = () => {
            // Get dimensions from container instead of computing style of canvas to be more robust in React
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            w = rect.width;
            h = rect.height;

            _min = 0.75 * Math.min(w, h);

            const rows = Math.floor(h / unit_y) + 2;
            const cols = Math.floor(w / unit_x) + 2;

            c1.width = w;
            c1.height = h;
            c2.width = w;
            c2.height = h;

            grid = new Grid(rows, cols);
            grid.draw(ctx2);

            if (!source) {
                source = { 'x': Math.floor(w / 2), 'y': Math.floor(h / 2) };
            }

            if (request_id) cancelAnimationFrame(request_id);
            neon();
        };

        // --- EVENTS ---

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Need to account for canvas position if it's not full screen/fixed,
            // but user code said canvas is fixed width 100%.
            // Better to use clientX relative to viewport if fixed, or offset if absolute.
            // Given the footer context, clientX/Y is good if we want the light to follow mouse anywhere on screen.
            source = { 'x': e.clientX, 'y': e.clientY };

            // If we want it relative to the footer only:
            // const rect = c1.getBoundingClientRect();
            // source = { 'x': e.clientX - rect.left, 'y': e.clientY - rect.top };
            // BUT, user code used clientX/Y on window, implying global follow. 
            // Accessing the footer usually implies we are at the bottom, so clientY might need adjustment if we want "flashlight effect" strictly on the footer surface.
            // Let's stick to global clientX/Y to match "EXACT" request logic, but mapped to canvas space.
            // Since canvas is fixed/absolute covering the footer, we need local coordinates for the gradient to be drawn correctly *on the canvas*.
            // If the canvas is position: absolute inside footer, (0,0) is top-left of footer.
            // e.clientY is top of VIEWPORT.
            // So we need to convert viewport coordinates to canvas local coordinates.
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                source = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        // Initial start
        init();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (request_id) cancelAnimationFrame(request_id);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                overflow: 'hidden',
                backgroundColor: '#121212'
            }}
        >
            <canvas
                ref={canvasRef1}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                }}
            />
            <canvas
                ref={canvasRef2}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 2
                }}
            />
        </div>
    );
};

export default HexGridBackground;
