<script>
	// @ts-nocheck

	import {
		name,
		strRoundsSt,
		strRoundsStSession,
		workoutRoundsSt,
		workoutRoundsStSession
	} from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import Sample from '../Sample.svelte';
	import { goto } from '$app/navigation';

	let sampleExists = false;

	let error;
	let strRounds;
	let loading = true;

	const unsubscribeSt = strRoundsSt.subscribe((strRoundsSt) => {
		strRounds = strRoundsSt;
	});

	let woRounds;
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
	});

	let woName = '';
	const unsubscribeName = name.subscribe((name) => {
		woName = name;
	});

	onDestroy(() => {
		unsubscribeSt();
		unsubscribeWO();
		unsubscribeName();
	});

	onMount(() => {
		workoutRoundsStSession();
		if (!woRounds) {
			error = 'No workout existing';
		}
		strRoundsStSession();
		if (!strRounds) {
			error = 'No workout existing';
		}
		loading = false;
	});

	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		currentSampleID = sampleID;
		sampleExists = true;
	};
</script>

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else}
	{#if woName}<div>Workout Name: {woName}</div>{/if}
	<div>Dynamic Stretch Warmup:</div>
	{#each strRounds.dynamic.times as time, i}
		<div>
			<span>{Math.round(time)}s: &nbsp;</span>
			<span>{strRounds.dynamic.titles[i]}</span>
			<button
				on:click={() => {
					showCurrentSample(strRounds.dynamic.samples[i]);
				}}>&#x2139;</button
			>
		</div>
	{/each}
	<div>{Math.round(strRounds.rest)}s: Rest before workout</div>
	<br />

	<div>Workout Rounds</div>
	{#each woRounds as round, i}
		<div>
			<div>Round {round.round}: {round.sets} Sets</div>
			<div>Start: {Math.floor(round.start / 60)}m {Math.round(round.start % 60)}s</div>
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
				</div>
			{/each}
			<div>Rest before next round: {Math.round(round.roundrest)}</div>
		</div>
	{/each}
	<br />

	<div>Static Stretch Cooldown:</div>
	{#each strRounds.static.times as time, i}
		<div>
			<span>{Math.round(time)}s: &nbsp;</span>
			<span>{strRounds.static.titles[i]}</span>
			<button
				on:click={() => {
					showCurrentSample(strRounds.static.samples[i]);
				}}>&#x2139;</button
			>
		</div>
	{/each}
	{#if sampleExists}
		<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
	{/if}
{/if}

<div>
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD
</div>
