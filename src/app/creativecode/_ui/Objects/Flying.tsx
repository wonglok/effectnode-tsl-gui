'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import {
  convertColorSpace,
  cos,
  mix,
  modelViewMatrix,
  normalLocal,
  positionLocal,
  roughness,
  sin,
  texture,
  time,
  uniform,
  uv,
  vec3,
  vec4,
} from 'three/tsl'
import * as THREE from 'three/webgpu'

import { ISheet, types } from '@theatre/core'
// import { FlyPlaneSheet } from './FlyPlaneSheet'
import { useVideoTexture } from '@react-three/drei'
import { FlyPlaneSheetName, useSheetHome } from './FlyPlaneSheet'

export function Flying() {
  let beach = `${location.origin}/video/sand.mp4`

  let tex = useVideoTexture(beach)
  let aspect = tex.image.videoWidth / tex.image.videoHeight
  //

  const Unis = useMemo(() => {
    return {
      //
      size: uniform(1.0),
      color1: uniform(new THREE.Color('#ff0000')),
      color2: uniform(new THREE.Color('#0000ff')),

      frequencyX: uniform(10),
      frequencyY: uniform(10),
    }
  }, [])

  const { material } = useMemo(() => {
    //
    const phyMat = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
    })

    const xBand = sin(uv().x.mul(Unis.frequencyX).sub(time)).mul(0.1)
    const yBand = sin(uv().y.mul(Unis.frequencyY).sub(time)).mul(0.1)

    const elevation = xBand.add(yBand).mul(Unis.size)

    phyMat.positionNode = positionLocal.add(vec3(0, 0, elevation))

    tex.mapping = THREE.EquirectangularReflectionMapping

    const col = convertColorSpace(texture(tex), THREE.LinearSRGBColorSpace, THREE.SRGBColorSpace)

    phyMat.colorNode = mix(Unis.color1, Unis.color2, elevation.mul(2))

    return { material: phyMat }
  }, [])

  let sheet = useSheetHome(FlyPlaneSheetName)
  useEffect(() => {
    if (!sheet) {
      return
    }

    let cleans: any[] = []

    let box1 = sheet.object(
      'flying1',
      {
        // position: { x: 0, y: 0, z: 0 },
        // rotation: { x: 0, y: 0, z: 0 },
        // scale: { x: 1, y: 1, z: 1 },
        //
        colorA: types.rgba({ ...new THREE.Color('#ff0000'), a: 1 }, {}),
        colorB: types.rgba({ ...new THREE.Color('#0000ff'), a: 1 }, {}),
        frequencyX: 10,
        frequencyY: 10,
        //
        //
        metalness: types.number(0, {
          range: [0, 1],
        }),
        roughness: types.number(0, {
          range: [0, 1],
        }),
        size: types.number(1, {
          range: [0, 5],
        }),
      },
      {
        reconfigure: true,
      },
    )

    cleans.push(
      box1.onValuesChange((values) => {
        //

        Unis.frequencyX.value = values.frequencyX
        Unis.frequencyY.value = values.frequencyY

        Unis.color1.value.setRGB(values.colorA.r, values.colorA.g, values.colorA.b)
        Unis.color2.value.setRGB(values.colorB.r, values.colorB.g, values.colorB.b)

        Unis.size.value = values.size

        material.metalness = values.metalness
        material.roughness = values.roughness

        //
      }),
    )

    //

    return () => {
      cleans.forEach((t) => {
        t()
      })
    }
  }, [Unis, sheet])

  let t3 = useMemo(() => {
    return new THREE.Object3D()
  }, [])

  useFrame(() => {
    t3.position.set(0, 0, 0)
  })
  return (
    <>
      {/* <directionalLight target={t3} castShadow position={[5, 5, 5]}></directionalLight> */}

      {sheet && (
        <>
          <spotLight
            //
            target={t3}
            castShadow
            position={[0, 5, 0]}
            map={tex}
            penumbra={1}
            intensity={50}
          />

          <mesh castShadow receiveShadow material={material} scale={[aspect, 1, 1]} rotation={[-0.5 * Math.PI, 0, 0]}>
            <planeGeometry args={[2, 2, Math.floor(256 * aspect), 256]} />
          </mesh>
        </>
      )}
    </>
  )
}

// FlyPlaneSheet
