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
	import {
		fetchRetryIntroWorkout,
		fetchRetryStretchWorkout,
		fetchRetryWorkout
	} from '$lib/jshelp/discardretry';
	import { get } from 'svelte/store';
	import { unravelstretchWO, unravelWO } from '$lib/jshelp/unravelwo';
	import { extractImageList } from '$lib/jshelp/fetchwo';
	import { preloadImages } from '$lib/jshelp/preloader';

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

	function cleanup() {
		sessionStorage.removeItem('reqType');
		sessionStorage.removeItem('reqBody');
		unsubscribe();
		unsubscribeUser();
	}

	async function mountCall() {
		let check = workoutTypeSession();
		if (check === null) {
			error = 'No workout type existing';
		}

		const token = await getLoginToken();
		await getUser(token, true);

		status = userObj && userObj.Paying && userObj.Paying === true ? 'Paid' : 'Unpaid';

		retryType = sessionStorage.getItem('reqType');
		if (
			(retryType === 'Regular' || retryType === 'Intro' || retryType === 'Stretch') &&
			sessionStorage.getItem('reqBody')
		) {
			reversable = true;
		}

		loading = false;
	}

	async function retryRequest() {
		loading = true;

		try {
			let workout;
			const token = await getLoginToken();

			let oldID = get(id);
			if (!oldID) {
				throw new Error(
					'Error properly fetching initial workout id in attempt to discard and retry'
				);
			}

			if (retryType === 'Regular') {
				const body = JSON.parse(sessionStorage.getItem('reqBody'));
				if (!body || !body.time || !body.diff) {
					throw new Error(
						'Error properly fetching initial workout request body in attempt to discard and retry'
					);
				}
				workout = await fetchRetryWorkout(token, body.time, body.diff, oldID);
			} else if (retryType === 'Stretch') {
				const body = JSON.parse(sessionStorage.getItem('reqBody'));
				if (!body || !body.time) {
					throw new Error(
						'Error properly fetching initial stretch workout request body in attempt to discard and retry'
					);
				}
				workout = await fetchRetryStretchWorkout(token, body.time, oldID);
			} else {
				const body = JSON.parse(sessionStorage.getItem('reqBody'));
				if (!body || !body.time) {
					throw new Error(
						'Error properly fetching initial intro workout request body in attempt to discard and retry'
					);
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
			cleanup();
			unsubLocalLogin();
			unsubFirebase();
		};
	});
</script>

<div class="centerpage">
	<div class="wholepage">
		{#if loading}
			<div class="loading">
				<div class="bouncer">
					<img src="/images/i9logotsp.png" alt="sdafa" />
				</div>
				<div class="loader2"></div>
			</div>
		{/if}

		<div div class="header">
			<MainHeader />
		</div>

		<div class="headerstupid">
			{#if error}
				<div>F: {error}</div>
				<button on:click={() => goto('./')}>Go Home</button>
			{:else if type === 'Stretch'}
				<ReviewStrWo bind:loading {status} />
			{:else}
				<ReviewWo bind:loading {status} />
			{/if}
			{#if !loading && !error}
				<div class="submit">
					<button
						on:click={() => {
							cleanup();
							goto('./');
						}}>Exit</button
					>
					{#if reversable}
						<button on:click={retryRequest} class="textsmaller">Discard & Try Again</button>
					{/if}
					<button on:click={() => goto('./workout')}>Proceed</button>
				</div>
			{/if}
		</div>

		{#if !loading && !error && status === 'Unpaid'}
			<div class="ad">
				<div class="innerad">
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
					AD AD AD AD AD AD AD AD AD
				</div>
			</div>
		{/if}
	</div>
</div>

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

	.centerpage {
		display: flex;
		align-items: center;
		justify-content: center;
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
		background: rgba(236, 241, 243, 0.85);
		box-shadow:
			rgba(0, 0, 0, 0.25) 0px 54px 55px,
			rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px,
			rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	@media (max-width: 960px) {
		.wholepage {
			background: rgba(236, 241, 243, 0.8);
		}
	}

	.centerpage::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgb(36, 4, 48) 0%,
			rgba(0, 0, 0, 1) 50%,
			rgb(1, 26, 24) 100%
		);
		z-index: -2;
	}

	.centerpage::after {
		content: '';
		position: absolute;
		top: -300%;
		left: -300%;
		width: 600%;
		height: 600%;
		background-image: url('/images/bgminitr2.png');
		background-repeat: repeat;
		background-size: 121px 51px;
		transform: rotate(45deg);
		transform-origin: center;
		z-index: -1;
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
		height: min(37.5dvh, 56.25dvw);
		overflow-y: auto;
		background-color: rgb(46, 46, 46);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.innerad {
		width: min(100%, 66.67dvh);
		height: 100%;
		overflow-y: auto;
		background-color: white;
		margin: 0;
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
		background-color: white;
		font-weight: normal;
	}

	.textsmaller {
		font-size: 16px;
	}

	@media (max-width: 390px) {
		.textsmaller {
			font-size: 12px;
			line-height: 1;
		}
	}

	@media (max-width: 500px) {
		.textsmaller {
			font-size: 14px;
			line-height: 1;
		}
	}
</style>
