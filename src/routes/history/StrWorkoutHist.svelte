<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import StrWorkoutEntry from './StrWorkoutEntry.svelte';

	export let history = null;
	console.log(history);
</script>

{#if !history || history.length < 1}
	<div>No workouts in your history (yet)</div>
	<button on:click={() => goto('./')}>Start one now</button>
{:else}
	{#each history as entry (entry.ID)}
		<StrWorkoutEntry {entry} />
	{/each}
{/if}
