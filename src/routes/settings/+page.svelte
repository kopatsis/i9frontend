<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { user, getUser } from '$lib/stores/user.js';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../Logout.svelte';
	import Setting from './Setting.svelte';

	let loading = true;
	let error = '';
	let retrievedSettings = null;

	let userData;
	const unsubscribe = user.subscribe((value) => {
		userData = value;
	});
	onDestroy(unsubscribe);

	onMount(async () => {
		if(!getLoginState()){
			goto('./login');
		}
		try {
			let retset = JSON.parse(localStorage.getItem('yZgvPlBiFb'));
			if (!retset) {
				retset = { mode: 'Dark Mode', sound: 'Regular', motion: 'Regular', data: 'Regular' };
				localStorage.setItem('yZgvPlBiFb', JSON.stringify(retset));
			}
			retrievedSettings = retset;
			const token = getLoginToken();
			error = await getUser(token);
		} catch (error) {
			error = error;
		}
		loading = false;
	});
</script>

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
{:else if !userData}
	<div>Error fetching user data, please try again</div>
{:else}
	<Setting key={'mode'} options={['Dark Mode', 'Light Mode']} bind:data={retrievedSettings} />
	<Setting key={'sound'} options={['Regular', 'Silent']} bind:data={retrievedSettings} />
	<Setting key={'motion'} options={['Regular', 'Reduced']} bind:data={retrievedSettings} />
	<Setting key={'data'} options={['Regular', 'Data Saver']} bind:data={retrievedSettings} />
	{#if userData.Paying}
		<button>Cancel subscription</button>
	{:else}
		<button>Start subscription</button>
	{/if}
	<Logout />
{/if}
