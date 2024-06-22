<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { user, getUser } from '$lib/stores/user.js';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../components/Logout.svelte';
	import Setting from '../components/Setting.svelte';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/jshelp/localtoken';
	// import SettingBackground from '../components/SettingBackground.svelte';

	export let dispSettings = true;

	let loading = true;
	let error = '';
	let retrievedSettings = null;

	let localuser = false;
	const unsubLocalLogin = localLogin.subscribe((value) => {
		localuser = value;
	});

	function closerAny() {
		dispSettings = false;
	}

	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closerAny();
		}
	}

	function handleKeydownOuter(event) {
		if (event.key === 'Enter') {
			closerAny();
		}
	}

	async function getCode() {
		try {
			const response = await fetch(`${import.meta.env.VITE_ADMIN_URL}/code`);
			if (!response.ok) {
				throw new Error('Failed to fetch code');
			}
			const data = await response.json();
			return data.code;
		} catch (err) {
			throw new Error(`Error fetching code: ${err.message}`);
		}
	}

	async function getToken() {
		try {
			const token = await getLoginToken();
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/refresh`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!response.ok) {
				throw new Error('Failed to fetch code');
			}
			const data = await response.json();
			return data.token;
		} catch (err) {
			throw new Error(`Error fetching code: ${err.message}`);
		}
	}

	async function adminPage(dest="home") {
		if (!localuser) {
			try {
				const userPromise = getToken();
				const codePromise = getCode();

				let [refreshToken, code] = await Promise.all([userPromise, codePromise]);

				refreshToken = refreshToken === "" ? "x1" : refreshToken;

				if (refreshToken && code) {
					const url = new URL(`${import.meta.env.VITE_ADMIN_URL}/multipass`);
					url.searchParams.set('multipass', refreshToken);
					url.searchParams.set('code', code);
					url.searchParams.set('dest', dest);

					window.open(url.toString(), '_blank');
				} else {
					throw new Error('Failed to get refresh token or code');
				}
			} catch (err) {
				console.error(`Error opening admin page: ${err.message}`);
			}
		}
	}

	function localMerge(){
		sessionStorage.setItem('merginglocal', 'true');
		logout();
		goto('./login');
	}

	let userData;
	const unsubscribe = user.subscribe((value) => {
		userData = value;
	});
	onDestroy(() => {
		unsubscribe;
		unsubLocalLogin();
	});

	async function mountCall() {
		window.addEventListener('keydown', handleKeydown);

		try {
			let retset = {
				theme: localStorage.getItem('theme'),
				sound: localStorage.getItem('sound'),
				motion: localStorage.getItem('motion'),
				data: localStorage.getItem('data'),
				back: localStorage.getItem('back')
			};
			if (!retset.theme || !retset.sound || !retset.motion || !retset.data || !retset.back) {
				retset = {
					theme: 'Dark Mode',
					sound: 'Regular',
					motion: 'Regular',
					data: 'Regular',
					back: 'Workout Pauses'
				};
				localStorage.setItem('theme', retset.mode);
				localStorage.setItem('sound', retset.sound);
				localStorage.setItem('motion', retset.motion);
				localStorage.setItem('data', retset.data);
				localStorage.setItem('back', retset.back);
			}
			retrievedSettings = retset;
		} catch (error) {
			let retset = {
				theme: 'Dark Mode',
				sound: 'Regular',
				motion: 'Regular',
				data: 'Regular',
				back: 'Workout Pauses'
			};
			localStorage.setItem('theme', retset.mode);
			localStorage.setItem('sound', retset.sound);
			localStorage.setItem('motion', retset.motion);
			localStorage.setItem('data', retset.data);
			localStorage.setItem('back', retset.back);
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
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	}

	onMount(async () => {
		mountCall();
	});
</script>

<div
	class="backdrop"
	on:click={closerAny}
	tabindex="0"
	on:keydown={handleKeydownOuter}
	role="button"
	aria-label="Close modal"
>
	<div class="modal" on:click|stopPropagation aria-hidden="true">
		{#if loading}
			<div>loading...</div>
		{:else if error}
			<div>F: {error}</div>
		{:else if !userData}
			<div>Error fetching user data, please try again</div>
		{:else}
			<div class="head">Device Settings</div>

			<div class="plainbuttons">
				<Logout />
			</div>

			<Setting key={'theme'} options={['Dark Mode', 'Light Mode']} bind:data={retrievedSettings} />
			<Setting key={'sound'} options={['Regular', 'Silent']} bind:data={retrievedSettings} />
			<Setting key={'motion'} options={['Regular', 'Reduced']} bind:data={retrievedSettings} />
			<Setting key={'data'} options={['Regular', 'Data Saver']} bind:data={retrievedSettings} />
			<Setting
				key={'back'}
				options={['Workout Pauses', 'Workout Continutes']}
				bind:data={retrievedSettings}
			/>
			<!-- {#if userData.Paying} -->
			<!-- <SettingBackground /> -->
			<!-- {/if} -->
			{#if !localuser}
			<div class="plainbuttons">
				<button on:click={adminPage} class="link-button">Account Admin Page</button>
			</div>
			{/if}
			<div class="plainbuttons">
				{#if !localuser}
					{#if userData.Paying}
						<button class="actionbutton" on:click={() => adminPage('pay')}>Cancel Giga Subscription</button>
					{:else}
						<button class="actionbutton" on:click={() => adminPage('pay')}>Start Giga Subscription</button>
					{/if}
				{:else}
					<button class="actionbutton" on:click={localMerge}>Create Account w/ Existing History</button>
				{/if}
			</div>
		{/if}
		<div class="plainbuttons">
			<button class="closebutton" on:click={() => (dispSettings = false)}>^</button>
		</div>
	</div>
</div>

<style>
	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		text-decoration: underline;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
	}
	.head {
		width: 100%;
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 15px;
	}
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.44);
		display: flex;
		justify-content: center;
		align-items: baseline;
		z-index: 15;
		cursor: pointer;
	}

	.modal {
		margin: 0;
		margin-top: 44px;
		padding: 15px;
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 20;
		overflow-y: scroll;
		cursor: default;
		max-height: 80dvh;
		width: 100dvw;
		padding-bottom: 0px;
	}

	.plainbuttons {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.actionbutton {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.closebutton {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		font-size: 36px;
	}
</style>
