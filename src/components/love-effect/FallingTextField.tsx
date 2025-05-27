// src/components/love-effect/FallingTextField.tsx
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { FLOOR_Y, spawnPosition, spawnVelocity } from "./constants";

export default function FallingTextField({
  count = 30,
  messages,
}: {
  count?: number;
  messages: string[];
}) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: spawnPosition(),
        velocity: spawnVelocity(),
        message: messages[Math.floor(Math.random() * messages.length)],
      })),
    [count, messages]
  );

  // Ref tới mesh thật trong scene
  const refs = useRef<THREE.Object3D[]>([]);

  useFrame((_, delta) => {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const mesh = refs.current[i];
      if (!mesh) continue;

      // Tính vị trí mới
      it.position.addScaledVector(it.velocity, delta);

      // Reset nếu chạm “sàn”
      if (it.position.y < FLOOR_Y) {
        it.position.copy(spawnPosition());
        it.velocity.copy(spawnVelocity());
        it.message = messages[Math.floor(Math.random() * messages.length)];

        // Cập nhật text khi đổi thông điệp
        // Vì nội dung <Text> là children của Billboard, cập nhật
        // vị trí xong rồi gọi mesh.children[0].setText? → đơn giản nhất là
        // đưa message thành key như dưới (khi đổi sẽ re-mount Text)
      }

      // Đẩy tọa độ mới vào object3D
      mesh.position.copy(it.position);
    }
  });

  return (
    <>
      {items.map((it, idx) => (
        <Billboard
          key={idx}
          ref={(el) => {
            if (el) refs.current[idx] = el;
          }}
          position={it.position.toArray()}
          follow
        >
          <Text
            fontSize={1.2}
            anchorX="center"
            anchorY="middle"
            outlineColor="#ffffff"
            outlineWidth={0.004}
            key={it.message}
          >
            {it.message}
          </Text>
        </Billboard>
      ))}
    </>
  );
}
