import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { FLOOR_Y, spawnPosition, spawnVelocity, TEXT_COUNT } from "./constants";

interface FallingTextFieldProps {
  count?: number;
  messages: string[];
  follow?: boolean;
  syncColors?: boolean;
}

export default function FallingTextField({
  count = TEXT_COUNT,
  messages,
  follow = false,
  syncColors = true,
}: FallingTextFieldProps) {
  /* khởi tạo items … */
  const items = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: spawnPosition(),
        velocity: spawnVelocity(),
        message: messages[Math.floor(Math.random() * messages.length)],
        fontSize: THREE.MathUtils.randFloat(0.7, 1.2),
      })),
    [count, messages]
  );

  const billRefs = useRef<THREE.Object3D[]>([]);
  const textRefs = useRef<THREE.Mesh[]>([]);

  const white = new THREE.Color("#ffffff");
  const blue  = new THREE.Color("#3b82f6");
  const pink  = new THREE.Color("#ff4d6d");
  const period = 10; // giây

  const gradient = (t: number) =>
    t < 1 / 3
      ? white.clone().lerp(blue, t * 3)
      : t < 2 / 3
      ? blue.clone().lerp(pink, (t - 1 / 3) * 3)
      : pink.clone().lerp(white, (t - 2 / 3) * 3);

  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const baseT = (timeRef.current % period) / period; // 0 → 1

    for (let i = 0; i < items.length; i++) {
      const it   = items[i];
      const bill = billRefs.current[i];
      const txt  = textRefs.current[i];
      if (!bill || !txt) continue;

      /* --- vị trí rơi --- */
      it.position.addScaledVector(it.velocity, delta);
      if (it.position.y < FLOOR_Y) {
        it.position.copy(spawnPosition());
        it.velocity.copy(spawnVelocity());
        it.message = messages[Math.floor(Math.random() * messages.length)];
      }
      bill.position.copy(it.position);

      /* --- màu --- */
      const t = syncColors
        ? baseT
        : (baseT + i / items.length) % 1;
      const c = gradient(t);

      const mats = Array.isArray(txt.material)
        ? txt.material
        : txt.material
        ? [txt.material]
        : [];

      for (const m of mats) {
        const basic = m as THREE.MeshBasicMaterial;
        if (basic.color) basic.color.copy(c);
      }
      (txt as THREE.Mesh & { outlineColor: THREE.Color }).outlineColor = c;
    }
  });

  /* JSX */
  return (
    <>
      {items.map((it, idx) => (
        <Billboard
          key={idx}
          ref={(el) => {
            if (el) billRefs.current[idx] = el;
          }}
          position={it.position.toArray()}
          follow={follow}
        >
          <Text
            ref={(el) => el && (textRefs.current[idx] = el)}
            fontSize={it.fontSize}
            outlineWidth={0.05}
            depthOffset={1}
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.9}
          >
            {it.message}
          </Text>
        </Billboard>
      ))}
    </>
  );
}
