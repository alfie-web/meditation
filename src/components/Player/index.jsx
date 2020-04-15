import React, { Fragment, Component, createRef } from 'react';
import classNames from 'classnames';

const trackRef = createRef();
const audioRef = createRef();
const videoRef = createRef();
const timeRef = createRef();

export default class Player extends Component {
	state = {
		fakeDuration: 600,
		outlineLength: null
	}


	setDuration = e => {
		audioRef.current.currentTime = 0;	
		this.setState({
			fakeDuration: +e.target.name
		})
	}

	toTimeFormat = num => {
		return (+num >= 0 && +num <= 9) ? '0' + num : num;
	}

	stopSound = () => {
		audioRef.current.pause();
		videoRef.current.pause();

		this.props.setIsPlaying(false);
	}

	playSound = () => {
		if (this.props.isPlaying) {
			this.stopSound();
		} else {
			audioRef.current.play();
			videoRef.current.play();
			
			this.props.setIsPlaying(true);
		}
	}

	
	resetSound = (currentTime) => {
		if (currentTime >= this.state.fakeDuration) {
			if (this.props.isLooped) {
				console.log('Зациклено', this.props.isLooped)
			} else {
				console.log('Не зациклено', this.props.isLooped)
				this.stopSound();
			}
			audioRef.current.currentTime = 0;
			videoRef.current.currentTime = 0;
		}
	}
	

	
	onPlay = () => {
		let currentTime = audioRef.current.currentTime;
		let elapsedTime = this.state.fakeDuration - currentTime;

		// Сразу оптимизации вагон
		let seconds = Math.floor(elapsedTime % 60);
		let minutes = Math.floor(elapsedTime / 60);
		timeRef.current.textContent = `${this.toTimeFormat(minutes)}:${this.toTimeFormat(seconds)}`;

		let progress = this.state.outlineLength - (currentTime / this.state.fakeDuration) * this.state.outlineLength;
		trackRef.current.style.strokeDashoffset = progress;

		if (currentTime >= this.state.fakeDuration) {
			this.resetSound(currentTime);
		}
	}


	// TODO: Поработать над зацикливанием

	componentDidMount() {
		let length = trackRef.current.getTotalLength()
		this.setState({
			outlineLength: length
		})
		trackRef.current.style.strokeDasharray = length;
		trackRef.current.style.strokeDashoffset = length;

		audioRef.current.addEventListener('timeupdate', this.onPlay);
	}

	// Но это скорее всего не нужно
	componentWillUnmount() {
		audioRef.current.removeEventListener('timeupdate', this.onPlay);
	}

	render()  {
		return (<Fragment>
		<div className="App__video">
			<video ref={videoRef} src={this.props.activeVideo} loop></video>
		</div>

		<div className="App__player">
			<div className="App__player-track">
				<button onClick={ this.playSound } className="Button Button--active" title={ this.props.isPlaying ? 'Отстановить' : 'Проигрывать' }>
					{ this.props.isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
						<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
						<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
					</svg> 
					: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
					</svg>
				}
				</button>
				<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
				</svg>
				<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
				</svg>
			</div>
			<audio ref={audioRef} src={this.props.activeAudio}></audio>
			<h1 ref={timeRef} className="App__player-time">00:00</h1>
		</div>

		<div className="App__times">
			<button className={ classNames('Button', { 'Button--active': this.state.fakeDuration === 10 }) } name="10" title="2 минуты" onClick={this.setDuration}>2 минуты</button>
			<button className={ classNames('Button', { 'Button--active': this.state.fakeDuration === 300 }) } title="5 минут" name="300" onClick={this.setDuration}>5 минут</button>
			<button className={ classNames('Button', { 'Button--active': this.state.fakeDuration === 600 }) } title="10 минут" name="600" onClick={this.setDuration}>10 минут</button>
		</div>

		<div className="App__controls">
				<button className={ classNames('Button', { 'Button--active': this.props.isLooped }) } onClick={ this.props.setLoop } title="Зациклить">
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
					<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
					C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
					c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
					c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
					c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
					c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
					C373.891,156.837,370.527,144.907,361.093,139.623z"/>
					<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
					c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
				</svg>
				</button>
				<button className="Button" title="Следующий">
					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
						<path d="M15.5001 8.13397C16.1667 8.51887 16.1667 9.48112 15.5001 9.86602L2.00006 17.6602C1.33339 18.0451 0.500061 17.564 0.500061 16.7942L0.500062 1.20576C0.500062 0.43596 1.3334 -0.0451642 2.00006 0.339736L15.5001 8.13397Z"/>
						<path d="M17.9167 1.89582C17.9167 1.263 17.4037 0.749991 16.7709 0.749991C16.1381 0.749991 15.6251 1.263 15.6251 1.89582V16.1042C15.6251 16.737 16.1381 17.25 16.7709 17.25C17.4037 17.25 17.9167 16.737 17.9167 16.1042V1.89582Z"/>
					</svg>
				</button>
				<button className="Button" title="Предыдущий">
					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
						<path d="M2.41667 8.13398C1.75 8.51888 1.75 9.48113 2.41667 9.86603L15.9167 17.6603C16.5833 18.0452 17.4167 17.564 17.4167 16.7942V1.20577C17.4167 0.435972 16.5833 -0.0451528 15.9167 0.339747L2.41667 8.13398Z"/>
						<path d="M0 1.89584C0 1.26301 0.513007 0.750002 1.14583 0.750002C1.77866 0.750002 2.29167 1.26301 2.29167 1.89584V16.1042C2.29167 16.737 1.77866 17.25 1.14583 17.25C0.513007 17.25 0 16.737 0 16.1042V1.89584Z"/>
					</svg>		
				</button>
			</div>
		</Fragment>)
	}
}






























