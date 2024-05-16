<script>
	// @ts-nocheck

	import Sample from '../../popups/Sample.svelte';
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
</script>

<select bind:value={filter}>
	<option value="">All Exercises</option>
	{#each exercises as exercise}
		<option value={exercise}>{exercise}</option>
	{/each}
</select>

<div class="grid">
	{#each library.filter((entry) => filter === '' || entry.Parent === filter) as entry (entry.ID)}
		<ExerEntry {entry} {bodyP} bind:sampleID bind:sampleEx={sampleExists} />
	{/each}

	{#if sampleExists}
		<Sample backendID={sampleID} bind:exists={sampleExists} />
	{/if}
</div>

<style>
	select {
		height: 32px;
		border-radius: 0;
	}

	.grid {
		margin-top: 5px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0px;
	}
</style>
