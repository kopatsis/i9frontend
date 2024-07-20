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

	let loading = true;
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
	{#if loading}
		<div class="loading" id="loader" style="display: none">
			<div class="bouncer">
				<img src="/images/i9logotsp.png" alt="sdafa" />
			</div>
			<div class="loader2"></div>
		</div>
	{:else if roundsComplete < 1}
		<div on:load={countDown}>No rounds to display, routing to home page in {transitionTime}</div>
	{:else if woRounds}
		<button on:click={close}>Close</button>
		<h1>Nice Job :)</h1>
		<img
			src="https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-high.webp"
			alt="thumbs up standing with smile"
		/>
		<div>
			<button on:click={() => (asWhole = true)}
				>{#if asWhole}<b>Rate WO as a Whole</b>{:else}Rate WO as a Whole{/if}</button
			>
			<button on:click={() => (asWhole = false)}
				>{#if asWhole}Rate Each Round{:else}<b>Rate Each Round</b>{/if}</button
			>
		</div>

		<div>
			<div>
				<div>How HARD was it, on a scale of 0 to 10 (0 easiest, 10 hardest):</div>
				<RateSlider bind:number={retWhole} />
			</div>
			<div>
				<div>How FUN was it, on a scale of 0 to 10 (0 most fun, 10 least):</div>
				<RateSlider bind:number={favWhole} />
			</div>
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
				<div>
					<div>How HARD was it, on a scale of 0 to 10 (0 easiest, 10 hardest):</div>
					<RateSlider bind:number={retVals[i]} />
				</div>
				<div>
					<div>How FUN was it, on a scale of 0 to 10 (0 most fun, 10 least):</div>
					<RateSlider bind:number={favVals[i]} />
				</div>
			{/each}
		{/if}

		<button on:click={postAndExit}>Submit</button>
	{:else}
		<div>Error loading past workout</div>
	{/if}
</Modal>

<style>
	.bouncer {
		padding: 10px;
		padding-top: 20px;
	}

	.bouncer img {
		height: auto;
		width: clamp(100px, 50dvw, 300px);
		animation: bounce 0.6s infinite;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(218, 229, 225, 0.85);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2000;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-25px);
			animation-timing-function: cubic-bezier(0.62, 0.1, 0.62, 1.21);
		}
	}

	.loader2 {
		width: 50px;
		aspect-ratio: 1;
		display: grid;
		border-radius: 50%;
		background:
			linear-gradient(0deg, rgb(0 0 0/50%) 30%, #0000 0 70%, rgb(0 0 0/100%) 0) 50%/8% 100%,
			linear-gradient(90deg, rgb(0 0 0/25%) 30%, #0000 0 70%, rgb(0 0 0/75%) 0) 50%/100% 8%;
		background-repeat: no-repeat;
		animation: l23 0.6s infinite steps(12);
	}
	.loader2::before,
	.loader2::after {
		content: '';
		grid-area: 1/1;
		border-radius: 50%;
		background: inherit;
		opacity: 0.915;
		transform: rotate(30deg);
	}
	.loader2::after {
		opacity: 0.83;
		transform: rotate(60deg);
	}
	@keyframes l23 {
		100% {
			transform: rotate(1turn);
		}
	}
</style>
