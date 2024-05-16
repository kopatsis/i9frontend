<script>
	// @ts-nocheck
	import { workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { goto } from '$app/navigation';
	import { setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import MainHeader from '../../components/MainHeader.svelte';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;

	let type;
	let error = '';
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
		console.log(type);
	});
	onDestroy(unsubscribe);

	function mountCall() {
		workoutTypeSession();
		if (!type) {
			console.log('ahah!')
			error = 'No workout type existing';
		}
		loading = false;
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

<MainHeader />
<div class="headerstupid">
	{#if loading}
		<div>loading...</div>
	{:else if error}
		<div>F: {error}</div>
		<button on:click={() => goto('./')}>Go Home</button>
	{:else if type === 'Stretch'}
		<ReviewStrWo />
	{:else}
		<ReviewWo />
	{/if}
</div>

<div class="submit">
	<button on:click={() => goto('./')}>Discard</button>
	<button on:click={() => goto('./workout')}>Proceed</button>
</div>

<div class="ad">
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
	AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD
</div>

<style>
	.headerstupid {
		margin-top: 49px;
		margin-left: 5px;
		margin-right: 5px;
		margin-bottom: calc(56.25dvw+49px);
		height: calc(100dvh - 56.25dvw - 98px);
	}

	.submit {
		height: 49px;
		margin-bottom: 56.25dvw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ad {
		width: 100dvw;
		height: 56.25dvw;
		overflow-y: scroll;
		position: absolute;
		bottom: 0;
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
