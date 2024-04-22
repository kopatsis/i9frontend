<script>
	// @ts-nocheck
	import { timescriptSt, scriptSt, strRoundsSt, genTimesSt } from '$lib/stores/workout.js';
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
    let round = null;
    let roundIter = 0;

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

	let woRounds;
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
	});

	onDestroy(() => {
		unsubscribeTimeScript();
		unsubscribeScript();
		unsubscribeSt();
		unsubscribeGen();
		unsubscribeWO();
	});

	// Timing functions
	function startStopwatch() {
		if (interval === null) {
			interval = setInterval(() => {
				time += 0.05;
			}, 50);
		}
	}

	function pauseStopwatch() {
		clearInterval(interval);
		interval = null;
	}

	function resetStopwatch() {
		clearInterval(interval);
		time = 0;
		interval = null;
	}

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

	function quit(status="Paused") {
		clearInterval(interval);
		interval = null;
		goto('./');
	}

	// Start funcs
	onMount(() => {
		loading = false;
		startStopwatch();
	});

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

    $: if (roundIter + 1 < woRounds.length && time > woRounds[roundIter].start){
        round = woRounds[roundIter];
        roundIter++;
    }

	$: if (status === 'Dynamic' && time > genTimes.exercises) {
		status = 'Exercise';
	} else if (status === 'Exercise' && time > genTimes.static){
        status = 'Static'
    } else if (status === 'Static' && time > getTimes.end){

	}
</script>

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
{:else}
	<button on:click={pauseStopwatch}>Pause</button>
	<button on:click={resetStopwatch}>Restart</button>
	<button on:click={quit}>Quit</button>
	<div>{formatTime()}</div>

	{#if status === 'Dynamic'}
		<div>Dynamic Stretches Warmup:</div>
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
		<div>Static Stretches Cooldown:</div>
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
	{:else}
    <div>
		<div>Round {round.round}: {round.sets} Sets</div>
        <div>Start: {Math.floor(round.start/60)}m {Math.round(round.start%60)}s</div>
		<div>On: {Math.round(round.on)} / Off: {Math.round(round.off)}</div>
		<div>Type: {round.type}</div>
		{#if round.type !== 'Combo'}
			<span
				>{round.reps[0]}{#if round.reps.length > 1}-{round.reps[1]}{/if}x &nbsp;</span
			>
		{/if}
		{#each round.samples as sample, j}
			<div>
				{#if round.type === 'Combo'}
					<span>{round.reps[j]}x &nbsp;</span>
				{/if}
				<span>{round.titles[j]}</span>
				<button
					on:click={() => {
						showCurrentSample(sample);
					}}>&#x2139;</button
				>
				{#if currentSampleID === sample}
					<Sample sampleID={currentSampleID} />
				{/if}
			</div>
		{/each}
		<div>Rest before next round: {Math.round(round.roundrest)}</div>
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
