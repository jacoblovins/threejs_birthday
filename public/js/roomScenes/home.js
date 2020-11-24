/* eslint-disable prettier/prettier */
import * as THREE from "/build/three.module.js";
import { FirstPersonControls } from "/jsm/controls/FirstPersonControls.js";
// import Stats from "/jsm/libs/stats.module.js";
import { GLTFLoader } from "/jsm/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from "/jsm/renderers/CSS3DRenderer.js";
import { VRButton } from "/jsm/webxr/VRButton.js";



function startHomeRoom() {
  // --------------------------------------------------------------------------------
  // Initial scene setup and render to the HTML page
  // --------------------------------------------------------------------------------

  const clock = new THREE.Clock();
  const townScene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 3.9;
  camera.position.y = 1.7;
  // camera.rotation.y = 180 * Math.PI / 180;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = 0;
  document.body.appendChild(renderer.domElement);

  const renderer2 = new CSS3DRenderer();
  renderer2.setSize(window.innerWidth, window.innerHeight);
  renderer2.domElement.style.position = "absolute";
  renderer2.domElement.style.top = 0;
  document.body.appendChild(renderer2.domElement);

  const domEvents2	= new THREEx.DomEvents(camera, renderer2.domElement);
  document.body.appendChild( VRButton.createButton( renderer ) );
  renderer.xr.enabled = true;
  
  // --------------------------------------------------------------------------------
  // Movement Controls
  // --------------------------------------------------------------------------------

  const controls = new FirstPersonControls( camera, renderer2.domElement );
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.08;
  controls.lookVertical = false;

  const homeMaterial = new THREE.MeshBasicMaterial({ wireframe: false, transparent: true, opacity: 0 });
  const homeGeometry = new THREE.PlaneGeometry(2.2, 3.5, 1);
  const homeMesh = new THREE.Mesh(homeGeometry, homeMaterial);
  townScene.add(homeMesh);

  domEvents2.addEventListener(homeMesh, "mouseover", () => {
    controls.activeLook = false;
  }, false);

  domEvents2.addEventListener(homeMesh, "mouseout", () => {
    controls.activeLook = true;
  }, false);
  
  // --------------------------------------------------------------------------------
  // Load the GLTF Scene I created
  // --------------------------------------------------------------------------------

  const loader = new GLTFLoader();
  loader.load(
    "../img/homeRoom.glb",
    (gltf) => {
    // called when the resource is loaded
      townScene.add(gltf.scene);
    },
    (xhr) => {
    // called while loading is progressing
      console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
    },
    (error) => {
    // called when loading has errors
      console.error("An error happened", error);
    },
  );

  // --------------------------------------------------------------------------------
  // Lighting
  // --------------------------------------------------------------------------------

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
  townScene.add(directionalLight);


  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.2);
  townScene.add(hemiLight);

  // --------------------------------------------------------------------------------
  // Clickable exit door
  // --------------------------------------------------------------------------------

  const doorMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  const doorGeometry = new THREE.PlaneGeometry(2, 2.55, 1);
  const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
  doorMesh.rotation.y = 90 * Math.PI / 90;
  doorMesh.position.set(0, 1.17, 5);
  townScene.add(doorMesh);

  domEvents2.addEventListener(doorMesh, "click", () => {
    console.log("you clicked on the mesh");
    document.location.reload();
  }, false);

  // --------------------------------------------------------------------------------
  // Henry's TV
  // --------------------------------------------------------------------------------

  const texture = new THREE.TextureLoader().load( '../../img/henryTV.jpg' );
  const tvMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const tvGeometry = new THREE.PlaneGeometry(3.3, 1.9, 1);
  const tvMesh = new THREE.Mesh(tvGeometry, tvMaterial);
  // tvMesh.rotation.y = 90 * Math.PI / 90;
  tvMesh.position.set(.1, 1.38, -4.77);
  townScene.add(tvMesh);

  // --------------------------------------------------------------------------------
  // Click cake for audio
  // --------------------------------------------------------------------------------

  const cakeMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  const cakeGeometry = new THREE.PlaneGeometry(.5, .4, 1);
  const cakeMesh = new THREE.Mesh(cakeGeometry, cakeMaterial);
  // cakeMesh.rotation.y = 90 * Math.PI / 90;
  cakeMesh.position.set(-.1, 1.084, -.65);
  townScene.add(cakeMesh);

  domEvents2.addEventListener(cakeMesh, "click", () => {
    console.log("you clicked on the mesh");
    audio.play()
  }, false);

  // --------------------------------------------------------------------------------
  // Audio Loader
  // --------------------------------------------------------------------------------
  const audioListener = new THREE.AudioListener();
  camera.add(audioListener)
  const audio = new THREE.Audio(audioListener);
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('../../img/birthSong.mp3', (mp3 => {
    audio.setBuffer(mp3);
  }))



  // --------------------------------------------------------------------------------
  // Resize Update/ Re-render
  // --------------------------------------------------------------------------------

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer2.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    render();
  }, false);

  // --------------------------------------------------------------------------------
  // Frame Rate (remove this later)
  // --------------------------------------------------------------------------------

  // const stats = Stats();
  // document.body.appendChild(stats.dom);

  // --------------------------------------------------------------------------------
  // Render all the above code every time the screen refreshes (hopefully 60fps)
  // --------------------------------------------------------------------------------

  const animate = function () {
    // requestAnimationFrame(animate);
    if(camera.position.x < -3){
      camera.position.x = -3;
    } else if(camera.position.x > 3){
      camera.position.x = 3;
    } else if(camera.position.z > 4){
      camera.position.z = 4;
    } else if(camera.position.z < -4){
      camera.position.z = -4;
    } else if (camera.position.y < 1.7 || camera.position.y > 1.7) {
      camera.position.y = 1.7;
    }
    render();
    // stats.update();
  };

  renderer.setAnimationLoop(animate);
  // animate();
  
  function render() {
    controls.update( clock.getDelta() );
    renderer.render(townScene, camera);
    renderer2.render(townScene, camera);
    homeMesh.rotation.copy( camera.rotation );
    homeMesh.position.copy( camera.position );
    homeMesh.updateMatrix();
    homeMesh.translateZ( - 2 );
  }

}
export { startHomeRoom as default };

