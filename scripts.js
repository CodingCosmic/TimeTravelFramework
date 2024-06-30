let scene, camera, renderer, cube;
let time = 5, energy = 5, frequency = 5;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);
    document.getElementById('visualization').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01 * time;
    cube.rotation.y += 0.01 * energy;
    cube.scale.x = 1 + 0.1 * frequency;
    cube.scale.y = 1 + 0.1 * frequency;

    renderer.render(scene, camera);
}

function runExperiment() {
    time = document.getElementById('time').value;
    energy = document.getElementById('energy').value;
    frequency = document.getElementById('frequency').value;
}

document.getElementById('runExperiment').addEventListener('click', runExperiment);

init();
