<script>
	// @ts-nocheck
	import { workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ActiveStrWo from './ActiveStrWO.svelte';
	import ActiveIntroWo from './ActiveIntroWO.svelte';
	import ActiveWo from './ActiveWO.svelte';
	import { goto } from '$app/navigation';

	let type = '';
	let error;
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
	<ActiveStrWo />
{:else if type === 'Intro'}
	<ActiveIntroWo />
{:else}
	<ActiveWo />
{/if}
