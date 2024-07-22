<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { postRating } from '$lib/jshelp/postwo';
	import { ratingFalse } from '$lib/stores/creation';
	import {
		rounds,
		workoutRoundsSt,
		id,
		workoutRoundsStSession,
		roundsSession,
		wipeWorkout,
		afterWOMessage
	} from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import Modal from '../templates/Modal.svelte';
	import { getLastWO } from '$lib/stores/user';
	import RateSlider from '../components/RateSlider.svelte';

	export let loading = true;
	let asWhole = true;
	let retWhole = 5;
	let favWhole = 3;

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

	let transitionTime = 3;

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

	function mountCall() {
		for (let i = 0; i < roundsComplete; i++) {
			retVals.push(5);
			favVals.push(3);
		}
		roundsSession();
		let check = workoutRoundsStSession();
		if (check === null) {
			roundsComplete = 0;
		}

		loading = false;
	}

	onMount(() => {
		mountCall();
	});

	function close() {
		loading = true;
		afterWOMessage.set(true);
		loading = false;
		ratingFalse();
	}

	async function postAndExit() {
		loading = true;
		try {
			const token = await getLoginToken();
			const woID = get(id);
			await postRating(token, woID, retVals, favVals, retWhole, favWhole, asWhole);
			wipeWorkout();
			await getLastWO(token);
			afterWOMessage.set(true);
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
			ratingFalse();
		}
	}
</script>

<Modal closerFunc={postAndExit}>
	<div class="main">
		{#if roundsComplete < 1}
			<div on:load={countDown}>No rounds to display, routing to home page in {transitionTime}</div>
		{:else if woRounds}
			<div class="closeline">
				<button class="link-button" on:click={close}>&times;</button>
			</div>
			<div class="minihead">Nice Job :)</div>
			<img class="mergediff"
				src="https://i9imgs.sfo3.cdn.digitaloceanspaces.com/cgts2.png"
				alt="thumbs up standing with smile"
			/>
			<div class="choices">
				<button on:click={() => (asWhole = true)}
					>{#if asWhole}<b>Rate WO as a Whole</b>{:else}Rate WO as a Whole{/if}</button
				>
				<button on:click={() => (asWhole = false)}
					>{#if asWhole}Rate Each Round{:else}<b>Rate Each Round</b>{/if}</button
				>
			</div>

			<div class="holdslider">
				<div>How HARD was it, on a scale of 0 to 10 (0 easiest, 10 hardest):</div>
				<RateSlider bind:number={retWhole} />
			</div>
			<div class="holdslider">
				<div>How FUN was it, on a scale of 0 to 10 (0 most fun, 10 least):</div>
				<RateSlider bind:number={favWhole} />
			</div>
			{#if !asWhole}
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
					<div class="holdslider">
						<div>How HARD was it, on a scale of 0 to 10 (0 easiest, 10 hardest):</div>
						<RateSlider bind:number={retVals[i]} />
					</div>
					<div class="holdslider">
						<div>How FUN was it, on a scale of 0 to 10 (0 most fun, 10 least):</div>
						<RateSlider bind:number={favVals[i]} />
					</div>
				{/each}
			{/if}

			<button on:click={postAndExit}>Submit</button>
		{:else}
			<div>Error loading past workout</div>
		{/if}
	</div>
</Modal>

<style>
	.mergediff {
		height: clamp(250px, min(60dvw, 60dvh), 1000px);
		width: clamp(250px, min(60dvw, 60dvh), 1000px);
		aspect-ratio: 1/1;
	}

	.minihead {
		font-size: 1.5em;
	}

	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		font-size: 24px;
	}

	.closeline {
		display: flex;
		justify-content: right;
		width: 100%;
	}

	.choices {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.choices button {
		flex: 1;
		margin: 6px;
		font-size: 16px;
		max-width: 500px;
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.main {
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.holdslider {
		margin: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
