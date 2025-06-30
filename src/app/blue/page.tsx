'use client'

import { Suspense } from 'react'
import { Box, Environment, OrbitControls, Stats } from '@react-three/drei'
import { Flying } from './_ui/Objects/Flying'
import { O3D } from '@/_threejs/Layer'
import { useRouter } from 'next/navigation'

export default function Page() {
  let router = useRouter()
  return (
    <>
      <O3D>
        <Suspense fallback={null}>
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]} background></Environment>

          <Flying />

          <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>

          <group scale={0.25}>
            <Box
              onClick={() => {
                //

                router.push('/creativecode')

                //
              }}
            >
              <meshBasicMaterial color={'blue'}></meshBasicMaterial>
            </Box>
          </group>
        </Suspense>
      </O3D>

      <div className='absolute top-0 left-0'>Happy</div>
    </>
  )
}

//

//

//
