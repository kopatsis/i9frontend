<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { user, getUser } from '$lib/stores/user.js';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../components/Logout.svelte';
	import Setting from '../components/Setting.svelte';
	import { goto } from '$app/navigation';
	import SettingBackground from '../components/SettingBackground.svelte';

	let loading = true;
	let error = '';
	let retrievedSettings = null;

	let userData;
	const unsubscribe = user.subscribe((value) => {
		userData = value;
	});
	onDestroy(unsubscribe);

	async function mountCall() {
		try {
			let retset = JSON.parse(localStorage.getItem('yZgvPlBiFb'));
			if (!retset) {
				retset = { mode: 'Dark Mode', sound: 'Regular', motion: 'Regular', data: 'Regular' };
				localStorage.setItem('yZgvPlBiFb', JSON.stringify(retset));
			}
			retrievedSettings = retset;
		} catch (error) {
			let retset = { mode: 'Dark Mode', sound: 'Regular', motion: 'Regular', data: 'Regular' };
			localStorage.setItem('yZgvPlBiFb', JSON.stringify(retset));
			retrievedSettings = retset;
		}

		try {
			const token = await getLoginToken();
			error = await getUser(token);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		mountCall();
	});
</script>

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
{:else if !userData}
	<div>Error fetching user data, please try again</div>
{:else}
	<button on:click={() => goto('./')}>Home</button><br />
	<Setting key={'mode'} options={['Dark Mode', 'Light Mode']} bind:data={retrievedSettings} />
	<Setting key={'sound'} options={['Regular', 'Silent']} bind:data={retrievedSettings} />
	<Setting key={'motion'} options={['Regular', 'Reduced']} bind:data={retrievedSettings} />
	<Setting key={'data'} options={['Regular', 'Data Saver']} bind:data={retrievedSettings} />
	<br />
	<SettingBackground />
	<br />
	{#if userData.Paying}
		<button>Cancel subscription</button>
	{:else}
		<button>Start subscription</button>
	{/if}
	<Logout />
{/if}
