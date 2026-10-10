import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useTranslation } from 'react-i18next';

interface ArenaViewer3DProps {
  isMobile: boolean;
  posterUrl: string;
  autoStart?: boolean;
}

export const ArenaViewer3D: React.FC<ArenaViewer3DProps> = ({ isMobile, posterUrl, autoStart = false }) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [userEnabled3D, setUserEnabled3D] = useState(autoStart || !isMobile); // Desktop autostarts, Mobile demands explicit click
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0 = Default fit, >1.0 = Zoomed in, <1.0 = Zoomed out

  // Mutable refs to interact with the Three.js loop directly
  const zoomFactorRef = useRef(1.0);
  const baseCamDistRef = useRef(20.0);
  const resetCameraRef = useRef<() => void>(() => {});
  const applyZoomRef = useRef<(delta: number) => void>(() => {});

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // If reduced motion, or in mobile user has not yet opted in, do NOT load Three.js or GLB
    if (prefersReducedMotion || !userEnabled3D) return;

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let modelGroup: THREE.Group | null = null;

    // Movement coordinates
    let targetRotationY = 0;
    let currentRotationY = 0;
    let targetRotationX = 0;
    let currentRotationX = 0;

    // Bounds configuration:
    // Desktop: ±0.32 rad (~18.3 deg) horizontal, -0.05 to +0.08 rad vertical
    // Mobile: ±0.20 rad (~11.5 deg) horizontal, zero vertical
    const maxRotY = isMobile ? 0.20 : 0.32;
    const maxRotX = isMobile ? 0.0 : 0.08;

    try {
      // 1. Scene setup
      scene = new THREE.Scene();
      scene.background = null; // transparent

      // 2. Camera setup - Positioned to capture the stage and logo with grandeur
      const aspect = container.clientWidth / container.clientHeight;
      const fov = isMobile ? 38 : 42;
      camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);

      if (isMobile) {
        camera.position.set(0, 1.8, 8.8);
        camera.lookAt(0, 1.6, 0);
      } else {
        camera.position.set(0, 2.2, 11.2);
        camera.lookAt(0, 1.7, 0);
      }

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      // Clean canvas container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // 4. Lighting setup - Faithfully calibrated to Blender stage reference:
      // In Blender: focused stage spotlights, controlled ambient, soft directional fill, without blowing out trusses.
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      // Subtle Sky/Ground hemisphere light for metallic contrast
      const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x111122, 0.75);
      scene.add(hemiLight);

      // Key overhead arena spotlight focused down at center stage
      const mainSpot = new THREE.DirectionalLight(0xffffff, 1.85);
      mainSpot.position.set(3, 14, 12);
      scene.add(mainSpot);

      // Soft left fill light
      const leftFill = new THREE.DirectionalLight(0xcfdcff, 1.15);
      leftFill.position.set(-8, 7, 7);
      scene.add(leftFill);

      // Soft right fill light
      const rightFill = new THREE.DirectionalLight(0xffecd8, 1.05);
      rightFill.position.set(8, 7, 7);
      scene.add(rightFill);

      // Brand Red Rim light - low angle, soft intensity so bleachers and trusses stay authentic
      const redRimLight = new THREE.DirectionalLight(0xd71920, 1.2);
      redRimLight.position.set(-8, 3, -1);
      scene.add(redRimLight);

      // Low stage red wash lights (left & right stage floor) producing the iconic red glow & reflections
      const leftRedStageGlow = new THREE.PointLight(0xff1824, 3.8, 24, 1.4);
      leftRedStageGlow.position.set(-7.5, -4.2, 3.5);
      scene.add(leftRedStageGlow);

      const rightRedStageGlow = new THREE.PointLight(0xff1824, 3.8, 24, 1.4);
      rightRedStageGlow.position.set(7.5, -4.2, 3.5);
      scene.add(rightRedStageGlow);

      // Ramp runway red side glow
      const rampLeftGlow = new THREE.PointLight(0xff0d1a, 2.8, 16, 1.5);
      rampLeftGlow.position.set(-2.4, -4.2, 4.0);
      scene.add(rampLeftGlow);

      const rampRightGlow = new THREE.PointLight(0xff0d1a, 2.8, 16, 1.5);
      rampRightGlow.position.set(2.4, -4.2, 4.0);
      scene.add(rampRightGlow);

      // Soft backlight for top chord separation
      const backLight = new THREE.DirectionalLight(0x80a0ff, 1.0);
      backLight.position.set(0, 8, -6);
      scene.add(backLight);

      // Reflective arena stadium floor plane matching Blender poster
      const floorGeo = new THREE.PlaneGeometry(80, 80);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x06070a,
        roughness: 0.38,
        metalness: 0.45,
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.set(0, -5.02, 0); // Flush with bottom of stage ramp and arena floor
      scene.add(floorMesh);

      // Top moving head lights along the upper truss chord (matching Blender: loc Z=8.0 to 9.65, color light blue/white)
      const topSpotPositions = [
        [-9.0, 4.6, 0.0],
        [-6.0, 6.2, 0.0],
        [-3.0, 6.2, 0.0],
        [0.0, 6.2, 0.0],
        [3.0, 6.2, 0.0],
        [6.0, 6.2, 0.0],
        [9.0, 4.6, 0.0]
      ];

      topSpotPositions.forEach(([x, y, z]) => {
        // Visible glowing spotlight fixture lens
        const fixtureGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.35, 16);
        const fixtureMat = new THREE.MeshStandardMaterial({
          color: 0x111318,
          roughness: 0.3,
          metalness: 0.8
        });
        const fixtureMesh = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixtureMesh.position.set(x, y + 0.15, z);
        scene.add(fixtureMesh);

        // Glowing bulb face
        const bulbGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xe6f0ff });
        const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
        bulbMesh.position.set(x, y - 0.05, z);
        scene.add(bulbMesh);

        // Targeted stage beam shining down
        const spot = new THREE.SpotLight(0xddeeff, 2.8, 28, Math.PI / 6, 0.45, 1.2);
        spot.position.set(x, y, z);
        spot.target.position.set(x * 0.4, -4.5, 3.5);
        scene.add(spot);
        scene.add(spot.target);
      });

      // Load authentic baked entrance sign texture directly from original Blender file
      const textureLoader = new THREE.TextureLoader();
      const bakedSignTexture = textureLoader.load('/models/entrance_sign_baked.png');
      bakedSignTexture.colorSpace = THREE.SRGBColorSpace;
      bakedSignTexture.flipY = false;

      // 5. Load GLB Model
      const loader = new GLTFLoader();
      loader.load(
        '/models/arena_hero.glb',
        (gltf) => {
          modelGroup = gltf.scene;

          const textures = new THREE.TextureLoader();
          const mainLed = textures.load('/models/stage-main-led.png', undefined, undefined, () => setLoadError(true));
          const sideLed = textures.load('/models/stage-side-led.png', undefined, undefined, () => setLoadError(true));
          for (const texture of [mainLed, sideLed]) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = false;
          }
          let logoTexture: THREE.Texture | null = null;
          modelGroup.traverse(child => {
            const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
            if (material?.name?.toLowerCase().includes('original logo rgba face')) {
              logoTexture = material.map || material.emissiveMap;
            }
          });

          // Process materials for vibrant contrast, proper alpha and glowing accents
          modelGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = false;
              mesh.receiveShadow = false;

              const meshLower = mesh.name.toLowerCase().replaceAll('_', ' ');
              const matName = (mesh.material && (mesh.material as THREE.Material).name) ? (mesh.material as THREE.Material).name.toLowerCase() : '';

              // Arena bleachers / tiers ("Arena tier.xxx") in Blender are dark background arena seating.
              // They should be deep matte charcoal/black so they don't reflect colored lights as flat purple slabs.
              if (meshLower.includes('arena tier') || meshLower.includes('tier.')) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: new THREE.Color(0x0c0e12),
                  metalness: 0.1,
                  roughness: 0.95,
                  roughnessMap: null,
                  metalnessMap: null
                });
                return;
              }

              // Entrance .com sign header platform - use authentic baked Blender texture
              if (meshLower.includes('entrance complete solid black 3d sign') || meshLower.includes('sign platform')) {
                mesh.material = new THREE.MeshStandardMaterial({
                  map: bakedSignTexture,
                  emissiveMap: bakedSignTexture,
                  emissive: new THREE.Color(0xffffff),
                  emissiveIntensity: 0.95,
                  roughness: 0.35,
                  metalness: 0.2
                });
                return;
              }

              // Hide empty black/white video plane that covers the central arena/logo
              if (
                meshLower.includes('video') || 
                meshLower.includes('360') || 
                meshLower.includes('plane.004') ||
                matName.includes('rotating logo with alpha')
              ) {
                // Keep the original screen geometry, replacing the unsupported movie
                // with the original transparent logo texture. No video is downloaded.
                if (logoTexture) {
                  mesh.material = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide });
                } else mesh.visible = false;
                return;
              }

              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;

                // 1. Logo Face with alpha transparency & emission
                if (matName.includes('original logo rgba face') || meshLower.includes('original logo face') || meshLower.includes('plane.002')) {
                  if (mat.emissiveMap && !mat.map) {
                    mat.map = mat.emissiveMap;
                  }
                  mat.transparent = true;
                  mat.alphaTest = 0.05;
                  mat.depthWrite = true;
                  mat.color = new THREE.Color(0xffffff);
                  mat.emissive = new THREE.Color(0xffffff);
                  mat.emissiveIntensity = 1.3;
                  mat.needsUpdate = true;
                }

                // 2. LED Screens - Give them vivid red/orange stage presence with real baked fire texture
                if (matName.includes('flame tongues') || meshLower.includes('fire led') || meshLower.includes('cube.040')) {
                  const texture = matName.includes('side screens') ? sideLed : mainLed;
                  mat.map = texture;
                  mat.emissiveMap = texture;
                  mat.color.set(0xffffff);
                  mat.emissive.set(0xffffff);
                  mat.emissiveIntensity = 0.95;
                  mat.metalness = 0;
                  mat.roughness = 0.45;
                  mat.needsUpdate = true;
                }

                // 3. Red LED Rims along the ramp
                if (matName.includes('red led') || meshLower.includes('red edge')) {
                  mat.color = new THREE.Color(0xff1122);
                  mat.emissive = new THREE.Color(0xff0022);
                  mat.emissiveIntensity = 2.2;
                }

                // 4. Brushed Silver Truss & Grating - Realistic architectural steel (avoids blown-out white glare)
                if (matName.includes('brushed silver') || matName.includes('bright stainless')) {
                  mat.color = new THREE.Color(0x768292);
                  mat.metalness = 0.65;
                  mat.roughness = 0.42;
                }

                // 5. Galvanized Ramp Steel
                if (matName.includes('galvanized ramp') || meshLower.includes('ramp actual')) {
                  mat.color = new THREE.Color(0x828e9e);
                  mat.metalness = 0.55;
                  mat.roughness = 0.40;
                }

                // 6. Stage Platform & Structural Base - Gunmetal/charcoal structure
                if (matName.includes('powdercoat') || meshLower.includes('stage platform') || meshLower.includes('structural base')) {
                  mat.color = new THREE.Color(0x181a20);
                  mat.metalness = 0.35;
                  mat.roughness = 0.70;
                }

                // 7. Backdrops & curtains - Rich dark stage velvet
                if (matName.includes('velvet') || matName.includes('sign backing')) {
                  mat.color = new THREE.Color(0x0e1014);
                  mat.roughness = 0.90;
                }
              }
            }
          });

          // Center specifically on the stage structure (excluding bleachers which extend back to -21m)
          // Stage bounding box: X [-10.05, 10.05], Y [0, 10.05], Z [-3.77, 13.00]
          // By centering on stageCenter, X = 0, stage floor is at Y = -5.02, top truss at Y = +5.02, ramp extends forward to Z = +8.38
          const stageCenter = new THREE.Vector3(0, 5.023, 4.617);
          modelGroup.position.sub(stageCenter);

          // Calculate adaptive camera distance to fit full stage width and complete ramp in any viewport
          const fitCamera = () => {
            if (!container || !camera) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            const aspect = width / height;
            camera.aspect = aspect;

            const fov = 40;
            camera.fov = fov;
            const halfFovRad = THREE.MathUtils.degToRad(fov / 2);

            // True stage width:
            const stageSpanX = 20.1;
            const marginX = isMobile ? 1.08 : 1.12;
            const distForWidth = (stageSpanX * marginX) / (2 * Math.tan(halfFovRad) * aspect);

            // Vertical ramp-to-truss requirement:
            // Ramp tip extends forward to Z = +8.38 and Y = -5.02.
            // On wide desktop (e.g. 1200x520, aspect ~2.3), distForHeight = 23.8m guarantees the entire ramp and floor remain inside the frustum.
            const distForHeight = isMobile ? 25.0 : 23.8;
            const baseDist = Math.max(distForWidth, distForHeight);

            baseCamDistRef.current = baseDist;
            const curDist = baseDist / zoomFactorRef.current;

            // Camera placed at Y=1.3 and tilted looking at Y=-0.6
            // puts the top truss near NDC Y ~ +0.59 and the ramp tip at NDC Y ~ -0.84, completely avoiding bottom edge clipping.
            const targetY = 1.3;
            const lookAtY = -0.6;
            camera.position.set(0, targetY, curDist);
            camera.lookAt(0, lookAtY, 0);
            camera.far = Math.max(160, curDist + 70);
            camera.updateProjectionMatrix();
          };

          fitCamera();
          resetCameraRef.current = () => {
            zoomFactorRef.current = 1.0;
            setZoomLevel(1.0);
            targetRotationY = 0;
            targetRotationX = 0;
            fitCamera();
          };

          scene?.add(modelGroup);
          setIsLoaded(true);
        },
        undefined,
        (err) => {
          console.error('Failed to load arena 3D model:', err);
          setLoadError(true);
        }
      );

      // 6. Interaction Event Handlers: Drag-to-orbit with mouse or touch
      let isDragging = false;
      let prevPointerX = 0;
      let prevPointerY = 0;
      let lastInteractionTime = Date.now();

      // Mouse drag controls
      const handleMouseDown = (e: MouseEvent) => {
        if (isMobile) return;
        isDragging = true;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        lastInteractionTime = Date.now();
        container.style.cursor = 'grabbing';
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (isMobile) return;
        if (!isDragging) {
          // Soft parallax preview on hover
          const rect = container.getBoundingClientRect();
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          targetRotationY = -normX * (maxRotY * 0.4);
          targetRotationX = normY * (maxRotX * 0.4);
          return;
        }

        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        lastInteractionTime = Date.now();

        // Drag to rotate horizontally and vertically within bounds
        const rotSpeed = 0.004;
        targetRotationY = Math.max(-maxRotY, Math.min(maxRotY, targetRotationY + deltaX * rotSpeed));
        targetRotationX = Math.max(-maxRotX, Math.min(maxRotX, targetRotationX - deltaY * rotSpeed));
      };

      const handleMouseUp = () => {
        if (isMobile) return;
        isDragging = false;
        container.style.cursor = 'grab';
      };

      const handleMouseLeave = () => {
        if (isMobile) return;
        isDragging = false;
        container.style.cursor = 'grab';
      };

      // Keyboard Controls (Accessibility: Arrow keys & A/D)
      const handleKeyDown = (e: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', '+', '-', '=', '_'].includes(e.key)) e.preventDefault();
        lastInteractionTime = Date.now();
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          targetRotationY = Math.min(maxRotY, targetRotationY + 0.08);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          targetRotationY = Math.max(-maxRotY, targetRotationY - 0.08);
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          if (!isMobile) targetRotationX = Math.min(maxRotX, targetRotationX + 0.03);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (!isMobile) targetRotationX = Math.max(-maxRotX, targetRotationX - 0.03);
        } else if (e.key === 'Home') {
          resetCameraRef.current();
        } else if (e.key === '+' || e.key === '=') {
          applyZoom(0.15);
        } else if (e.key === '-' || e.key === '_') {
          applyZoom(-0.15);
        }
      };

      // Mobile Touch Handling: Drag horizontally, 2-finger pinch to zoom
      let touchStartX = 0;
      let touchStartY = 0;
      let isHorizontalGesture = false;
      let initialPinchDist = 0;

      const handleTouchStart = (e: TouchEvent) => {
        lastInteractionTime = Date.now();
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isHorizontalGesture = false;
          initialPinchDist = 0;
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          initialPinchDist = Math.hypot(dx, dy);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        lastInteractionTime = Date.now();
        if (e.touches.length === 1 && initialPinchDist === 0) {
          const dx = e.touches[0].clientX - touchStartX;
          const dy = e.touches[0].clientY - touchStartY;

          if (!isHorizontalGesture) {
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
              isHorizontalGesture = true;
            }
          }

          if (isHorizontalGesture) {
            const rotSpeed = 0.0045;
            targetRotationY = Math.max(-maxRotY, Math.min(maxRotY, targetRotationY + dx * rotSpeed));
            touchStartX = e.touches[0].clientX;
          }
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const currentDist = Math.hypot(dx, dy);

          if (initialPinchDist > 0 && Math.abs(currentDist - initialPinchDist) > 5) {
            const ratio = currentDist / initialPinchDist;
            const delta = (ratio - 1) * 0.3;
            applyZoom(delta);
            initialPinchDist = currentDist;
          }
        }
      };

      const handleTouchEnd = () => {
        isHorizontalGesture = false;
        initialPinchDist = 0;
      };

      // Attach event listeners
      container.style.cursor = 'grab';
      if (!isMobile) {
        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mouseleave', handleMouseLeave);
      } else {
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
      }
      container.addEventListener('keydown', handleKeyDown);

      // Zoom controller with safe limits (min zoom 0.7x full overview, max zoom 1.8x close-up)
      const applyZoom = (delta: number) => {
        if (!camera) return;
        const newZoom = Math.min(1.8, Math.max(0.7, zoomFactorRef.current + delta));
        zoomFactorRef.current = newZoom;
        setZoomLevel(newZoom);

        if (baseCamDistRef.current > 0) {
          const newDist = baseCamDistRef.current / newZoom;
          const targetY = 1.3;
          const lookAtY = -0.6;
          camera.position.z = newDist;
          camera.position.y = targetY;
          camera.lookAt(0, lookAtY, 0);
          camera.updateProjectionMatrix();
        }
      };
      applyZoomRef.current = applyZoom;

      // 7. Resize Handler
      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        fitCamera();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // 8. Animation & Render Loop with smooth lerp and subtle idle breathing
      let startTime = performance.now();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const now = performance.now();
        const timeSinceUser = Date.now() - lastInteractionTime;

        // Subtle ambient breathing rotation when idle (respects prefersReducedMotion check above)
        let idleOffset = 0;
        if (timeSinceUser > 2500 && !isDragging) {
          const t = (now - startTime) * 0.0008;
          idleOffset = Math.sin(t) * 0.035; // Very subtle gentle sway
        }

        const effectiveTargetY = targetRotationY + idleOffset;
        currentRotationY += (effectiveTargetY - currentRotationY) * 0.06;
        currentRotationX += (targetRotationX - currentRotationX) * 0.06;

        if (modelGroup) {
          modelGroup.rotation.y = currentRotationY;
          modelGroup.rotation.x = currentRotationX;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      animate();

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('keydown', handleKeyDown);
        if (!isMobile) {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mouseleave', handleMouseLeave);
        } else {
          container.removeEventListener('touchstart', handleTouchStart);
          container.removeEventListener('touchmove', handleTouchMove);
          container.removeEventListener('touchend', handleTouchEnd);
        }
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (e) {
      console.error('WebGL initialization failed:', e);
      setLoadError(true);
    }
  }, [isMobile, prefersReducedMotion, userEnabled3D]);

  // Fallback for reduced motion or error
  if (prefersReducedMotion || loadError) {
    return (
      <img
        src={posterUrl}
        alt={isEn ? "100% Wrestling Podcast Official 3D Stage" : "100% Wrestling Podcast Escenario Oficial 3D"}
        className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
      />
    );
  }

  return (
    <div 
      className="relative w-full h-full select-none overflow-hidden group outline-none" 
      style={{ touchAction: 'pan-y' }}
      tabIndex={userEnabled3D ? 0 : undefined}
      role="region"
      aria-label={isEn ? "Interactive 3D Stage for 100% Wrestling Podcast. Use left and right arrow keys to pan camera." : "Escenario 3D interactivo de 100% Wrestling Podcast. Usa las flechas izquierda y derecha para mover la cámara."}
    >
      {/* Instant fallback poster */}
      <img
        src={posterUrl}
        alt={isEn ? "100% Wrestling Podcast Official 3D Stage" : "100% Wrestling Podcast Escenario Oficial 3D"}
        className={`absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Mobile On-Demand Activation Button */}
      {isMobile && !userEnabled3D && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={() => setUserEnabled3D(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-red hover:bg-[#b91c1c] active:scale-95 text-white font-display font-black text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(215,25,32,0.4)] flex items-center gap-2 cursor-pointer border border-white/20"
            aria-label={isEn ? "Load and explore interactive 3D arena" : "Cargar y explorar arena 3D interactiva"}
          >
            <span>{isEn ? "Explore 3D arena" : "Explorar arena 3D"}</span>
          </button>
          <span className="text-[10px] text-white/70 font-mono mt-2 tracking-wide uppercase">
            {isEn ? "Optimized on-demand load" : "Carga optimizada bajo demanda"}
          </span>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      {userEnabled3D && (
        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-label={isEn ? "3D Arena: left and right arrows to explore" : "Arena 3D: flechas izquierda y derecha para explorar"}
          className={`w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ touchAction: 'pan-y' }}
        />
      )}

      {/* Floating Zoom and Reset Controls (Tactile >=44px touch targets, placed on top-right out of logo area) */}
      {userEnabled3D && isLoaded && (
        <div 
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl select-none"
          role="toolbar"
          aria-label={isEn ? "3D camera zoom and reset controls" : "Controles de zoom y restablecer cámara 3D"}
        >
          {/* Zoom In Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              applyZoomRef.current(0.18);
            }}
            disabled={zoomLevel >= 1.75}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-lg"
            aria-label={isEn ? "Zoom in arena" : "Acercar arena"}
            title={isEn ? "Zoom in (+)" : "Acercar (+)"}
          >
            +
          </button>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              applyZoomRef.current(-0.18);
            }}
            disabled={zoomLevel <= 0.72}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-lg"
            aria-label={isEn ? "Zoom out arena" : "Alejar arena"}
            title={isEn ? "Zoom out (−)" : "Alejar (−)"}
          >
            −
          </button>

          {/* Reset Camera View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetCameraRef.current();
            }}
            className="px-3 h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-mono font-medium tracking-wider transition-all cursor-pointer"
            aria-label={isEn ? "Reset camera to default view" : "Restablecer vista de cámara"}
            title={isEn ? "Reset view (Home)" : "Restablecer vista (Home)"}
          >
            {isEn ? "Reset" : "Restablecer"}
          </button>
        </div>
      )}

      {/* Indicators */}
      {!isMobile && isLoaded && (
        <div className="absolute bottom-3 right-4 z-20 pointer-events-none opacity-40 group-hover:opacity-85 transition-opacity text-[10px] uppercase font-mono tracking-widest text-white/80 bg-black/50 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
          {isEn ? "Explore with mouse or arrow keys • 3D Arena" : "Explora con el mouse o flechas • 3D Arena"}
        </div>
      )}
      {isMobile && isLoaded && (
        <div className="absolute bottom-2 right-3 z-20 pointer-events-none opacity-60 text-[9px] uppercase font-mono tracking-widest text-white/80 bg-black/50 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
          {isEn ? "Swipe horizontally • Pinch to zoom" : "Desliza horizontal • Pinza para zoom"}
        </div>
      )}
    </div>
  );
};
