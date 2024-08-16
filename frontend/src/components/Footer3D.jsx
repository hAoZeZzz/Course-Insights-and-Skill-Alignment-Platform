import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Footer3D = () => {
  const canvasRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return; 
    initialized.current = true; 

    let camera, scene, renderer, controls;
    let mesh, material;
    const geometries = [
      new THREE.ConeGeometry(1.0, 2.0),
      new THREE.BoxGeometry(2.0, 2.0, 2.0),
      new THREE.SphereGeometry(1.0, 16, 8),
    ];

    const api = {
      count: 256,
    };

    const init = () => {
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / 350, 1, 100);
      camera.position.z = 30;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, 350);
      canvasRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controls.enableZoom = false; // Disable zoom
      controls.enableRotate = true; // Disable rotate
      controls.enablePan = false; // Disable pan

      window.addEventListener("resize", onWindowResize);
    };

    const initMesh = () => {
      if (mesh) {
        mesh.parent.remove(mesh);
        if (mesh.dispose) {
          mesh.dispose();
        }
      }

      material = new THREE.MeshNormalMaterial();

      mesh = new THREE.Group();
      for (let i = 0; i < api.count; i++) {
        const child = new THREE.Mesh(
          geometries[i % geometries.length],
          material
        );
        randomizeMatrix(child.matrix);
        child.matrix.decompose(child.position, child.quaternion, child.scale);
        child.userData.rotationSpeed = randomizeRotationSpeed(
          new THREE.Euler()
        );
        mesh.add(child);
      }

      scene.add(mesh);
    };

    const randomizeMatrix = (matrix) => {
      const position = new THREE.Vector3();
      const rotation = new THREE.Euler();
      const quaternion = new THREE.Quaternion();
      const scale = new THREE.Vector3();

      position.x = Math.random() * 40 - 20;
      position.y = Math.random() * 40 - 20;
      position.z = Math.random() * 40 - 20;

      rotation.x = Math.random() * 2 * Math.PI;
      rotation.y = Math.random() * 2 * Math.PI;
      rotation.z = Math.random() * 2 * Math.PI;

      quaternion.setFromEuler(rotation);

      scale.x = scale.y = scale.z = 0.5 + Math.random() * 0.5;

      return matrix.compose(position, quaternion, scale);
    };

    const randomizeRotationSpeed = (rotation) => {
      rotation.x = Math.random() * 0.01;
      rotation.y = Math.random() * 0.01;
      rotation.z = Math.random() * 0.01;
      return rotation;
    };

    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = 20;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      mesh.children.forEach((child) => {
        const rotationSpeed = child.userData.rotationSpeed;
        child.rotation.x += rotationSpeed.x;
        child.rotation.y += rotationSpeed.y;
        child.rotation.z += rotationSpeed.z;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    init();
    initMesh();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <div ref={canvasRef}></div>;
};

export default Footer3D;
