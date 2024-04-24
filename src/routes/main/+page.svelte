<script>
	import { goto } from '$app/navigation';
	import { getLoginState, getLoginToken } from '$lib/jshelp/localtoken';
	import { onMount } from 'svelte';
	import Logout from '../Logout.svelte';
	import CreateForm from './CreateForm.svelte';

	let token = '';
	let loading = true;
	let type = 'Regular';

	onMount(() => {
		if (!getLoginState()) {
			goto('./login');
		}

		token = getLoginToken();

		console.log(token);
		loading = false;
	});
</script>

<Logout />

{#if loading}
	<div>loading...</div>
{:else}
	<button
		on:click={() => {
			if (type !== 'Regular') {
				type = 'Regular';
			}
		}}>Regular</button
	>
	<button
		on:click={() => {
			if (type !== 'Stretch') {
				type = 'Stretch';
			}
		}}>Stretch</button
	>
	<button
		on:click={() => {
			if (type !== 'Intro') {
				type = 'Intro';
			}
		}}>Intro</button
	>

	<CreateForm {token} formType={type} />
{/if}
