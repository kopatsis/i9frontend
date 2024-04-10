<script>
	// @ts-nocheck
	import { workoutType } from '$lib/stores/workout.js';
	import { onDestroy } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { fetchAllSamples } from '$lib/jshelp/fetchsample';
	import Sample from '../Sample.svelte';

	let type;
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});
	onDestroy(unsubscribe);

	// Del later
	let samples
	const tempQuery = () => {
		try {
			samples = fetchAllSamples()
		} catch(error){
			console.error(error);
		}
	}
	tempQuery();
	let i = 0;
	let interval = null;
	let time = 0;
	function startStopwatch() {
		if (interval === null) {
			interval = setInterval(() => {
				time += 1;
			}, 1000);
		}
	}
	startStopwatch();
	$: if(time >= 20){
		time = 0
		i++
	}
</script>

{#if type === 'Stretch'}
	<!-- <ReviewStrWo /> -->
{:else}
	<!-- <ReviewWo /> -->
{/if}

<!-- Del later -->
<div>TEMP:</div>
<Sample sampleID={samples[i].ID} />

