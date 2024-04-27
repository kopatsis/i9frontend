<script>
	// @ts-nocheck

	import { strRoundsSt, strRoundsStSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import Sample from '../Sample.svelte';
	import { goto } from '$app/navigation';

	let error = '';

	let workout;
	const unsubscribe = strRoundsSt.subscribe((strRoundsSt) => {
		workout = strRoundsSt;
	});

	onDestroy(() => {
		unsubscribe();
	});

	onMount(() => {
		strRoundsStSession();
		if (!workout) {
			error = 'No workout existing';
		}
	});

	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		if (currentSampleID !== sampleID) {
			currentSampleID = sampleID;
		}
	};
</script>

{#if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else}
	<div>Dynamic Stretches:</div>
	{#each workout.dynamic.times as time, i}
		<div>
			<span>{Math.round(time)}s: &nbsp;</span>
			<span>{workout.dynamic.titles[i]}</span>
			<button
				on:click={() => {
					showCurrentSample(workout.dynamic.samples[i]);
				}}>&#x2139;</button
			>
			{#if currentSampleID === workout.dynamic.samples[i]}
				<Sample sampleID={currentSampleID} />
			{/if}
		</div>
	{/each}
	<br />

	<div>Static Stretches:</div>
	{#each workout.static.times as time, i}
		<div>
			<span>{Math.round(time)}s: &nbsp;</span>
			<span>{workout.static.titles[i]}</span>
			<button
				on:click={() => {
					showCurrentSample(workout.static.samples[i]);
				}}>&#x2139;</button
			>
			{#if currentSampleID === workout.static.samples[i]}
				<Sample sampleID={currentSampleID} />
			{/if}
		</div>
	{/each}
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
