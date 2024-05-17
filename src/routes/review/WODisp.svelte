<script>
	// @ts-nocheck
	import Sample from '../../popups/Sample.svelte';

	export let strRounds = null;
	export let woRounds = null;
	export let iterator = 0;
	export let status = 'Unpaid';

	let sampleExists = false;
	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		currentSampleID = sampleID;
		sampleExists = true;
	};

	$: start = Math.max(0, (iterator - 1) * 3);
	$: end = Math.min(iterator * 3, woRounds.length);
	$: subarray = woRounds.slice(start, end);
</script>

<div class="rounddisp">
	<div class="inner">
		{#if strRounds && woRounds}
			{#if iterator === 0}
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
				<div><span>{Math.round(strRounds.rest)}s: &nbsp;</span><span>Rest before workout</span></div>
			{:else if (iterator >= 4 && status === 'Paid') || (iterator >= 10 && status == 'Unpaid')}
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
			{:else if status === 'Unpaid'}
				<div>
					<div>Workout Round #{woRounds[iterator - 1].round}</div>
					<div>{woRounds[iterator - 1].sets} Sets</div>
					<div>
						Start: {Math.floor(woRounds[iterator - 1].start / 60)}m {Math.round(
							woRounds[iterator - 1].start % 60
						)}s
					</div>
					<div>
						On: {Math.round(woRounds[iterator - 1].on)} / Off: {Math.round(
							woRounds[iterator - 1].off
						)}
					</div>
					<div>Type: {woRounds[iterator - 1].type}</div>
					{#if woRounds[iterator - 1].type !== 'Combo'}
						<span>
							{woRounds[iterator - 1].reps[0]}
							{#if woRounds[iterator - 1].reps.length > 1}
								- {woRounds[iterator - 1].reps[1]}
							{/if}
							x &nbsp;
						</span>
					{/if}
					{#each woRounds[iterator - 1].samples as sample, j}
						<div>
							{#if woRounds[iterator - 1].type === 'Combo'}
								<span>{woRounds[iterator - 1].reps[j]}x &nbsp;</span>
							{/if}
							<span>{woRounds[iterator - 1].titles[j]}</span>
							<button
								on:click={() => {
									showCurrentSample(sample);
								}}>&#x2139;</button
							>
						</div>
					{/each}
					<div>
						Rest before next round: {Math.round(
							woRounds[iterator - 1].roundrest + woRounds[iterator - 1].off
						)}
					</div>
				</div>
			{:else}
				{#each subarray as round}
					<div>
						<div>Workout Round #{round.round}</div>
						<div>{round.sets} Sets</div>
						<div>Start: {Math.floor(round.start / 60)}m {Math.round(round.start % 60)}s</div>
						<div>On: {Math.round(round.on)} / Off: {Math.round(round.off)}</div>
						<div>Type: {round.type}</div>
						{#if round.type !== 'Combo'}
							<span
								>{round.reps[0]}{#if round.reps.length > 1}-{round.reps[1]}{/if}x &nbsp;</span
							>
						{/if}
						{#each round.samples as sample, j}
							<div>
								{#if round.type === 'Combo'}
									<span>{round.reps[j]}x &nbsp;</span>
								{/if}
								<span>{round.titles[j]}</span>
								<button
									on:click={() => {
										showCurrentSample(sample);
									}}>&#x2139;</button
								>
							</div>
						{/each}
						<div>Rest before next round: {Math.round(round.roundrest + round.off)}</div>
					</div>
				{/each}
			{/if}

			{#if sampleExists}
				<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
			{/if}
		{/if}
	</div>
</div>

<style>
	.rounddisp {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.inner{
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		border: 1px solid rgb(137, 151, 155);
		overflow-y: scroll;
		max-height: 100%;
		padding: 6px;
	}
</style>
