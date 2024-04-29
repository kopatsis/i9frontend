<script>
	// @ts-nocheck

	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { user, getUser } from '$lib/stores/user.js';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../Logout.svelte';
	import Setting from './Setting.svelte';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import { goto } from '$app/navigation';

	let local = false;
	let firebaseUser = undefined;

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
			const token = await getLoginToken();
			error = await getUser(token);
		} catch (error) {
			error = error;
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			local = value;
			if (local && !firebaseUser) {
				mountCall();
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
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
