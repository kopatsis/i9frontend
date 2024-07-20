<script>
	// @ts-nocheck
	import {
		timescriptSt,
		scriptSt,
		strRoundsSt,
		genTimesSt,
		updateTime,
		timescriptStSession,
		scriptStSession,
		strRoundsStSession,
		genTimesStSession,
		afterWOMessage,
		currenttime,
		currenttimeSession,
		wipeWorkout,
		woIdSession,
		name,
		nameSession
	} from '$lib/stores/workout.js';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import Sample from '../../popups/Sample.svelte';
	import Imgframe from '../../components/Imgframe.svelte';
	import Audio from '../../popups/Audio.svelte';
	import { get } from 'svelte/store';
	import TimeProgress from '../../components/TimeProgress.svelte';
	import Modal from '../../templates/Modal.svelte';

	export let size = 'mid';
	const cdn = import.meta.env.VITE_CDN_URL;
	let sampleExists = false;
	let worker;

	// Variables in presentation section
	let interval = null;
	let time = 0;
	let startTime;
	let loading = true;
	let error = false;

	let status = 'Dynamic';

	let picIter = 0;
	let src = 'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
	let set = 0;
	let activeTitle = '';
	let picEndTime = 0;
	let angle = '02';

	let scriptIter = 0;
	let scriptStartTime = 0;
	let scriptEndTime = 0;
	let scriptRest = false;

	let lastCalled = 0;
	let exitMessage = false;
	let resetMessage = false;
	let paused = false;
	let timeMessage = false;
	let existingTime = 0;

	let audioDisp = false;

	let transitionTime = 3;
	let transitioning = false;
	let intervalCountdown;

	// Subscriptions section
	let timescript;
	const unsubscribeTimeScript = timescriptSt.subscribe((timescriptSt) => {
		timescript = timescriptSt;
	});

	let script;
	const unsubscribeScript = scriptSt.subscribe((scriptSt) => {
		script = scriptSt;
	});

	let strRounds;
	const unsubscribeSt = strRoundsSt.subscribe((strRoundsSt) => {
		strRounds = strRoundsSt;
	});

	let genTimes;
	const unsubscribeGen = genTimesSt.subscribe((genTimesSt) => {
		genTimes = genTimesSt;
	});

	let nameWO = '';
	const unsubscribeName = name.subscribe((name) => {
		nameWO = name;
	});

	// Timing functions

	function step() {
		let now = performance.now();
		let dt = now - startTime;

		time = dt / 1000;

		interval = setTimeout(step, Math.max(0, 10 - (dt % 10)));
	}

	function startStopwatch() {
		if (intervalCountdown) clearInterval(intervalCountdown);
		transitioning = true;
		intervalCountdown = setInterval(() => {
			transitionTime--;
			if (transitionTime === 0) {
				transitioning = false;
				clearInterval(intervalCountdown);

				if (worker) {
					worker.postMessage({ command: 'start', time: time });
				} else {
					if (interval === null) {
						if (interval === null) {
							startTime = performance.now() - time * 1000;
							interval = setTimeout(step, 10);
						}
					}
				}

				paused = false;
				transitionTime = 3;
			}
		}, 1000);
	}

	function pauseStopwatch() {
		paused = true;
		if (worker) {
			worker.postMessage({ command: 'pause' });
		} else {
			if (interval !== null) {
				clearTimeout(interval);
				interval = null;
				time = (performance.now() - startTime) / 1000;
			}
		}
	}

	function resetStopwatch() {
		pauseStopwatch();
		time = 0;

		if (worker) {
			worker.postMessage({ command: 'reset' });
		}

		status = 'Dynamic';
		picIter = 0;
		src = 'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
		set = 0;
		activeTitle = '';
		picEndTime = 0;

		scriptIter = 0;
		scriptStartTime = 0;
		scriptEndTime = 0;
		scriptRest = false;

		lastCalled = 0;
		interval = null;

		resetMessage = false;
		timeMessage = false;

		startStopwatch();
		updateTime(time, 'stretch');
	}

	function handleVisibilityChange() {
		if (document.visibilityState === 'visible') {
			startStopwatch();
		} else {
			pauseStopwatch();
		}
	}

	onDestroy(() => {
		unsubscribeTimeScript();
		unsubscribeScript();
		unsubscribeSt();
		unsubscribeGen();
		unsubscribeName();
		clearInterval(interval);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		if (worker) {
			worker.terminate();
		}
	});

	function truncateString(str) {
		if (str.length > 40) {
			return str.slice(0, 37) + '...';
		}
		return str;
	}

	function audioDisplay() {
		pauseStopwatch();
		audioDisp = true;
	}

	const audioUndisplay = () => {
		audioDisp = false;
		startStopwatch();
	};

	function goHome() {
		isCreateForm.set(true);
		goto('./');
	}

	// Sizing functions
	function changeSize() {
		const smallest = Math.min(window.innerWidth, window.innerHeight);
		let newsize;
		if (smallest < 250) {
			newsize = 'low';
		} else if (smallest < 750) {
			newsize = 'mid';
		} else if (smallest < 1750) {
			newsize = 'high';
		} else {
			newsize = 'OG';
		}
		if (size !== newsize) {
			size = newsize;
			src = cdn + '/' + script[picIter].position + angle + '-' + size + '.webp';
		}
	}

	let parentDiv;
	let fontSize = '16px';

	function updateFontSize() {
		if (parentDiv) {
			const font = Math.round(Math.min(parentDiv.clientWidth, parentDiv.clientHeight) * 0.9) / 10;
			parentDiv.style.fontSize = `${font}px`;
		}
	}

	function formatTime(time) {
		const minutes = Math.floor(Math.round(time) / 60);
		let seconds = Math.floor(Math.round(time) % 60);
		if (seconds < 10) {
			seconds = `0${seconds}`;
		}
		return `${minutes}:${seconds}`;
	}

	// Other interactive functions
	function changeAngle(newAngle) {
		if (angle !== newAngle) {
			angle = newAngle;
			src = cdn + '/' + script[picIter].position + angle + '-' + size + '.webp';
		}
	}

	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		currentSampleID = sampleID;
		sampleExists = true;
	};

	async function quit(status) {
		clearInterval(interval);
		interval = null;
		loading = true;
		try {
			await updateTime(time, 'stretch', status, true);
		} catch (err) {
			console.log(err);
		} finally {
			if (status === 'Finished') {
				wipeWorkout();
				afterWOMessage.set(true);
			}
			goto('./');
		}
	}

	function resetQuestion() {
		pauseStopwatch();
		resetMessage = true;
	}

	function exitQuestion() {
		pauseStopwatch();
		exitMessage = true;
	}

	function returnNoReset() {
		resetMessage = false;
		startStopwatch();
	}

	function returnNoExit() {
		exitMessage = false;
		startStopwatch();
	}

	// Start funcs
	onMount(() => {
		currenttimeSession();
		const oldTime = get(currenttime);
		console.log(oldTime);

		if (localStorage.getItem('szsY0s') === 'DceYdZ') {
			worker = new Worker(new URL('/timeworker.js', import.meta.url));

			worker.onmessage = function (event) {
				time = parseFloat(event.data);
			};
		} else {
			document.addEventListener('visibilitychange', handleVisibilityChange);
		}

		let check = timescriptStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = scriptStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = strRoundsStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = genTimesStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = nameSession();
		if (check === null) {
			error = 'Error loading name';
		}

		woIdSession();

		if (!error && oldTime > 0 && genTimes && genTimes.end && oldTime < genTimes.end) {
			timeMessage = true;
			existingTime = oldTime;
		} else if (!error) {
			startStopwatch();
		}
		loading = false;
	});

	// Having old time functions
	function startAnew() {
		timeMessage = false;
		time = 0;
		loading = false;
		updateTime(time, 'stretch', 'Progressing', true);
		startStopwatch();
	}

	function startAtOld() {
		loading = true;

		let workingTime = 0;
		let workingStatus = 'Dynamic';
		let workingPicIter = 0;
		let workingSrc =
			'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
		let workingSet = 0;
		let workingActiveTitle = '';
		let workingPicEndTime = 0;
		let workingScriptIter = 0;
		let workingScriptStartTime = 0;
		let workingScriptEndTime = 0;
		let workingScriptRest = false;

		while (workingTime < existingTime) {
			workingTime += 0.01;
			if (workingTime > workingScriptEndTime && workingScriptIter + 1 < timescript.length) {
				workingScriptStartTime = workingScriptEndTime;
				workingScriptRest = timescript[workingScriptIter].isrest;
				workingScriptIter++;
				workingScriptEndTime = timescript[workingScriptIter].time;
			}

			if (script && workingTime > workingPicEndTime && workingPicIter + 1 < script.length) {
				workingSrc = cdn + '/' + script[workingPicIter].position + angle + '-' + size + '.webp';
				workingActiveTitle = script[workingPicIter].names[0];
				workingSet = script[workingPicIter].set;
				workingPicIter++;
				workingPicEndTime = script[workingPicIter].time;
			}

			if (genTimes && workingStatus === 'Dynamic' && workingTime > genTimes.static) {
				workingStatus = 'Static';
			}
		}
		time = workingTime;
		status = workingStatus;
		picIter = workingPicIter;
		src = workingSrc;
		set = workingSet;
		activeTitle = workingActiveTitle;
		picEndTime = workingPicEndTime;
		scriptIter = workingScriptIter;
		scriptStartTime = workingScriptStartTime;
		scriptEndTime = workingScriptEndTime;
		scriptRest = workingScriptRest;

		updateTime(time, 'stretch', 'Progressing', true);
		loading = false;
		timeMessage = false;
		startStopwatch();
	}

	// Reactive statements on time change
	$: if (timescript && time > scriptEndTime && scriptIter + 1 < timescript.length) {
		scriptStartTime = scriptEndTime;
		scriptRest = timescript[scriptIter].isrest;
		scriptIter++;
		scriptEndTime = timescript[scriptIter].time;
	}

	$: if (script && time > picEndTime && picIter + 1 < script.length) {
		src = cdn + '/' + script[picIter].position + angle + '-' + size + '.webp';
		activeTitle = script[picIter].names[0]; // Have it so it's just one title in unravel lol
		set = script[picIter].set;
		picIter++;
		picEndTime = script[picIter].time;
	}

	$: if (genTimes && status === 'Dynamic' && time > genTimes.static) {
		status = 'Static';
	} else if (genTimes && status === 'Static' && time > genTimes.end) {
		quit('Finished');
	}

	$: if (Math.floor(time) !== lastCalled && Math.floor(time) !== lastCalled + 1 && !loading) {
		lastCalled = Math.floor(time);
		updateTime(time, 'stretch');
	}
