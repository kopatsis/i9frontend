<script>
// @ts-nocheck

	import Sample from "../Sample.svelte";
import StrEntry from "./StrEntry.svelte";

	export let library = null;
    let sampleID = '';

	const bodyP = [
		null,
		'Left Calf',
		'Right Calf',
		'Left Quad',
		'Right Quad',
		'Left Hamstring',
		'Right Hamstring',
		'Glutes',
		'Abs',
		'Lower Back',
		'Upper Back',
		'Left Bicep',
		'Right Bicep',
		'Left Tricep',
		'Right Tricep',
		'Left Shoulder',
		'Right Shoulder',
		'Neck',
		'Chest',
		'Left Hip',
		'Right Hip'
	];
</script>

{#each library as entry (entry.ID)}
	<StrEntry entry={entry} bodyP={bodyP} bind:sampleID={sampleID}/>
{/each}

{#if sampleID && sampleID !== ''}
    <button on:click={() => sampleID = ''}>&times;</button>
    <Sample backendID={sampleID}/>
{/if}