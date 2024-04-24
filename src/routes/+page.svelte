<script>
// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginState, getLoginToken } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import Logout from './Logout.svelte';
	import { afterWOMessage } from '$lib/stores/workout';
	import { getUser, user } from '$lib/stores/user';
	import UserUpdateForm from './UserUpdateForm.svelte';

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

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		}

		token = getLoginToken();
		getUser(token);
		name = userObj.Name ? userObj.Name : '';
		console.log(token);
		console.log(getLoginState());
	});

	onDestroy(() => {
		afterWOMessage.set(false);
		unsubscribeUser();
		unsubscribe();
	})
</script>

<h1>Welcome to i9 lol</h1>
{#if afterWOMTrue}
	<div>Nice job{#if !name}!{:else}, {name}!{/if}</div>
{:else}
	<div>Welcome{#if !name}!{:else}, {name}!{/if}</div>
{/if}

{#if !showForm}
	<button on:click={() => showForm = true}>Edit Defaults</button>
{:else}
	<UserUpdateForm token={token} bind:exists={showForm}/>
{/if}

<button on:click={() => goto('./main')}>Form</button>
<button on:click={() => goto('./review')}>Sample</button>
<Logout />
