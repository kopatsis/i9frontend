<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import { afterWOMessage, storedWorkout, storedWorkoutSession } from '$lib/stores/workout';
	import { getUser, user } from '$lib/stores/user';
	import UserUpdateForm from './UserUpdateForm.svelte';
	import { creationType } from '$lib/stores/creation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';

	// @ts-nocheck

	let local = false;
	let firebaseUser = undefined;
	let loading = true;

	let name = '';
	let showForm = false;

	let afterWOMTrue = false;
	const unsubscribe = afterWOMessage.subscribe((afterWOMessage) => {
		afterWOMTrue = afterWOMessage;
	});

	let userObj;
	const unsubscribeUser = user.subscribe((user) => {
		userObj = user;
	});

	// sub to wotype instead
	let lastWO;
	const unsubscribeWO = storedWorkout.subscribe((workout) => {
		lastWO = workout;
	});

	function workoutGen(type) {
		creationType.set(type);
		goto('./main');
	}

	async function mountCall() {
		const token = await getLoginToken();
		console.log(token)
		getUser(token);
		name = userObj && userObj.Name ? userObj.Name : '';
		storedWorkoutSession();
		loading = false;
	}

	onMount(() => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			console.log("local sub run: ", value)
			local = value;
			if (local && !firebaseUser) {
				console.log("trigger?")
				mountCall();
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
			console.log("firebase sub run: ", value, localLogin)
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
	});
</script>

<h1>i9!</h1>
{#if loading}
	<div>loading...</div>
{:else}
	{#if afterWOMTrue}
		<div>
			Nice job{#if !name || name === 'local'}!{:else}, {name}!{/if}
		</div>
	{:else}
		<div>
			Welcome{#if !name || name === 'local'}!{:else}, {name}!{/if}
		</div>
	{/if}

	{#if lastWO}
		<button on:click={goto('./workout')}>Return to last workout</button>
	{/if}

	{#if !showForm}
		<button on:click={() => (showForm = true)}>Edit Defaults</button>
	{:else}
		<UserUpdateForm bind:exists={showForm} />
	{/if}

	<button on:click={() => workoutGen('Regular')}>Generate Workout</button>
	<button on:click={() => workoutGen('Stretch')}>Stretch Workout</button>
	<button on:click={() => workoutGen('Intro')}>Assessment Workout</button>
	<br><button on:click={() => goto('./settings')}>⚙️</button>
{/if}
