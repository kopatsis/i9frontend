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
		wipeWorkout
	} from '$lib/stores/workout.js';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import Sample from '../../popups/Sample.svelte';
	import Imgframe from '../../components/Imgframe.svelte';
	import Audio from '../../popups/Audio.svelte';
	import { get } from 'svelte/store';
	import TimeProgress from '../../components/TimeProgress.svelte';

	export let size = 'mid';
	const cdn = import.meta.env.VITE_CDN_URL;
	let sampleExists = false;

	// Variables in presentation section
	let interval = null;
	let time = 0;
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

	// Timing functions
	function startStopwatch() {
		if (intervalCountdown) clearInterval(intervalCountdown);
		transitioning = true;
		intervalCountdown = setInterval(() => {
			transitionTime--;
			if (transitionTime === 0) {
				transitioning = false;
				clearInterval(intervalCountdown);
				if (interval === null) {
					interval = setInterval(() => {
						time += 0.01;
					}, 10);
				}
				paused = false;
				transitionTime = 3;
			}
		}, 800);
	}

	function pauseStopwatch() {
		clearInterval(interval);
		interval = null;
		paused = true;
	}

	document.addEventListener('visibilitychange', function () {
		if (document.visibilityState === 'visible') {
			startStopwatch();
		} else {
			pauseStopwatch();
		}
	});

	function resetStopwatch() {
		paused = true;
		clearInterval(interval);
		time = 0;

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

		startStopwatch();
		updateTime(time, 'stretch');
	}

	onDestroy(() => {
		unsubscribeTimeScript();
		unsubscribeScript();
		unsubscribeSt();
		unsubscribeGen();
		clearInterval(interval);
	});

	function formatTime(time) {
		return `${Math.floor(Math.round(time) / 60)} min ${Math.floor(Math.round(time) % 60)} sec`;
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

		timescriptStSession();
		if (!timescript) {
			error = 'Error loading workout';
		}
		scriptStSession();
		if (!script) {
			error = 'Error loading workout';
		}
		strRoundsStSession();
		if (!strRounds) {
			error = 'Error loading workout';
		}
		genTimesStSession();
		if (!genTimes) {
			error = 'Error loading workout';
		}

		if (!error && oldTime > 0 && genTimes && genTimes.end && oldTime < genTimes.end) {
			timeMessage = true;
			existingTime = oldTime;
		} else if (!error){
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

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else if !timescript || !script || !strRounds || !genTimes}
	<div>No workout active</div>
	<button on:click={() => goto('./')}>Create one now</button>
{:else if timeMessage}
	<div>
		Do you want to continue off of your previous saved time of: {Math.floor(existingTime / 60)} min {Math.floor(
			existingTime % 60
		)} sec?
	</div>
	<button on:click={startAtOld}>Yes</button>
	<button on:click={startAnew}>No</button>
{:else}
	{#if exitMessage}
		<div>Are you sure you want to exit?</div>
		<button on:click={returnNoExit}>Back to Workout</button>
		<button on:click={() => quit('Paused')}>Exit</button>
	{:else if resetMessage}
		<div>Are you sure you want restart?</div>
		<button on:click={returnNoReset}>No, go back</button>
		<button on:click={resetStopwatch}>Yes, restart</button>
	{:else if transitioning}
		<div>Countdown: {transitionTime}</div>
	{/if}
	{#if paused}
		<button on:click={startStopwatch}>Start</button>
	{:else}
		<button on:click={pauseStopwatch}>Pause</button>
	{/if}
	<button on:click={resetQuestion}>Restart</button>
	<button on:click={exitQuestion}>Quit</button>
	<div>{formatTime(time)} // {formatTime(genTimes ? genTimes.end : 1)}</div>
	<TimeProgress current={time} end={genTimes ? genTimes.end : 1} />

	{#if status === 'Dynamic'}
		<div>Dynamic Stretches:</div>
		{#if activeTitle}
			<div>
				<span>{Math.round(strRounds.dynamic.times[set - 1])}s: &nbsp;</span>
				<span>{activeTitle}</span>
				<button
					on:click={() => {
						showCurrentSample(strRounds.dynamic.samples[set - 1]);
					}}>&#x2139;</button
				>
			</div>
		{/if}
	{:else if status === 'Static'}
		<div>Static Stretches:</div>
		<div>
			<span>{Math.round(strRounds.static.times[set - 1])}s: &nbsp;</span>
			<span>{activeTitle}</span>
			<button
				on:click={() => {
					showCurrentSample(strRounds.static.samples[set - 1]);
				}}>&#x2139;</button
			>
		</div>
	{/if}

	<br />
	<Imgframe
		{time}
		endTime={scriptEndTime}
		startTime={scriptStartTime}
		reversed={scriptRest}
		{src}
		alt={activeTitle}
	/>
	<br />

	<button
		on:click={() => {
			changeAngle('01');
		}}>Left</button
	>
	<button
		on:click={() => {
			changeAngle('02');
		}}>Half Left</button
	>
	<button
		on:click={() => {
			changeAngle('03');
		}}>Front</button
	>
	<button
		on:click={() => {
			changeAngle('04');
		}}>Half Right</button
	>
	<button
		on:click={() => {
			changeAngle('05');
		}}>Right</button
	>
	<button
		on:click={() => {
			changeAngle('06');
		}}>Top</button
	>

	{#if sampleExists && activeTitle}
		<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
	{/if}

	<button on:click={() => (audioDisp = true)}>Show music</button>
	<Audio bind:display={audioDisp} />
{/if}
