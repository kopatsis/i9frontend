<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { user, getUser } from '$lib/stores/user.js';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../components/Logout.svelte';
	import Setting from '../components/Setting.svelte';
	import { localLogin, refreshUserData, userStore } from '$lib/jshelp/firebaseuser';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/jshelp/localtoken';
	import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '../auth/firebase';
	import { fly, fade } from 'svelte/transition';
	// import SettingBackground from '../components/SettingBackground.svelte';

	export let dispSettings = true;

	let loading = true;

	let error = '';
	let retrievedSettings = null;
	let verifEmail = false;
	let passReset = false;

	let localuser = false;
	const unsubLocalLogin = localLogin.subscribe((value) => {
		localuser = value;
	});

	let userVar;
	const unsubUser = userStore.subscribe((user) => {
		userVar = user;
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

	async function getTokenID() {
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
			return data.idcode;
		} catch (err) {
			throw new Error(`Error fetching code: ${err.message}`);
		}
	}

	async function adminPage(dest = 'home') {
		if (!localuser) {
			try {
				const userPromise = getTokenID();
				const codePromise = getCode();

				let [refreshToken, code] = await Promise.all([userPromise, codePromise]);

				refreshToken = refreshToken === '' ? 'x1' : refreshToken;

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

	function localMerge() {
		sessionStorage.setItem('merginglocal', 'true');
		logout();
		goto('./login');
	}

	async function sendVerification() {
		if (userVar) {
			try {
				await sendEmailVerification(userVar);
				verifEmail = true;
			} catch (err) {
				console.error(err);
			}
		}
	}

	async function sendReset() {
		if (userVar) {
			try {
				await sendPasswordResetEmail(auth, userVar.email);
				passReset = true;
			} catch (err) {
				console.error(err);
			}
		}
	}

	let headerHeight = 26;

	function updateSizes() {
		const size = Math.min(window.innerWidth, window.innerHeight);
		headerHeight = Math.max(20, Math.min(50, size * 0.09)) + 6;
	}

	let userData;
	const unsubscribe = user.subscribe((value) => {
		userData = value;
	});
	onDestroy(() => {
		unsubscribe();
		unsubLocalLogin();
		unsubUser();
		window.removeEventListener('resize', updateSizes);
	});

	async function mountCall() {
		window.addEventListener('keydown', handleKeydown);

		try {
			let retset = {
				theme: localStorage.getItem('bWEemu'),
				colors: localStorage.getItem('12h4cwe'),
				sound: localStorage.getItem('W8xMSC'),
				motion: localStorage.getItem('wJJgce'),
				data: localStorage.getItem('RMrC28'),
				back: localStorage.getItem('szsY0s')
			};
			if (
				!retset.theme ||
				!retset.colors ||
				!retset.sound ||
				!retset.motion ||
				!retset.data ||
				!retset.back
			) {
				retset = {
					theme: 'DceYdZ',
					colors: '3ojnKb',
					sound: 'DceYdZ',
					motion: '3ojnKb',
					data: '3ojnKb',
					back: 'DceYdZ'
				};
				localStorage.setItem('bWEemu', retset.theme);
				localStorage.setItem('12h4cwe', retset.colors);
				localStorage.setItem('W8xMSC', retset.sound);
				localStorage.setItem('wJJgce', retset.motion);
				localStorage.setItem('RMrC28', retset.data);
				localStorage.setItem('szsY0s', retset.back);
			}
			retrievedSettings = retset;
		} catch (error) {
			let retset = {
				theme: 'DceYdZ',
				colors: '3ojnKb',
				sound: 'DceYdZ',
				motion: '3ojnKb',
				data: '3ojnKb',
				back: 'DceYdZ'
			};
			localStorage.setItem('bWEemu', retset.theme);
			localStorage.setItem('12h4cwe', retset.colors);
			localStorage.setItem('W8xMSC', retset.sound);
			localStorage.setItem('wJJgce', retset.motion);
			localStorage.setItem('RMrC28', retset.data);
			localStorage.setItem('szsY0s', retset.back);
			retrievedSettings = retset;
		}

		try {
			const token = await getLoginToken();
			error = await getUser(token);
			await refreshUserData();
		} catch (err) {
			error = err;
		} finally {
			loading = false;
			return () => {
				window.removeEventListener('keydown', handleKeydown);
			};
		}
	}

	onMount(async () => {
		mountCall();
		updateSizes();
		window.addEventListener('resize', updateSizes);
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
	<div
		class="modal"
		on:click|stopPropagation
		aria-hidden="true"
		style="margin-top: {headerHeight}px;"
		transition:fly={{ y: -300, duration: 300 }}
	>
		{#if !loading}
			<div class="innercontent">
				{#if error}
					<div>F: {error}</div>
				{:else if !userData}
					<div>Error fetching user data, please try again</div>
				{:else}
					<div class="head">Device Settings</div>

					<div class="plainbuttons">
						{#if !localuser}
							{#if userData.Paying}
								<button class="actionbutton" on:click={() => adminPage('pay')}
									>Cancel Giga Subscription</button
								>
							{:else}
								<button class="actionbutton bigger" on:click={() => adminPage('pay')}
									>Start Giga Subscription</button
								>
							{/if}
						{:else}
							<button class="actionbutton" on:click={localMerge}
								>Create Account w/ Existing History</button
							>
						{/if}
					</div>

					<div class="allopts">
						<Setting key={'theme'} bind:data={retrievedSettings} />
						<Setting key={'colors'} bind:data={retrievedSettings} />
						<Setting key={'sound'} bind:data={retrievedSettings} />
						<Setting key={'motion'} bind:data={retrievedSettings} />
						<Setting key={'data'} bind:data={retrievedSettings} />
						<Setting key={'back'} bind:data={retrievedSettings} />
					</div>

					{#if !localuser}
						<div class="plainbuttons">
							<button on:click={adminPage} class="link-button">Account Admin Page</button>
						</div>
						{#if userVar && !userVar.emailVerified}
							<div class="plainbuttons">
								<button on:click={sendVerification} class="link-button"
									>Send Email Verification</button
								>
							</div>
							{#if verifEmail}
								<div>Nice, check your email and follow the instructions to verify your email.</div>
							{/if}
						{/if}
						{#if userVar}
							<div class="plainbuttons">
								<button on:click={sendReset} class="link-button">Reset Password</button>
							</div>
							{#if passReset}
								<div>
									Nice, check your email and follow the instructions to reset your password.
								</div>
							{/if}
						{/if}
					{/if}

					<div class="plainbuttons">
						<Logout />
					</div>
				{/if}
			</div>
			<div class="plainbuttons bottom">
				<button class="closebutton" on:click={() => (dispSettings = false)}>^</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.allopts {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: fit-content;
		margin: 10px;
	}

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
		font-size: 26px;
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
		margin-top: clamp(53px, 12dvw, 86px);
		/* padding: 15px; */
		background: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 20;
		overflow-y: auto;
		cursor: default;
		/* height: calc(100dvh - clamp(53px, 12dvw, 86px)); */
		width: min(100dvw, 960px);
		padding-bottom: 0px;
		display: flex;
		flex-direction: column;
		scrollbar-width: none;
	}

	.plainbuttons {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.innercontent {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.actionbutton.bigger {
		font-size: 24px;
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
