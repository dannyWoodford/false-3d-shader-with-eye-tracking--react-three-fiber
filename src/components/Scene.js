import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const twgl = window.twgl

const m3scaling = (sx, sy) => {
	return [sx, 0, 0, 0, sy, 0, 0, 0, 1]
}

export default function Scene({ ...props }) {
	const [canvasExist, setCanvasExist] = useState(false)
	const [context, setContext] = useState({
		x: -1,
		y: -1
	})
	
	/**
	 * Sizes
	 */
	const sizes = {}
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	let canvas;

	if (canvasExist === false) {
		canvas = document.createElement('canvas')
		setCanvasExist(true)
		console.log('create canvas')
	} else { 
		canvas = document.querySelector('.canvas')
	}

	canvas.className = 'canvas'
	const gl = canvas.getContext('webgl')
	document.body.appendChild(canvas)



	let originalImage = { width: 1, height: 1 } // replaced after loading
	let originalTexture = twgl.createTexture(
		gl,
		{
			src: 'images/lake.jpg',
			crossOrigin: '',
		},
		(err, texture, source) => {
			originalImage = source
		}
	)

	let originalTexture1 = twgl.createTexture(
		gl,
		{
			src: 'images/lake.jpg',
			crossOrigin: '',
		},
		(err, texture, source) => {
			originalImage = source
		}
	)

	let originalTexture2 = twgl.createTexture(
		gl,
		{
			src: 'images/space-station.jpg',
			crossOrigin: '',
		},
		(err, texture, source) => {
			originalImage = source
		}
	)

	let mapTexture = twgl.createTexture(gl, {
		src: 'images/lake-map.jpg',
		crossOrigin: '',
	})

	let mapTexture1 = twgl.createTexture(gl, {
		src: 'images/lake-map.jpg',
		crossOrigin: '',
	})

	let mapTexture2 = twgl.createTexture(gl, {
		src: 'images/space-station-map.jpg',
		crossOrigin: '',
	})

	// compile shaders, link program, lookup location
	const programInfo = twgl.createProgramInfo(gl, ['vs', 'fs'])

	// calls gl.createBuffer, gl.bindBuffer, gl.bufferData for a quad
	const bufferInfo = twgl.primitives.createXYQuadBufferInfo(gl)

	const mouse = [0, 0]
	// document.addEventListener('mousemove', (event) => {
	// 	mouse[0] = ((event.clientX / sizes.width) * 2 - 1) * 0.01
	// 	mouse[1] = ((event.clientY / sizes.height) * 2 - 1) * 0.01

	// 	// console.log('event.clientX', event.clientX)
	// })

	// Select the node that will be observed for mutations
	const targetNode = document.querySelector('body');

	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };

	// Callback function to execute when mutations are observed
	const callback = function(mutationsList, observer) {
		// Use traditional 'for loops' for IE 11
		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				// console.log('A child node has been added or removed.');
				if (mutation.addedNodes[0]) { 
					if (mutation.addedNodes[0].id === 'webgazerGazeDot') { 
						// console.log('', mutation.addedNodes[0].id);
					}
				}
			}
			else if (mutation.type === 'attributes') {
				if (mutation.target.id === 'webgazerGazeDot') { 
					// console.dir(mutation.target);
					// console.log('The ' + mutation.attributeName + ' attribute was modified.');
					let style = window.getComputedStyle(mutation.target);
					let matrix = new DOMMatrix(style.transform);
					// console.log('translateX: ', matrix.m41);
					// console.log('translateY: ', matrix.m42);
					mouse[0] = ((matrix.m41 / sizes.width) * 2 - 1) * 0.02
					mouse[1] = ((matrix.m42 / sizes.height) * 2 - 1) * 0.02
					
					// if (matrix.m41 - context.x > 100) { 
					// 	console.log('mouse[0]', mouse[0])
					// 	setContext({
					// 		x: matrix.m41,
					// 		y: -1
					// 	})
					// } 
				}
			}
		}
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
		
	// useEffect(() => {
	// 	let webgazerGazeDot = document.querySelector('#webgazerGazeDot')
	// 	console.log('webgazerGazeDot', webgazerGazeDot)
		
	// 	if (webgazerGazeDot !== null) { 
	// 		console.log('useEffect', webgazerGazeDot)
	// 	}
	// })

	// document.addEventListener('touchmove', (event) => {
	// 	mouse[0] = ((event.touches[0].clientX / sizes.width) * 2 - 1) * -0.02
	// 	mouse[1] = ((event.touches[0].clientY / sizes.height) * 2 - 1) * -0.02
	// })

	// document.addEventListener('touchend', (event) => {
	// 	mouse[0] = 0
	// 	mouse[1] = 0
	// })

	let nMouse = [0, 0]

	const demo1Button = document.querySelector('.demo-1')
	const demo2Button = document.querySelector('.demo-2')

	demo1Button.addEventListener('click', (event) => {
		originalTexture = originalTexture1
		mapTexture = mapTexture1
	})

	demo2Button.addEventListener('click', (event) => {
		originalTexture = originalTexture2
		mapTexture = mapTexture2
	})

	let canvasTex = new THREE.CanvasTexture(gl.canvas)

	useFrame(() => {
		twgl.resizeCanvasToDisplaySize(canvas)

		gl.viewport(0, 0, canvas.width, canvas.height)

		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.useProgram(programInfo.program)

		// calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
		twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)

		const canvasAspect = canvas.width / canvas.height
		const imageAspect = originalImage.width / originalImage.height
		const mat = m3scaling(imageAspect / canvasAspect, -1)

		nMouse[0] += (mouse[0] - nMouse[0]) * 0.05
		nMouse[1] += (mouse[1] - nMouse[1]) * 0.05

		// calls gl.activeTexture, gl.bindTexture, gl.uniformXXX
		twgl.setUniforms(programInfo, {
			u_matrix: mat,
			u_originalImage: originalTexture,
			u_mapImage: mapTexture,
			u_mouse: nMouse,
		})
		// calls gl.drawArrays or gl.drawElements
		twgl.drawBufferInfo(gl, bufferInfo)

		canvasTex.needsUpdate = true
	})
	
	// useEffect(() => {
	// 	console.log('value', props.isReady)
	// }, [props.isReady])


	return (
		<>
			<OrbitControls 
				enableZoom={false}
				enablePan={false}
				enableKeys={false}
			/>
			<mesh
				position={[0, 0, 0]}
				rotation={[0, Math.PI / 2, 0]}
				scale={[-1, 1, 1]}
			>
				<sphereGeometry args={[2, 32, 32]} />
				<meshBasicMaterial side={THREE.BackSide} map={canvasTex} />
			</mesh>
		</>
	)
}
