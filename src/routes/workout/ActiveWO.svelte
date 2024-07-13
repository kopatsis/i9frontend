<script>
	// @ts-nocheck
	import {
		currenttimeSession,
		roundsSet,
		timescriptSt,
		scriptSt,
		strRoundsSt,
		genTimesSt,
		updateTime,
		currenttime,
		workoutRoundsSt,
		afterWOMessage,
		workoutRoundsStSession,
		timescriptStSession,
		scriptStSession,
		strRoundsStSession,
		genTimesStSession,
		woIdSession,
		name,
		nameSession
	} from '$lib/stores/workout.js';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import Sample from '../../popups/Sample.svelte';
	import Imgframe from '../../components/Imgframe.svelte';
	import Audio from '../../popups/Audio.svelte';
	import TimeProgress from '../../components/TimeProgress.svelte';
	import { ratingTrue } from '$lib/stores/creation';
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
	let round = null;
	let roundIter = 0;

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
	let paused = true;
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

	let woRounds = [];
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
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
						startTime = performance.now() - time * 1000;
						interval = setTimeout(step, 10);
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
		round = null;
		roundIter = 0;

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

		timeMessage = false;
		resetMessage = false;
		startStopwatch();
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
		unsubscribeWO();
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

	async function quit(rate = true) {
		clearInterval(interval);
		interval = null;
		loading = true;
		try {
			await updateTime(time, '', 'Paused', true);
		} catch (err) {
			console.log(err);
		} finally {
			if (rate) {
				ratingTrue();
			} else {
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
		check = workoutRoundsStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = nameSession();
		if (check === null) {
			error = 'Error loading name';
		}

		woIdSession();

		changeSize();
		updateFontSize();
		window.addEventListener('resize', changeSize);
		window.addEventListener('resize', updateFontSize);

		if (!error && oldTime > 0 && genTimes && genTimes.end && oldTime < genTimes.end) {
			timeMessage = true;
			existingTime = oldTime;
		} else if (!error) {
			startStopwatch();
		}
		loading = false;
	});

	function startAnew() {
		timeMessage = false;
		time = 0;
		loading = false;
		updateTime(time, '', 'Progressing', true);
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
		let workingRound = null;
		let workingRoundIter = 0;

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

			if (workingRoundIter < woRounds.length && workingTime > woRounds[workingRoundIter].start) {
				workingRound = woRounds[workingRoundIter];
				roundsSet(workingRoundIter);
				workingRoundIter++;
			}

			if (genTimes && workingStatus === 'Dynamic' && workingTime > genTimes.exercises) {
				workingStatus = 'Exercise';
			} else if (genTimes && workingStatus === 'Exercise' && workingTime > genTimes.static) {
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
		round = workingRound;
		roundIter = workingRoundIter;

		updateTime(time, '', 'Progressing', true);
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

	$: if (woRounds && roundIter < woRounds.length && time > woRounds[roundIter].start) {
		round = woRounds[roundIter];
		roundsSet(roundIter);
		roundIter++;
	}

	$: if (genTimes && status === 'Dynamic' && time > genTimes.exercises) {
		status = 'Exercise';
	} else if (genTimes && status === 'Exercise' && time > genTimes.static) {
		status = 'Static';
	} else if (genTimes && status === 'Static' && time > genTimes.end) {
		quit();
	}

	$: if (Math.floor(time) !== lastCalled && Math.floor(time) !== lastCalled + 1 && !loading) {
		lastCalled = Math.floor(time);
		updateTime(time);
	}
</script>

<div class="page">
	{#if loading}
		<div>loading...</div>
	{:else if error}
		<Modal closerFunc={() => goto('./')}>
			<div>F: {error}</div>
			<button on:click={() => goto('./')}>Go Home</button>
		</Modal>
	{:else if !timescript || !script || !strRounds || !genTimes || !woRounds}
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
		{/if}

		{#if paused}
			<Modal>
				<div class="pauseModal">
					<div class="options">
						{#if exitMessage}
							<div class="full">Are you sure you want to exit?</div>
							<div class="anglerow controls full">
								<button on:click={returnNoExit}>Back to Workout</button>
								<button on:click={() => quit(true)}>Exit and Rate</button>
								<button on:click={() => quit(false)}>Exit and Don't Rate</button>
							</div>
						{:else if resetMessage}
							<div class="full">Are you sure you want restart?</div>
							<div class="anglerow controls full">
								<button on:click={returnNoReset}>No, go back</button>
								<button on:click={resetStopwatch}>Yes, restart</button>
							</div>
						{:else}
							<div class="anglerow controls full">
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
									<div>This Round: Dynamic Stretch Warmup</div>
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
						{:else if status === 'Static'}
							<div class="inner first">
								<div>This Round: Static Stretch Cooldown</div>
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
								<div>&nbsp;{Math.round(strRounds.static.times[set - 1])} seconds</div>
							</div>
						{:else if activeTitle === 'Round Rest' && round.round === 10}
							<div class="inner first">Nice Job! That's it for the main workout!</div>
						{:else}
							{#if activeTitle === 'Round Rest'}
								<div class="inner zero">Up Next:</div>
							{/if}
							<div class="inner first">
								<div>Workout Round: #{round.round}: {round.type}</div>
							</div>
							<div class="inner second">
								<div class="grid">
									{#if round.type !== 'Combo'}
										{#if round.reps.length < 2}
											<div>{round.reps[0]}x</div>
										{:else if activeTitle === 'Round Rest'}
											<div>{round.reps[0]}-{round.reps[1]}x</div>
										{:else if set % 2 == 1}
											<div>{round.reps[0]}x</div>
										{:else}
											<div>{round.reps[1]}x</div>
										{/if}
									{/if}
									{#each round.samples as sample, j}
										{#if round.type === 'Combo'}
											<div>{round.reps[j]}x</div>
										{:else if j !== 0}
											<div>&nbsp;</div>
										{/if}
										<div>{round.titles[j]}</div>
										<div>
											<button
												on:click={() => {
													showCurrentSample(sample);
												}}>&#x2139;</button
											>
										</div>
									{/each}
								</div>
							</div>
							<div class="inner third">
								<div>Set {activeTitle === 'Round Rest' ? 0 : set} / {round.sets}</div>
								<div>
									Exercise Per Set: {Math.round(round.on)}s
								</div>
								<div>Rest Per Set: {Math.round(round.off)}s</div>
							</div>
							<div class="inner fourth">
								<div>Rest before next round: {Math.round(round.roundrest + round.off)} seconds</div>
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
							<div>Dynamic Stretch Warmup</div>
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
				{:else if status === 'Static'}
					<div class="inner first">
						<pre>{formatTime(time)}</pre>
						<div>Static Stretch Cooldown</div>
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
						<div>&nbsp;{Math.round(strRounds.static.times[set - 1])} seconds</div>
					</div>
				{:else if activeTitle === 'Round Rest' && round.round === 10}
					<div class="inner first">Nice Job! That's it for the main workout!</div>
					<div class="inner second">Up Next: Static Stretch Cooldown</div>
				{:else}
					{#if activeTitle === 'Round Rest'}
						<div class="inner zero">Up Next:</div>
					{/if}
					<div class="inner first">
						<pre>{formatTime(time)}</pre>
						<div>WO Round {round.round}: {round.type}</div>
					</div>
					<div class="inner second">
						<div class="grid">
							{#if round.type !== 'Combo'}
								{#if round.reps.length < 2}
									<div>{round.reps[0]}x</div>
								{:else if activeTitle === 'Round Rest'}
									<div>{round.reps[0]}-{round.reps[1]}x</div>
								{:else if set % 2 == 1}
									<div>{round.reps[0]}x</div>
								{:else}
									<div>{round.reps[1]}x</div>
								{/if}
							{/if}
							{#each round.samples as sample, j}
								{#if round.type === 'Combo'}
									<div>{round.reps[j]}x</div>
								{:else if j !== 0}
									<div>&nbsp;</div>
								{/if}
								<div>{round.titles[j]}</div>
								<div>
									<button
										on:click={() => {
											showCurrentSample(sample);
										}}>&#x2139;</button
									>
								</div>
							{/each}
						</div>
					</div>
					<div class="inner third">
						<div>Set {activeTitle === 'Round Rest' ? 0 : set} / {round.sets}</div>
						<div>
							Exercise Per Set: {Math.round(round.on)}s
						</div>
						<div>Rest Per Set: {Math.round(round.off)}s</div>
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
		/>

		<div class="anglerow full">
			<button
				on:click={() => {
					changeAngle('01');
				}}
				><img src={angle === '01' ? '/small/Image1T.png' : '/small/Image1.png'} alt="Left" />
			</button>
			<button
				on:click={() => {
					changeAngle('02');
				}}
				><img
					src={angle === '02' ? '/small/Image2T.png' : '/small/Image2.png'}
					alt="Half Left"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('03');
				}}
				><img
					src={angle === '03' ? '/small/Image3T.png' : '/small/Image3.png'}
					alt="Center"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('04');
				}}
				><img
					src={angle === '04' ? '/small/Image4T.png' : '/small/Image4.png'}
					alt="Half Right"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('05');
				}}
				><img
					src={angle === '05' ? '/small/Image5T.png' : '/small/Image5.png'}
					alt="Right"
				/></button
			>
			<button
				on:click={() => {
					changeAngle('06');
				}}
				><img src={angle === '06' ? '/small/Image6T.png' : '/small/Image6.png'} alt="Top" /></button
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
	.anglerow {
		display: flex;
		width: 100%;
		height: clamp(30px, 10dvw, 55px);
		border-top: 1px solid rgb(137, 151, 155);
		box-sizing: border-box;
		padding: 0;
	}

	.anglerow button {
		flex: 1;
		padding: 2px;
		border: none;
		border-top: 1px solid rgb(137, 151, 155);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
	}

	.anglerow button img {
		height: calc(100% - 5px);
		width: calc(100% - 5px);
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
	.grid {
		display: grid;
		grid-template-columns: max-content 1fr max-content;
		gap: 1px;
	}
	.grid > div {
		padding: 6px;
	}

	pre {
		font-family: 'Courier New', Courier, monospace;
	}

	.inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
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
			width: clamp(30px, 10dvh, 55px);
			border-top: none;
			border-left: 1px solid rgb(137, 151, 155);
		}
	}
</style>
