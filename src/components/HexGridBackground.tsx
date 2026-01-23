import React, { useEffect, useRef } from 'react';

interface HexGridBackgroundProps {
    isVisible?: boolean;
    scrollProgress?: number;
}

const HexGridBackground: React.FC<HexGridBackgroundProps> = ({ isVisible = true, scrollProgress = 0 }) => {
    const canvas0Ref = useRef<HTMLCanvasElement>(null);
    const canvas1Ref = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(0);

    useEffect(() => {
        progressRef.current = scrollProgress;
    }, [scrollProgress]);

    useEffect(() => {
        if (!isVisible) return;

        const c0 = canvas0Ref.current;
        const c1 = canvas1Ref.current;
        if (!c0 || !c1) return;

        // --- CONSTANTS FROM ARTIST (Ana Tudor) ---
        const HEX_CRAD = 32;
        const HEX_BG = '#171717';
        const HEX_HL = '#2a2a2a'; // Dark grey baseline
        const HEX_HLW = 2;
        const HEX_GAP = 4;

        // CUSTOM GREEN PALETTE (User Request: "Mas visible el color verde")
        const NEON_PALETE = [
            '#00FF00', // Pure Green
            '#39FF14', // Neon Green
            '#ccff00', // Acid Green
            '#00FA9A', // Spring Green
            '#7FFF00'  // Chartreuse
        ];
        const T_SWITCH = 64;

        // Math Shorthands (Mimicking Math.[p])
        const { PI, sqrt, sin, cos, pow, round } = Math;

        let w: number, h: number, _min: number;
        let ctx: CanvasRenderingContext2D[] = [];
        let source: { x: number, y: number } | null = null;
        let t = 0;
        let request_id: number;
        let grid: Grid;

        const unit_x = 3 * HEX_CRAD + HEX_GAP * sqrt(3);
        const unit_y = HEX_CRAD * sqrt(3) * 0.5 + 0.5 * HEX_GAP;
        const off_x = 1.5 * HEX_CRAD + HEX_GAP * sqrt(3) * 0.5;

        // Palette Processing
        const wp = NEON_PALETE.map(c => {
            const num = parseInt(c.replace('#', ''), 16);
            return {
                r: num >> 16 & 0xFF,
                g: num >> 8 & 0xFF,
                b: num & 0xFF
            };
        });
        const nwp = wp.length;
        let csi = 0;
        const f = 1 / T_SWITCH;

        class GridItem {
            x: number; y: number;
            points: { hex: { x: number, y: number }[], hl: { x: number, y: number }[][] };

            constructor(x: number, y: number) {
                this.x = x || 0;
                this.y = y || 0;
                this.points = { hex: [], hl: [] };
                this.init();
            }

            init() {
                const ba = PI / 3;
                const ri = HEX_CRAD - 0.5 * HEX_HLW;

                for (let i = 0; i < 6; i++) {
                    const a = i * ba;
                    const x = this.x + HEX_CRAD * cos(a);
                    const y = this.y + HEX_CRAD * sin(a);

                    this.points.hex.push({ x, y });

                    if (i > 0) {
                        this.points.hl.push([
                            { x: this.x + ri * cos(a - ba), y: this.y + ri * sin(a - ba) },
                            { x: this.x + ri * cos(a), y: this.y + ri * sin(a) }
                        ]);
                    }
                }

                // Close the loop for hl
                this.points.hl.push([
                    { x: this.x + ri * cos(5 * ba), y: this.y + ri * sin(5 * ba) },
                    { x: this.x + ri * cos(6 * ba), y: this.y + ri * sin(6 * ba) }
                ]);
            }

            draw(ct: CanvasRenderingContext2D, offsetX: number) {
                ct.beginPath();
                for (let i = 0; i < 6; i++) {
                    const px = this.points.hex[i].x + offsetX;
                    const py = this.points.hex[i].y;
                    if (i === 0) ct.moveTo(px, py);
                    else ct.lineTo(px, py);
                }
                ct.closePath();
                ct.fill();
                ct.stroke();
            }

            highlight(ct: CanvasRenderingContext2D, offsetX: number, weight: number) {
                for (let i = 0; i < 6; i++) {
                    ct.setLineDash([weight * HEX_CRAD, (1 - weight) * HEX_CRAD]);
                    ct.beginPath();
                    ct.moveTo(this.points.hl[i][0].x + offsetX, this.points.hl[i][0].y);
                    ct.lineTo(this.points.hl[i][1].x + offsetX, this.points.hl[i][1].y);
                    ct.stroke();
                }
            }
        }

        class Grid {
            items: GridItem[] = [];
            constructor(rows: number, cols: number) {
                for (let row = 0; row < rows; row++) {
                    const y = row * unit_y;
                    for (let col = 0; col < cols; col++) {
                        const x = ((row % 2 === 0) ? 0 : off_x) + col * unit_x;
                        this.items.push(new GridItem(x, y));
                    }
                }
            }

            draw(ct: CanvasRenderingContext2D, offsetX: number) {
                ct.fillStyle = HEX_BG;
                ct.strokeStyle = HEX_HL;
                ct.lineWidth = HEX_HLW;
                this.items.forEach(item => item.draw(ct, offsetX));
            }

            highlight(ct: CanvasRenderingContext2D, offsetX: number, r: number, g: number, b: number) {
                this.items.forEach(item => {
                    const dist = source ? sqrt(pow(item.x + offsetX - source.x, 2) + pow(item.y - source.y, 2)) : 0;
                    // Boosted brightness from 1.2 to 2.5 for maximum "visible green" impact
                    const weight = 2.5 * pow(0.5 * (sin(dist / _min * PI - t / T_SWITCH * PI) + 1), 2);

                    if (weight > 0.1) {
                        // Clamp alpha to max 1.0 to avoid invalid rgba values
                        const alpha = Math.min(1, weight);
                        ct.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                        item.highlight(ct, offsetX, alpha);
                    }
                });
            }
        }

        const resize = () => {
            const parent = c0.parentElement;
            if (!parent) return;
            w = parent.clientWidth;
            h = parent.clientHeight;
            _min = 0.5 * sqrt(w * w + h * h);

            [c0, c1].forEach((canvas, i) => {
                canvas.width = w;
                canvas.height = h;
                ctx[i] = canvas.getContext('2d')!;
            });

            grid = new Grid(Math.ceil(h / unit_y) + 1, Math.ceil(w / unit_x) + 20); // Massive buffer for parallax sweep
            if (!source) source = { x: w / 2, y: h / 2 };
        };

        const render = () => {
            t++;
            const offsetX = w * (0.2 - 1.2 * progressRef.current); // Optimized parallax sweep

            // Background Layer
            ctx[0].fillStyle = '#121212';
            ctx[0].fillRect(0, 0, w, h);
            if (grid) grid.draw(ctx[0], offsetX);

            // Neon Layer
            ctx[1].clearRect(0, 0, w, h);
            ctx[1].lineWidth = HEX_HLW;
            ctx[1].lineCap = 'round';
            ctx[1].globalCompositeOperation = 'lighter'; // Additive glow

            const csc = (t % T_SWITCH) * f;
            const next_csi = (csi + 1) % nwp;

            const r = round((1 - csc) * wp[csi].r + csc * wp[next_csi].r);
            const g = round((1 - csc) * wp[csi].g + csc * wp[next_csi].g);
            const b = round((1 - csc) * wp[csi].b + csc * wp[next_csi].b);

            if (t % T_SWITCH === 0) csi = next_csi;

            if (grid) grid.highlight(ctx[1], offsetX, r, g, b);

            request_id = requestAnimationFrame(render);
        };

        const move = (e: MouseEvent | TouchEvent) => {
            const pos = 'touches' in e ? e.touches[0] : (e as MouseEvent);
            source = { x: pos.clientX, y: pos.clientY };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', move);
        resize();
        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', move);
            cancelAnimationFrame(request_id);
        };
    }, [isVisible]);

    return (
        <div className="hex-grid-container" style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 25,
            pointerEvents: 'none',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s ease',
        }}>
            <canvas ref={canvas0Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
            <canvas ref={canvas1Ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        </div>
    );
};

export default HexGridBackground;
