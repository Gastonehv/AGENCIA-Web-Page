declare module 'three-nebula' {
    import * as THREE from 'three';
    export default class Nebula {
        static fromJSONAsync(json: any, three: any): Promise<Nebula>;
        emitters: any[]; // Add emitters property
        addRenderer(renderer: any): void;
        destroy(): void;
        update(delta: number): void;
    }
    export class SpriteRenderer {
        constructor(scene: THREE.Scene, three: any);
    }
}
