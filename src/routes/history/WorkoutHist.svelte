<script>
	// @ts-nocheck

	import Sample from '../Sample.svelte';
	import WorkoutEntry from './WorkoutEntry.svelte';

	export let history = null;
	let sampleID = '';

</script>

{#each history as entry (entry.ID)}
	<WorkoutEntry {entry} bind:sampleID />
{/each}

{#if sampleID && sampleID !== ''}
	<button on:click={() => (sampleID = '')}>&times;</button>
	<Sample backendID={sampleID} />
{/if}