</script>

<div class="page">
	{#if loading}
		<div class="loading" id="loader" style="display: none">
			<div class="bouncer">
				<img src="/images/i9logotsp.png" alt="sdafa" />
			</div>
			<div class="loader2"></div>
		</div>
	{:else if error}
		<Modal closerFunc={() => goto('./')}>
			<div>F: {error}</div>
			<button on:click={() => goto('./')}>Go Home</button>
		</Modal>
	{:else if !timescript || !script || !strRounds || !genTimes}
		<Modal closerFunc={() => goto('./')}>
			<div>No workout active</div>
			<button on:click={goHome}>Create one now</button>
		</Modal>
	{:else if timeMessage}
		<Modal>
			<div>
				Do you want to continue off of your previous saved time of: {Math.floor(existingTime / 60)} min
				{Math.floor(existingTime % 60)} sec?
			</div>
			<div class="anglerow controls">
				<button on:click={startAtOld}>Yes</button>
				<button on:click={startAnew}>No</button>
			</div>
		</Modal>
	{:else}
		{#if transitioning}
			<div class="transition">
				<div>{transitionTime}</div>
			</div>
		{:else if paused}
			<Modal>
				<div class="pauseModal">
					<div class="options">
						{#if exitMessage}
							<div class="full">Are you sure you want to exit?</div>
							<div class="pausequests">
								<button on:click={returnNoExit}>Back to Workout</button>
								<button on:click={() => quit('Paused')}>Exit</button>
							</div>
						{:else if resetMessage}
							<div class="full">Are you sure you want restart?</div>
							<div class="pausequests">
								<button on:click={returnNoReset}>No, go back</button>
								<button on:click={resetStopwatch}>Yes, restart</button>
							</div>
						{:else}
							<div class="pausequests">
								<button on:click={startStopwatch}>Resume</button>
								<button on:click={resetQuestion}>Restart</button>
								<button on:click={exitQuestion}>Quit</button>
								<button on:click={audioDisplay}>Show music</button>
							</div>
						{/if}
					</div>
					<div class="wodata">
						<div>Data for this workout</div>
						<div>
							<div>
								Current Time: <pre>{formatTime(time)}</pre>
							</div>
							<div>
								Total Time: <pre>{formatTime(genTimes ? genTimes.end : 1)}</pre>
							</div>
						</div>
						<div>
							<div>WO Name: {truncateString(nameWO)}</div>
						</div>
						{#if status === 'Dynamic'}
							{#if activeTitle}
								<div class="inner first">
									<div>This Round: Dynamic Stretches</div>
								</div>
								<div class="inner second">
									<div>{activeTitle}</div>
									<div>
										<button
											on:click={() => {
												showCurrentSample(strRounds.dynamic.samples[set - 1]);
											}}>&#x2139;</button
										>
									</div>
								</div>
								<div class="inner third">
									<div>Stretch Set {set} / {strRounds.dynamic.times.length}</div>
									<div>{Math.round(strRounds.dynamic.times[set - 1])} seconds</div>
								</div>
							{/if}
						{:else}
							<div class="inner first">
								<div>This Round: Static Stretches</div>
							</div>
							<div class="inner second">
								<div>{activeTitle}</div>
								<div>
									<button
										on:click={() => {
											showCurrentSample(strRounds.static.samples[set - 1]);
										}}>&#x2139;</button
									>
								</div>
							</div>
							<div class="inner third">
								<div>Stretch Set {set} / {strRounds.static.times.length}</div>
								<div>{Math.round(strRounds.static.times[set - 1])} seconds</div>
							</div>
						{/if}
					</div>
				</div>
			</Modal>
		{/if}

		<div class="infobar" bind:this={parentDiv}>
			<div>
				{#if status === 'Dynamic'}
					{#if activeTitle}
						<div class="inner first">
							<pre>{formatTime(time)}</pre>
							<div>Dynamic Stretches</div>
						</div>
						<div class="inner second">
							<div>{activeTitle}</div>
							<div>
								<button
									on:click={() => {
										showCurrentSample(strRounds.dynamic.samples[set - 1]);
									}}>&#x2139;</button
								>
							</div>
						</div>
						<div class="inner third">
							<div>Stretch Set {set} / {strRounds.dynamic.times.length}</div>
							<div>{Math.round(strRounds.dynamic.times[set - 1])} seconds</div>
						</div>
					{/if}
				{:else}
					<div class="inner first">
						<pre>{formatTime(time)}</pre>
						<div>Static Stretches</div>
					</div>
					<div class="inner second">
						<div>{activeTitle}</div>
						<div>
							<button
								on:click={() => {
									showCurrentSample(strRounds.static.samples[set - 1]);
								}}>&#x2139;</button
							>
						</div>
					</div>
					<div class="inner third">
						<div>Stretch Set {set} / {strRounds.static.times.length}</div>
						<div>{Math.round(strRounds.static.times[set - 1])} seconds</div>
					</div>
				{/if}
			</div>
		</div>

		<Imgframe
			{time}
			endTime={scriptEndTime}
			startTime={scriptStartTime}
			reversed={scriptRest}
			{src}
			alt={activeTitle}
			{pauseStopwatch}
		/>

		<div class="anglerow full">
			<button
				on:click={() => {
					changeAngle('01');
				}}
				><img src={angle === '01' ? '/small/Angle1T.png' : '/small/Angle1.png'} alt="Left" />
			</button>
			<button
				on:click={() => {
					changeAngle('02');
				}}
				><img
					src={angle === '02' ? '/small/Angle2T.png' : '/small/Angle2.png'}
					alt="Half Left"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('03');
				}}
				><img
					src={angle === '03' ? '/small/Angle3T.png' : '/small/Angle3.png'}
					alt="Center"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('04');
				}}
				><img
					src={angle === '04' ? '/small/Angle4T.png' : '/small/Angle4.png'}
					alt="Half Right"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('05');
				}}
				><img
					src={angle === '05' ? '/small/Angle5T.png' : '/small/Angle5.png'}
					alt="Right"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('06');
				}}
				><img src={angle === '06' ? '/small/Angle6T.png' : '/small/Angle6.png'} alt="Top" /></button
			>
		</div>

		{#if sampleExists}
			<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
		{/if}

		<Audio bind:display={audioDisp} closer={audioUndisplay} />

		<TimeProgress current={time} end={genTimes ? genTimes.end : 1} />
	{/if}
</div>

<style>
	
.bouncer {
		padding: 10px;
		padding-top: 20px;
	}

	.bouncer img {
		height: auto;
		width: clamp(100px, 50dvw, 300px);
		animation: bounce 0.6s infinite;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(218, 229, 225, 0.85);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2000;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-25px);
			animation-timing-function: cubic-bezier(0.62, 0.1, 0.62, 1.21);
		}
	}

	.loader2 {
		width: 50px;
		aspect-ratio: 1;
		display: grid;
		border-radius: 50%;
		background:
			linear-gradient(0deg, rgb(0 0 0/50%) 30%, #0000 0 70%, rgb(0 0 0/100%) 0) 50%/8% 100%,
			linear-gradient(90deg, rgb(0 0 0/25%) 30%, #0000 0 70%, rgb(0 0 0/75%) 0) 50%/100% 8%;
		background-repeat: no-repeat;
		animation: l23 0.6s infinite steps(12);
	}
	.loader2::before,
	.loader2::after {
		content: '';
		grid-area: 1/1;
		border-radius: 50%;
		background: inherit;
		opacity: 0.915;
		transform: rotate(30deg);
	}
	.loader2::after {
		opacity: 0.83;
		transform: rotate(60deg);
	}
	@keyframes l23 {
		100% {
			transform: rotate(1turn);
		}
	}

	.anglerow {
		display: flex;
		width: 100%;
		height: clamp(25px, 8dvw, 55px);
		border-top: 1px solid rgb(137, 151, 155);
		box-sizing: border-box;
		padding: 0;
	}

	.anglerow button {
		padding: 2px;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		cursor: pointer;
		background-color: transparent;
		height: 100%;
		width: auto;
	}

	.anglerow button img {
		height: calc(100% - 5px);
		width: auto;
		aspect-ratio: 1/1;
	}

	.infobar {
		flex: 1;
		min-height: 30dvh;
		width: 100%;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		overflow-y: auto;
		overflow-x: auto;
	}

	.controls > button {
		font-size: 16px;
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		width: 100dvw;
	}

	.page > .full {
		flex-shrink: 0;
	}

	.transition {
		height: 100dvh;
		width: 100dvw;
		z-index: 19;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.44);
		position: fixed;
		top: 0;
		left: 0;
	}

	.transition > div {
		font-size: 72px;
		color: white;
		z-index: 20;
	}

	pre {
		font-family: 'Courier New', Courier, monospace;
	}

	.inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		width: 100%;
	}

	.inner > div {
		margin: 5px;
	}

	.pauseModal {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pauseModal > div {
		flex: 1;
		border: 1px solid grey;
		box-sizing: border-box;
	}

	.options {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 8px;
	}

	.pausequests {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.pausequests > button {
		flex: 1;
		max-width: 500px;
	}

	@media (min-aspect-ratio: 1.2/1) {
		.pauseModal {
			flex-direction: row;
		}
		.page {
			flex-direction: row;
		}

		.infobar {
			min-height: auto;
			width: auto;
			min-width: 30dvw;
			height: 100%;
		}

		.anglerow {
			height: 100%;
			width: clamp(25px, 8dvh, 55px);
			border-top: none;
			border-left: 1px solid rgb(137, 151, 155);
		}

		.anglerow button {
			width: 100%;
			height: auto;
		}

		.anglerow button img {
			width: calc(100% - 5px);
			height: auto;
		}
	}
</style>
