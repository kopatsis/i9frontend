<script>
	// @ts-nocheck

	import { name, strRoundsSt, strRoundsStSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import StrWoDisp from './StrWODisp.svelte';

	let error = '';
	let loading = true;
	let disp = 'Dynamic';

	let workout;
	const unsubscribe = strRoundsSt.subscribe((strRoundsSt) => {
		workout = strRoundsSt;
	});

	let woName = '';
	const unsubscribeName = name.subscribe((name) => {
		woName = name;
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeName();
	});

	onMount(() => {
		strRoundsStSession();
		if (!workout) {
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
	{#if woName}<div class="name">Workout Name: {woName}</div>{/if}
	<div class="content">
		<button class="back arr" on:click={() => disp = 'Dynamic'}>
			{#if disp === 'Dynamic'}&nbsp;{:else}&lt;{/if}
		</button>
		<StrWoDisp strRounds={workout} {disp} />
		<button class="forw arr" on:click={() => disp = 'Static'}>
			{#if disp === 'Static'}&nbsp;{:else}&gt;{/if}
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
		max-height: calc(100% - 25px);
	}

	.arr {
		width: fit-content;
		height: 100%;
		background-color: beige;
		border: none;
		border-radius: none;
	}
</style>