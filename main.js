import '/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ISAAC_HEAD_IMAGE from '/static/images/isaachead.png';
import SPACE_IMAGE from '/static/images/space.jpg';
import TERMITE_DANCE from '/static/audio/termitedance.ogg';
//import TERMITE_OBJ from '/static/termite/formicarufa.obj';
import TERMITE_TEXTURE from '/static/termite/texture.jpg';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


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

const isaacTexture = new THREE.TextureLoader().load(ISAAC_HEAD_IMAGE);
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
//scene.add(isaac);

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
scene.add(pointLight);
scene.add(ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// background
const spaceTexture = new THREE.TextureLoader().load(SPACE_IMAGE);
scene.background = spaceTexture;

// termite
const textureLoader = new THREE.TextureLoader();
const termiteMap = textureLoader.load(TERMITE_TEXTURE);
const termiteMaterial = new THREE.MeshPhongMaterial({map: termiteMap});

const termiteLoader = new OBJLoader();
termiteLoader.load(
	'/static/termite/formica rufa.obj',
	function ( object ) {
    object.traverse( function ( node ) {
      if (node.isMesh ) node.materia = termiteMaterial;
    });
		scene.add( object );
	});


// audio
const listener = new THREE.AudioListener;
camera.add( listener );
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load( TERMITE_DANCE, function ( buffer ) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});
sound.setVolume(1);
sound.play();

function animate(){
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;

  isaac.rotation.x += .01;
  isaac.rotation.y += .1;
  isaac.rotation.z += .01;

  renderer.render( scene, camera);

  //controls.update();
}

animate();