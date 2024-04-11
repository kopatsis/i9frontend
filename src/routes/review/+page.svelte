<script>
	// @ts-nocheck
	import { workoutType } from '$lib/stores/workout.js';
	import { onDestroy } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { goto } from '$app/navigation';

	let type;
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});
	onDestroy(unsubscribe);



</script>

{#if type === 'Stretch'}
	<ReviewStrWo />
{:else}
	<ReviewWo />
{/if}

<button on:click={() => goto('./workout')}>Proceed</button>
<button on:click={() => goto('./')}>Discard</button>


