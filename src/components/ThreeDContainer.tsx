import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDContainer = () => {
  const mountRef = useRef(null);
  const mixersRef = useRef([]); // Array to hold multiple mixers

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
    renderer.setClearColor(0x000000, 0); // Second parameter is alpha
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 1;
    controls.maxDistance = 6;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    // Brighter lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(10, 10, 9);
    directionalLight.castShadow = false;
    directionalLight.intensity = 10; // Adjust intensity for brightness
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    
    // Load first model
    loader.load(
      "GLB/source/sample.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0); // Keep first model at original position
        model.scale.set(2, 2, 2);
        scene.add(model);

        const animations = gltf.animations;
        if (animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const animationIndex = 2; // Customize this index
          const action = mixer.clipAction(animations[animationIndex]);
          action.play();
          mixersRef.current.push(mixer); // Add to mixers array
        }
      },
      undefined,
      (error) => {
        console.error("Error loading first model:", error);
      }
    );

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      // Update all mixers
      mixersRef.current.forEach(mixer => mixer.update(delta));
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

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
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="three-container" />;
};

export default ThreeDContainer;