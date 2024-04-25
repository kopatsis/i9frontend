<script>
	// @ts-nocheck

    import ExerEntry from "./ExerEntry.svelte"

	export let library = null;

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
	<ExerEntry entry={entry} bodyP={bodyP}/>
{/each}
