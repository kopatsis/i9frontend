<script>
	import { goto } from '$app/navigation';
	import { getLoginState, getLoginToken } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import Logout from './Logout.svelte';
	import { afterWOMessage } from '$lib/stores/workout';

	// @ts-nocheck

	let token = '';

	let afterWOMTrue = false;
	const unsubscribe = afterWOMessage.subscribe((afterWOMessage) => {
		afterWOMTrue = afterWOMessage;
	});

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		}

		token = getLoginToken();
		console.log(token);
		console.log(getLoginState());
	});

	onDestroy(() => {
		afterWOMessage.set(false);
		unsubscribe();
	})
</script>

<h1>Welcome to i9 lol</h1>
{#if afterWOMTrue}
	<div>Congrats!</div>
{/if}
<button on:click={() => goto('./main')}>Form</button>
<button on:click={() => goto('./review')}>Sample</button>
<Logout />
