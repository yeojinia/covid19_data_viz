import React, { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useLoader, useFrame, useUpdate} from 'react-three-fiber'
import { useMemo } from 'react'
import bold from './bold.blob'

function Text({ children, vAlign = 'center', hAlign = 'center', size = 1, color = '#000000', ...props }) {

    const font = useLoader(THREE.FontLoader, bold);

    const config = useMemo(
        () => ({font, size: 1, height: 0.5, curveSegments: 10, bevelEnabled: false, bevelThickness: 0, bevelSize: 0, bevelOffset: 0, bevelSegments: 0 }),
        // () => ({ font, size: 40, height: 30, curveSegments: 32, bevelEnabled: true, bevelThickness: 6, bevelSize: 2.5, bevelOffset: 0, bevelSegments: 8 }),
        [font]
    )

    return (
        <group {...props} scale={[0.5, 0.5, 0.5]}>
            {/*<mesh ref={mesh}>*/}
            <mesh>
                <textBufferGeometry args={[children, config]} />
                <meshNormalMaterial />
            </mesh>
        </group>
    )
}
function Jumbo() {

    return (
            <Text hAlign="left" position={[0, 0.2, 0]} children="YAHO" />
    )

}

function TestText() {

    return (
        <Canvas camera={{ position: [0, 0, 4] }}>
            {/*<ambientLight intensity={2} />*/}
            {/*<pointLight position={[40, 40, 40]} />*/}
            <Suspense fallback={null}>
                <Jumbo/>
                {/*<Text hAlign="left" position={[0, 0.2, 0]} children="YAHO" />*/}
            </Suspense>
        </Canvas>
    )
}

export default TestText;