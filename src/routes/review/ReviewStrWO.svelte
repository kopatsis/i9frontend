<script>
	// @ts-nocheck

	import { strRoundsSt } from '$lib/stores/workout.js';
	import { onDestroy } from 'svelte';
	import Sample from '../Sample.svelte';

	let workout;
	const unsubscribe = strRoundsSt.subscribe((strRoundsSt) => {
		workout = strRoundsSt;
	});

	onDestroy(() => {
		unsubscribe();
	});

	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		if (currentSampleID !== sampleID) {
			currentSampleID = sampleID;
		}
	};
</script>

<div>Dynamic Stretches: </div>
{#each workout.dynamic.times as time, i}
	<div>
		<span>{Math.round(time)}s: &nbsp;</span>
		<span>{workout.dynamic.titles[i]}</span>
		<button
			on:click={() => {
				showCurrentSample(workout.dynamic.samples[i]);
			}}
		>&#x2139;</button>
		{#if currentSampleID === workout.dynamic.samples[i]}
			<Sample sampleID={currentSampleID} />
		{/if}
	</div>
{/each}
<br />

<div>Static Stretches: </div>
{#each workout.static.times as time, i}
	<div>
		<span>{Math.round(time)}s: &nbsp;</span>
		<span>{workout.static.titles[i]}</span>
		<button
			on:click={() => {
				showCurrentSample(workout.static.samples[i]);
			}}
		>&#x2139;</button>
		{#if currentSampleID === workout.static.samples[i]}
			<Sample sampleID={currentSampleID} />
		{/if}
	</div>
{/each}

<div>AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
    AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD 
</div>
