<script>
	import { goto } from '$app/navigation';
	import { getLoginState, getLoginToken } from '$lib/jshelp/localtoken';
	import { onMount } from 'svelte';
	import Logout from './Logout.svelte';

	// @ts-nocheck

	let token = '';

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		}

		token = getLoginToken();
		console.log(token);
		console.log(getLoginState());
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={() => goto('./main')}>Form</button>
<button on:click={() => goto('./workout')}>Sample</button>
<Logout />
