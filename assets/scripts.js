// Initialize scene, camera, and renderer
const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf7f7f7);

const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
camera.position.set(0, 12, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const sunlight = new THREE.DirectionalLight(0xfffbee, 0.4);
sunlight.position.set(20, 30, -20);
scene.add(sunlight);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientlight);

const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(0, 12, 20);
light.shadow.radius = 20;
scene.add(light);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.5);
scene.add(hemiLight);

const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
light2.position.set(0, 12, -20);
scene.add(light2);

let model;

// Texture loader
const textureLoader = new THREE.TextureLoader();

const diffuse1 = textureLoader.load('./assets/diffuse-1.jpg');
const normal1 = textureLoader.load('./assets/normal-1.jpg');
const diffuse2 = textureLoader.load('./assets/diffuse-2.jpg');
const normal2 = textureLoader.load('./assets/normal-2.jpg');

const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load(
  './assets/no map.glb',
  (gltf) => {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(10, 10, 10);
    // Apply initial materials
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          metalness : 0.1,
          roughness : 0.5,
          map: diffuse1,
          normalMap: normal1, 
        });
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      }
    });

    scene.add(model);

    loadingBar.style.width = '100%';
    loadingText.textContent = 'Loading complete!';
    setTimeout(() => {
      document.getElementById('loading-bar-container').style.display = 'none';
    }, 500);
  },
  (xhr) => {
    const progress = Math.round((xhr.loaded / xhr.total) * 100);
    loadingBar.style.width = progress + '%';
    loadingText.textContent = `Loading... ${progress}%`;
  },
  (error) => {
    console.error('Error loading the GLB model:', error);
    loadingText.textContent = 'Error loading model.';
  }
);

// Add orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 12, 0);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 15;

const settingsBtn = document.getElementById('settings-btn');
const controlPanel = document.getElementById('control-panel');

settingsBtn.addEventListener('click', () => {
  controlPanel.classList.toggle('show');
  if (controlPanel.classList.contains('show')) {
    settingsBtn.innerHTML = '<i class="fas fa-times"></i>';
  } else {
    settingsBtn.innerHTML = '<i class="fas fa-cogs"></i>';
  }
});

// Buttons for texture changes
const texture1Button = document.getElementById('texture-1');
const texture2Button = document.getElementById('texture-2');

texture1Button.addEventListener('click', () => {
  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          metalness : 0.1,
          roughness : 0.5,
          map: diffuse1,
          normalMap: normal1, 
        });
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      }
    });
  }
});

texture2Button.addEventListener('click', () => {
  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          metalness : 0.1,
          roughness : 0.5,
          map: diffuse2,
          normalMap: normal2, 
        });
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      }
    });
  }
});

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
