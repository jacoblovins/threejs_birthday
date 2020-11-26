/* eslint-disable prettier/prettier */
import * as THREE from "/build/three.module.js";
import { FirstPersonControls } from "/jsm/controls/FirstPersonControls.js";
// import Stats from "/jsm/libs/stats.module.js";
import { GLTFLoader } from "/jsm/loaders/GLTFLoader.js";
// import startSchoolRoom from "./roomScenes/school.js";
import startOfficeRoom from "./roomScenes/office.js";
import startStoreRoom from "./roomScenes/store.js";
import startHomeRoom from "./roomScenes/home.js";
import { VRButton } from "/jsm/webxr/VRButton.js";

function startTown() {
  // --------------------------------------------------------------------------------
  // Initial scene setup and render to the HTML page
  // --------------------------------------------------------------------------------
  
  const clock = new THREE.Clock();

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 8;
  camera.position.y = 2;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  document.body.appendChild( VRButton.createButton( renderer ) );
  renderer.xr.enabled = true;

  // --------------------------------------------------------------------------------
  // Movement Controls
  // --------------------------------------------------------------------------------

  const controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.08;
  controls.lookVertical = false;

  const mouseMaterial = new THREE.MeshBasicMaterial({ wireframe: false, transparent: true, opacity: 0 });
  const mouseGeometry = new THREE.PlaneGeometry(2.2, 3.5, 1);
  const mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
  scene.add(mouseMesh);

  domEvents.addEventListener(mouseMesh, "mouseover", () => {
    controls.activeLook = false;
  }, false);

  domEvents.addEventListener(mouseMesh, "mouseout", () => {
    controls.activeLook = true;
  }, false);


  // --------------------------------------------------------------------------------
  // Load the GLTF Scene I created
  // --------------------------------------------------------------------------------

  const loader = new GLTFLoader();
  loader.load(
    "../img/henrys.glb",
    (gltf) => {
      // called when the resource is loaded
      scene.add(gltf.scene);
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
  scene.add(directionalLight);


  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.2);
  scene.add(hemiLight);

  // --------------------------------------------------------------------------------
  // Updateable Text for Signs
  // --------------------------------------------------------------------------------

  const fontLoader = new THREE.FontLoader();

  fontLoader.load("../fonts/Roboto_Bold.json", (font) => {

    // Office
    const officeText = new THREE.TextGeometry("Jake's Garage", {
      font: font,
      size: .7,
      height: .1,
      curveSegments: 12,
    });
    const officeMesh = new THREE.Mesh(officeText, new THREE.MeshStandardMaterial({
      color: "black",
      metalness: 0.0,
      roughness: 0.5,
      side: THREE.DoubleSide
    }));
    officeMesh.position.set(12, 7, -11);
    officeMesh.rotation.y = Math.PI * 180;
    scene.add(officeMesh);


    // Store
    const storeText = new THREE.TextGeometry("Henry's Garage", {
      font: font,
      size: .7,
      height: .5,
      curveSegments: 12,
    });
    const storeMesh = new THREE.Mesh(storeText, new THREE.MeshStandardMaterial({
      color: "black",
      metalness: 0.0,
      roughness: 0.5,
      side: THREE.DoubleSide
    }));
    storeMesh.position.set(-3.2, 7, -11.5);
    storeMesh.rotation.y = Math.PI * 180;
    scene.add(storeMesh);
  });

  // --------------------------------------------------------------------------------
  // Chick Fil A sign
  // --------------------------------------------------------------------------------  

  const texture = new THREE.TextureLoader().load( '../../img/logo.jpg' );
  const chickMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const chickGeometry = new THREE.PlaneGeometry(3.3, 1.9, 1);
  const chickMesh = new THREE.Mesh(chickGeometry, chickMaterial);
  chickMesh.rotation.y = 90 * Math.PI / 180;
  chickMesh.position.set(-11.4, 4.95, 8.25);
  scene.add(chickMesh);

  // --------------------------------------------------------------------------------
  // Clickable doors
  // --------------------------------------------------------------------------------

  // create the office door mesh
  const officeMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  const officeGeometry = new THREE.PlaneGeometry(6.5, 6.5, 1);
  const officeMesh = new THREE.Mesh(officeGeometry, officeMaterial);
  officeMesh.rotation.y = Math.PI * 180;
  officeMesh.position.set(15, 2, -12.6);
  scene.add(officeMesh);

  // create the store door mesh
  const storeMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  const storeGeometry = new THREE.PlaneGeometry(6.5, 6.5, 1);
  const storeMesh = new THREE.Mesh(storeGeometry, storeMaterial);
  storeMesh.rotation.y = Math.PI * 180;
  storeMesh.position.set(0, 2, -12.5);
  scene.add(storeMesh);

  // create the home door mesh
  const homeMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  const homeGeometry = new THREE.PlaneGeometry(1.4, 3.5, 1);
  const homeMesh = new THREE.Mesh(homeGeometry, homeMaterial);
  homeMesh.rotation.y = Math.PI / -2;
  homeMesh.position.set(22.3, 1.7, 6);
  scene.add(homeMesh);


  // --------------------------------------------------------------------------------
  // Resize Update/ Re-render
  // --------------------------------------------------------------------------------

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
    render();
  }, false);

  // --------------------------------------------------------------------------------
  // Go to rooms when doors are clicked
  // --------------------------------------------------------------------------------

  domEvents.addEventListener(officeMesh, "click", () => {
    console.log("you clicked on the mesh");
    document.body.innerHTML = "";
    startOfficeRoom();
  }, false);

  domEvents.addEventListener(storeMesh, "click", () => {
    console.log("you clicked on the mesh");
    document.body.innerHTML = "";
    startStoreRoom();
  }, false);

  domEvents.addEventListener(homeMesh, "click", () => {
    console.log("you clicked on the mesh");
    document.body.innerHTML = "";
    startHomeRoom();
  }, false);

  // --------------------------------------------------------------------------------
  // Frame Rate (remove this later)
  // --------------------------------------------------------------------------------

  // const stats = Stats();
  // document.body.appendChild(stats.dom);

  // --------------------------------------------------------------------------------
  // Render all the above code every time the screen refreshes (hopefully 60fps)
  // --------------------------------------------------------------------------------
  
  const render = function () {
    if (camera.position.x < -8) {
      camera.position.x = -8;
    } else if (camera.position.x > 15.5) {
      camera.position.x = 15.5;
    } else if (camera.position.z > 11) {
      camera.position.z = 11;
    } else if (camera.position.z < -30) {
      camera.position.z = -30;
    } else if (camera.position.y < 2 || camera.position.y > 2) {
      camera.position.y = 2;
    }

    controls.update(clock.getDelta());
    renderer.render(scene, camera);
    mouseMesh.rotation.copy( camera.rotation );
    mouseMesh.position.copy( camera.position );
    mouseMesh.updateMatrix();
    mouseMesh.translateZ( - 2 );
    // stats.update();
  };
  
  renderer.setAnimationLoop(render);
  // render();
}
startTown();

export { startTown as default };