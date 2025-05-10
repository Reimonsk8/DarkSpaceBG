import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeDContainer = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 0.5, 3.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    // renderer.setClearColor(0x000000, 0);

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 1;
    controls.maxDistance = 6;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3;

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 10);
    scene.add(directionalLight);

    const pointLights = [
      { color: 0xffaa00, pos: [-4, 2, -4] },
      { color: 0x00aaff, pos: [4, -1, 4] },
      { color: 0xff00ff, pos: [-4, -1, 4] },
    ];

    pointLights.forEach(({ color, pos }) => {
      const light = new THREE.PointLight(color, 1.5, 15);
      light.position.set(...pos);
      scene.add(light);
    });

    const loader = new GLTFLoader();
    loader.load(
      "GLB/space_boi.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -0.5, 0);
        model.scale.set(0.35, 0.35, 0.35);
        scene.add(model);

        const animations = gltf.animations;
        const mixer = new THREE.AnimationMixer(model);

        if (animations && animations.length > 0) {
          const animationIndex = 2;
          console.log("Available animations:", animations.map((a, i) => `${i}: ${a.name}`));
          const action = mixer.clipAction(animations[animationIndex]);
          action.play();
        }

        mixerRef.current = mixer;
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixerRef.current?.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
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

  return (
    <>
      {/* <h1 className="title">3D Model Viewer</h1> */}
      <div ref={mountRef} className="three-container" />
    </>
  );
};

export default ThreeDContainer;
