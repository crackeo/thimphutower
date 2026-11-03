'use client';
// Illustrative 3D interior of a guest room, built from the features the hotel lists for every
// room (see inRoom in content/site.ts). Layout, finishes and colours are not a survey.
// 1 unit = 1 metre. The window wall faces the square at -z; the entry door is at +z.
import { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Raycaster,
  RepeatWrapping,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const W = 4.4; // inner width (x)
const D = 5.6; // inner depth (z)
const H = 2.8; // ceiling height
const L = -W / 2;
const R = W / 2;
const F = -D / 2; // window wall
const B = D / 2; // entry wall

export type Feature = 'windows' | 'bed' | 'phone' | 'sofa' | 'desk' | 'tv' | 'ac' | 'wardrobe' | 'bathroom';
type Cam = { pos: [number, number, number]; target: [number, number, number] };

const VIEWS = {
  overview: { pos: [5.6, 6.6, 6.4], target: [0, 0.6, 0] },
  door: { pos: [0.3, 1.6, 2.45], target: [-0.4, 1.1, -2.6] },
  window: { pos: [0.6, 1.5, -0.4], target: [0, 1.5, -2.8] },
} satisfies Record<string, Cam>;
type View = keyof typeof VIEWS;
const VIEW_LABELS: Record<View, string> = { overview: 'Overview', door: 'From the door', window: 'The view' };

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

/** Small procedural textures, so the scene needs no extra downloads besides the view photo. */
function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat: [number, number] = [1, 1]) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 4;
  return t;
}

const floorTex = () =>
  canvasTexture(
    512,
    512,
    (c) => {
      const rows = 8;
      for (let r = 0; r < rows; r++) {
        let x = (r % 2) * -120;
        while (x < 512) {
          const len = 180 + ((r * 97 + x) % 140);
          const l = 34 + ((r * 13 + Math.abs(x)) % 9);
          c.fillStyle = `hsl(26 42% ${l}%)`;
          c.fillRect(x, r * 64, len, 64);
          c.fillStyle = 'rgb(0 0 0 / 0.05)';
          for (let g = 0; g < 6; g++) c.fillRect(x, r * 64 + 6 + g * 10 + ((x + g) % 5), len, 1);
          c.fillStyle = 'rgb(20 12 6 / 0.55)';
          c.fillRect(x, r * 64, 2, 64);
          x += len;
        }
        c.fillStyle = 'rgb(20 12 6 / 0.55)';
        c.fillRect(0, r * 64, 512, 2);
      }
    },
    [2.2, 2.8],
  );

