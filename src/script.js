import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import GUI from 'lil-gui'
// import gsap from 'gsap'
// import { TweenMax } from 'gsap'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */

// Floor
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
grassColorTexture.colorSpace = THREE.SRGBColorSpace
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

grassColorTexture.repeat.set(4, 4)
grassAmbientOcclusionTexture.repeat.set(4, 4)
grassNormalTexture.repeat.set(4, 4)
grassRoughnessTexture.repeat.set(4, 4)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const house = new THREE.Group()
scene.add(house)

// Walls
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
bricksColorTexture.colorSpace = THREE.SRGBColorSpace
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.position.y = 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
doorColorTexture.colorSpace = THREE.SRGBColorSpace
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 6, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 6, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 6, 3)
scene.add(ghost3)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 50; i++) {
    let validPosition = false;
    let x, z;

    while (!validPosition) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 6;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;

        validPosition = true;
        for (const grave of graves.children) {
            grave.castShadow = true
            const distance = new THREE.Vector2(x - grave.position.x, z - grave.position.z).length();
            // La distance doit être inférieure à 2 au vu de la taille du cercle dans lequel elles sont placées
            if (distance < 1.5) {
                validPosition = false;
                break;
            }
        }
    }

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    floor.receiveShadow = true

    // Position
    grave.position.set(x, 0.3, z);

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;

    // Ajouter à la scène
    graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.26)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 3, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Fog
 */
const fog = new THREE.Fog('#262837', 1, 20)
scene.fog = fog

/**
 * Loader
 */
let giantX = 7;
let giantZ = 7;

const loader = new GLTFLoader();

loader.load(
    'textures/models/Cube_World/Giant.glb',
    (gltf) => {
        const giant = gltf.scene.children[0];

        if (giant) {
            giant.castShadow = true;
            scene.add(giant);
            giant.scale.set(0.4,0.4,0.4);
            giant.position.set(giantX, 0, giantZ);
            giant.rotation.y = Math.PI / 2;

            // Ajouter les écouteurs d'événements pour les touches directionnelles
            window.addEventListener('keydown', handleKeyDown);
        } else {
            console.error('Giant not found in the loaded GLTF scene.');
        }
        

function handleKeyDown(event) {
    const step = 0.1; // Ajustez la valeur de déplacement selon vos besoins

    switch (event.key) {
        case 'ArrowUp':
            giantZ -= step;
            break;
        case 'ArrowDown':
            giantZ += step;
            break;
        case 'ArrowLeft':
            giantX -= step;
            break;
        case 'ArrowRight':
            giantX += step;
            break;
    }

    // Mettez à jour la position du géant
    giant.position.set(giantX, 0, giantZ);
}
    },
);

function addSkeleton(gltf, position) {
    const skeleton = gltf.scene.children[0];

    if (skeleton) {
        skeleton.castShadow = true;
        scene.add(skeleton);
        skeleton.scale.set(0.3, 0.3, 0.3);
        skeleton.position.copy(position);
        skeleton.rotation.y = Math.PI / 2;

        // Utiliser GSAP pour animer le déplacement sur l'axe x
        // TweenMax.to(skeleton.position, 10, { x: "+=5", repeat: -1, yoyo: true }); // Répéter l'animation en boucle

        console.log(skeleton);
    } else {
        console.error('Skeleton not found in the loaded GLTF scene.');
    }
}

// Charger le modèle et ajouter les squelettes à la scène avec des positions aléatoires
for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    loader.load('textures/models/Cube_World/Skeleton.glb', (gltf) => addSkeleton(gltf, new THREE.Vector3(x, 0, z)));
}


// Créer une fonction pour ajouter les fences à la scène
function addFenceCenter(gltf, position) {
    const fenceCenter = gltf.scene.children[0];

    if (fenceCenter) {
        fenceCenter.castShadow = true;
        scene.add(fenceCenter);
        fenceCenter.scale.set(0.3, 0.3, 0.3);
        fenceCenter.position.copy(position);  // Utiliser la copie de position fournie
        fenceCenter.rotation.y = Math.PI / 2;
    } else {
        console.error('FenceCenter not found in the loaded GLTF scene.');
    }
}

// Définir les positions pour chaque fence
const positions = [];

for (let z = -9; z <= 9; z += 0.6) {
    const newPosition = new THREE.Vector3(9.9, 0.30, z);
    positions.push(newPosition);
}
for (let z = -9; z <= 9; z += 0.6) {
    const newPosition = new THREE.Vector3(-9.9, 0.30, z);
    positions.push(newPosition);
}
let rotate = false
for (let x = 9; x >= -9; x -= 0.6) {
    const newPosition = new THREE.Vector3(x, 0.30, 9.9);
    rotate = true;
    positions.push(newPosition);
}
for (let x = 9; x >= -9; x -= 0.6) {
    const newPosition = new THREE.Vector3(x, 0.30, -9.9);
    rotate = true;
    positions.push(newPosition);
}

// Charger le modèle et ajouter les fences à la scène
for (let i = 0; i < positions.length; i++) {
    loader.load('textures/models/Cube_World/Fence_Center.glb', (gltf) => addFenceCenter(gltf, positions[i]));
    if(rotate == true){
        // fenceCenter.rotation.y = Math.PI / 2;
    }
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = 3
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.castShadow = true
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
}

tick()