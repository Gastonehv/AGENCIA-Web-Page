import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 1, 100);
camera.position.z = 5;
camera.position.y = -4;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = false;
ctrls.enableZoom = false;
ctrls.enablePan = false;
ctrls.enableRotate = false;

function createTextTexture() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    context.imageSmoothingEnabled = true;

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'white';
    context.font = 'bold 45px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const text = 'VORTEX'; // Change text here
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 89;

    const horizontalSpacing = textWidth * .4;
    const verticalSpacing = textHeight * 2.3;

    for (let x = horizontalSpacing / 2; x < canvas.width; x += horizontalSpacing) {
        for (let y = verticalSpacing / 2; y < canvas.height; y += verticalSpacing) {
            context.save();
            context.translate(x, y);
            context.rotate(Math.PI / 2);
            context.fillText(text, 0, 0);
            context.restore();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
}

const torusKnotGeo = new THREE.TorusGeometry(5, 3.8, 60, 100);
const textTexture = createTextTexture();
const torusKnotMat = new THREE.MeshStandardMaterial({
    map: textTexture,
    roughness: 0.1,
    metalness: 0.1
});
const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
torusKnot.rotation.x = Math.PI * 0.01;
scene.add(torusKnot);

const spotLight = new THREE.SpotLight('#ffffff', 100);
spotLight.angle = Math.PI / 4.3;
spotLight.penumbra = .25;
spotLight.position.set(0, -0.2, 9);
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

function animate(t = 0) {
    requestAnimationFrame(animate);
    torusKnot.rotation.z = t * 0.0002;
    const speed = 0.00004;
    textTexture.offset.y = - (t * speed) % 1;

    renderer.render(scene, camera);
    ctrls.update();
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
