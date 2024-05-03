<script>
	// @ts-nocheck

	import { workouts, strworkouts, getHistory } from '$lib/stores/history';
	import { onDestroy, onMount } from 'svelte';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
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
			const token = await getLoginToken();
			await getHistory(token);
			console.log(wos, strwos);
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
			if (firebaseUser === undefined && !local) {
				loading = true;
			} else if (firebaseUser === null && !local) {
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
<button on:click={() => goto('./')}>Home</button><button on:click={() => goto('./library')}>Library</button><br>
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
