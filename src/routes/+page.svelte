<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginState, getLoginToken } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import Logout from './Logout.svelte';
	import { afterWOMessage, storedWorkout, storedWorkoutSession } from '$lib/stores/workout';
	import { getUser, user } from '$lib/stores/user';
	import UserUpdateForm from './UserUpdateForm.svelte';
	import { creationType } from '$lib/stores/creation';

	// @ts-nocheck

	let token = '';
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

	let lastWO;
	const unsubscribeWO = storedWorkout.subscribe((workout) => {
		lastWO = workout;
	});

	function workoutGen(type) {
		creationType.set(type);
		goto('./main');
	}

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		} else {
			token = getLoginToken();
			getUser(token);
			name = (userObj && userObj.Name) ? userObj.Name : '';
			storedWorkoutSession();
		}
	});

	onDestroy(() => {
		afterWOMessage.set(false);
		unsubscribeUser();
		unsubscribe();
		unsubscribeWO();
	});
</script>

<h1>i9!</h1>
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
	<UserUpdateForm {token} bind:exists={showForm} />
{/if}

<button on:click={() => workoutGen('Regular')}>Generate Workout</button>
<button on:click={() => workoutGen('Stretch')}>Stretch Workout</button>
<button on:click={() => workoutGen('Intro')}>Assessment Workout</button>
<Logout />
