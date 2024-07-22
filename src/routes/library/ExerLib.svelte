<script>
	// @ts-nocheck

	import Sample from '../../popups/Sample.svelte';
	import ExerEntry from './ExerEntry.svelte';

	export let library = null;
	export let current = 'Exercise';
	export let loading = false;

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

	function switchType(type) {
		if (current !== type) {
			current = type;
		}
	}
</script>

<div class="topper">
	<div class="partialtop">
		<button class="changebutton" on:click={() => switchType('Exercise')}>
			{#if current === 'Exercise'}<b>Exercises</b>{:else}Exercises{/if}
		</button>
		<button class="changebutton" on:click={() => switchType('Stretch')}>
			{#if current === 'Stretch'}<b>Stretches</b>{:else}Stretches{/if}
		</button>
	</div>

	<div class="partialtop">
		<span>&nbsp;&nbsp;Filter by:&nbsp;&nbsp;</span>
		<select bind:value={filter}>
			<option value="">All Exercises</option>
			{#each exercises as exercise}
				<option value={exercise}>{exercise}</option>
			{/each}
		</select>
	</div>
</div>

<div class="grid">
	{#each library.filter((entry) => filter === '' || entry.Parent === filter) as entry (entry.ID)}
		<ExerEntry {entry} bind:sampleID bind:sampleEx={sampleExists} bind:loading  />
	{/each}

	{#if sampleExists}
		<Sample backendID={sampleID} bind:exists={sampleExists} bind:loading  />
	{/if}
</div>

<style>
	select {
		/* height: 32px; */
		border-radius: 0;
		color: inherit;
		font-size: inherit;
		/* background-color: inherit; */
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
		padding: 6px;
	}

	.grid {
		margin-top: 5px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		gap: 0px;
		width: 100%;
	}

	.changebutton {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin-left: 4px;
		margin-right: 4px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		background-color: var(--main-color);
		color: white;
		font-weight: normal;
	}

	.topper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		/* margin-bottom: 16px; */
	}

	.partialtop {
		margin-bottom: 16px;
	}
</style>
