<script>
	// @ts-nocheck

	import { name, strRoundsSt, strRoundsStSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import Sample from '../Sample.svelte';
	import { goto } from '$app/navigation';

	let error = '';
	let sampleExists = false;
	let loading = true;

	let workout;
	const unsubscribe = strRoundsSt.subscribe((strRoundsSt) => {
		workout = strRoundsSt;
	});

	let woName = '';
	const unsubscribeName = name.subscribe((name) => {
		woName = name;
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeName();
	});

	onMount(() => {
		strRoundsStSession();
		if (!workout) {
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
