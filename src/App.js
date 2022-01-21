import React, {useState, useEffect} from 'react'
import { WebGazeContext } from './WebGazeContext'
import MainApp from './Main'
import CanvasContainer from './components/CanvasContainer.js'

import './App.css'

import Script from 'react-load-script'
declare var webgazer

class WebGazeLoader extends React.Component {

	handleScriptLoad() {
		webgazer.setGazeListener((data, elapsedTime) => {
			if (data == null) {
				return
			}
		
			if (data.x - this.props.context.x > 50) { 
				// console.log('data', data.x)
				// console.log('this.props.context', this.props.context.x)

				this.props.setContext(webgazer.util.bound(data))
			}
		})
		.begin()
	}

	handleScriptError() {
		console.log('error')
	}

	render() {
		console.log('rerender')

		return (
			// <WebGazeContext.Provider >
			// 	<Script
			// 		url='https://webgazer.cs.brown.edu/webgazer.js'
			// 		onLoad={this.handleScriptLoad.bind(this)}
			// 		onError={this.handleScriptError.bind(this)}
			// 	/>
			// {/* <MainApp /> */}
			
			// </WebGazeContext.Provider>
			<>
				<Script
					url='https://webgazer.cs.brown.edu/webgazer.js'
					onLoad={this.handleScriptLoad.bind(this)}
					onError={this.handleScriptError.bind(this)}
				/>
			</>
		)
	}
}
WebGazeLoader.contextType = WebGazeContext

function App() {
	const [context, setContext] = useState({
		x: -1,
		y: -1 
	})

	// useEffect(() => {
	// 	console.log('context', context)
	// })

	return (
		<div className='App'>
			<WebGazeLoader setContext={setContext} context={context}/>
			<CanvasContainer
				context={context}
				// value={this.state.context}
				// isReady={this.state.canvasReady}
				// isReadyHandler={this.isReadyHandler}
			/>
		</div>
	)
}

export default App
