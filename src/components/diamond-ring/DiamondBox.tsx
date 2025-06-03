import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const DIAMOND_RING_URL = '/models/diamond_ring.glb'
useGLTF.preload(DIAMOND_RING_URL)

const BoxModel = () => {
  const { scene } = useGLTF(DIAMOND_RING_URL)
  const lidRef = useRef<THREE.Object3D>(null!)

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'Object_12' && child instanceof THREE.Object3D) {
        child.parent?.remove(child)
      }
    })


    scene.traverse((child) => {
      if (child.name === 'top_EX_2' && child instanceof THREE.Object3D) {
        child.rotation.set(0, 0, 0)
        child.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))

        lidRef.current = child

        gsap.set(child.rotation, {
          x: 0,
        })
      }
    })
  }, [scene])

  const handleClick = () => {
    if (lidRef.current) {
      gsap.to(lidRef.current.rotation, {
        x: -Math.PI / 2,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      })
    }
  }

  return (
    <primitive
      object={scene}
      onClick={handleClick}
    />
  )
}

export default BoxModel