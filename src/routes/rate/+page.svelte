<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { postRating } from '$lib/jshelp/postwo';
	import {
		rounds,
		workoutRoundsSt,
		id,
		workoutRoundsStSession,
		roundsSession,
		wipeWorkout
	} from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';

	let loading = true;
	let retVals = [];
	let favVals = [];

	let roundsComplete = 0;
	const unsubscribeRounds = rounds.subscribe((rounds) => {
		roundsComplete = rounds;
	});

	let woRounds;
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
	});

	onDestroy(() => {
		unsubscribeRounds();
		unsubscribeWO();
	});

	let transitionTime = 5;

	let intervalId;
	function countDown() {
		if (intervalId) clearInterval(intervalId);
		intervalId = setInterval(() => {
			transitionTime--;
			if (transitionTime === 0) {
				clearInterval(intervalId);
				goto('./');
			}
		}, 1000);
	}

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		} else {
			for (let i = 0; i < roundsComplete; i++) {
				retVals.push(5);
				favVals.push(3);
			}
			roundsSession();
			workoutRoundsStSession();
			if (!woRounds) {
				roundsComplete = 0;
			}

			loading = false;
		}
	});

	async function postAndExit() {
		loading = true;
		const token = getLoginToken();
		const woID = get(id);
		await postRating(token, woID, retVals, favVals);
		wipeWorkout();
		goto('./');
	}
</script>

{#if loading}
	<div>loading...</div>
{:else if roundsComplete < 1}
	<div on:load={countDown}>No rounds to display, routing to home page in {transitionTime}</div>
{:else}
	<button on:click={postAndExit}>Close</button>
	<h1>Nice Job :)</h1>
	<img
		src="https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-high.webp"
		alt="thumbs up standing with smile"
	/>
	{#each woRounds.slice(0, roundsComplete) as round, i}
		<div>
			<div>Round {round.round}: {round.sets} Sets</div>
			<div>Start: {Math.floor(round.start / 60)}m {Math.round(round.start % 60)}s</div>
			<div>On: {Math.round(round.on)} / Off: {Math.round(round.off)}</div>
			<div>Type: {round.type}</div>
			{#if round.type !== 'Combo'}
				<span
					>{round.reps[0]}{#if round.reps.length > 1}-{round.reps[1]}{/if}x &nbsp;</span
				>
			{/if}
			{#each round.titles as title, j}
				<div>
					{#if round.type === 'Combo'}
						<span>{round.reps[j]}x &nbsp;</span>
					{/if}
					<span>{title}</span>
				</div>
			{/each}
			<div>Rest before next round: {Math.round(round.roundrest)}</div>
		</div>
		<div>
			<div>Difficulty Rating:</div>
			<input type="range" min="0" max="10" bind:value={retVals[i]} />
			<input type="number" min="0" max="10" step="0.1" bind:value={retVals[i]} />
		</div>
		<div>
			<div>Enjoyment Rating:</div>
			<input type="range" min="1" max="5" bind:value={favVals[i]} />
			<input type="number" min="1" max="5" step="0.1" bind:value={favVals[i]} />
		</div>
	{/each}
	<button on:click={postAndExit}>Submit</button>
{/if}
