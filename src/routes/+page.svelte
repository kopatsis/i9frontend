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
	import { getUser, user } from '$lib/stores/user';
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

	let woType;
	const unsubscribeWO = workoutType.subscribe((workout) => {
		woType = workout;
	});

	let woName = '';
	const unsubscribeName = name.subscribe((name) => {
		woName = name;
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

	async function mountCall() {
		const token = await getLoginToken();
		console.log(token);
		getUser(token);
		uname = userObj && userObj.Name ? userObj.Name : '';
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
		unsubscribeWO();
		unsubscribeName();
		unsubscribeRating();
		unsubscribeCreate();
	});
</script>

<MainHeader />
{#if loading}
	<div>loading...</div>
{:else}
	{#if ratingPop}
		<Rate />
	{:else if createPop}
		<CreateFormPop />
	{/if}

	{#if afterWOMTrue}
		<div>
			Nice job{#if !uname || uname === 'local'}!{:else}, {uname}!{/if}
		</div>
	{:else}
		<div>
			Welcome{#if !uname || uname === 'local'}!{:else}, {uname}!{/if}
		</div>
	{/if}

	{#if woType}
		<button on:click={() => goto('./review')}>Return to last {woType} workout ({woName})</button>
	{/if}

	{#if !showForm}
		<button on:click={() => (showForm = true)}>Edit Defaults</button>
	{:else}
		<UserUpdateForm bind:exists={showForm} />
	{/if}

	{#if userObj?.Assessed}<button on:click={() => workoutGen('Regular')}>Generate Workout</button
		>{/if}
	<button on:click={() => workoutGen('Stretch')}>Stretch Workout</button>
	<button on:click={() => workoutGen('Intro')}>Assessment Workout</button>
	<br />
{/if}

<MainFooter />
