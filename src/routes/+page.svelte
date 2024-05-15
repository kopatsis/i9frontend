<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import {
		afterWOMessage,
		name,
		nameSession,
		workoutType,
		workoutTypeSession
	} from '$lib/stores/workout';
	import { getUser, user, getLastWO, lastWO } from '$lib/stores/user';
	import UserUpdateForm from '../popups/UserUpdateForm.svelte';
	import { creationType, isCreateForm, isRating, ratingSession } from '$lib/stores/creation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import MainFooter from '../components/MainFooter.svelte';
	import MainHeader from '../components/MainHeader.svelte';
	import Rate from '../popups/Rate.svelte';
	import CreateFormPop from '../popups/CreateFormPop.svelte';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;

	let uname = '';
	let showForm = false;

	let afterWOMTrue = false;
	const unsubscribe = afterWOMessage.subscribe((afterWOMessage) => {
		afterWOMTrue = afterWOMessage;
	});

	let userObj;
	const unsubscribeUser = user.subscribe((user) => {
		userObj = user;
	});

	let recentWO;
	const unsubWO = lastWO.subscribe((wo) => {
		recentWO = wo;
	});

	let ratingPop = false;
	const unsubscribeRating = isRating.subscribe((rating) => {
		ratingPop = rating;
	});

	let createPop = false;
	const unsubscribeCreate = isCreateForm.subscribe((create) => {
		createPop = create;
	});

	function workoutGen(type) {
		creationType.set(type);
		isCreateForm.set(true);
	}

	function formatDateString(isoDateString) {
		const date = new Date(isoDateString);
		return date.toLocaleString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
	}

	async function mountCall() {
		const token = await getLoginToken();
		console.log(token);
		await Promise.all([getUser(token), getLastWO(token)]);
		uname = userObj && userObj.Name ? userObj.Name : '';
		console.log(uname);
		workoutTypeSession();
		nameSession();
		ratingSession();
		loading = false;
	}

	onMount(() => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			console.log('local sub run: ', value);
			local = value;
			if (local && !firebaseUser) {
				console.log('trigger?');
				mountCall();
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
			console.log('firebase sub run: ', value, localLogin);
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

	onDestroy(() => {
		afterWOMessage.set(false);
		unsubscribeUser();
		unsubscribe();
		unsubWO();
		unsubscribeRating();
		unsubscribeCreate();
	});
</script>

<MainHeader />
<div class="headerstupid">
	{#if loading}
		<div>loading...</div>
	{:else}
		{#if ratingPop}
			<Rate />
		{:else if createPop}
			<CreateFormPop />
		{:else if showForm}
			<UserUpdateForm bind:exists={showForm} />
		{/if}

		{#if afterWOMTrue}
			<div class="greeting">
				Nice job{#if !uname || uname === 'local'}!{:else}, {uname}!{/if}
			</div>
		{:else}
			<div class="greeting">
				<div>
					Welcome{#if !uname || uname === 'local'}!{:else},{/if}
				</div>
				{#if uname && uname !== 'local'}
					<div>
						{uname}
					</div>
				{/if}
			</div>
		{/if}

		<div>
			<button class="gen" on:click={() => workoutGen('Regular')}>Generate Workout</button>
		</div>

		<div>
			<div>
				<button class="edit" on:click={() => (showForm = true)}>Edit Defaults</button>
			</div>
		</div>

		<div>
			{#if recentWO}
				<div>Your most recent workout details:</div>
				<div>Name: {recentWO.name}</div>
				<div>Type: {recentWO.type} workout</div>
				<div>Date: {formatDateString(recentWO.date)}</div>
				<div>Status: {recentWO.status}</div>
				{#if recentWO.stored === true}
				<div>
					<button on:click={() => goto('./review')}>Return to Workout</button>
				</div>
				{/if}
			{:else}
				<div>No workouts generated (yet)</div>
			{/if}
		</div>
		
	{/if}
</div>
<MainFooter />

<style>
	.gen {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 24px;
		margin: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.edit {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.headerstupid {
		margin-top: 49px;
		margin-bottom: 44px;
		margin-left: 5px;
		margin-right: 5px;
		height: calc(100dvh - 93px);
		width: calc(100dvw - 10px);
		box-sizing: border-box;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
	}

	.greeting {
		font-size: 48px;
		font-weight: lighter;
		text-align: center;
	}
</style>
