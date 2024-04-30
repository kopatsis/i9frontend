<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import StrEntry from '../library/StrEntry.svelte';

	export let history = null;
</script>

{#if !history || history.length < 1}
	<div>No workouts in your history (yet)</div>
	<button on:click={() => goto('./main')}>Start one now</button>
{:else}
	{#each history as entry (entry.ID)}
		<StrEntry {entry} />
	{/each}
{/if}
