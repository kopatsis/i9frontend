<script>
	// @ts-nocheck

	import WorkoutEntry from './WorkoutEntry.svelte';

	export let history = null;

</script>

{#each history as entry (entry.ID)}
	<WorkoutEntry {entry} />
{/each}

