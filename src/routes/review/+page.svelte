<script>
	// @ts-nocheck
	import { id, wipeWorkout, workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { goto } from '$app/navigation';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import MainHeader from '../../components/MainHeader.svelte';
	import { getUser, user } from '$lib/stores/user';
	import { fetchRetryIntroWorkout, fetchRetryWorkout } from '$lib/jshelp/discardretry';
	import { get } from 'svelte/store';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;

	let error = '';
	let status = 'Unpaid';
	let reversable = false;
	let retryType = 'Regular';

	let type;
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});

	let userObj;
	const unsubscribeUser = user.subscribe((user) => {
		userObj = user;
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeUser();
	});

	async function mountCall() {
		let check = workoutTypeSession();
		if (check === null) {
			error = 'No workout type existing';
		}

		const token = await getLoginToken();
		await getUser(token, true);

		status = userObj && userObj.Paying && userObj.Paying === true ? 'Paid' : 'Unpaid';

		retryType = sessionStorage.getItem('reqType');
		if ((retryType === 'Regular' || retryType === 'Intro' || retryType === 'Stretch') && sessionStorage.getItem('reqBody')) {
			reversable = true;
		}

		loading = false;
	}

	async function retryRequest() {
		loading = true;

		try {
			let workout;

			let oldID = get(id)
			if (!oldID) {
				throw new Error('Error properly fetching initial workout id in attempt to discard and retry');
			}

			if (retryType === 'Regular') {
				body = JSON.parse(sessionStorage.getItem('reqBody'))
				if (!body || !body.time || !body.diff) {
					throw new Error('Error properly fetching initial workout request body in attempt to discard and retry');
				}
				workout = await fetchRetryWorkout(token, body.time, body.diff, oldID);
			} else if (retryType === 'Stretch') {
				body = JSON.parse(sessionStorage.getItem('reqBody'))
				if (!body || !body.time) {
					throw new Error('Error properly fetching initial stretch workout request body in attempt to discard and retry');
				}
				workout = await fetchRetryIntroWorkout(token, body.time, oldID);
			} else {
				body = JSON.parse(sessionStorage.getItem('reqBody'))
				if (!body || !body.time) {
					throw new Error('Error properly fetching initial intro workout request body in attempt to discard and retry');
				}
				workout = await fetchRetryIntroWorkout(token, body.time, oldID);
			}

			wipeWorkout();

			if (retryType === 'Regular') {
				unravelWO(workout);
			} else if (retryType === 'Stretch') {
				unravelstretchWO(workout);
			} else {
				unravelWO(workout, 'Intro');
			}

			preloadImages(extractImageList(workout));
		} catch (err) {
			error = err
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
		<div div class="header">
			<MainHeader />
		</div>

		<div class="headerstupid">
			{#if loading}
				<div>loading...</div>
			{:else if error}
				<div>F: {error}</div>
				<button on:click={() => goto('./')}>Go Home</button>
			{:else if type === 'Stretch'}
				<ReviewStrWo />
			{:else}
				<ReviewWo {status} />
			{/if}
			{#if !loading && !error}
				<div class="submit">
					<button on:click={() => goto('./')}>Exit</button>
					{#if reversable}
						<button on:click={retryRequest}>Discard & Try Again</button>
					{/if}
					<button on:click={() => goto('./workout')}>Proceed</button>
				</div>
			{/if}
		</div>

		{#if !loading && !error && status === 'Unpaid'}
			<div class="ad">
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
				AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
			</div>
		{/if}
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

	.header {
		width: 100%;
	}

	.headerstupid {
		margin: 5px;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: hidden;
	}

	.submit {
		height: 49px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ad {
		width: 100dvw;
		height: 50dvw;
		overflow-y: auto;
	}

	button {
		flex: 1;
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
