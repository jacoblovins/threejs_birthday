/* eslint-disable prettier/prettier */
import * as THREE from "/build/three.module.js";
import { FirstPersonControls } from "/jsm/controls/FirstPersonControls.js";
import { GLTFLoader } from "/jsm/loaders/GLTFLoader.js";
import { CSS3DRenderer, CSS3DObject } from "/jsm/renderers/CSS3DRenderer.js";
import { VRButton } from "/jsm/webxr/VRButton.js";



function startStoreRoom() {
  // --------------------------------------------------------------------------------
  // Initial scene setup and render to the HTML page
  // --------------------------------------------------------------------------------

  const clock = new THREE.Clock();
  const townScene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5.5;
  camera.position.y = 1.7;
  camera.position.x = 1;

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

  const domEvents2 = new THREEx.DomEvents(camera, renderer2.domElement);
  document.body.appendChild(VRButton.createButton(renderer));
  renderer.xr.enabled = true;

  // --------------------------------------------------------------------------------
  // Movement Controls
  // --------------------------------------------------------------------------------

  const controls = new FirstPersonControls(camera, renderer2.domElement);
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
    "../img/ujgarage.glb",
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

  const light = new THREE.AmbientLight( 0x404040 ); // soft white light
  townScene.add( light );
  // --------------------------------------------------------------------------------
  // Clickable exit door
  // --------------------------------------------------------------------------------

  const doorMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  const doorGeometry = new THREE.PlaneGeometry(2.3, 2.5, 1);
  const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
  doorMesh.rotation.y = 90 * Math.PI / 90;
  doorMesh.position.set(1.3, 1.1, 6.85);
  townScene.add(doorMesh);

  domEvents2.addEventListener(doorMesh, "click", () => {
    console.log("you clicked on the mesh");
    document.location.reload();
  }, false);

  // --------------------------------------------------------------------------------
  // Add a todo element
  // --------------------------------------------------------------------------------

  // const officeMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  // const officeGeometry = new THREE.PlaneGeometry(5, 2.5, 1);
  // const officeMesh = new THREE.Mesh(officeGeometry, officeMaterial);
  // officeMesh.position.set(1.4, 1.6, -0.85);
  // townScene.add(officeMesh);

  // const moveMaterial = new THREE.MeshBasicMaterial({ wireframe: false });
  // const moveGeometry = new THREE.PlaneGeometry(9, 4, 1);
  // const moveMesh = new THREE.Mesh(moveGeometry, moveMaterial);
  // moveMesh.position.set(0, 1.7, -.9);
  // townScene.add(moveMesh);

  // const element = document.createElement("div");
  // const iframe = document.createElement("iframe");
  // iframe.src = "../../html-tasks/storeTodo.html";
  // iframe.style.width = "400px";
  // iframe.style.height = "160px";
  // element.appendChild(iframe);

  // const domObject = new CSS3DObject(element);
  // domObject.scale.set(.009, .009, .009);
  // officeMesh.add(domObject);



  // --------------------------------------------------------------------------------
  // Lock controls when focused on todo list
  // --------------------------------------------------------------------------------

  // domEvents2.addEventListener(officeMesh, "mouseover", () => {
  //   controls.activeLook = false;
  // }, false);

  // domEvents2.addEventListener(moveMesh, "mouseover", () => {
  //   controls.activeLook = true;
  // }, false);

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
  // Render all the above code every time the screen refreshes (hopefully 60fps)
  // --------------------------------------------------------------------------------

  const animate = function () {
    if (camera.position.x < -1) {
      camera.position.x = -1;
    } else if (camera.position.x > 4) {
      camera.position.x = 4;
    } else if (camera.position.z > 5.8) {
      camera.position.z = 5.8;
    } else if (camera.position.z < .5) {
      camera.position.z = .5;
    } else if (camera.position.y < 1.7 || camera.position.y > 1.7) {
      camera.position.y = 1.7;
    }

    render();
  };

  renderer.setAnimationLoop(animate);
  // animate();

  function render() {
    controls.update(clock.getDelta());
    renderer.render(townScene, camera);
    renderer2.render(townScene, camera);
    homeMesh.rotation.copy(camera.rotation);
    homeMesh.position.copy(camera.position);
    homeMesh.updateMatrix();
    homeMesh.translateZ(- 2);
  }

}
export { startStoreRoom as default };

