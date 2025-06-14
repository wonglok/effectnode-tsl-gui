'use client'

import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { WebGPURenderer } from 'three/webgpu'
import { mix, modelWorldMatrix, positionLocal, sin, time, uniform, uv, vec3, vec4 } from 'three/tsl'
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import * as THREE from 'three/webgpu'

import studio from '@theatre/studio'
import { FlyPlaneSheet } from './_ui/Theatre/FlyPlaneSheet'
import { types } from '@theatre/core'
import '@theatre/core'

if (process.env.NODE_ENV === 'development') {
  studio.initialize()
}

extend({ ...(THREE as any) })

function Scene() {
  useFrame((st) => {
    st.gl.render(st.scene, st.camera)
  }, 1)

  const uni = useMemo(() => {
    return {
      //
      frequencyX: uniform(10),
      frequencyY: uniform(10),
    }
  }, [])

  const customMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
    })

    const modelPosition = modelWorldMatrix.mul(vec4(positionLocal, 1))
    const elevation = sin(modelPosition.x.mul(uni.frequencyX).sub(time))
      .mul(0.1)
      .add(sin(modelPosition.z.mul(uni.frequencyY).sub(time)).mul(0.1))

    material.positionNode = positionLocal.add(vec3(0, 0, elevation))
    material.normalNode = positionLocal.add(vec3(0, elevation, 0)).normalize()

    const color1 = vec3(uv(), 1.0)

    const color2 = vec3(1.0, uv())

    material.colorNode = mix(
      color1,
      color2,
      sin(time.add(elevation.mul(25)))
        .mul(0.5)
        .add(0.5),
    )

    return material
  }, [uni])

  //
  useEffect(() => {
    let box1 = FlyPlaneSheet.object(
      'flying1',
      {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        colorA: types.rgba({ ...new THREE.Color('#ff0000'), a: 1 }, {}),
        colorB: types.rgba({ ...new THREE.Color('#0000ff'), a: 1 }, {}),
        frequencyX: 10,
        frequencyY: 10,
        metalness: types.number(0, {
          range: [0, 2],
        }),
      },
      {
        reconfigure: true,
      },
    )

    return box1.onValuesChange((values) => {
      //

      uni.frequencyX.value = values.frequencyX
      uni.frequencyY.value = values.frequencyY

      customMaterial.metalness = values.metalness
      //
    })
  }, [uni])

  // useControls({
  //   frequency: {
  //     value: [20, 20],
  //     onChange: (value: [number, number]) => {
  //       uni.frequencyX.value = value[0]
  //       uni.frequencyY.value = value[1]
  //     },
  //   },
  // })

  //

  return (
    <>
      <mesh material={customMaterial} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[1, 1, 128, 128]} />
      </mesh>
    </>
  )
}

// FlyPlaneSheet

export default function Page() {
  //

  //
  return (
    <div className='w-full h-full'>
      <Canvas
        gl={async (st: any) => {
          const renderer = new WebGPURenderer({
            canvas: st.canvas as HTMLCanvasElement,
          })
          if (!renderer._initialized) {
            await renderer.init()
          }

          return renderer
        }}
      >
        {/*  */}
        <Suspense fallback={null}>
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>
          <Scene />
          <OrbitControls object-position={[0, 2.5, 5]}></OrbitControls>
          <Stats></Stats>
        </Suspense>
        {/*  */}
      </Canvas>
    </div>
  )
}
