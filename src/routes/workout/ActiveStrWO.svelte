<script>
	// @ts-nocheck
	import {
		timescriptSt,
		scriptSt,
		strRoundsSt,
		genTimesSt,
		updateTime,

		afterWOMessage

	} from '$lib/stores/workout.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Sample from '../Sample.svelte';
	import Imgframe from '../../components/Imgframe.svelte';

	export let size = 'mid';
	const cdn = import.meta.env.VITE_CDN_URL;

	// Variables in presentation section
	let interval = null;
	let time = 0;
	let loading = true;
	let error = false;

	let status = 'Dynamic';

	let picIter = 0;
	let src = '';
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

	let getTimes;
	const unsubscribeGen = genTimesSt.subscribe((genTimesSt) => {
		getTimes = genTimesSt;
	});

	// Timing functions
	function startStopwatch() {
		if (interval === null) {
			interval = setInterval(() => {
				time += 0.01;
			}, 10);
		}
	}

	function pauseStopwatch() {
		clearInterval(interval);
		interval = null;
	}

	function resetStopwatch() {
		paused = true;
		clearInterval(interval);
		time = 0;
		
		status = 'Dynamic';
		picIter = 0;
		src = '';
		set = 0;
		activeTitle = '';
		picEndTime = 0;

		scriptIter = 0;
		scriptStartTime = 0;
		scriptEndTime = 0;
		scriptRest = false;

		lastCalled = 0;
		interval = null;
	}

	onDestroy(() => {
		unsubscribeTimeScript();
		unsubscribeScript();
		unsubscribeSt();
		unsubscribeGen();
		clearInterval(interval);
	});

	function formatTime() {
		return `${Math.floor(time / 60)} min ${Math.floor(time % 60)} sec`;
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
		if (currentSampleID !== sampleID) {
			currentSampleID = sampleID;
		}
	};

	async function quit() {
		clearInterval(interval);
		interval = null;
		loading = true;
		await updateTime(time, 'stretch', 'Paused', true);
		afterWOMessage.set(true);
		goto('./');
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
		const oldTime = get(currenttime)
		if (oldTime !== 0){
			timeMessage = true;
			existingTime = oldTime
		} else {
			loading = false;
			startStopwatch();
		}
	});

	function startAnew(){
		timeMessage = false;
		time = 0;
		loading = false;
		startStopwatch();
	}

	function startAtOld(){
		time = 0;
		timeMessage = false;
		while (time < existingTime){
			time += 0.05;
		}
		time = workingTime;
		loading = false;
		startStopwatch();
	}

	// Reactive statements on time change
	$: if (time > scriptEndTime && scriptIter + 1 < timescript.length) {
		scriptStartTime = scriptEndTime;
		scriptRest = timescript[scriptIter].isrest;
		scriptIter++;
		scriptEndTime = timescript[scriptIter].time;
	}

	$: if (time > picEndTime && picIter + 1 < script.length) {
		src = cdn + '/' + script[picIter].position + angle + '-' + size + '.webp';
		activeTitle = script[picIter].names[0]; // Have it so it's just one title in unravel lol
		set = script[picIter].set;
		picIter++;
		picEndTime = script[picIter].time;
	}

	$: if (status === 'Dynamic' && time > genTimes.static) {
		status = 'Static';
	} else if (status === 'Static' && time > getTimes.end) {
		quit();
	}

	$: if (Math.floor(time) !== lastCalled && Math.floor(time) !== lastCalled + 1 && !loading) {
		lastCalled = Math.floor(time);
		updateTime(time, 'stretch');
	}
</script>

{#if timeMessage}
	<div>Do you want to continue off of your previous saved time of: {Math.floor(existingTime / 60)} min ${Math.floor(existingTime % 60)} sec?</div>
	<button on:click={startAtOld}>Yes</button>
	<button on:click={startAnew}>No</button>
{:else if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
{:else}
	{#if exitMessage}
		<div>Are you sure you want to exit?</div>
		<button on:click={returnNoExit}>Back to Workout</button>
		<button on:click={quit}>Exit</button>
	{:else if resetMessage}
		<div>Are you sure you want restart?</div>
		<button on:click={returnNoReset}>No, go back</button>
		<button on:click={resetStopwatch}>Yes, restart</button>
	{/if}
	{#if paused}
		<button on:click={startStopwatch}>Start</button>
	{:else}
		<button on:click={pauseStopwatch}>Pause</button>
	{/if}
	<button on:click={resetQuestion}>Restart</button>
	<button on:click={exitQuestion}>Quit</button>
	<div>{formatTime()}</div>

	{#if status === 'Dynamic'}
		<div>Dynamic Stretches:</div>
		<div>
			<span>{Math.round(strRounds.dynamic.times[set - 1])}s: &nbsp;</span>
			<span>{activeTitle}</span>
			<button
				on:click={() => {
					showCurrentSample(strRounds.dynamic.samples[set - 1]);
				}}>&#x2139;</button
			>
			{#if currentSampleID === strRounds.dynamic.samples[set - 1]}
				<Sample sampleID={currentSampleID} />
			{/if}
		</div>
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
			{#if currentSampleID === strRounds.static.samples[set - 1]}
				<Sample sampleID={currentSampleID} />
			{/if}
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
{/if}
