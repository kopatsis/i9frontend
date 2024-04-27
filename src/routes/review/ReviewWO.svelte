<script>
	// @ts-nocheck

	import { strRoundsSt, strRoundsStSession, workoutRoundsSt, workoutRoundsStSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import Sample from '../Sample.svelte';
	import { goto } from '$app/navigation';


	let error;
	let strRounds;
	const unsubscribeSt = strRoundsSt.subscribe((strRoundsSt) => {
		strRounds = strRoundsSt;
	});

	let woRounds;
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
	});

	onDestroy(() => {
		unsubscribeSt();
		unsubscribeWO();
	});

	onMount(() => {
		workoutRoundsStSession();
		if (!woRounds) {
			error = 'No workout existing';
		}
		strRoundsStSession();
		if(!strRounds){
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
		{#if currentSampleID === strRounds.dynamic.samples[i]}
			<Sample sampleID={currentSampleID} />
		{/if}
	</div>
{/each}
<div>{Math.round(strRounds.rest)}s: Rest before workout</div>
<br />

<div>Workout Rounds</div>
{#each woRounds as round, i}
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
		{#if currentSampleID === strRounds.static.samples[i]}
			<Sample sampleID={currentSampleID} />
		{/if}
	</div>
{/each}
{/if}

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
