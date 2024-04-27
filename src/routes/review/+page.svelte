<script>
	// @ts-nocheck
	import { workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { goto } from '$app/navigation';
	import { getLoginState } from '$lib/jshelp/localtoken';

	let type;
	let error = '';
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});
	onDestroy(unsubscribe);

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		}

		workoutTypeSession();
		if (!type) {
			error = 'No workout type existing';
		}
	});
</script>

{#if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else if type === 'Stretch'}
	<ReviewStrWo />
{:else}
	<ReviewWo />
{/if}

<button on:click={() => goto('./workout')}>Proceed</button>
<button on:click={() => goto('./')}>Discard</button>
