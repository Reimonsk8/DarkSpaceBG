import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ThreeDContainer = () => {
  const mountRef = useRef(null);
  const modelsRef = useRef([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 3.5);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(10, 10, 9);
    directionalLight.intensity = 10;
    scene.add(directionalLight);

    // Load OBJ models
    const loader = new OBJLoader();
    
    console.log('🔍 Loading OBJ model...');
    
    loader.load(
      // '/GLB/ass-teroids.obj', // Change your file to .obj format
      '/GLB/Rock/Rock.obj', // Change your file to .obj format
      (object) => {
        console.log('✅ OBJ model loaded successfully!');
        
        // Create first model (left to right)
        const model1 = object.clone();
        model1.position.set(-8, 1, 0);
        model1.scale.set(1.5, 1.5, 1.5);
        
        // Add material to all meshes
        model1.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({ color: 0xff69b4 });
          }
        });
        
        scene.add(model1);
        modelsRef.current.push({
          model: model1,
          direction: 1,
          startX: -8,
          endX: 8,
          speed: 2
        });

        // Create second model (right to left)
        const model2 = object.clone();
        model2.position.set(8, -1, 0);
        model2.scale.set(1.2, 1.2, 1.2);
        model2.rotation.y = Math.PI;
        
        // Add different colored material
        model2.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
          }
        });
        
        scene.add(model2);
        modelsRef.current.push({
          model: model2,
          direction: -1,
          startX: 8,
          endX: -8,
          speed: 1.5
        });
      },
      (progress) => {
        console.log(`📈 Loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
      },
      (error) => {
        console.warn('❌ OBJ loading failed, using fallback:', error);
        createFallbackModels();
      }
    );

    // Fallback geometric models
    const createFallbackModels = () => {
      console.log('🔄 Creating fallback models...');
      
      const geometry = new THREE.ConeGeometry(0.3, 1, 8);
      
      // Model 1
      const model1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xff69b4 }));
      model1.position.set(-8, 1, 0);
      model1.rotation.z = -Math.PI/2;
      scene.add(model1);
      
      modelsRef.current.push({
        model: model1,
        direction: 1,
        startX: -8,
        endX: 8,
        speed: 2
      });

      // Model 2
      const model2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
      model2.position.set(8, -1, 0);
      model2.rotation.z = Math.PI/2;
      scene.add(model2);
      
      modelsRef.current.push({
        model: model2,
        direction: -1,
        startX: 8,
        endX: -8,
        speed: 1.5
      });
    };

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update flying positions
      modelsRef.current.forEach((modelData) => {
        const { model, direction, startX, endX, speed } = modelData;
        
        model.position.x += delta * speed * direction;
        
        if (direction > 0 && model.position.x > endX) {
          model.position.x = startX;
        } else if (direction < 0 && model.position.x < endX) {
          model.position.x = startX;
        }

        // Add rotation
        model.rotation.x += delta * 1;
        model.rotation.y += delta * 2;
        
        // Add vertical bobbing
        model.position.y += Math.sin(clock.getElapsedTime() * 2 + model.position.x * 0.1) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="three-container" 
      style={{ 
        width: '100%', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1
      }} 
    />
  );
};

export default ThreeDContainer;