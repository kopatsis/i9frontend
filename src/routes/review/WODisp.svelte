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
	{#if strRounds && woRounds}
		{#if iterator === 0}
			<div>Dynamic Stretch Warmup:</div>
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
					<div>{Math.round(strRounds.rest)}s</div>
					<div>Rest before workout</div>
					<div>&nbsp;</div>
				</div>
			</div>
		{:else if (iterator >= 4 && status === 'Paid') || (iterator >= 10 && status == 'Unpaid')}
			<div>Static Stretch Cooldown:</div>
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
		{:else if status === 'Unpaid'}
			<div>Workout Round #{woRounds[iterator - 1].round}</div>
			<div class="inner">
				<div class="grid2">
					<div>Set Count</div>
					<div>{woRounds[iterator - 1].sets}</div>
					<div>Start Time</div>
					<div>
						{Math.floor(woRounds[iterator - 1].start / 60)}m {Math.round(
							woRounds[iterator - 1].start % 60
						)}s
					</div>
					<div>Exercise Per Set</div>
					<div>{Math.round(woRounds[iterator - 1].on)}s</div>
					<div>Rest Per Set</div>
					<div>{Math.round(woRounds[iterator - 1].off)}s</div>
					<div>Rest Before Next Round</div>
					<div>{Math.round(woRounds[iterator - 1].roundrest + woRounds[iterator - 1].off)}s</div>
					<div>Round Type</div>
					<div>{woRounds[iterator - 1].type}</div>
				</div>
				<div class="grid">
					{#if woRounds[iterator - 1].type !== 'Combo'}
						<div>
							{woRounds[iterator - 1].reps[0]}
							{#if woRounds[iterator - 1].reps.length > 1}
								- {woRounds[iterator - 1].reps[1]}
							{/if}
							x
						</div>
					{/if}
					{#each woRounds[iterator - 1].samples as sample, j}
						{#if woRounds[iterator - 1].type === 'Combo'}
							<div>{woRounds[iterator - 1].reps[j]}x</div>
						{:else if j !== 0}
							<div>&nbsp;</div>
						{/if}
						<div>{woRounds[iterator - 1].titles[j]}</div>
						<div>
							<button
								on:click={() => {
									showCurrentSample(sample);
								}}>&#x2139;</button
							>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			{#each subarray as round}
				<div>Workout Round #{round.round}</div>
				<div class="inner">
					<div class="grid2">
						<div>Set Count</div>
						<div>{round.sets}</div>
						<div>Start Time</div>
						<div>
							{Math.floor(round.start / 60)}m {Math.round(round.start % 60)}
						</div>
						<div>Exercise Per Set</div>
						<div>{Math.round(round.on)}s</div>
						<div>Rest Per Set</div>
						<div>{Math.round(round.off)}s</div>
						<div>Rest Before Next Round</div>
						<div>{Math.round(round.roundrest + round.off)}</div>
						<div>Round Type</div>
						<div>{round.type}</div>
					</div>
					<div class="grid">
						{#if round.type !== 'Combo'}
							<div>
								{round.reps[0]}
								{#if round.reps.length > 1}
									- {round.reps[1]}
								{/if}
								x
							</div>
						{/if}
						{#each round.samples as sample, j}
							{#if round.type === 'Combo'}
								<div>{round.reps[j]}x</div>
							{:else if j !== 0}
								<div>&nbsp;</div>
							{/if}
							<div>{round.titles[j]}</div>
							<div>
								<button
									on:click={() => {
										showCurrentSample(sample);
									}}>&#x2139;</button
								>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		{/if}

		{#if sampleExists}
			<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
		{/if}
	{/if}
</div>

<style>
	.grid2 {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 1px;
		background-color: rgb(228, 228, 228);
	}
	.grid2 > div {
		padding: 6px;
		background: white;
	}
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
