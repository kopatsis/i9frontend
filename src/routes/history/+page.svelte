<script>
	// @ts-nocheck

	import { workouts, strworkouts, getHistory } from '$lib/stores/history';
	import { onDestroy, onMount } from 'svelte';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import WorkoutHist from './WorkoutHist.svelte';
	import StrWorkoutHist from './StrWorkoutHist.svelte';
	import { goto } from '$app/navigation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import MainFooter from '../../components/MainFooter.svelte';
	import MainHeader from '../../components/MainHeader.svelte';

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

	function switchType(type) {
		if (current !== type) {
			current = type;
		}
	}

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

<div class="centerpage">
	<div class="wholepage">
		<div class="header">
			<MainHeader />
		</div>
		<div class="headerstupid">
			{#if loading}
				<div>loading...</div>
			{:else if error}
				<div>F: {error}</div>
			{:else}
				<div class="tabs">
					<button on:click={() => switchType('Workout')}>
						{#if current === 'Workout'}
							<b>Workouts</b>
						{:else}
							Workouts
						{/if}
					</button>
					<button on:click={() => switchType('Stretch')}>
						{#if current === 'Stretch'}
							<b>Strech Workouts</b>
						{:else}
							Strech Workouts
						{/if}
					</button>
				</div>

				{#if current === 'Workout'}
					<WorkoutHist history={wos} />
				{:else}
					<StrWorkoutHist history={strwos} />
				{/if}
			{/if}
		</div>
		<div class="footer">
			<MainFooter />
		</div>
	</div>
</div>

<style>
	.centerpage {
		display: flex;
		align-items: center;
		justify-content: center;
		display: flex;
		position: fixed;
		background-color: rgb(97, 97, 97);
		width: 100dvw;
		height: 100dvh;
	}

	.wholepage {
		height: 100dvh;
		width: min(100dvw, 960px);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: fixed;
		background-color: white;
	}

	.header,
	.footer {
		width: 100%;
	}

	.tabs {
		display: flex;
		justify-content: center;
	}

	.headerstupid {
		margin: 5px;
		flex: 1;
		overflow-y: auto;
	}
	
	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin-left: 4px;
		margin-right: 4px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}
</style>
