'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import {
  convertColorSpace,
  cos,
  mix,
  modelViewMatrix,
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

import { types } from '@theatre/core'
import { FlyPlaneSheet } from './FlyPlaneSheet'
import { useTexture, useVideoTexture } from '@react-three/drei'

export function Flying() {
  //
  useFrame((st) => {
    st.gl.render(st.scene, st.camera)
  }, 1)

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
    const phyMat = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
    })

    const xBand = sin(positionLocal.x.mul(Unis.frequencyX).sub(time)).mul(0.1)
    const yBand = sin(positionLocal.y.mul(Unis.frequencyY).sub(time)).mul(0.1)
    const elevation = xBand.add(yBand).mul(Unis.size)

    phyMat.positionNode = positionLocal.add(vec3(0, 0, elevation))
    phyMat.normalNode = vec3(vec4(positionLocal.add(vec3(0, 0, elevation)), 1.0).mul(modelViewMatrix)).normalize()

    phyMat.colorNode = convertColorSpace(texture(tex), THREE.LinearSRGBColorSpace, THREE.SRGBColorSpace).mul(
      mix(
        Unis.color1,
        Unis.color2,
        //

        sin(elevation).mul(cos(elevation)),
      ),
    )

    return { material: phyMat }
  }, [])

  //
  useEffect(() => {
    let box1 = FlyPlaneSheet.object(
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

    //

    return box1.onValuesChange((values) => {
      //

      Unis.frequencyX.value = values.frequencyX
      Unis.frequencyY.value = values.frequencyY

      Unis.color1.value.setRGB(values.colorA.r, values.colorA.g, values.colorA.b)
      Unis.color2.value.setRGB(values.colorB.r, values.colorB.g, values.colorB.b)

      Unis.size.value = values.size

      material.metalness = values.metalness
      material.roughness = values.roughness

      //
    })
  }, [Unis])

  return (
    <>
      <mesh material={material} scale={[aspect, 1, 1]} rotation={[-0.5 * Math.PI, 0, 0]}>
        <planeGeometry args={[2, 2, 256, 256]} />
      </mesh>
    </>
  )
}

// FlyPlaneSheet
