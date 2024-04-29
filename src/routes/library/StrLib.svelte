<script>
	// @ts-nocheck

	import Sample from '../Sample.svelte';
	import StrEntry from './StrEntry.svelte';

	export let library = null;
	let sampleID = '';
	let sampleType = 'static';
	let filter = '';

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

	const types = [
		'Dynamic',
		'Static',
	];
</script>

<select bind:value={filter}>
	<option value="">All</option>
	{#each types as type}
		<option value={type}>{type}</option>
	{/each}
</select>

{#each library.filter((entry) => filter === '' || entry.Type === filter) as entry (entry.ID)}
	<StrEntry {entry} {bodyP} bind:sampleID bind:sampleType/>
{/each}

{#if sampleID && sampleID !== ''}
	<button on:click={() => (sampleID = '')}>&times;</button>
	<Sample backendID={sampleID} type={sampleType}/>
{/if}