// C классовой компонентой все работает, а вот на хуках того же не скажешь.
// useCallback-и все мемоизируют и не реагируют на новое значение хз почему



// import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';
// import classNames from 'classnames';

// export default function Player({ activeAudio, activeVideo, setLoop, isPlaying, isLooped, setIsPlaying }) {
// 	const [fakeDuration, setFakeDuration] = useState(600);
// 	const [outlineLength, setOutlineLength] = useState(null);

// 	const trackRef = useRef();
// 	const audioRef = useRef();
// 	const videoRef = useRef();
// 	const timeRef = useRef();

// 	const setDuration = e => {
// 		audioRef.current.currentTime = 0;	// лучше это вынести в state
// 		setFakeDuration(+e.target.name);
// 	}

// 	const toTimeFormat = num => {
// 		return (+num >= 0 && +num <= 9) ? '0' + num : num;
// 	}

// 	// console.log(isLooped)

// 	const stopSound = useCallback(() => {
// 		// console.log(playerState)
// 		audioRef.current.pause();
// 		videoRef.current.pause();
// 		// changePlayerState({
// 		// 	isPlaying: false
// 		// })
// 		setIsPlaying(false);
// 	}, [setIsPlaying])

// 	const playSound = useCallback(() => {
// 		if (isPlaying) {
// 			stopSound();
// 		} else {
// 			audioRef.current.play();
// 			videoRef.current.play();
// 			// changePlayerState({
// 			// 	isPlaying: true
// 			// })
// 			setIsPlaying(true);
// 		}
// 	}, [setIsPlaying, isPlaying, stopSound])

	
// 	const resetSound = useCallback((currentTime) => {
// 		if (currentTime >= fakeDuration) {
// 			if (isLooped) {
// 				console.log('Зациклено', isLooped)
// 			} else {
// 				console.log('Не зациклено', isLooped)
// 				stopSound();
// 			}
// 			audioRef.current.currentTime = 0;
// 			videoRef.current.currentTime = 0;
// 		}
// 	}, [fakeDuration, stopSound, isLooped])
	

	
// 	const onPlay = useCallback(() => {
// 		let currentTime = audioRef.current.currentTime;
// 		let elapsedTime = fakeDuration - currentTime;

// 		// Сразу оптимизации вагон
// 		let seconds = Math.floor(elapsedTime % 60);
// 		let minutes = Math.floor(elapsedTime / 60);
// 		timeRef.current.textContent = `${toTimeFormat(minutes)}:${toTimeFormat(seconds)}`;

// 		let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
// 		trackRef.current.style.strokeDashoffset = progress;

// 		if (currentTime >= fakeDuration) {
// 			resetSound(currentTime, isLooped);
// 			// stopSound();
// 			// audioRef.current.currentTime = 0;
// 			// videoRef.current.currentTime = 0;

// 			// if (playerState.isLooped) {
// 			// 	// playSound()
// 			// 	console.log('Зациклено')
// 			// } else {
// 			// 	console.log('Не зациклено')
// 			// }
// 		}
// 	}, [trackRef, fakeDuration, outlineLength, resetSound, isLooped])


// 	// TODO: Поработать над зацикливанием

// 	useEffect(() => {
// 		let length = trackRef.current.getTotalLength()
// 		setOutlineLength(length);
// 		trackRef.current.style.strokeDasharray = length;
// 		trackRef.current.style.strokeDashoffset = length;
// 	}, [setOutlineLength, trackRef])

// 	useEffect(() => {
// 		audioRef.current.addEventListener('timeupdate', onPlay);

// 		// return () => {
// 		// 	audioRef.current.removeEventListener('timeupdate', onPlay);
// 		// }
// 	}, [audioRef, onPlay])

// 	return (
// 		<Fragment>
// 		<div className="App__video">
// 			<video ref={videoRef} src={activeVideo} loop></video>
// 		</div>

