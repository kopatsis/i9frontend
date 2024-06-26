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
		console.log(strRounds)
	});

	let woRounds;
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
		console.log(woRounds)
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
	<div>loading...</div>
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
