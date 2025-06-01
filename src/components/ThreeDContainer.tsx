import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

    // Load GLTF model
    const loader = new GLTFLoader();

    // loader.load(
    //   "/GLB/ass-teroids.glb",
    //   (gltf) => {
    //     // console.log("✅ GLTF model loaded successfully!");
    //     const baseModel = gltf.scene;
    //     console.log(baseModel)
    //     // === Model 1 ===
    //     const model1 = baseModel.clone(true);
    //     model1.position.set(-8, 6, 8);
    //     model1.scale.set(0.1, 0.1, 0.1); // Apply scale to the whole clone

    //     model1.traverse((child) => {
    //       if (child.isMesh) {
    //         child.material = new THREE.MeshPhongMaterial({ color: 0xff69b4 });
    //         child.scale.set(0.5,0.5,0.5)
    //       }
    //     });

    //     scene.add(model1);
    //     modelsRef.current.push({
    //       model: model1,
    //       direction: 1,
    //       startX: -8,
    //       endX: 8,
    //       speed: 2,
    //     });

    //     // === Model 2 ===
    //     const model2 = baseModel.clone(true);
    //     model2.position.set(8, -1, 0);
    //     model2.scale.set(1.2, 1.2, 1.2);
    //     model2.rotation.y = Math.PI;

    //     model2.traverse((child) => {
    //       if (child.isMesh) {
    //         child.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    //         child.scale.set(0.5,0.5,0.5)

    //       }
    //     });

    //     scene.add(model2);
    //     modelsRef.current.push({
    //       model: model2,
    //       direction: -1,
    //       startX: 8,
    //       endX: -8,
    //       speed: 1.5,
    //     });
    //   },
    //   (progress) => {
    //     console.log(
    //       `📈 Loading progress: ${((progress.loaded / progress.total) * 100).toFixed(2)}%`
    //     );
    //   },
    //   (error) => {
    //     console.warn("❌ GLTF loading failed, using fallback:", error);
    //     createFallbackModels();
    //   }
    // );

    loader.load(
  "/GLB/ass-teroids.glb",
  (gltf) => {
    const baseModel = gltf.scene;

    // Utility: Clone and prepare a model
    const prepareModel = (position, scale, color, direction, startX, endX, speed, rotationY = 0) => {
      const clone = baseModel.clone(true);
      const inner = clone.getObjectByName("Sketchfab_Scene");

      if (inner) {
        inner.position.set(...position);
        inner.scale.set(...scale);
        inner.rotation.y = rotationY;

        inner.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({ color });
          }
        });

        scene.add(inner);
        modelsRef.current.push({
          model: inner,
          direction,
          startX,
          endX,
          speed,
        });
      } else {
        console.warn("⚠️ Could not find 'Sketchfab_Scene' inside GLTF");
      }
    };

    // Add models
    prepareModel([-8, 6, 8], [0.1, 0.1, 0.1], 0xff69b4, 1, -8, 8, 2);
    prepareModel([8, -1, 0], [1.2, 1.2, 1.2], 0x00ff00, -1, 8, -8, 1.5, Math.PI);
  },
  (progress) => {
    console.log(`📈 Loading progress: ${((progress.loaded / progress.total) * 100).toFixed(2)}%`);
  },
  (error) => {
    console.warn("❌ GLTF loading failed, using fallback:", error);
    createFallbackModels();
  }
);

    // Fallback geometric models
    const createFallbackModels = () => {
      console.log("🔄 Creating fallback models...");

      const geometry = new THREE.ConeGeometry(0.3, 1, 8);

      // Model 1
      const model1 = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: 0xff69b4 })
      );
      model1.position.set(-8, 1, 0);
      model1.rotation.z = -Math.PI / 2;
      scene.add(model1);

      modelsRef.current.push({
        model: model1,
        direction: 1,
        startX: -8,
        endX: 8,
        speed: 2,
      });

      // Model 2
      const model2 = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: 0x00ff00 })
      );
      model2.position.set(8, -1, 0);
      model2.rotation.z = Math.PI / 2;
      scene.add(model2);

      modelsRef.current.push({
        model: model2,
        direction: -1,
        startX: 8,
        endX: -8,
        speed: 1.5,
      });
    };

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      modelsRef.current.forEach(({ model, direction, startX, endX, speed }) => {
        model.position.x += delta * speed * direction;

        if (direction > 0 && model.position.x > endX) {
          model.position.x = startX;
        } else if (direction < 0 && model.position.x < endX) {
          model.position.x = startX;
        }

        model.rotation.x += delta * 1;
        model.rotation.y += delta * 2;

        model.position.y += Math.sin(clock.getElapsedTime() * 2 + model.position.x * 0.1) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
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
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
  );
};

export default ThreeDContainer;