// 		<div className="App__player">
// 			<div className="App__player-track">
// 				<button onClick={ playSound } className="Button Button--active" title={ isPlaying ? 'Отстановить' : 'Проигрывать' }>
// 					{ isPlaying ? <svg viewBox="0 0 36 42" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M-7.62939e-06 2.5C-7.62939e-06 1.11929 1.11928 0 2.49999 0C3.8807 0 4.99999 1.11929 4.99999 2.5V39.5C4.99999 40.8807 3.8807 42 2.49999 42C1.11928 42 -7.62939e-06 40.8807 -7.62939e-06 39.5V2.5Z"/>
// 						<path d="M31 2.5C31 1.11929 32.1193 0 33.5 0C34.8807 0 36 1.11929 36 2.5V39.5C36 40.8807 34.8807 42 33.5 42C32.1193 42 31 40.8807 31 39.5V2.5Z"/>
// 					</svg> 
// 					: <svg className="play" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M32.25 20.433L3.75 36.8875C3.41667 37.0799 3 36.8394 3 36.4545L3 3.54552C3 3.16062 3.41667 2.92005 3.75 3.1125L32.25 19.567C32.5833 19.7594 32.5833 20.2406 32.25 20.433Z" stroke="white" strokeWidth="5"/>
// 					</svg>
// 				}
// 				</button>
// 				<svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 					<circle cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 				</svg>
// 				<svg className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
// 					<circle ref={trackRef} cx="226.5" cy="226.5" r="216.5" strokeWidth="10"/>
// 				</svg>
// 			</div>
// 			<audio ref={audioRef} src={activeAudio}></audio>
// 			<h1 ref={timeRef} className="App__player-time">00:00</h1>
// 		</div>

// 		<div className="App__times">
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 10 }) } name="10" title="2 минуты" onClick={setDuration}>2 минуты</button>
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 300 }) } title="5 минут" name="300" onClick={setDuration}>5 минут</button>
// 			<button className={ classNames('Button', { 'Button--active': fakeDuration === 600 }) } title="10 минут" name="600" onClick={setDuration}>10 минут</button>
// 		</div>

// 		<div className="App__controls">
// 				<button className={ classNames('Button', { 'Button--active': isLooped }) } onClick={ setLoop } title="Зациклить">
// 					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 371.108 371.108">
// 					<path d="M361.093,139.623c-7.882-4.414-17.496-2.774-23.531,3.385C318.591,68.981,251.312,14.1,171.454,14.1
// 					C76.914,14.1,0,91.014,0,185.554s76.914,171.454,171.454,171.454c41.296,0,81.195-14.892,112.345-41.933
// 					c8.165-7.088,9.039-19.454,1.951-27.619c-7.088-8.164-19.453-9.037-27.619-1.951c-24.029,20.859-54.811,32.346-86.677,32.346
// 					c-72.949,0-132.298-59.349-132.298-132.298S98.505,53.256,171.454,53.256c58.537,0,108.308,38.218,125.692,91.01
// 					c-6.604-3.42-14.869-2.924-21.101,1.969c-8.504,6.678-9.984,18.985-3.306,27.489l32.367,41.216
// 					c4.466,5.688,11.113,8.958,18.044,8.958c0.568,0,1.138-0.022,1.708-0.066c7.536-0.586,14.318-5.012,18.141-11.838l25.608-45.723
// 					C373.891,156.837,370.527,144.907,361.093,139.623z"/>
// 					<path d="M171.054,85.674c-10.813,0-19.5,8.765-19.5,19.578v75.375c0,13.494,10.857,24.927,24.525,24.927h54.502
// 					c10.813,0,19.578-8.687,19.578-19.5s-8.765-19.5-19.578-19.5h-40.028v-61.302C190.554,94.439,181.867,85.674,171.054,85.674z"/>
// 				</svg>
// 				</button>
// 				<button className="Button" title="Следующий">
// 					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M15.5001 8.13397C16.1667 8.51887 16.1667 9.48112 15.5001 9.86602L2.00006 17.6602C1.33339 18.0451 0.500061 17.564 0.500061 16.7942L0.500062 1.20576C0.500062 0.43596 1.3334 -0.0451642 2.00006 0.339736L15.5001 8.13397Z"/>
// 						<path d="M17.9167 1.89582C17.9167 1.263 17.4037 0.749991 16.7709 0.749991C16.1381 0.749991 15.6251 1.263 15.6251 1.89582V16.1042C15.6251 16.737 16.1381 17.25 16.7709 17.25C17.4037 17.25 17.9167 16.737 17.9167 16.1042V1.89582Z"/>
// 					</svg>
// 				</button>
// 				<button className="Button" title="Предыдущий">
// 					<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
// 						<path d="M2.41667 8.13398C1.75 8.51888 1.75 9.48113 2.41667 9.86603L15.9167 17.6603C16.5833 18.0452 17.4167 17.564 17.4167 16.7942V1.20577C17.4167 0.435972 16.5833 -0.0451528 15.9167 0.339747L2.41667 8.13398Z"/>
// 						<path d="M0 1.89584C0 1.26301 0.513007 0.750002 1.14583 0.750002C1.77866 0.750002 2.29167 1.26301 2.29167 1.89584V16.1042C2.29167 16.737 1.77866 17.25 1.14583 17.25C0.513007 17.25 0 16.737 0 16.1042V1.89584Z"/>
// 					</svg>		
// 				</button>
// 			</div>
// 		</Fragment>
// 	)
// }