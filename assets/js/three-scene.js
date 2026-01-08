// Simple Three.js 3D Background
class ThreeScene {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.log('Three.js not loaded, skipping 3D background');
            return;
        }
        
        // Get canvas element
        const canvas = document.getElementById('threeCanvas');
        if (!canvas) {
            console.log('Canvas element not found');
            return;
        }
        
        try {
            // Setup scene
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            
            // Configure renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Position camera
            this.camera.position.z = 5;
            
            // Create geometry
            this.createGeometry();
            
            // Start animation
            this.animate();
            
            // Handle window resize
            window.addEventListener('resize', () => this.onResize());
            
            console.log('✅ 3D Scene initialized');
            
        } catch (error) {
            console.warn('3D Scene failed:', error);
        }
    }
    
    createGeometry() {
        // Create floating geometry
        this.meshes = [];
        
        // Create multiple floating cubes
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshBasicMaterial({
                color: 0x64ffda,
                wireframe: true,
                transparent: true,
                opacity: 0.1
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            
            // Random rotation speed
            mesh.userData = {
                rotationSpeed: {
                    x: 0.005 + Math.random() * 0.01,
                    y: 0.005 + Math.random() * 0.01,
                    z: 0.005 + Math.random() * 0.01
                },
                floatSpeed: 0.001 + Math.random() * 0.002,
                floatOffset: Math.random() * Math.PI * 2
            };
            
            this.meshes.push(mesh);
            this.scene.add(mesh);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Get current time
        const time = Date.now() * 0.001;
        
        // Animate each mesh
        this.meshes.forEach(mesh => {
            // Rotation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
            
            // Floating motion
            const floatY = Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.5;
            mesh.position.y = mesh.userData.originalY + floatY;
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize when Three.js is loaded
function initThreeScene() {
    if (typeof THREE !== 'undefined') {
        window.threeScene = new ThreeScene();
    } else {
        // Wait for Three.js to load
        const checkThree = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(checkThree);
                window.threeScene = new ThreeScene();
            }
        }, 100);
    }
}

// Start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
    initThreeScene();
}
