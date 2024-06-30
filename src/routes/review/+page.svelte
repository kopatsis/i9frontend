<script>
	// @ts-nocheck
	import { wipeWorkout, workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { goto } from '$app/navigation';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import MainHeader from '../../components/MainHeader.svelte';
	import { getUser, user } from '$lib/stores/user';

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
		if (retryType === 'Regular' || retryType === 'Intro' || retryType === 'Stretch') {
			reversable = true;
		}

		loading = false;
	}

	async function retryRequest() {
		wipeWorkout();
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
