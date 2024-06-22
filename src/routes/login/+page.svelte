<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLocalToken, loginLocally, setLoginToken } from '$lib/jshelp/localtoken';
	import { onMount } from 'svelte';
	import Signin from './Signin.svelte';
	import Signup from './Signup.svelte';

	let signUpForm = false;
	let merging = false;
	let localToken = '';

	async function createLocalUser() {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/local`;

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: 'local' })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			throw new Error('Error creating local user:' + error);
		}
	}

	const localLogin = async () => {
		if (getLocalToken() === '') {
			try {
				const token = await createLocalUser();
				console.log(token.Token);
				setLoginToken(token.Token);
			} catch (error) {
				setLoginToken('');
			}
		}
		loginLocally();
		goto('./');
	};

	onMount(() => {
		if (sessionStorage.getItem('merginglocal') === 'true' && getLocalToken() !== ''){
			merging = true;
			localToken = getLocalToken();
			signUpForm = true;
		}
	})
</script>

<div class="loghead">
	<b class="logheadtxt">i9 Fitness</b>
</div>

{#if !signUpForm}
	<Signin bind:signUp={signUpForm} />
{:else}
	<Signup bind:signUp={signUpForm} bind:merging={merging} localToken={localToken}/>
{/if}
<button class="link-button" on:click={localLogin}>Use without account (anonymous)</button>

<style>
	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		text-decoration: underline;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 16px;
	}

	.link-button:hover,
	.link-button:focus {
		text-decoration: none;
	}

	.loghead {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.logheadtxt {
		font-size: clamp(20px, 10dvw, 54px);
	}
</style>
