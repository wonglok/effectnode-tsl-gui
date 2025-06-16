'use client'

import '@theatre/core'
import { Canvas, extend } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { WebGPURenderer } from 'three/webgpu'
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import * as THREE from 'three/webgpu'

import { Flying } from './_ui/Objects/Flying'

extend({ ...(THREE as any) })

if (process.env.NODE_ENV === 'development') {
  import('./_ui/Extension/extensionConfig')
}

export default function Page() {
  return (
    <div className='w-full h-full'>
      <Canvas
        gl={async (st: any) => {
          const renderer = new WebGPURenderer({
            canvas: st.canvas as HTMLCanvasElement,
          })
          renderer.shadowMap.enabled = true
          renderer.shadowMap.type = THREE.PCFSoftShadowMap

          if (!renderer._initialized) {
            await renderer.init()
          }

          return renderer
        }}
      >
        {/*  */}
        <Suspense fallback={null}>
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>

          <Flying />

          <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>
        </Suspense>
      </Canvas>
    </div>
  )
}
