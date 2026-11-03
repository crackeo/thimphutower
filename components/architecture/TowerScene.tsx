'use client';
// Interactive 3D model of Thimphu Tower, built procedurally from the same measurements as
// Elevation.tsx (1 unit = 100 SVG px). Illustrative, not a survey of the building.
import { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  PCFSoftShadowMap,
  PMREMGenerator,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { nu, rooms } from '@/content/site';
import { TLink } from '../Motion';

const S = 0.01;
const X = (x: number) => (x - 300) * S;
const Y = (y: number) => (680 - y) * S;
const W = 4.2;
const D = 0.55 * W; // depth is an assumption: no side drawings exist
const FZ = D / 2;
const BAYS = [145, 248, 352, 455];
const FLOORS = [
  { band: [400, 486], top: 408, h: 50 },
  { band: [320, 400], top: 334, h: 50 },
  { band: [228, 320], top: 242, h: 66 },
  { band: [112, 228], top: 150, h: 66 },
];

type Role = 'wall' | 'trim' | 'glass' | 'paint' | 'ground' | 'water' | 'roof' | 'gold';
const SOLID: Record<Role, string> = {
  wall: '#cfab73',
  trim: '#5a3424',
  glass: '#26313a',
  paint: '#9c3a2a',
  ground: '#2a2724',
  water: '#3b525c',
  roof: '#4a3326',
  gold: '#e1ba3b',
};
const LINES: Record<Role, string> = {
  wall: '#1f1d1b',
  trim: '#1f1d1b',
  glass: '#191817',
  paint: '#1f1d1b',
  ground: '#181716',
  water: '#1b2226',
  roof: '#1f1d1b',
  gold: '#1f1d1b',
};

export type Part = 'floor-1' | 'floor-2' | 'floor-3' | 'floor-4' | 'arcade' | 'tower';
const PARTS: { id: Part; label: string }[] = [
  { id: 'floor-4', label: 'Guest floor 4' },
  { id: 'floor-3', label: 'Guest floor 3' },
  { id: 'floor-2', label: 'Guest floor 2' },
  { id: 'floor-1', label: 'Guest floor 1' },
  { id: 'arcade', label: 'Street arcade' },
  { id: 'tower', label: 'The Clock Tower' },
];
const DETAIL: Record<Part, string> = {
  'floor-4': 'The top guest floor. Tall arched triple windows under painted timber lintels look straight onto the square.',
  'floor-3': 'Tall arched triple windows, the largest on the facade, with views across to the Clock Tower.',
  'floor-2': 'Triple windows under carved and painted lintels, overlooking the square.',
  'floor-1': 'The first guest floor, just above the painted frieze and the street arcade.',
  arcade: 'Painted columns and a frieze of roundels. Shops open onto the square at street level.',
  tower: 'The landmark at the heart of the square, directly across from the hotel. Our windows look onto it.',
};

type View = 'front' | 'corner' | 'above';
const VIEWS: Record<View, { pos: [number, number, number]; target: [number, number, number] }> = {
  front: { pos: [0.6, 3.2, 15], target: [0.6, 2.8, 0] },
  corner: { pos: [-8.6, 5.8, 11.8], target: [0.8, 2.6, 1.2] },
  above: { pos: [0.8, 15, 5.8], target: [0.8, 0, 1.8] },
};
const VIEW_LABELS: Record<View, string> = { front: 'Front', corner: 'Corner', above: 'Above' };
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type Api = { view: (v: View) => void; mode: (m: 'model' | 'lines') => void; lift: (l: boolean) => void; select: (p: Part | null) => void };

export default function TowerScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const [view, setView] = useState<View>('corner');
  const [mode, setMode] = useState<'model' | 'lines'>('model');
  const [lift, setLift] = useState(false);
  const [part, setPart] = useState<Part | null>(null);

  useEffect(() => {
    const el = wrap.current!;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive 3D model of Thimphu Tower Hotel and the Clock Tower. Drag to turn, pinch or scroll to zoom, click a floor to inspect it.');
    el.prepend(canvas);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.45;
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    scene.add(new HemisphereLight('#fff3e0', '#3a332c', 0.9));
    // late-afternoon sun from the west, casting soft shadows across the square
    const sun = new DirectionalLight('#ffe2b8', 2.6);
    sun.position.set(-7, 9, 7);
    sun.target.position.set(0.6, 1.5, 2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 3;
    scene.add(sun, sun.target);

    const solidMats = {} as Record<Role, MeshStandardMaterial>;
    const lineMats = {} as Record<Role, MeshBasicMaterial>;
    (Object.keys(SOLID) as Role[]).forEach((r) => {
      const po = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
      solidMats[r] = new MeshStandardMaterial({ color: SOLID[r], roughness: 0.8, ...po });
      if (r === 'glass') Object.assign(solidMats[r], { roughness: 0.12, metalness: 0.7, emissive: new Color('#4a3218'), emissiveIntensity: 0.35 });
      if (r === 'water') Object.assign(solidMats[r], { roughness: 0.08, metalness: 0.5 });
      if (r === 'gold') Object.assign(solidMats[r], { roughness: 0.35, metalness: 0.85 });
      lineMats[r] = new MeshBasicMaterial({ color: LINES[r], ...po });
    });
    const line = new LineBasicMaterial({ color: '#e9e3d9', transparent: true, opacity: 0.12 });
    const meshes: { mesh: Mesh; role: Role }[] = [];
    const geoms: BufferGeometry[] = [];
    let currentPart: Part | 'site' = 'site';

    const add = (parent: Group, geom: BufferGeometry, role: Role, x: number, y: number, z: number, edges = true) => {
      const m = new Mesh(geom, solidMats[role]);
      m.position.set(x, y, z);
      m.castShadow = role !== 'ground' && role !== 'water';
      m.receiveShadow = true;
      m.userData.part = currentPart;
      if (edges) {
        const e = new EdgesGeometry(geom, 25);
        geoms.push(e);
        m.add(new LineSegments(e, line));
      }
      geoms.push(geom);
      meshes.push({ mesh: m, role });
      parent.add(m);
      return m;
    };
    const box = (w: number, h: number, d: number) => new BoxGeometry(w, h, d);
    const windowAt = (parent: Group, cx: number, cy: number, h: number, face: 'front' | 'left' | 'right') => {
      const g = new Group();
      add(g, box(0.84, h, 0.04), 'glass', 0, 0, 0);
      add(g, box(0.96, 0.07, 0.14), 'trim', 0, h / 2 + 0.1, 0);
      add(g, box(0.92, 0.05, 0.1), 'trim', 0, h / 2 + 0.035, 0);
      add(g, box(0.94, 0.05, 0.12), 'trim', 0, -h / 2 - 0.025, 0);
      add(g, box(0.84, 0.02, 0.05), 'trim', 0, -h * 0.12, 0, false);
      [-0.14, 0.14].forEach((mx) => add(g, box(0.03, h, 0.06), 'trim', mx, 0, 0, false));
      if (face === 'front') g.position.set(cx, cy, FZ);
      else {
        g.position.set(face === 'right' ? W / 2 : -W / 2, cy, cx);
        g.rotation.y = face === 'right' ? Math.PI / 2 : -Math.PI / 2;
      }
      parent.add(g);
    };

    const model = new Group();
    scene.add(model);
    const site = new Group();
    model.add(site);
    add(site, box(15, 0.06, 12), 'ground', 0.6, -0.03, 2.6, false);
    add(site, box(2.2, 0.04, 1.2), 'water', 0.3, 0.02, FZ + 2.7);

    currentPart = 'arcade';
    const arcade = new Group();
    model.add(arcade);
    const arcH = Y(512);
    add(arcade, box(W - 0.3, arcH, D - 0.4), 'wall', 0, arcH / 2, -0.15);
    [150, 250, 350, 452].forEach((x) => add(arcade, box(0.8, Y(556) - Y(654), 0.03), 'glass', X(x), (Y(556) + Y(654)) / 2, FZ - 0.35));
    [96, 200, 300, 400, 504].forEach((x) => {
      add(arcade, box(0.12, Y(524), 0.12), 'paint', X(x), Y(524) / 2, FZ - 0.08);
      add(arcade, box(0.28, 0.12, 0.2), 'trim', X(x), Y(518), FZ - 0.08);
    });
    add(arcade, box(W, Y(486) - Y(512), D), 'paint', 0, (Y(486) + Y(512)) / 2, 0);
    for (let x = 112; x <= 492; x += 38) {
      const r = add(arcade, new CylinderGeometry(0.075, 0.075, 0.03, 20), 'gold', X(x), Y(499), FZ + 0.015);
      r.rotation.x = Math.PI / 2;
    }

    const floors = FLOORS.map((f, i) => {
      currentPart = `floor-${i + 1}` as Part;
      const g = new Group();
      model.add(g);
      const [t, b] = f.band;
      add(g, box(W, Y(t) - Y(b), D), 'wall', 0, (Y(t) + Y(b)) / 2, 0);
      const cy = Y(f.top + f.h / 2);
      BAYS.forEach((bx) => windowAt(g, X(bx), cy, f.h * S, 'front'));
      [-0.55, 0.55].forEach((sx) => {
        windowAt(g, sx, cy, f.h * S, 'left');
        windowAt(g, -sx, cy, f.h * S, 'right');
      });
      return g;
    });

    currentPart = 'floor-4';
    const roof = new Group();
    model.add(roof);
    add(roof, box(W + 0.6, 0.14, D + 0.6), 'roof', 0, Y(103), 0);
    const cone = add(roof, new ConeGeometry((W + 0.5) / Math.SQRT2, 0.3, 4), 'roof', 0, Y(96) + 0.15, 0);
    cone.rotation.y = Math.PI / 4;
    cone.scale.z = (D + 0.5) / (W + 0.5);

    currentPart = 'tower';
    const tower = new Group();
    tower.position.set(3.4, 0, FZ + 2.8);
    model.add(tower);
    add(tower, box(0.9, 0.2, 0.9), 'trim', 0, 0.1, 0);
    add(tower, box(0.42, 0.5, 0.42), 'wall', 0, 0.45, 0);
    add(tower, box(0.3, 3.3, 0.3), 'paint', 0, 2.35, 0);
    [1.4, 2.6, 3.6].forEach((y) => add(tower, box(0.36, 0.06, 0.36), 'trim', 0, y, 0));
    add(tower, box(0.46, 0.46, 0.46), 'wall', 0, 4.25, 0);
    (
      [
        [0, 0.24, 'x'],
        [0, -0.24, 'x'],
        [0.24, 0, 'z'],
        [-0.24, 0, 'z'],
      ] as const
    ).forEach(([x, z, axis]) => {
      const c = add(tower, new CylinderGeometry(0.14, 0.14, 0.02, 24), 'gold', x, 4.25, z);
      if (axis === 'x') c.rotation.x = Math.PI / 2;
      else c.rotation.z = Math.PI / 2;
    });
    const tr = add(tower, new ConeGeometry(0.42, 0.38, 4), 'roof', 0, 4.67, 0);
    tr.rotation.y = Math.PI / 4;

    const groups: Record<Part, Group> = { 'floor-1': floors[0], 'floor-2': floors[1], 'floor-3': floors[2], 'floor-4': floors[3], arcade, tower };

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 24;
    controls.maxPolarAngle = Math.PI * 0.49;
    let tween: { from: Vector3; to: Vector3; tFrom: Vector3; tTo: Vector3; t0: number } | null = null;
    const k = () => (camera.aspect < 0.9 ? 1.3 : camera.aspect < 1.3 ? 1.12 : 1);
    const fly = (p: Vector3, t: Vector3, instant = false) => {
      if (instant) {
        camera.position.copy(p);
        controls.target.copy(t);
        controls.update();
        return;
      }
      tween = { from: camera.position.clone(), to: p, tFrom: controls.target.clone(), tTo: t, t0: performance.now() };
    };
    const goTo = (v: View, instant = false) => {
      const { pos, target } = VIEWS[v];
      const t = new Vector3(...target);
      fly(new Vector3(...pos).sub(t).multiplyScalar(k()).add(t), t, instant);
    };

    let liftTarget = 0;
    let selected: Part | null = null;
    const slide: Record<string, number> = {};
    const select = (p: Part | null) => {
      selected = p;
      if (!p) return;
      const g = groups[p];
      const y = p === 'tower' ? 2.6 : p === 'arcade' ? 1 : (Y(FLOORS[Number(p.slice(-1)) - 1].band[0]) + Y(FLOORS[Number(p.slice(-1)) - 1].band[1])) / 2;
      const target = p === 'tower' ? new Vector3(tower.position.x, y, tower.position.z) : new Vector3(0, y + g.position.y, FZ);
      const dir = new Vector3(-0.45, 0.28, 1).normalize();
      fly(target.clone().add(dir.multiplyScalar((p === 'tower' ? 8 : 9) * k())), target);
    };
    const applyMode = (m: 'model' | 'lines') => {
      meshes.forEach(({ mesh, role }) => (mesh.material = m === 'model' ? solidMats[role] : lineMats[role]));
      line.opacity = m === 'model' ? 0.12 : 0.85;
    };
    api.current = { view: (v) => goTo(v), mode: applyMode, lift: (l) => (liftTarget = l ? 1 : 0), select };

    // click to pick (ignore drags)
    const ray = new Raycaster();
    const ptr = new Vector2();
    let down: [number, number] | null = null;
    const onDown = (e: PointerEvent) => (down = [e.clientX, e.clientY]);
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
      const r = canvas.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(model.children, true).find((h) => h.object instanceof Mesh && h.object.userData.part !== 'site');
      const p = (hit?.object.userData.part as Part | undefined) ?? null;
      setPart(p);
      select(p);
    };
    const onMove = (e: PointerEvent) => {
      if (e.buttons) return;
      const r = canvas.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(model.children, true).find((h) => h.object instanceof Mesh && h.object.userData.part !== 'site');
      canvas.style.cursor = hit ? 'pointer' : 'grab';
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
    goTo('corner', true);
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let lifted = 0;
    let raf = 0;
    let visible = true;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (tween) {
        const t = Math.min(1, (now - tween.t0) / 1000);
        const e = ease(t);
        camera.position.lerpVectors(tween.from, tween.to, e);
        controls.target.lerpVectors(tween.tFrom, tween.tTo, e);
        if (t === 1) tween = null;
      }
      lifted += (liftTarget - lifted) * 0.12;
      roof.position.y = lifted * 0.35 * 5;
      floors.forEach((f, i) => (f.position.y = lifted * 0.35 * (i + 1)));
      // the selected part slides forward like a drawer
      (Object.keys(groups) as Part[]).forEach((p) => {
        if (p === 'tower') return;
        const goal = selected === p ? 0.35 : 0;
        slide[p] = (slide[p] ?? 0) + (goal - (slide[p] ?? 0)) * 0.14;
        groups[p].position.z = slide[p];
      });
      roof.position.z = slide['floor-4'] ?? 0;
      controls.update();
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
      geoms.forEach((g) => g.dispose());
      [...Object.values(solidMats), ...Object.values(lineMats), line].forEach((m) => m.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
      api.current = null;
    };
  }, []);

  const choose = (p: Part) => {
    const next = part === p ? null : p;
    setPart(next);
    api.current?.select(next);
    if (!next) api.current?.view(view);
  };
  const isFloor = part?.startsWith('floor');

  return (
    <div className="stage night">
      <div className="stage__canvas" ref={wrap}>
        <div className="stage__toolbar">
          <div className="seg" role="group" aria-label="Camera view">
            {(Object.keys(VIEWS) as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v && !part}
                onClick={() => {
                  setView(v);
                  setPart(null);
                  api.current?.select(null);
                  api.current?.view(v);
                }}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
          <div className="seg" role="group" aria-label="Model options">
            <button type="button" aria-pressed={lift} onClick={() => { setLift(!lift); api.current?.lift(!lift); }}>
              Lift floors
            </button>
            <button type="button" aria-pressed={mode === 'lines'} onClick={() => { const m = mode === 'lines' ? 'model' : 'lines'; setMode(m); api.current?.mode(m); }}>
              Lines
            </button>
          </div>
        </div>
        <p className="stage__hint" aria-hidden="true">Drag to turn · click a floor</p>
      </div>
      <aside className="stage__panel" aria-label="Explore the building">
        <p className="label">Explore</p>
        <ul className="stage__parts">
          {PARTS.map((p) => (
            <li key={p.id}>
              <button type="button" aria-pressed={part === p.id} onClick={() => choose(p.id)}>
                {p.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="stage__detail" aria-live="polite">
          {part ? (
            <>
              <h3>{PARTS.find((p) => p.id === part)!.label}</h3>
              <p className="muted small">{DETAIL[part]}</p>
              {isFloor && (
                <>
                  <ul className="stage__rooms">
                    {rooms.map((r) => (
                      <li key={r.slug}>
                        <TLink href={`/rooms/${r.slug}/`}>
                          <span>{r.name}</span>
                          <span className="num">{nu(r.price)}</span>
                        </TLink>
                      </li>
                    ))}
                  </ul>
                  <p className="muted small">Hoping for a particular floor? Mention it when you enquire.</p>
                  <TLink className="link" href="/rooms/#inside">Step inside a room in 3D →</TLink>
                </>
              )}
            </>
          ) : (
            <p className="muted small">Select a floor, the arcade or the Clock Tower, here or on the model.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
