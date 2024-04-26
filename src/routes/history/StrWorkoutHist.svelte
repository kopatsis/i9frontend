<script>
	// @ts-nocheck

	import StrEntry from "../library/StrEntry.svelte";

	export let history = null;

</script>

{#each history as entry (entry.ID)}
	<StrEntry {entry} />
{/each}