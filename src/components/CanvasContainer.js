import React, { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Stats, AdaptiveDpr, AdaptiveEvents} from '@react-three/drei'

import Scene from './Scene.js';

function CanvasContainer({ ...props }) {
	
	// setTimeout(() => {
	// 	props.isReadyHandler()
	// }, 3000);

	// useEffect(() => {
	// 	console.log('context', props.isReady)
	// }, [props.isReady])

	// useEffect(() => {
	// 	console.log('context', props.context)
	// })

	return (
		<div
			className='canvas-container'
		>	
			<Canvas
				className="webgl"
				camera={{ fov: 45, position: [0.3877541317884009, -0.7852562001645822, -0.4929700126621239] }}
				linear={true}
				flat={true}
				// onCreated={() => props.isReadyHandler()}
			>
				{/* <mesh
					position={[0, 0, 1]}
				>
					<sphereGeometry args={[.3, 32, 32]} />
					<meshBasicMaterial map={new THREE.TextureLoader().load('images/lake.jpg')}/>
				</mesh> */}
				{/* <AdaptiveDpr pixelated />
				<AdaptiveEvents /> */}
				<Scene
					// isReady={props.isReady}
					// isReadyHandler={props.isReadyHandler}
					// context={props.context} 
				/>
			</Canvas>
			<Stats className="stats" />

			<div className="demo-container">
				<button className="demo-btn demo-1">Lake Demo</button>
				<button className="demo-btn demo-2">Space Demo</button>
			</div>
		</div>
	)
}

export default CanvasContainer
