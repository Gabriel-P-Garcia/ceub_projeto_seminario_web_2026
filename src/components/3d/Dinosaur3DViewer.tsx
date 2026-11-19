"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useAppStore } from "@/lib/store";
import { playSound, speakText } from "@/lib/sound";
import {
  RotateCcw,
  Layers,
  Sun,
  Eye,
  Maximize2,
  Volume2,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface Dinosaur3DViewerProps {
  speciesName: string;
  modelType: string; // "theropod" | "sauropod" | "ceratopsian" | "stegosaur" | "ankylosaur" | "pterosaur"
  lengthMeters: number;
  heightMeters: number;
  skeletonNotes?: string;
  muscleNotes?: string;
  integumentNotes?: string;
}

interface Hotspot {
  title: string;
  position: THREE.Vector3;
  description: string;
  clinicalSignificance: string;
}

export default function Dinosaur3DViewer({
  speciesName,
  modelType,
  lengthMeters,
  heightMeters,
  skeletonNotes,
  muscleNotes,
  integumentNotes,
}: Dinosaur3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    current3DLayer,
    set3DLayer,
    scaleTarget,
    setScaleTarget,
    lightingMode,
    setLightingMode,
    wireframe,
    toggleWireframe,
  } = useAppStore();

  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References to 3D groups for dynamic layer toggling
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const skeletonGroupRef = useRef<THREE.Group | null>(null);
  const muscleGroupRef = useRef<THREE.Group | null>(null);
  const integumentGroupRef = useRef<THREE.Group | null>(null);
  const scaleObjectGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Define Hotspots according to dinosaur clade/type
  const hotspots: Hotspot[] = React.useMemo(() => {
    if (modelType === "sauropod") {
      return [
        {
          title: "Sacos Aéreos Cervicais",
          position: new THREE.Vector3(2.5, 3.2, 0),
          description: "Cavidades pneumáticas nas vértebras do pescoço que aliviavam até 60% do peso da cabeça.",
          clinicalSignificance: "Adaptação idêntica ao sistema respiratório de fluxo contínuo das aves.",
        },
        {
          title: "Membros Anteriores Alongados",
          position: new THREE.Vector3(1.2, 1.8, 0.8),
          description: "Úmero com crista deltopeitoral expandida para suportar toneladas de massa corpórea.",
          clinicalSignificance: "Postura colunar gravitportal sustentada por pés palmados amortecidos.",
        },
        {
          title: "Cauda em Chicote",
          position: new THREE.Vector3(-3.5, 1.5, 0),
          description: "Vértebras caudais distais afiladas atuando como contrapeso dinâmico.",
          clinicalSignificance: "Permitia quebrar a barreira do som para comunicação e defesa.",
        },
      ];
    } else if (modelType === "ceratopsian") {
      return [
        {
          title: "Folho Parietal (Gola Óssea)",
          position: new THREE.Vector3(1.8, 2.4, 0),
          description: "Escudo ósseo maciço recoberto de queratina vascularizada.",
          clinicalSignificance: "Proteção contra mordidas no pescoço e display visual de maturação.",
        },
        {
          title: "Chifres Supraorbitais",
          position: new THREE.Vector3(2.4, 2.7, 0.4),
          description: "Núcleos ósseos com bainhas córneas de mais de 1 metro de comprimento.",
          clinicalSignificance: "Armas de combate frontal contra predadores e disputas reprodutivas.",
        },
      ];
    } else {
      // Theropod default (T-Rex, Oxalaia, Buriolestes, etc.)
      return [
        {
          title: "Fenestra Antorbital & Olfato",
          position: new THREE.Vector3(2.8, 2.3, 0.3),
          description: "Grande abertura no crânio que reduzia o peso sem diminuir a rigidez estrutural.",
          clinicalSignificance: "Alojamento de bulbos olfatórios gigantescos para rastreio de presas a quilômetros.",
        },
        {
          title: "Musculatura Mandibular (m. Adductor)",
          position: new THREE.Vector3(2.0, 2.0, 0.5),
          description: "Zona de inserção para os poderosos músculos adutores da mandíbula.",
          clinicalSignificance: "Capacidade de gerar pressão esmagadora superior a 35.000 Newtons.",
        },
        {
          title: "M. Caudofemoralis Longus",
          position: new THREE.Vector3(-1.0, 1.8, 0.4),
          description: "O maior músculo locomotor, conectando as vértebras da cauda ao fêmur.",
          clinicalSignificance: "Fornecia o impulso primário de tração bípede para arrancadas rápidas.",
        },
      ];
    }
  }, [modelType]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensões do container
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Criação da cena Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#0f172a"); // Slate profundo de museu
    scene.fog = new THREE.FogExp2("#0f172a", 0.035);

    // Câmera com FOV realista
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 3.5, 7);

    // Renderizador WebGL otimizado
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Controles Orbitais
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Não atravessar o chão
    controls.minDistance = 2.5;
    controls.maxDistance = 25;
    controls.target.set(0, 1.5, 0);

    // Piso de escavação paleontológica / grid de medição métrica
    const gridHelper = new THREE.GridHelper(24, 24, 0xd97706, 0x334155);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grupo de Iluminação
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    lightsGroup.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffecd2, 4.5);
    mainSpot.position.set(8, 12, 8);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.4;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    lightsGroup.add(mainSpot);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-8, 6, -8);
    lightsGroup.add(rimLight);

    // --- CONSTRUÇÃO DOS MODELOS ANATÔMICOS PROCEDURAIS PRECISOS ---
    const skeletonGroup = new THREE.Group();
    const muscleGroup = new THREE.Group();
    const integumentGroup = new THREE.Group();
    skeletonGroupRef.current = skeletonGroup;
    muscleGroupRef.current = muscleGroup;
    integumentGroupRef.current = integumentGroup;

    scene.add(skeletonGroup);
    scene.add(muscleGroup);
    scene.add(integumentGroup);

    // Materiais anatômicos
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5eedc, // Cor de osso fóssil
      roughness: 0.45,
      metalness: 0.05,
      wireframe: false,
    });

    const muscleMaterial = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Vermelho muscular profundo
      roughness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: modelType === "sauropod" ? 0x22543d : modelType === "ceratopsian" ? 0x9a3412 : 0xb45309,
      roughness: 0.7,
      transparent: true,
      opacity: 0.82,
    });

    // Construção de acordo com a morfologia
    if (modelType === "sauropod") {
      // 1. ESQUELETO SAURÓPODE
      // Crânio pequeno
      const skullGeo = new THREE.BoxGeometry(0.7, 0.5, 0.6);
      const skull = new THREE.Mesh(skullGeo, boneMaterial);
      skull.position.set(3.2, 3.6, 0);
      skeletonGroup.add(skull);

      // Coluna cervical alongada (pescoço)
      for (let i = 0; i < 7; i++) {
        const vertGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.5, 8);
        const vert = new THREE.Mesh(vertGeo, boneMaterial);
        vert.position.set(0.6 + i * 0.4, 2.0 + i * 0.25, 0);
        vert.rotation.z = -Math.PI / 4;
        skeletonGroup.add(vert);
      }

      // Caixa torácica maciça
      const ribCageGeo = new THREE.CylinderGeometry(1.4, 1.3, 2.8, 12);
      const ribCage = new THREE.Mesh(ribCageGeo, boneMaterial);
      ribCage.rotation.z = Math.PI / 2;
      ribCage.position.set(-0.2, 2.2, 0);
      skeletonGroup.add(ribCage);

      // 4 membros colunares
      const legGeo = new THREE.CylinderGeometry(0.3, 0.35, 2.0, 10);
      [
        [0.8, 1.0, 0.9],
        [0.8, 1.0, -0.9],
        [-1.2, 1.0, 0.8],
        [-1.2, 1.0, -0.8],
      ].forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, boneMaterial);
        leg.position.set(x, y, z);
        skeletonGroup.add(leg);
      });

      // Cauda
      for (let i = 0; i < 8; i++) {
        const tailGeo = new THREE.CylinderGeometry(0.25 - i * 0.025, 0.3 - i * 0.025, 0.5, 8);
        const tailVert = new THREE.Mesh(tailGeo, boneMaterial);
        tailVert.position.set(-1.8 - i * 0.45, 1.9 - i * 0.15, 0);
        tailVert.rotation.z = Math.PI / 3;
        skeletonGroup.add(tailVert);
      }

      // 2. MÚSCULOS SAURÓPODE
      const neckMuscles = new THREE.ConeGeometry(0.5, 3.5, 12);
      const neckM = new THREE.Mesh(neckMuscles, muscleMaterial);
      neckM.position.set(1.8, 2.8, 0);
      neckM.rotation.z = -Math.PI / 3.5;
      muscleGroup.add(neckM);

      const torsoMuscles = new THREE.SphereGeometry(1.6, 16, 16);
      const torsoM = new THREE.Mesh(torsoMuscles, muscleMaterial);
      torsoM.position.set(-0.2, 2.2, 0);
      torsoM.scale.set(1.4, 1.0, 1.0);
      muscleGroup.add(torsoM);

      // 3. PELE SAURÓPODE
      const skinGeo = new THREE.CylinderGeometry(1.5, 1.4, 3.2, 16);
      const skinMesh = new THREE.Mesh(skinGeo, skinMaterial);
      skinMesh.rotation.z = Math.PI / 2;
      skinMesh.position.set(-0.2, 2.2, 0);
      integumentGroup.add(skinMesh);

      const skinNeck = new THREE.CylinderGeometry(0.45, 0.8, 3.6, 16);
      const skinN = new THREE.Mesh(skinNeck, skinMaterial);
      skinN.position.set(1.8, 2.8, 0);
      skinN.rotation.z = -Math.PI / 3.5;
      integumentGroup.add(skinN);
    } else {
      // TERÓPODE (Bípede Predador: T-Rex, Spinosaurus, Oxalaia, etc.)
      // 1. ESQUELETO
      // Crânio com fenestras
      const skullGeo = new THREE.BoxGeometry(1.4, 0.7, 0.6);
      const skull = new THREE.Mesh(skullGeo, boneMaterial);
      skull.position.set(2.4, 2.2, 0);
      skull.castShadow = true;
      skeletonGroup.add(skull);

      // Mandíbula inferior
      const jawGeo = new THREE.BoxGeometry(1.3, 0.25, 0.55);
      const jaw = new THREE.Mesh(jawGeo, boneMaterial);
      jaw.position.set(2.35, 1.75, 0);
      skeletonGroup.add(jaw);

      // Dentes incrassados
      for (let i = 0; i < 6; i++) {
        const toothGeo = new THREE.ConeGeometry(0.04, 0.15, 6);
        const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        tooth.position.set(1.9 + i * 0.18, 1.85, 0.25);
        tooth.rotation.x = Math.PI;
        skeletonGroup.add(tooth);

        const toothL = tooth.clone();
        toothL.position.z = -0.25;
        skeletonGroup.add(toothL);
      }

      // Coluna dorsal e costelas
      const spineGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.6, 8);
      const spine = new THREE.Mesh(spineGeo, boneMaterial);
      spine.position.set(0.6, 2.0, 0);
      spine.rotation.z = Math.PI / 2.2;
      skeletonGroup.add(spine);

      // Costelas e Gastrália (costelas abdominais)
      for (let i = 0; i < 5; i++) {
        const ribGeo = new THREE.TorusGeometry(0.6 - i * 0.05, 0.04, 6, 12, Math.PI);
        const rib = new THREE.Mesh(ribGeo, boneMaterial);
        rib.position.set(1.2 - i * 0.4, 1.8, 0);
        rib.rotation.y = Math.PI / 2;
        skeletonGroup.add(rib);
      }

      // Pélvis e Sacro
      const pelvisGeo = new THREE.BoxGeometry(0.8, 0.5, 0.7);
      const pelvis = new THREE.Mesh(pelvisGeo, boneMaterial);
      pelvis.position.set(-0.3, 2.1, 0);
      skeletonGroup.add(pelvis);

      // Pernas bípedes digitígradas (Fêmur + Tíbia + Metatarsos)
      [-0.45, 0.45].forEach((zPos) => {
        // Fêmur
        const femurGeo = new THREE.CylinderGeometry(0.14, 0.12, 1.1, 8);
        const femur = new THREE.Mesh(femurGeo, boneMaterial);
        femur.position.set(-0.2, 1.6, zPos);
        femur.rotation.z = -0.25;
        skeletonGroup.add(femur);

        // Tíbia / Fíbula
        const tibiaGeo = new THREE.CylinderGeometry(0.11, 0.09, 1.1, 8);
        const tibia = new THREE.Mesh(tibiaGeo, boneMaterial);
        tibia.position.set(-0.05, 0.7, zPos);
        tibia.rotation.z = 0.25;
        skeletonGroup.add(tibia);

        // Pé com garras
        const footGeo = new THREE.BoxGeometry(0.6, 0.1, 0.25);
        const foot = new THREE.Mesh(footGeo, boneMaterial);
        foot.position.set(0.2, 0.1, zPos);
        skeletonGroup.add(foot);
      });

      // Bracinhos terópodes (dímero reduzido)
      [-0.35, 0.35].forEach((zPos) => {
        const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.45, 6);
        const arm = new THREE.Mesh(armGeo, boneMaterial);
        arm.position.set(1.2, 1.5, zPos);
        arm.rotation.z = -Math.PI / 3;
        skeletonGroup.add(arm);
      });

      // Cauda (Vértebras caudais estendidas para contrapeso)
      for (let i = 0; i < 9; i++) {
        const vertGeo = new THREE.CylinderGeometry(0.14 - i * 0.012, 0.16 - i * 0.012, 0.45, 8);
        const vert = new THREE.Mesh(vertGeo, boneMaterial);
        vert.position.set(-0.8 - i * 0.4, 2.0 - i * 0.08, 0);
        vert.rotation.z = Math.PI / 2.1;
        skeletonGroup.add(vert);
      }

      // 2. CAMADA MUSCULAR (M. Caudofemoralis, Músculo Mandibular, Coxas)
      const jawMuscleGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const jawM = new THREE.Mesh(jawMuscleGeo, muscleMaterial);
      jawM.position.set(1.85, 2.0, 0);
      jawM.scale.set(1.3, 0.9, 0.9);
      muscleGroup.add(jawM);

      const neckMuscleGeo = new THREE.CylinderGeometry(0.35, 0.55, 1.2, 10);
      const neckM = new THREE.Mesh(neckMuscleGeo, muscleMaterial);
      neckM.position.set(1.6, 2.05, 0);
      neckM.rotation.z = -Math.PI / 4;
      muscleGroup.add(neckM);

      // Coxas musculosas
      [-0.45, 0.45].forEach((zPos) => {
        const thighGeo = new THREE.CapsuleGeometry(0.32, 0.8, 8, 12);
        const thigh = new THREE.Mesh(thighGeo, muscleMaterial);
        thigh.position.set(-0.2, 1.55, zPos);
        thigh.rotation.z = -0.2;
        muscleGroup.add(thigh);
      });

      // M. Caudofemoralis (Base da cauda)
      const caudofemoralisGeo = new THREE.ConeGeometry(0.5, 2.2, 10);
      const caudo = new THREE.Mesh(caudofemoralisGeo, muscleMaterial);
      caudo.position.set(-1.4, 1.95, 0);
      caudo.rotation.z = -Math.PI / 2.05;
      muscleGroup.add(caudo);

      // 3. CAMADA DE TEGUMENTO / PELE & PENAS
      const bodySkinGeo = new THREE.CapsuleGeometry(0.7, 1.8, 12, 18);
      const bodySkin = new THREE.Mesh(bodySkinGeo, skinMaterial);
      bodySkin.position.set(0.6, 1.9, 0);
      bodySkin.rotation.z = Math.PI / 2.2;
      integumentGroup.add(bodySkin);

      const headSkinGeo = new THREE.BoxGeometry(1.5, 0.85, 0.7);
      const headSkin = new THREE.Mesh(headSkinGeo, skinMaterial);
      headSkin.position.set(2.4, 2.1, 0);
      integumentGroup.add(headSkin);

      const tailSkinGeo = new THREE.ConeGeometry(0.48, 3.8, 14);
      const tailSkin = new THREE.Mesh(tailSkinGeo, skinMaterial);
      tailSkin.position.set(-2.4, 1.85, 0);
      tailSkin.rotation.z = -Math.PI / 2.08;
      integumentGroup.add(tailSkin);

      // Se for carnívoro emplumado ou cristas dorsais (como Spinosaurus / Oxalaia)
      if (speciesName.toLowerCase().includes("oxalaia") || speciesName.toLowerCase().includes("spino")) {
        const sailGeo = new THREE.BufferGeometry();
        // Vela dorsal espinossaurídea
        const sailShape = new THREE.Shape();
        sailShape.moveTo(0, 0);
        sailShape.lineTo(0.5, 1.8);
        sailShape.lineTo(1.8, 1.5);
        sailShape.lineTo(2.4, 0);
        sailShape.lineTo(0, 0);
        const extrudeSettings = { depth: 0.05, bevelEnabled: false };
        const sailGeom = new THREE.ExtrudeGeometry(sailShape, extrudeSettings);
        const sailMat = new THREE.MeshStandardMaterial({
          color: 0x059669,
          roughness: 0.6,
          side: THREE.DoubleSide,
        });
        const sailMesh = new THREE.Mesh(sailGeom, sailMat);
        sailMesh.position.set(-0.8, 2.3, -0.025);
        integumentGroup.add(sailMesh);
      }
    }

    // --- OBJETO DE COMPARAÇÃO DE ESCALA RELATIVA ---
    const scaleGroup = new THREE.Group();
    scaleObjectGroupRef.current = scaleGroup;
    scene.add(scaleGroup);

    // Construtor de silhueta humana padrão (1.8m de altura)
    function buildHumanSilhouette() {
      const human = new THREE.Group();
      const humanMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.5,
        wireframe: true,
      });

      // Cabeça
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), humanMat);
      head.position.y = 1.68;
      human.add(head);

      // Tronco
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.65, 8), humanMat);
      torso.position.y = 1.25;
      human.add(torso);

      // Pernas
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.9, 6), humanMat);
      leftLeg.position.set(-0.1, 0.45, 0);
      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 0.1;
      human.add(leftLeg);
      human.add(rightLeg);

      // Braços
      const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.65, 6), humanMat);
      leftArm.position.set(-0.25, 1.25, 0);
      const rightArm = leftArm.clone();
      rightArm.position.x = 0.25;
      human.add(leftArm);
      human.add(rightArm);

      human.position.set(4.0, 0, 1.5);
      return human;
    }

    // Carro moderno (4.5m)
    function buildCarSilhouette() {
      const car = new THREE.Group();
      const carMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.3,
        wireframe: true,
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.4, 1.8), carMat);
      body.position.set(0, 0.8, 0);
      car.add(body);
      car.position.set(2.0, 0, 3.0);
      return car;
    }

    // Elefante Africano (3.2m de altura)
    function buildElephantSilhouette() {
      const ele = new THREE.Group();
      const eleMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.6,
        wireframe: true,
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 1.8), eleMat);
      body.position.set(0, 2.1, 0);
      ele.add(body);

      // 4 patas
      for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.8, 8), eleMat);
        leg.position.set(
          i < 2 ? 1.0 : -1.0,
          0.9,
          i % 2 === 0 ? 0.7 : -0.7
        );
        ele.add(leg);
      }
      ele.position.set(-3.5, 0, 2.5);
      return ele;
    }

    // Atualizar objeto de escala
    function updateScaleObject(target: string) {
      if (!scaleObjectGroupRef.current) return;
      scaleObjectGroupRef.current.clear();

      if (target === "human") {
        scaleObjectGroupRef.current.add(buildHumanSilhouette());
      } else if (target === "car") {
        scaleObjectGroupRef.current.add(buildCarSilhouette());
      } else if (target === "elephant") {
        scaleObjectGroupRef.current.add(buildElephantSilhouette());
      }
    }

    updateScaleObject(scaleTarget);

    // --- MARCADORES INTERATIVOS DE ANATOMIA (CALLOUT HOTSPOTS) ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const markerMeshes: THREE.Mesh[] = [];

    hotspots.forEach((spot, idx) => {
      const markerGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(spot.position);
      marker.userData = { hotspotIndex: idx };
      scene.add(marker);
      markerMeshes.push(marker);

      // Anel pulsante ao redor do marcador
      const ringGeo = new THREE.RingGeometry(0.16, 0.22, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(spot.position);
      ring.lookAt(camera.position);
      scene.add(ring);
    });

    // Clique em Hotspot
    const onCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const spotIdx = hit.userData.hotspotIndex;
        if (spotIdx !== undefined && hotspots[spotIdx]) {
          playSound("click");
          setActiveHotspot(hotspots[spotIdx]);
        }
      }
    };

    renderer.domElement.addEventListener("click", onCanvasClick);

    // Loop de Animação
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotação suave automática se ativada
      if (autoRotate && controlsRef.current) {
        scene.rotation.y += delta * 0.15;
      }

      // Pulsação sutil nos marcadores anatômicos
      markerMeshes.forEach((m, idx) => {
        const s = 1 + Math.sin(elapsedTime * 3 + idx) * 0.15;
        m.scale.set(s, s, s);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onCanvasClick);
      renderer.dispose();
      if (container) container.innerHTML = "";
    };
  }, [modelType, speciesName, hotspots, autoRotate]);

  // Atualização reativa de Camadas (Esqueleto / Músculo / Pele)
  useEffect(() => {
    if (!skeletonGroupRef.current || !muscleGroupRef.current || !integumentGroupRef.current)
      return;

    if (current3DLayer === "skeleton") {
      skeletonGroupRef.current.visible = true;
      muscleGroupRef.current.visible = false;
      integumentGroupRef.current.visible = false;
    } else if (current3DLayer === "muscles") {
      skeletonGroupRef.current.visible = true;
      muscleGroupRef.current.visible = true;
      integumentGroupRef.current.visible = false;
    } else if (current3DLayer === "integument") {
      skeletonGroupRef.current.visible = false;
      muscleGroupRef.current.visible = false;
      integumentGroupRef.current.visible = true;
    } else {
      // 'all'
      skeletonGroupRef.current.visible = true;
      muscleGroupRef.current.visible = true;
      integumentGroupRef.current.visible = true;
    }
  }, [current3DLayer]);

  // Atualização reativa de Wireframe
  useEffect(() => {
    [skeletonGroupRef.current, muscleGroupRef.current, integumentGroupRef.current].forEach(
      (grp) => {
        if (!grp) return;
        grp.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            child.material.wireframe = wireframe;
          }
        });
      }
    );
  }, [wireframe]);

  // Atualização reativa de Iluminação
  useEffect(() => {
    if (!lightsGroupRef.current) return;
    lightsGroupRef.current.clear();

    if (lightingMode === "museum") {
      const amb = new THREE.AmbientLight(0xffffff, 0.7);
      const spot = new THREE.SpotLight(0xffecd2, 4.0);
      spot.position.set(6, 12, 6);
      const rim = new THREE.DirectionalLight(0x38bdf8, 2.0);
      rim.position.set(-6, 5, -6);
      lightsGroupRef.current.add(amb, spot, rim);
    } else if (lightingMode === "daylight") {
      const sun = new THREE.DirectionalLight(0xffffff, 3.5);
      sun.position.set(10, 15, 10);
      const amb = new THREE.AmbientLight(0xbae6fd, 1.2);
      lightsGroupRef.current.add(sun, amb);
    } else {
      // Sunset
      const sunset = new THREE.DirectionalLight(0xf97316, 3.8);
      sunset.position.set(-10, 5, 8);
      const amb = new THREE.AmbientLight(0x451a03, 1.5);
      lightsGroupRef.current.add(sunset, amb);
    }
  }, [lightingMode]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1.5, 0);
    }
    if (sceneRef.current) {
      sceneRef.current.rotation.y = 0;
    }
    playSound("click");
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-amber-900/40 bg-slate-950 shadow-2xl transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[540px] md:h-[620px]"
      }`}
    >
      {/* Canvas 3D */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-amber-400 font-medium text-sm">
              Carregando Modelo Anatômico 3D (R3F/Three.js)...
            </p>
          </div>
        </div>
      )}

      {/* Barra de Ferramentas Superior - ADR-001 Controles de Camadas */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Camadas Anatômicas */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs">
          <span className="text-slate-400 px-2 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" /> Camada:
          </span>
          <button
            onClick={() => {
              set3DLayer("all");
              playSound("click");
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              current3DLayer === "all"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Completo
          </button>
          <button
            onClick={() => {
              set3DLayer("skeleton");
              playSound("click");
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              current3DLayer === "skeleton"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800"
            }`}
            title="Visualizar osteologia e estrutura óssea"
          >
            🦴 Esqueleto
          </button>
          <button
            onClick={() => {
              set3DLayer("muscles");
              playSound("click");
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              current3DLayer === "muscles"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800"
            }`}
            title="Visualizar sistema muscular e tração motora"
          >
            🥩 Músculos
          </button>
          <button
            onClick={() => {
              set3DLayer("integument");
              playSound("click");
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition ${
              current3DLayer === "integument"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-300 hover:bg-slate-800"
            }`}
            title="Visualizar escamas, penas e tegumento dérmico"
          >
            🦎 Pele & Penas
          </button>
        </div>

        {/* Comparação de Escala e Ações Rápidas */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs">
          <Users className="w-3.5 h-3.5 text-sky-400 ml-1" />
          <span className="text-slate-400 hidden sm:inline">Escala:</span>
          <select
            value={scaleTarget}
            onChange={(e) => {
              setScaleTarget(e.target.value as any);
              playSound("click");
            }}
            className="bg-slate-800 text-sky-300 font-medium rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="none">Nenhum</option>
            <option value="human">Humano (1.8m)</option>
            <option value="car">Carro (4.5m)</option>
            <option value="elephant">Elefante (3.2m)</option>
          </select>

          {/* Narração de Acessibilidade */}
          <button
            onClick={() => {
              const textToSpeak = `${speciesName}. Comprimento estimado: ${lengthMeters} metros. Altura: ${heightMeters} metros. ${skeletonNotes || ""}`;
              speakText(textToSpeak);
              playSound("click");
            }}
            className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
            title="Ouvir descrição anatômica por voz (Acessibilidade)"
            aria-label="Ouvir descrição anatômica"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              playSound("click");
            }}
            className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
            title="Alternar Tela Cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controles Flutuantes Inferiores */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs text-slate-300">
          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              playSound("click");
            }}
            className={`px-2 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              autoRotate ? "bg-amber-600/80 text-white" : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Giro Automático</span>
          </button>

          <button
            onClick={resetCamera}
            className="px-2 py-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition flex items-center gap-1"
            title="Restaurar visualização original da câmera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Resetar</span>
          </button>

          <button
            onClick={() => {
              toggleWireframe();
              playSound("click");
            }}
            className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
              wireframe ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-300"
            }`}
            title="Alternar malha poligonal 3D"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wireframe</span>
          </button>

          {/* Modos de Iluminação */}
          <button
            onClick={() => {
              const nextMode =
                lightingMode === "museum"
                  ? "daylight"
                  : lightingMode === "daylight"
                  ? "sunset"
                  : "museum";
              setLightingMode(nextMode);
              playSound("click");
            }}
            className="px-2 py-1 hover:bg-slate-800 rounded-lg text-amber-400 transition flex items-center gap-1"
            title="Alternar iluminação (Museu / Sol / Pôr do Sol)"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="capitalize hidden sm:inline">{lightingMode}</span>
          </button>
        </div>
      </div>

      {/* Dimensões em Escala Métrica no Canto */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 shadow-lg text-xs font-mono text-slate-300">
        <span className="text-amber-400 font-semibold">{lengthMeters}m</span> comp. ×{" "}
        <span className="text-amber-400 font-semibold">{heightMeters}m</span> alt.
      </div>

      {/* Modal / Card de Hotspot Anatômico Selecionado */}
      {activeHotspot && (
        <div className="absolute top-20 right-4 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-amber-500/50 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{activeHotspot.title}</span>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
            >
              Fechar
            </button>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed mb-2.5">
            {activeHotspot.description}
          </p>
          <div className="bg-amber-950/40 border border-amber-900/40 p-2.5 rounded-xl">
            <span className="text-[11px] font-semibold text-amber-400 block mb-0.5">
              Significância Evolutiva & Biológica:
            </span>
            <p className="text-slate-300 text-[11px] leading-snug">
              {activeHotspot.clinicalSignificance}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
