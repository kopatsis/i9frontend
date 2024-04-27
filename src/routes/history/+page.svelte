<script>
	// @ts-nocheck

	import { workouts, strworkouts, getHistory } from '$lib/stores/library';
	import { onDestroy, onMount } from 'svelte';
	import { getLoginState, getLoginToken } from '$lib/jshelp/localtoken';
	import Logout from '../Logout.svelte';
	import WorkoutHist from './WorkoutHist.svelte';
	import StrWorkoutHist from './StrWorkoutHist.svelte';
	import { goto } from '$app/navigation';

	let current = 'Workout';
	let loading = true;
	let error = '';

	let wos;
	const unsubscribeWO = workouts.subscribe((workouts) => {
		wos = workouts;
	});

	let strwos;
	const unsubscribeStrWO = strworkouts.subscribe((strworkouts) => {
		strwos = strworkouts;
	});

	onDestroy(() => {
		unsubscribeWO();
		unsubscribeStrWO();
	});

	onMount(async () => {
		if(!getLoginState()){
			goto('./login');
		}
		try {
			const token = getLoginToken();
			await getHistory(token);
			loading = false;
		} catch (err) {
			error = err;
		}
	});
</script>

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
{:else}
	<button
		on:click={() => {
			if (current !== 'Workout') {
				current = 'Workout';
			}
		}}
		>{#if current === 'Workout'}+{/if}Workouts</button
	>
	<button
		on:click={() => {
			if (current !== 'Stretch') {
				current = 'Stretch';
			}
		}}
		>{#if current === 'Stretch'}+{/if}Stretch Workouts</button
	>

	{#if current === 'Workout'}
		<WorkoutHist history={wos} />
	{:else}
		<StrWorkoutHist history={strwos} />
	{/if}
{/if}
<Logout />
