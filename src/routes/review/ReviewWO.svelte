<script>
	// @ts-nocheck

	import {
		name,
		strRoundsSt,
		strRoundsStSession,
		workoutRoundsSt,
		workoutRoundsStSession
	} from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import WoDisp from './WODisp.svelte';

	export let status = 'Unpaid';

	let error;
	let strRounds;
	let loading = true;

	const unsubscribeSt = strRoundsSt.subscribe((strRoundsSt) => {
		strRounds = strRoundsSt;
		console.log(strRounds);
	});

	let woRounds;
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
		console.log(woRounds);
	});

	let woName = '';
	const unsubscribeName = name.subscribe((name) => {
		woName = name;
	});

	let iterator = 0;

	function contentAdj(plus = true) {
		if (plus) {
			if (!(iterator === 4 && status === 'Paid') && !(iterator === 10)) {
				iterator++;
			}
		} else {
			if (!(iterator === 0)) {
				iterator--;
			}
		}
	}

	onDestroy(() => {
		unsubscribeSt();
		unsubscribeWO();
		unsubscribeName();
	});

	onMount(() => {
		let check = workoutRoundsStSession();
		if (check === null) {
			error = 'No workout existing';
		}
		check = strRoundsStSession();
		if (check === null) {
			error = 'No workout existing';
		}

		loading = false;
	});
</script>

{#if loading}
	<div class="loading" id="loader" style="display: none">
		<div class="bouncer">
			<img src="/images/i9logotsp.png" alt="sdafa" />
		</div>
		<div class="loader2"></div>
	</div>
{:else if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else}
	{#if woName}<div class="name"><b>Workout Name: {woName}</b></div>{/if}
	<div class="content">
		<button class="back arr" on:click={() => contentAdj(false)}>
			{#if iterator === 0}&nbsp;{:else}&lt;{/if}
		</button>
		<WoDisp {woRounds} {strRounds} {status} {iterator} />
		<button class="forw arr" on:click={contentAdj}>
			{#if (iterator === 4 && status === 'Paid') || iterator === 10}&nbsp;{:else}&gt;{/if}
		</button>
	</div>
{/if}

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

	.name {
		text-align: center;
	}

	.content {
		display: flex;
		flex: 1;
		overflow-y: hidden;
	}

	.arr {
		width: fit-content;
		height: 100%;
		background-color: beige;
		border: none;
		border-radius: none;
	}
</style>
