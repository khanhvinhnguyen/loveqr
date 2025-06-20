import * as THREE from "three";

/*****************************
 * Configurable constants
 *****************************/
export const FALL_RANGE = { x: 40, y: 20, z: 40 };
export const FLOOR_Y = -15;

export const TEXT_COUNT = 50;
export const HEART_COUNT = 20;

export const MESSAGES_DEFAULT = [
  "Always by my side ❤️",
  "Happy 1-Year!",
  "Love you 3000",
  "Cảm ơn vì đã ở đây",
  "Anh yêu bé",
];

/*****************************
 * Helpers
 *****************************/
export function spawnPosition() {
  return new THREE.Vector3(
    (Math.random() - 0.5) * FALL_RANGE.x,
    Math.random() * FALL_RANGE.y - 2,
    -Math.random() * FALL_RANGE.z + 10
  );
}

export function spawnVelocity() {
  // downward + towards camera
  return new THREE.Vector3(
    0,
    -3 - Math.random() * 3, // Y fall speed
    0
  );
}