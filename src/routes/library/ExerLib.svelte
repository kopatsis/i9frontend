<script>
	// @ts-nocheck

	import Sample from '../Sample.svelte';
	import ExerEntry from './ExerEntry.svelte';

	export let library = null;
	let sampleID = '';
	let filter = '';
	let sampleExists = false;

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

	const exercises = [
		'Pushups',
		'Squats',
		'Burpees',
		'Jumps',
		'Lunges',
		'Mountain Climbers',
		'Abs',
		'Bridges',
		'Kicks',
		'Planks',
		'Supermans'
	];

	$: if (sampleID) {
		sampleExists = true;
	}
</script>

<select bind:value={filter}>
	<option value="">All</option>
	{#each exercises as exercise}
		<option value={exercise}>{exercise}</option>
	{/each}
</select>

{#each library.filter((entry) => filter === '' || entry.Parent === filter) as entry (entry.ID)}
	<ExerEntry {entry} {bodyP} bind:sampleID bind:sampleEx={sampleExists} />
{/each}

{#if sampleExists}
	<Sample backendID={sampleID} bind:exists={sampleExists} />
{/if}
