<script>
	// @ts-nocheck
	import Sample from '../../popups/Sample.svelte';

	export let strRounds = null;
	export let disp = 'Dynamic';

	let sampleExists = false;
	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		currentSampleID = sampleID;
		sampleExists = true;
	};

</script>

<div class="rounddisp">
	{#if strRounds}
		{#if disp === 'Dynamic'}
			<div>Dynamic Stretch Warmup:</div>
			{#each strRounds.dynamic.times as time, i}
				<div>
					<span>{Math.round(time)}s: &nbsp;</span>
					<span>{strRounds.dynamic.titles[i]}</span>
					<button
						on:click={() => {
							showCurrentSample(strRounds.dynamic.samples[i]);
						}}>&#x2139;</button
					>
				</div>
			{/each}
		{:else}
			<div>Static Stretch Cooldown:</div>
			{#each strRounds.static.times as time, i}
				<div>
					<span>{Math.round(time)}s: &nbsp;</span>
					<span>{strRounds.static.titles[i]}</span>
					<button
						on:click={() => {
							showCurrentSample(strRounds.static.samples[i]);
						}}>&#x2139;</button
					>
				</div>
			{/each}
		{/if}

		{#if sampleExists}
			<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
		{/if}
	{/if}
</div>

<style>
    .rounddisp{
        flex: 1;
        overflow-y: scroll;
    }
</style>