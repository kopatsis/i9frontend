<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { user, getUser } from '$lib/stores/user.js';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../components/Logout.svelte';
	import Setting from '../components/Setting.svelte';
	import SettingBackground from '../components/SettingBackground.svelte';

	export let dispSettings = true;

	let loading = true;
	let error = '';
	let retrievedSettings = null;

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

	let userData;
	const unsubscribe = user.subscribe((value) => {
		userData = value;
	});
	onDestroy(unsubscribe);

	async function mountCall() {
		window.addEventListener('keydown', handleKeydown);

		try {
			let retset = {
				theme: JSON.parse(localStorage.getItem('theme')),
				sound: JSON.parse(localStorage.getItem('sound')),
				motion: JSON.parse(localStorage.getItem('motion')),
				data: JSON.parse(localStorage.getItem('data')),
				back: JSON.parse(localStorage.getItem('back'))
			};
			if (!retset.theme || !retset.sound || !retset.motion || !retset.data || !retset.back) {
				retset = {
					theme: 'Dark Mode',
					sound: 'Regular',
					motion: 'Regular',
					data: 'Regular',
					back: 'WO Pauses'
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
				back: 'WO Pauses'
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
			<div class="head">User Settings</div>
			<Setting key={'theme'} options={['Dark Mode', 'Light Mode']} bind:data={retrievedSettings} />
			<Setting key={'sound'} options={['Regular', 'Silent']} bind:data={retrievedSettings} />
			<Setting key={'motion'} options={['Regular', 'Reduced']} bind:data={retrievedSettings} />
			<Setting key={'data'} options={['Regular', 'Data Saver']} bind:data={retrievedSettings} />
			<Setting key={'back'} options={['Workout Pauses', 'Workout Continutes']} bind:data={retrievedSettings} />
			<!-- {#if userData.Paying} -->
			<!-- <SettingBackground /> -->
			<!-- {/if} -->
			<div class="plainbuttons">
				{#if userData.Paying}
					<button class="actionbutton">Cancel Giga Subscription</button>
				{:else}
					<button class="actionbutton">Start Giga Subscription</button>
				{/if}
			</div>

			<div class="plainbuttons">
				<Logout />
			</div>
		{/if}
		<div class="plainbuttons">
			<button class="closebutton" on:click={() => (dispSettings = false)}>^</button>
		</div>
	</div>
</div>

<style>
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
