'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface ArtisticCanvasProps {
  currentStep: 'hero' | 'location' | 'profile' | 'results' | 'quick';
  isDarkMode?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// SHADERS GLSL — FITA CINÉTICA & ATMOSFERA CASA 13
// ═══════════════════════════════════════════════════════════════

const ribbonVertexShader = `
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Ondulação suave contínua (tecido cívico fluindo)
    float wave1 = sin(pos.x * 1.8 + uTime * 0.7) * 0.35;
    float wave2 = cos(pos.y * 2.2 + uTime * 0.5 + pos.x) * 0.25;
    float wave3 = sin((pos.x + pos.y) * 1.2 + uTime * 0.4) * 0.15;

    // Resposta sutil ao cursor
    float dist = distance(pos.xy, uPointer * 2.5);
    float pointerInfluence = sin(dist * 2.5 - uTime * 2.0) * exp(-dist * 0.8) * 0.2;

    pos.z += wave1 + wave2 + wave3 + pointerInfluence;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ribbonFragmentShader = `
  uniform float uTime;
  uniform float uDarkMix;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Paleta Oficial Casa 13 (Vermelho Rubro, Amarelo Sol, Verde Esperança, Azul Brasil)
    vec3 cRed    = vec3(0.773, 0.133, 0.161); // #C52229
    vec3 cGold   = vec3(0.961, 0.620, 0.043); // #F59E0B
    vec3 cGreen  = vec3(0.063, 0.725, 0.506); // #10B981
    vec3 cBlue   = vec3(0.114, 0.306, 0.847); // #1D4ED8
    vec3 cLightBg = vec3(0.98, 0.98, 0.99);

    // Gradiente fluente ao longo da fita (U) e do tempo
    float t = vUv.x + sin(vUv.y * 3.0 + uTime * 0.3) * 0.2;
    vec3 col = cRed;

    if (t < 0.35) {
      col = mix(cRed, cGold, smoothstep(0.0, 0.35, t));
    } else if (t < 0.65) {
      col = mix(cGold, cGreen, smoothstep(0.35, 0.65, t));
    } else {
      col = mix(cGreen, cBlue, smoothstep(0.65, 1.0, t));
    }

    // Efeito de iluminação volumétrica / sombreamento de dobra
    float shadow = smoothstep(-0.6, 0.6, vElevation) * 0.35 + 0.65;
    col *= shadow;

    // Transparência suave nas bordas para integração impecável com a página
    float edgeAlpha = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    float endAlpha = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    float alpha = edgeAlpha * endAlpha * 0.45;

    // Em modo claro, deixar mais suave e etéreo para não competir com a leitura
    if (uDarkMix < 0.5) {
      alpha *= 0.38;
    } else {
      alpha *= 0.55;
    }

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function ArtisticCanvas({ currentStep, isDarkMode = false }: ArtisticCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ribbonMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const uniformsRef = useRef<any>(null);
  const pointerPosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Configuração da Cena e Câmera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);
    cameraRef.current = camera;

    // 2. WebGLRenderer otimizado para celulares simples (DPR limitado a 1.5, alpha ativo)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Fita Cinética com Custom GLSL Shaders
    const ribbonGeo = new THREE.PlaneGeometry(9, 3.5, 64, 48);
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uDarkMix: { value: isDarkMode ? 1.0 : 0.0 },
    };
    uniformsRef.current = uniforms;

    const ribbonMat = new THREE.ShaderMaterial({
      vertexShader: ribbonVertexShader,
      fragmentShader: ribbonFragmentShader,
      uniforms: uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.rotation.x = -0.35;
    ribbonMesh.position.y = -0.4;
    scene.add(ribbonMesh);
    ribbonMeshRef.current = ribbonMesh;

    // 4. Constelação de Partículas Ambientes Otimizadas (120 partículas leves)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color('#F59E0B');
    const redColor = new THREE.Color('#C52229');
    const greenColor = new THREE.Color('#10B981');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      const pColor = i % 3 === 0 ? goldColor : i % 3 === 1 ? redColor : greenColor;
      colors[i * 3 + 0] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: isDarkMode ? 0.65 : 0.45,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 5. Interação com Pointer (Mouse / Touch)
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      pointerPosRef.current.targetX = (clientX / window.innerWidth) * 2 - 1;
      pointerPosRef.current.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // 6. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop com Clock
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Lerp pointer para inércia cinematográfica
      pointerPosRef.current.x += (pointerPosRef.current.targetX - pointerPosRef.current.x) * 0.04;
      pointerPosRef.current.y += (pointerPosRef.current.targetY - pointerPosRef.current.y) * 0.04;

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value = time;
        uniformsRef.current.uPointer.value.set(pointerPosRef.current.x, pointerPosRef.current.y);
      }

      // Parallax sutil na câmera acoplado ao mouse
      if (cameraRef.current) {
        cameraRef.current.position.x += (pointerPosRef.current.x * 0.4 - cameraRef.current.position.x) * 0.03;
        cameraRef.current.position.y += (pointerPosRef.current.y * 0.3 - cameraRef.current.position.y) * 0.03;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Leve rotação das partículas cósmicas
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.03;
        particlesRef.current.rotation.x = Math.sin(time * 0.02) * 0.05;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // Atualização de Tema (Modo Claro vs Escuro no Shader)
  useEffect(() => {
    if (uniformsRef.current) {
      gsap.to(uniformsRef.current.uDarkMix, {
        value: isDarkMode ? 1.0 : 0.0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [isDarkMode]);

  // Coreografia de Câmera GSAP baseada na Etapa da Narrativa
  useEffect(() => {
    if (!cameraRef.current || !ribbonMeshRef.current) return;

    const camera = cameraRef.current;
    const mesh = ribbonMeshRef.current;

    switch (currentStep) {
      case 'hero':
        gsap.to(camera.position, {
          z: 7,
          y: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.rotation, {
          x: -0.35,
          z: 0,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.position, {
          y: -0.4,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        break;

      case 'location':
        // Câmera sobe suavemente e a fita gira levemente para dar espaço ao mapa interativo
        gsap.to(camera.position, {
          z: 8.2,
          y: 0.6,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.rotation, {
          x: -0.5,
          z: 0.15,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.position, {
          y: -1.2,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        break;

      case 'profile':
        // Câmera aproxima com foco no perfil humano
        gsap.to(camera.position, {
          z: 6.8,
          y: -0.2,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.rotation, {
          x: -0.25,
          z: -0.1,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.position, {
          y: 0.2,
          duration: 1.2,
          ease: 'power3.inOut',
        });
        break;

      case 'results':
        // Câmera abre em perspectiva ampla para visualização de arsenal e cards
        gsap.to(camera.position, {
          z: 8.8,
          y: 0.4,
          duration: 1.4,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.rotation, {
          x: -0.4,
          z: 0.05,
          duration: 1.4,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.position, {
          y: -0.8,
          duration: 1.4,
          ease: 'power3.inOut',
        });
        break;

      case 'quick':
        // Câmera dinâmica e enérgica com leve elevação para foco no cartão do argumento
        gsap.to(camera.position, {
          z: 7.4,
          y: 0.3,
          duration: 1.0,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.rotation, {
          x: -0.3,
          z: -0.08,
          duration: 1.0,
          ease: 'power3.inOut',
        });
        gsap.to(mesh.position, {
          y: -0.3,
          duration: 1.0,
          ease: 'power3.inOut',
        });
        break;
    }
  }, [currentStep]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
