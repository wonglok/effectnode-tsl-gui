'use client'

import { Box, OrbitControls } from '@react-three/drei'
import { O3D } from '@/_threejs/Layer'
import { useRouter } from 'next/navigation'

export default function Page() {
  let router = useRouter()
  return (
    <>
      <O3D>
        <group>
          <Box
            onClick={() => {
              //
              router.push('/blue')
            }}
          >
            <meshBasicMaterial color={'red'}></meshBasicMaterial>
          </Box>
          <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>
        </group>
      </O3D>

      <div className='absolute top-0 left-0'>Creative Code</div>
    </>
  )
}