/** A painted band in the spirit of Bhutanese cornices: lotus roundels between coloured bands. */
const corniceTex = () =>
  canvasTexture(
    512,
    64,
    (c) => {
      const bands = ['#2d4f7c', '#9c3a2a', '#2f6b4f'];
      c.fillStyle = '#9c3a2a';
      c.fillRect(0, 0, 512, 64);
      bands.forEach((b, i) => {
        c.fillStyle = b;
        c.fillRect(0, i * 6, 512, 6);
        c.fillRect(0, 58 - i * 6, 512, 6);
      });
      for (let i = 0; i < 8; i++) {
        const x = 32 + i * 64;
        c.fillStyle = '#e1ba3b';
        c.beginPath();
        c.arc(x, 32, 13, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#f3efe8';
        for (let p = 0; p < 8; p++) {
          const a = (p / 8) * Math.PI * 2;
          c.beginPath();
          c.ellipse(x + Math.cos(a) * 8, 32 + Math.sin(a) * 8, 4, 2, a, 0, Math.PI * 2);
          c.fill();
        }
        c.fillStyle = '#2f6b4f';
        c.beginPath();
        c.moveTo(x + 32, 20);
        c.lineTo(x + 40, 32);
        c.lineTo(x + 32, 44);
        c.lineTo(x + 24, 32);
        c.fill();
      }
    },
    [3, 1],
  );

const rugTex = () =>
  canvasTexture(256, 256, (c) => {
    c.fillStyle = '#8c5f2b';
    c.fillRect(0, 0, 256, 256);
    c.strokeStyle = '#e8d9b8';
    c.lineWidth = 6;
    c.strokeRect(14, 14, 228, 228);
    c.strokeStyle = '#5a3424';
    c.lineWidth = 3;
    c.strokeRect(28, 28, 200, 200);
    c.fillStyle = '#e1ba3b';
    for (let i = 0; i < 4; i++) {
      c.save();
      c.translate(128, 128);
      c.rotate((i * Math.PI) / 2);
      c.beginPath();
      c.moveTo(0, -60);
      c.lineTo(18, 0);
      c.lineTo(-18, 0);
      c.fill();
      c.restore();
    }
  });

/** Wall outline with arched openings, extruded into a solid wall or a timber frame. */
function archShape(x0: number, x1: number, y0: number, y1: number, holes: { cx: number; w: number; sill: number; spring: number }[]) {
  const s = new Shape();
  s.moveTo(x0, y0);
  s.lineTo(x1, y0);
  s.lineTo(x1, y1);
  s.lineTo(x0, y1);
  s.lineTo(x0, y0);
  holes.forEach(({ cx, w, sill, spring }) => {
    const h = new Shape();
    h.moveTo(cx - w / 2, sill);
    h.lineTo(cx + w / 2, sill);
    h.lineTo(cx + w / 2, spring);
    h.absarc(cx, spring, w / 2, 0, Math.PI, false);
    h.lineTo(cx - w / 2, sill);
    s.holes.push(h);
  });
  return s;
}

export default function RoomScene({
  beds,
  features,
  initial = null,
}: {
  beds: 'double' | 'twin';
  features: Record<Feature, { title: string; text: string }>;
  initial?: Feature | null;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const api = useRef<{ view: (v: View) => void; select: (f: Feature | null) => void; light: (evening: boolean) => void } | null>(null);
  const [view, setView] = useState<View>('overview');
  const [feature, setFeature] = useState<Feature | null>(initial);
  const [evening, setEvening] = useState(false);

  useEffect(() => {
    const el = wrap.current!;
    const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    el.prepend(canvas);

    const scene = new Scene();
    scene.background = new Color('#1d1b19');
    const pmrem = new PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;

    const camera = new PerspectiveCamera(45, 1, 0.05, 80);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.4;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.enablePan = false;

    const disposables: { dispose: () => void }[] = [pmrem, env];
    const geo = <T extends BufferGeometry>(g: T) => (disposables.push(g), g);
    const mat = (o: ConstructorParameters<typeof MeshStandardMaterial>[0]) => {
      const m = new MeshStandardMaterial({ roughness: 0.8, ...o });
      disposables.push(m);
      return m;
    };
    const tex = (t: Texture) => (disposables.push(t), t);

    const M = {
      plaster: mat({ color: '#efe5d3', roughness: 0.95 }),
      ceiling: mat({ color: '#f6f0e6', roughness: 1 }),
      floor: mat({ map: tex(floorTex()), roughness: 0.55 }),
      timber: mat({ color: '#5a3424', roughness: 0.6 }),
      oak: mat({ color: '#8a5a36', roughness: 0.55 }),
      cornice: mat({ map: tex(corniceTex()), roughness: 0.7 }),
      linen: mat({ color: '#f7f2e9', roughness: 0.95 }),
      throw: mat({ color: '#9c3a2a', roughness: 0.9 }),
      headboard: mat({ color: '#c9b79c', roughness: 0.9 }),
      sofa: mat({ color: '#7d3526', roughness: 0.92 }),
      cushion: mat({ color: '#e1ba3b', roughness: 0.85 }),
      rug: mat({ map: tex(rugTex()), roughness: 1 }),
      black: mat({ color: '#141312', roughness: 0.25, metalness: 0.2 }),
      white: mat({ color: '#f4f2ee', roughness: 0.35 }),
      tile: mat({ color: '#d9d2c6', roughness: 0.4 }),
      brass: mat({ color: '#c49a3c', roughness: 0.35, metalness: 0.9 }),
      glass: mat({ color: '#cfe0e6', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.22 }),
      shade: mat({ color: '#f3dcb4', roughness: 0.9, emissive: new Color('#ffb46b'), emissiveIntensity: 0.15 }),
      mirror: mat({ color: '#9fb0b6', roughness: 0.05, metalness: 1 }),
    };

    const room = new Group();
    scene.add(room);
    const hits: Object3D[] = [];
    const box = (
      w: number,
      h: number,
      d: number,
      m: Material,
      x: number,
      y: number,
      z: number,
      opts: { round?: number; parent?: Object3D; feature?: Feature; cast?: boolean } = {},
    ) => {
      const g = opts.round ? geo(new RoundedBoxGeometry(w, h, d, 3, opts.round)) : geo(new BoxGeometry(w, h, d));
      const mesh = new Mesh(g, m);
      mesh.position.set(x, y, z);
      mesh.castShadow = opts.cast ?? true;
      mesh.receiveShadow = true;
      if (opts.feature) {
        mesh.userData.feature = opts.feature;
        hits.push(mesh);
      }
      (opts.parent ?? room).add(mesh);
      return mesh;
    };
    const cyl = (rt: number, rb: number, h: number, m: Material, x: number, y: number, z: number, feature?: Feature, parent: Object3D = room) => {
      const mesh = new Mesh(geo(new CylinderGeometry(rt, rb, h, 28)), m);
      mesh.position.set(x, y, z);
      mesh.castShadow = mesh.receiveShadow = true;
      if (feature) {
        mesh.userData.feature = feature;
        hits.push(mesh);
      }
      parent.add(mesh);
      return mesh;
    };

    // ---- shell: floor, ceiling and the four walls (walls facing the camera are cut away)
    box(W, 0.06, D, M.floor, 0, -0.03, 0, { cast: false });
    const ceiling = new Group();
    room.add(ceiling);
    box(W, 0.06, D, M.ceiling, 0, H + 0.03, 0, { parent: ceiling, cast: false });
    const walls = { left: new Group(), right: new Group(), back: new Group(), front: new Group() };
    Object.values(walls).forEach((g) => room.add(g));
    const T = 0.14;
    box(T, H, D, M.plaster, L - T / 2, H / 2, 0, { parent: walls.left });
    box(T, H, D, M.plaster, R + T / 2, H / 2, 0, { parent: walls.right });
    // entry wall with a door opening at x -0.3..0.6
    box(1.9 + T, H, T, M.plaster, (L - T + -0.3) / 2, H / 2, B + T / 2, { parent: walls.back });
    box(R + T - 0.6, H, T, M.plaster, (0.6 + R + T) / 2, H / 2, B + T / 2, { parent: walls.back });
    box(0.9, H - 2.1, T, M.plaster, 0.15, (H + 2.1) / 2, B + T / 2, { parent: walls.back });
    box(0.82, 2.06, 0.05, M.timber, 0.15, 1.03, B + 0.02, { parent: walls.back });
    box(0.04, 0.04, 0.08, M.brass, -0.18, 1.0, B - 0.02, { parent: walls.back });
    // painted cornice band on every wall, just under the ceiling
    const band = 0.22;
    box(0.02, band, D, M.cornice, L + 0.01, H - band / 2 - 0.04, 0, { parent: walls.left, cast: false });
    box(0.02, band, D, M.cornice, R - 0.01, H - band / 2 - 0.04, 0, { parent: walls.right, cast: false });
    box(W, band, 0.02, M.cornice, 0, H - band / 2 - 0.04, B - 0.01, { parent: walls.back, cast: false });

    // window wall: three arched openings in a carved timber frame, as on the facade
    const holes = [-1.25, 0, 1.25].map((cx) => ({ cx, w: 0.92, sill: 0.62, spring: 1.95 }));
    const front = new Mesh(geo(new ExtrudeGeometry(archShape(L - T, R + T, 0, H, holes), { depth: T * 1.6, bevelEnabled: false })), M.plaster);
    front.position.z = F - T * 1.6;
    front.receiveShadow = front.castShadow = true;
    walls.front.add(front);
    holes.forEach((h) => {
      const frame = new Mesh(
        geo(new ExtrudeGeometry(archShape(h.cx - h.w / 2 - 0.09, h.cx + h.w / 2 + 0.09, h.sill - 0.08, h.spring + h.w / 2 + 0.1, [h]), { depth: 0.07, bevelEnabled: false })),
        M.timber,
      );
      frame.position.z = F;
      frame.userData.feature = 'windows';
      hits.push(frame);
      walls.front.add(frame);
      box(0.035, h.spring - h.sill + h.w / 2 - 0.02, 0.04, M.timber, h.cx, (h.sill + h.spring + h.w / 2) / 2, F - 0.1, { parent: walls.front, feature: 'windows' });
      box(h.w, 0.035, 0.04, M.timber, h.cx, h.spring, F - 0.1, { parent: walls.front, feature: 'windows' });
      box(h.w + 0.3, 0.05, 0.22, M.oak, h.cx, h.sill - 0.05, F + 0.05, { parent: walls.front, feature: 'windows' });
    });
    box(W - 0.4, 0.2, 0.08, M.cornice, 0, 2.62, F + 0.04, { parent: walls.front, feature: 'windows', cast: false });
    box(W, band, 0.02, M.cornice, 0, H - band / 2 - 0.04, F + 0.01, { parent: walls.front, cast: false });

    // the view: a photograph taken from the hotel during a festival on the square
    const viewMat = new MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    disposables.push(viewMat);
    const viewPlane = new Mesh(geo(new PlaneGeometry(7.2, 4.8)), viewMat);
    viewPlane.position.set(0, 1.5, F - 2.2);
    walls.front.add(viewPlane);
    // seen from outside the room, the openings show pale daylight instead of the photo
    const skyMat = new MeshBasicMaterial({ color: '#d7e2e6', toneMapped: false });
    disposables.push(skyMat);
    const sky = new Mesh(geo(new PlaneGeometry(W, H)), skyMat);
    sky.position.set(0, H / 2, F - T * 0.8);
    walls.front.add(sky);
    new TextureLoader().load('/images/optimized/festival-from-window-1280.webp', (t) => {
      t.colorSpace = SRGBColorSpace;
      const img = t.image as { width: number; height: number };
      const a = img.width / img.height / (7.2 / 4.8);
      if (a > 1) t.repeat.set(1 / a, 1), t.offset.set((1 - 1 / a) / 2, 0);
      else t.repeat.set(1, a), t.offset.set(0, (1 - a) / 2);
      viewMat.map = t;
      viewMat.needsUpdate = true;
      disposables.push(t);
    });

    // ---- bed against the left wall, head to the wall
    const bedLen = 2.05;
    const bz = 0.35;
    box(0.08, 1.15, beds === 'double' ? 2.2 : 2.6, M.timber, L + 0.04, 0.58, bz, { feature: 'bed' });
    box(0.06, 0.82, beds === 'double' ? 1.95 : 2.35, M.headboard, L + 0.1, 0.72, bz, { feature: 'bed', round: 0.03 });
    const bedOne = (z: number, w: number) => {
      box(bedLen, 0.3, w, M.oak, L + 0.12 + bedLen / 2, 0.18, z, { feature: 'bed' });
      box(bedLen - 0.04, 0.22, w - 0.04, M.linen, L + 0.12 + bedLen / 2, 0.44, z, { feature: 'bed', round: 0.06 });
      box(bedLen * 0.66, 0.08, w + 0.04, M.linen, L + 0.12 + bedLen * 0.66, 0.56, z, { feature: 'bed', round: 0.04 });
      box(0.5, 0.09, w + 0.08, M.throw, L + 0.12 + bedLen - 0.35, 0.6, z, { feature: 'bed', round: 0.03 });
      const pillows = w > 1.2 ? [-w / 4, w / 4] : [0];
      pillows.forEach((p) => box(0.36, 0.14, Math.min(0.62, w - 0.2), M.linen, L + 0.34, 0.62, z + p, { feature: 'bed', round: 0.06 }));
    };
    if (beds === 'double') bedOne(bz, 1.8);
    else {
      bedOne(bz - 0.62, 1.0);
      bedOne(bz + 0.62, 1.0);
    }
    box(1.6, 0.012, beds === 'double' ? 2.3 : 2.8, M.rug, L + 1.5, 0.006, bz, { cast: false });

    // bedside tables with lamps; the telephone sits on the window side
    const lamps: PointLight[] = [];
    const sideZ = beds === 'double' ? [bz - 1.22, bz + 1.22] : [bz - 1.42, bz + 1.42];
    sideZ.forEach((z, i) => {
      box(0.45, 0.55, 0.42, M.timber, L + 0.3, 0.275, z, { feature: i === 0 ? 'phone' : 'bed' });
      cyl(0.06, 0.09, 0.26, M.brass, L + 0.3, 0.68, z);
      const shade = cyl(0.13, 0.17, 0.2, M.shade, L + 0.3, 0.88, z);
      shade.castShadow = false;
      const p = new PointLight('#ffb46b', 0, 5, 1.6);
      p.position.set(L + 0.3, 0.86, z);
      room.add(p);
      lamps.push(p);
    });
    box(0.16, 0.06, 0.2, M.black, L + 0.38, 0.58, sideZ[0] - 0.05, { feature: 'phone', round: 0.02 });
    box(0.05, 0.035, 0.18, M.black, L + 0.32, 0.63, sideZ[0] - 0.05, { feature: 'phone', round: 0.015 });

    // air conditioning, high on the wall above the bed
    box(0.24, 0.3, 0.95, M.white, L + 0.12, 2.3, bz, { feature: 'ac', round: 0.04 });
    box(0.02, 0.03, 0.8, M.black, L + 0.245, 2.2, bz, { feature: 'ac' });

    // ---- sofa and low table in the window corner
    const sofa = new Group();
    sofa.position.set(L + 0.45, 0, F + 1.05);
    room.add(sofa);
    box(0.8, 0.42, 1.6, M.sofa, 0, 0.21, 0, { parent: sofa, feature: 'sofa', round: 0.06 });
    box(0.22, 0.48, 1.6, M.sofa, -0.29, 0.62, 0, { parent: sofa, feature: 'sofa', round: 0.08 });
    [-0.74, 0.74].forEach((z) => box(0.8, 0.26, 0.14, M.sofa, 0, 0.55, z, { parent: sofa, feature: 'sofa', round: 0.06 }));
    [-0.4, 0.4].forEach((z) => box(0.12, 0.34, 0.4, M.cushion, -0.12, 0.62, z, { parent: sofa, feature: 'sofa', round: 0.05 }));
    cyl(0.32, 0.32, 0.04, M.oak, L + 1.35, 0.42, F + 1.05, 'sofa');
    cyl(0.04, 0.06, 0.4, M.timber, L + 1.35, 0.2, F + 1.05, 'sofa');

    // ---- work desk and chair on the right wall, by the window
    const dz = F + 0.95;
    box(0.6, 0.04, 1.25, M.oak, R - 0.3, 0.75, dz, { feature: 'desk' });
    [-0.58, 0.58].forEach((z) => box(0.56, 0.73, 0.04, M.timber, R - 0.3, 0.365, dz + z, { feature: 'desk' }));
    box(0.04, 0.5, 0.04, M.brass, R - 0.2, 1.0, dz - 0.45, { feature: 'desk' });
    const dl = cyl(0.06, 0.11, 0.13, M.shade, R - 0.2, 1.3, dz - 0.45, 'desk');
    dl.castShadow = false;
    box(0.3, 0.012, 0.42, M.black, R - 0.32, 0.778, dz + 0.1, { feature: 'desk' });
    const chair = new Group();
    chair.position.set(R - 0.85, 0, dz);
    chair.rotation.y = 0.15;
    room.add(chair);
    box(0.46, 0.06, 0.46, M.timber, 0, 0.46, 0, { parent: chair, feature: 'desk', round: 0.02 });
    box(0.05, 0.5, 0.42, M.timber, -0.21, 0.74, 0, { parent: chair, feature: 'desk', round: 0.02 });
    box(0.4, 0.05, 0.4, M.headboard, 0, 0.5, 0, { parent: chair, feature: 'desk', round: 0.02 });
    [
      [-0.19, -0.19],
      [-0.19, 0.19],
      [0.19, -0.19],
      [0.19, 0.19],
    ].forEach(([x, z]) => box(0.04, 0.44, 0.04, M.timber, x, 0.22, z, { parent: chair, feature: 'desk' }));

    // ---- TV on the wall facing the bed, over a console holding the fridge and coffee maker
    const tz = bz;
    box(0.45, 0.55, 1.5, M.timber, R - 0.225, 0.275, tz, { feature: 'tv' });
    box(0.01, 0.48, 0.55, M.oak, R - 0.455, 0.29, tz - 0.42, { feature: 'tv' });
    box(0.03, 0.2, 0.03, M.brass, R - 0.47, 0.32, tz - 0.2, { feature: 'tv' });
    box(0.2, 0.26, 0.16, M.black, R - 0.2, 0.68, tz + 0.45, { feature: 'tv', round: 0.02 });
    [0.15, 0.27].forEach((o) => cyl(0.035, 0.03, 0.08, M.white, R - 0.32, 0.59, tz + o, 'tv'));
    box(0.05, 0.68, 1.18, M.black, R - 0.03, 1.45, tz, { feature: 'tv', round: 0.01 });

    // ---- large wardrobe on the entry wall (the locker is inside)
    const wx = L + 0.7;
    box(1.3, 2.25, 0.62, M.timber, wx, 1.125, B - 0.31, { feature: 'wardrobe' });
    [-0.325, 0.325].forEach((o) => box(0.62, 2.12, 0.02, M.oak, wx + o, 1.12, B - 0.63, { feature: 'wardrobe' }));
    [-0.04, 0.04].forEach((o) => box(0.02, 0.32, 0.03, M.brass, wx + o, 1.15, B - 0.65, { feature: 'wardrobe' }));

    // ---- private bathroom in the corner by the door (x 0.8..R, z 1.4..B)
    const bx = 0.8;
    const bzz = 1.4;
    const bath = new Group();
    room.add(bath);
    box(R - bx, 0.02, B - bzz, M.tile, (bx + R) / 2, 0.012, (bzz + B) / 2, { parent: bath, feature: 'bathroom', cast: false });
    box(0.1, H, 0.35, M.plaster, bx, H / 2, bzz + 0.175, { parent: bath, feature: 'bathroom' });
    box(0.1, H, B - 2.45, M.plaster, bx, H / 2, (2.45 + B) / 2, { parent: bath, feature: 'bathroom' });
    box(0.1, H - 2.1, 0.7, M.plaster, bx, (H + 2.1) / 2, 2.1, { parent: bath, feature: 'bathroom' });
    box(R - bx + 0.05, H, 0.1, M.plaster, (bx + R) / 2, H / 2, bzz, { parent: bath, feature: 'bathroom' });
    box(0.7, 0.08, 0.45, M.oak, 1.6, 0.82, bzz + 0.27, { parent: bath, feature: 'bathroom' });
    box(0.66, 0.74, 0.4, M.timber, 1.6, 0.39, bzz + 0.25, { parent: bath, feature: 'bathroom' });
    cyl(0.17, 0.12, 0.12, M.white, 1.6, 0.92, bzz + 0.27, 'bathroom', bath);
    box(0.6, 0.75, 0.02, M.mirror, 1.6, 1.55, bzz + 0.06, { parent: bath, feature: 'bathroom', cast: false });
    box(0.36, 0.4, 0.5, M.white, R - 0.25, 0.2, 2.0, { parent: bath, feature: 'bathroom', round: 0.08 });
    box(0.18, 0.38, 0.42, M.white, R - 0.09, 0.55, 2.0, { parent: bath, feature: 'bathroom', round: 0.04 });
    box(R - 1.35, 0.06, B - 2.3, M.tile, (1.35 + R) / 2, 0.05, (2.3 + B) / 2, { parent: bath, feature: 'bathroom' });
    box(0.02, 1.9, B - 2.3, M.glass, 1.35, 1.0, (2.3 + B) / 2, { parent: bath, feature: 'bathroom', cast: false });
    cyl(0.06, 0.06, 0.04, M.brass, (1.35 + R) / 2, 2.0, B - 0.12, 'bathroom', bath);
    const geyser = cyl(0.13, 0.13, 0.5, M.white, (1.35 + R) / 2, 2.4, B - 0.18, 'bathroom', bath);
    geyser.rotation.z = Math.PI / 2;
    [1.5, 1.7].forEach((z) => box(0.04, 0.12, 0.04, M.white, R - 0.05, 0.98, z, { parent: bath, feature: 'bathroom' }));

    // ---- lighting: day comes through the windows; the evening is lamplight
    const hemi = new HemisphereLight('#fff6e8', '#6b5a48', 0.7);
    scene.add(hemi);
    const sun = new DirectionalLight('#fff1dc', 2.4);
    sun.position.set(-1.6, 4.2, F - 4);
    sun.target.position.set(0.4, 0, 0.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -4;
    sun.shadow.camera.right = 4;
    sun.shadow.camera.top = 4;
    sun.shadow.camera.bottom = -4;
    sun.shadow.bias = -0.0008;
    sun.shadow.radius = 4;
    scene.add(sun, sun.target);
    const ceilingLight = new PointLight('#ffd9a8', 0, 7, 1.4);
    ceilingLight.position.set(-0.2, H - 0.25, 0);
    room.add(ceilingLight);

    // gold hotspots, one per feature
    const SPOTS: Record<Feature, [number, number, number]> = {
      windows: [0, 2.25, F + 0.12],
      bed: [L + 1.5, 0.8, bz],
      phone: [L + 0.38, 0.75, sideZ[0] - 0.05],
      ac: [L + 0.3, 2.3, bz],
      sofa: [L + 0.45, 0.85, F + 1.05],
      desk: [R - 0.3, 0.95, dz + 0.25],
      tv: [R - 0.12, 1.95, tz],
      wardrobe: [wx, 1.5, B - 0.7],
      bathroom: [1.6, 1.3, 2.05],
    };
    const spotGeo = geo(new SphereGeometry(0.055, 20, 12));
    const haloGeo = geo(new SphereGeometry(0.11, 20, 12));
    const spotMat = new MeshBasicMaterial({ color: '#e1ba3b', toneMapped: false, depthTest: false });
    const haloMat = new MeshBasicMaterial({ color: '#e1ba3b', transparent: true, opacity: 0.25, toneMapped: false, depthTest: false });
    disposables.push(spotMat, haloMat);
    const spots = (Object.keys(SPOTS) as Feature[]).map((f) => {
      const g = new Group();
      g.position.set(...SPOTS[f]);
      const dot = new Mesh(spotGeo, spotMat);
      const halo = new Mesh(haloGeo, haloMat);
      dot.renderOrder = halo.renderOrder = 10;
      dot.userData.feature = halo.userData.feature = f;
      g.add(halo, dot);
      hits.push(halo);
      scene.add(g);
      return { f, g, halo };
    });

    // camera moves
    const CAMS: Record<Feature, Cam> = {
      windows: { pos: [0.5, 1.55, -0.6], target: [0, 1.45, F] },
      bed: { pos: [1.4, 2.2, 2.2], target: [L + 1, 0.5, bz] },
      phone: { pos: [L + 1.5, 1.4, sideZ[0] - 1.2], target: [L + 0.35, 0.6, sideZ[0]] },
      ac: { pos: [1.2, 1.7, bz + 0.9], target: [L, 2.2, bz] },
      sofa: { pos: [0.9, 1.6, F + 2.4], target: [L + 0.5, 0.5, F + 1.05] },
      desk: { pos: [-0.4, 1.7, dz + 1.4], target: [R - 0.3, 0.8, dz] },
      tv: { pos: [L + 1.4, 1.4, bz + 0.2], target: [R, 1.1, tz] },
      wardrobe: { pos: [wx + 0.6, 1.6, B - 2.6], target: [wx, 1.2, B - 0.4] },
      bathroom: { pos: [-0.6, 5.2, 5.4], target: [1.5, 0.4, 2.1] },
    };
    let tween: { from: Vector3; to: Vector3; tFrom: Vector3; tTo: Vector3; t0: number } | null = null;
    const fit = () => (camera.aspect < 0.9 ? 1.35 : camera.aspect < 1.3 ? 1.12 : 1);
    const fly = (c: Cam, instant = false) => {
      const target = new Vector3(...c.target);
      const pos = new Vector3(...c.pos);
      // pull back on narrow screens, but never through a wall when inside the room
      const inside = Math.abs(pos.x) < R && Math.abs(pos.z) < B && pos.y < H;
      if (!inside) pos.sub(target).multiplyScalar(fit()).add(target);
      if (instant) {
        camera.position.copy(pos);
        controls.target.copy(target);
        controls.update();
        return;
      }
      tween = { from: camera.position.clone(), to: pos, tFrom: controls.target.clone(), tTo: target, t0: performance.now() };
    };
    let selected: Feature | null = null;
    let eveningTarget = 0;
    api.current = {
      view: (v) => fly(VIEWS[v]),
      select: (f) => {
        selected = f;
        if (f) fly(CAMS[f]);
      },
      light: (e) => (eveningTarget = e ? 1 : 0),
    };

    // picking (ignore drags)
    const ray = new Raycaster();
    const ptr = new Vector2();
    const pick = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      const visibleHits = hits.filter((o) => {
        let p: Object3D | null = o;
        while (p) {
          if (!p.visible) return false;
          p = p.parent;
        }
        return true;
      });
      // hotspots win over furniture, since they draw on top
      const all = ray.intersectObjects(visibleHits, false);
      const spot = all.find((h) => (h.object as Mesh).geometry === haloGeo);
      return ((spot ?? all[0])?.object.userData.feature as Feature | undefined) ?? null;
    };
    let down: [number, number] | null = null;
    const onDown = (e: PointerEvent) => (down = [e.clientX, e.clientY]);
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
      const f = pick(e);
      if (!f) return;
      setFeature(f);
      api.current?.select(f);
    };
    const onMove = (e: PointerEvent) => {
      if (e.buttons) return;
      canvas.style.cursor = pick(e) ? 'pointer' : 'grab';
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointermove', onMove);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    fly(initial ? CAMS[initial] : VIEWS.overview, true);
    selected = initial;
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const day = { hemi: 0.7, sun: 2.4, env: 0.55, view: new Color('#ffffff'), bg: new Color('#1d1b19') };
    const night = { hemi: 0.08, sun: 0, env: 0.12, view: new Color('#3d4560'), bg: new Color('#0e0d0c') };
    const tmp = new Color();
    let ev = 0;
    let raf = 0;
    let visible = true;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (tween) {
        const t = Math.min(1, (now - tween.t0) / 1100);
        const k = ease(t);
        camera.position.lerpVectors(tween.from, tween.to, k);
        controls.target.lerpVectors(tween.tFrom, tween.tTo, k);
        if (t === 1) tween = null;
      }
      controls.update();

      // cut away whatever stands between the camera and the room
      const c = camera.position;
      walls.left.visible = c.x > L;
      walls.right.visible = c.x < R;
      walls.back.visible = c.z < B;
      walls.front.visible = c.z > F;
      ceiling.visible = c.y < H;
      const inside = c.x > L && c.x < R && c.z > F && c.z < B && c.y < H;
      viewPlane.visible = inside;
      sky.visible = !inside;
      // the bathroom's own walls step aside while it is selected, so you can see in
      bath.children.forEach((m) => {
        if (m instanceof Mesh && m.material === M.plaster) m.visible = selected !== 'bathroom';
      });

      ev += (eveningTarget - ev) * 0.06;
      hemi.intensity = day.hemi + (night.hemi - day.hemi) * ev;
      sun.intensity = day.sun * (1 - ev);
      scene.environmentIntensity = day.env + (night.env - day.env) * ev;
      viewMat.color.copy(tmp.copy(day.view).lerp(night.view, ev));
      skyMat.color.copy(tmp.set('#d7e2e6').lerp(night.view, ev));
      (scene.background as Color).copy(tmp.copy(day.bg).lerp(night.bg, ev));
      lamps.forEach((l) => (l.intensity = 0.6 + 3.4 * ev));
      ceilingLight.intensity = 0.4 + 2.2 * ev;
      M.shade.emissiveIntensity = 0.15 + 1.6 * ev;

      const pulse = 1 + Math.sin(now / 380) * 0.18;
      spots.forEach(({ f, g, halo }) => {
        const on = f === selected;
        halo.scale.setScalar(on ? pulse * 1.5 : pulse);
        g.scale.setScalar(on ? 1.25 : 1);
      });
      renderer.render(scene, camera);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointermove', onMove);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      canvas.remove();
      api.current = null;
    };
  }, [beds, initial]);

  const choose = (f: Feature) => {
    const next = feature === f ? null : f;
    setFeature(next);
    api.current?.select(next);
    if (!next) api.current?.view(view);
  };

  return (
    <div className="stage night stage--room">
      <div className="stage__canvas" ref={wrap}>
        <div className="stage__toolbar">
          <div className="seg" role="group" aria-label="Camera view">
            {(Object.keys(VIEWS) as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v && !feature}
                onClick={() => {
                  setView(v);
                  setFeature(null);
                  api.current?.select(null);
                  api.current?.view(v);
                }}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
          <div className="seg" role="group" aria-label="Time of day">
            <button type="button" aria-pressed={!evening} onClick={() => { setEvening(false); api.current?.light(false); }}>
              Day
            </button>
            <button type="button" aria-pressed={evening} onClick={() => { setEvening(true); api.current?.light(true); }}>
              Evening
            </button>
          </div>
        </div>
        <p className="stage__hint" aria-hidden="true">Drag to look around · tap a gold dot</p>
      </div>
      <aside className="stage__panel" aria-label="In the room">
        <p className="label">In the room</p>
        <ul className="stage__parts">
          {(Object.keys(features) as Feature[]).map((f) => (
            <li key={f}>
              <button type="button" aria-pressed={feature === f} onClick={() => choose(f)}>
                {features[f].title}
              </button>
            </li>
          ))}
        </ul>
        <div className="stage__detail" aria-live="polite">
          {feature ? (
            <>
              <h3>{features[feature].title}</h3>
              <p className="muted small">{features[feature].text}</p>
            </>
          ) : (
            <p className="muted small">Choose a feature, or tap a gold dot in the room.</p>
          )}
          <p className="stage__note">Illustrative interior built from the hotel’s room features. Layout, finishes and colours vary by room.</p>
        </div>
      </aside>
    </div>
  );
}
