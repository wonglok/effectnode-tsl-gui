'use client'

import { Canvas, useFrame, extend } from '@react-three/fiber'
import { useControls } from 'leva'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three/webgpu'
import { MeshStandardNodeMaterial, WebGPURenderer } from 'three/webgpu'
import { mix, modelWorldMatrix, positionLocal, sin, texture, time, uniform, uv, vec3, vec4 } from 'three/tsl'
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { ReactThreeFiber } from '@react-three/fiber'
import { VideoTex } from './_ui/VideoTex'

extend({ ...(THREE as {}) })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      MeshStandardNodeMaterial: ReactThreeFiber.ThreeToJSXElements<MeshStandardNodeMaterial>
    }
  }
}

function Scene() {
  let [tex, setTex] = useState<THREE.Texture | undefined>(undefined)
  useFrame((st) => {
    st.gl.render(st.scene, st.camera)
  }, 1)

  const uniformGroup = useMemo(() => {
    return {
      frequencyX: uniform(10),
      frequencyY: uniform(5),
    }
  }, [])

  const customMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
    })

    // vertex
    const modelPosition = modelWorldMatrix.mul(vec4(positionLocal, 1))
    const elevation = sin(modelPosition.x.mul(uniformGroup.frequencyX).sub(time))
      .mul(0.1)
      .add(sin(modelPosition.z.mul(uniformGroup.frequencyY).sub(time)).mul(0.1))

    material.positionNode = positionLocal.add(vec3(0, 0, elevation))

    // fragment
    const color1 = vec3(uv(), 1.0)
    const color2 = vec3(1.0, uv())
    material.colorNode = mix(
      color1,
      color2,
      sin(time.add(elevation.mul(25)))
        .mul(0.5)
        .add(0.5),
    ).add(texture(tex))

    return material
  }, [uniformGroup])

  useControls({
    frequency: {
      value: [10, 5],
      onChange: (value: [number, number]) => {
        uniformGroup.frequencyX.value = value[0]
        uniformGroup.frequencyY.value = value[1]
      },
    },
  })

  //

  return (
    <>
      <VideoTex src={`/video/1321208-uhd_3840_2160_30fps.mp4`} onReady={setTex}></VideoTex>
      <mesh material={customMaterial} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[1, 1, 128, 128]} />
      </mesh>
    </>
  )
}

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

          let body = document.querySelector('body')
          renderer.setSize(body?.clientWidth || 1, body?.clientHeight || 1)
          renderer.setPixelRatio(window.devicePixelRatio || 1)

          await renderer.init()
          return renderer
        }}
      >
        <Suspense fallback={null}>
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>
          <Scene />
        </Suspense>
        <OrbitControls></OrbitControls>
        <Stats></Stats>
      </Canvas>
    </div>
  )
}
