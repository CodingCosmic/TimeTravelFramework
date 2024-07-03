let scene, camera, renderer, cube;
let time = 5, energy = 5, frequency = 5;
let particles = [];
let particleCount = 100;
let mic;
let fft;

function init() {
    // Three.js setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('visualization').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    animate();

    // p5.js setup
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('visualization');

    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT();
    fft.setInput(mic);

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let particleSlider = select('#particleCount');
    particleSlider.input(() => {
        particleCount = particleSlider.value();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Three.js animations
    cube.rotation.x += 0.01 * time;
    cube.rotation.y += 0.01 * energy;
    cube.scale.x = 1 + 0.1 * frequency;
    cube.scale.y = 1 + 0.1 * frequency;

    renderer.render(scene, camera);

    // p5.js animations
    background(0);
    let spectrum = fft.analyze();

    for (let particle of particles) {
        particle.update(spectrum);
        particle.show();
    }
}

function runExperiment() {
    time = document.getElementById('time').value;
    energy = document.getElementById('energy').value;
    frequency = document.getElementById('frequency').value;
}

document.getElementById('runExperiment').addEventListener('click', runExperiment);

init();

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
    }

    update(spectrum) {
        let freq = int(random(0, spectrum.length));
        let amp = spectrum[freq];

        this.pos.x += map(amp, 0, 255, -1, 1) * this.vel.x;
        this.pos.y += map(amp, 0, 255, -1, 1) * this.vel.y;

        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }

    show() {
        noStroke();
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
