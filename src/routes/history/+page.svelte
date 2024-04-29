<script>
	// @ts-nocheck

	import { workouts, strworkouts, getHistory } from '$lib/stores/library';
	import { onDestroy, onMount } from 'svelte';
	import { getLoginState, getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import Logout from '../Logout.svelte';
	import WorkoutHist from './WorkoutHist.svelte';
	import StrWorkoutHist from './StrWorkoutHist.svelte';
	import { goto } from '$app/navigation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';

	let local = false;
	let firebaseUser = undefined;

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

	async function mountCall() {
		try {
			const token = getLoginToken();
			await getHistory(token);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			local = value;
			if (local && !firebaseUser) {
				mountCall();
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
			firebaseUser = value;
			if (firebaseUser === undefined && !localLogin) {
				loading = true;
			} else if (firebaseUser === null && !localLogin) {
				goto('./login');
			} else if (firebaseUser) {
				mountCall();
			}
		});

		return () => {
			unsubLocalLogin();
			unsubFirebase();
		};
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
