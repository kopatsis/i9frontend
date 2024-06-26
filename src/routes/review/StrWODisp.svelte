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
			<div>Dynamic Stretches:</div>
			<div class="inner">
				<div class="grid">
					{#each strRounds.dynamic.times as time, i}
						<div>{Math.round(time)}s</div>
						<div>{strRounds.dynamic.titles[i]}</div>
						<div>
							<button
								on:click={() => {
									showCurrentSample(strRounds.dynamic.samples[i]);
								}}>&#x2139;</button
							>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div>Static Stretches:</div>
			<div class="inner">
				<div class="grid">
					{#each strRounds.static.times as time, i}
						<div>{Math.round(time)}s</div>
						<div>{strRounds.static.titles[i]}</div>
						<div>
							<button
								on:click={() => {
									showCurrentSample(strRounds.static.samples[i]);
								}}>&#x2139;</button
							>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if sampleExists}
			<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
		{/if}
	{/if}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: max-content 1fr max-content;
		gap: 1px;
		background-color: rgb(228, 228, 228);
	}
	.grid > div {
		padding: 6px;
		background: white;
	}
	.rounddisp {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow-y: hidden;
	}

	.inner {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		border: 1px solid rgb(137, 151, 155);
		overflow-y: auto;
		flex: 1;
		padding: 6px;
	}
</style>
