import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ISAAC_HEAD_IMAGE from '/static/images/isaachead.png';
import SPACE_IMAGE from '/static/images/space.jpg';
import TERMITE_DANCE from '/static/audio/termitedance.ogg';
//import TERMITE_OBJ from '/static/termite/formica rufa.obj';
//import TERMITE_TEXTURE from '/static/termite/texture.jpg';
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);

let camera, controls, scene, renderer, light, torus, isaac

function init() {
  const overlay = document.getElementById('overlay');
  overlay.remove();
  const scrollWrapper = document.getElementById('scroll-wrapper');
  scrollWrapper.style.display = "block";

  const audioLoader = new THREE.AudioLoader();
  const listener = new THREE.AudioListener();
  camera.add(listener);
  audioLoader.load(TERMITE_DANCE, function (buffer) {
    const audio = new THREE.PositionalAudio(listener);
    audio.setBuffer(buffer);
    audio.setVolume(30);
    audio.setLoop(true);
    isaac.add(audio);
    audio.play();
  })
}

// scene
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})
controls = new OrbitControls(camera, renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

const isaacTexture = new THREE.TextureLoader().load(ISAAC_HEAD_IMAGE);
const isaacMaterial = new THREE.MeshBasicMaterial({ map: isaacTexture });

// torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
torus = new THREE.Mesh(
  geometry,
  isaacMaterial);
scene.add(torus);

// isaac sphere
isaac = new THREE.Mesh(
  new THREE.SphereGeometry(3, 20, 20),
  new THREE.MeshBasicMaterial({ map: isaacTexture })
);
scene.add(isaac);
Array(200).fill().forEach(addStar);

// lights
light = new THREE.AmbientLight(0xffffff);
scene.add(light);

//const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// background
const spaceTexture = new THREE.TextureLoader().load(SPACE_IMAGE);
scene.background = spaceTexture;


// stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

animate();

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  isaac.rotation.x += .01;
  isaac.rotation.y += .1;
  isaac.rotation.z += .01;

  renderer.render(scene, camera);

}