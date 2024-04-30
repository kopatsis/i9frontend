<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import WorkoutEntry from './WorkoutEntry.svelte';

	export let history = null;
</script>

{#if !history || history.length < 1}
	<div>No workouts in your history (yet)</div>
	<button on:click={() => goto('./main')}>Start one now</button>
{:else}
	{#each history as entry (entry.ID)}
		<WorkoutEntry {entry} />
	{/each}
{/if}
