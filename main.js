import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
renderer.render( scene, camera);

const isaacTexture = new THREE.TextureLoader().load('isaachead.png');
const isaacMaterial = new THREE.MeshBasicMaterial( {map: isaacTexture });

// torus
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347 });
const torus = new THREE.Mesh( 
  geometry, 
  isaacMaterial);
scene.add(torus);

// isaac sphere
const isaac = new THREE.Mesh(
  new THREE.SphereGeometry(3,20,20),
  new THREE.MeshBasicMaterial( {map: isaacTexture })
);
scene.add(isaac);

// stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );
  
  star.position.set(x,y,z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

// lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5)
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  isaac.rotation.x += .01;
  isaac.rotation.y += .1;
  isaac.rotation.z += .01;

  renderer.render( scene, camera);
}

animate();