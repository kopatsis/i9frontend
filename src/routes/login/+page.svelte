<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLocalToken, loginLocally, setLoginToken } from '$lib/jshelp/localtoken';
	import { onMount } from 'svelte';
	import Signin from './Signin.svelte';
	import Signup from './Signup.svelte';
	import { colorCheckers } from '$lib/jshelp/colors';

	let signUpForm = false;
	let merging = false;
	let localToken = '';

	let loading = true;

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
		colorCheckers();
		if (sessionStorage.getItem('merginglocal') === 'true' && getLocalToken() !== '') {
			merging = true;
			localToken = getLocalToken();
			sessionStorage.removeItem('merginglocal');
			signUpForm = true;
		}
	});
</script>

<div class="centerpage">
	<div class="wholepage">
		{#if loading}
			<div class="loading">
				<div class="bouncer">
					<img src="/images/i9logotsp.png" alt="sdafa" />
				</div>
				<div class="loader2"></div>
			</div>
		{/if}

		<div class="loghead header">
			<b class="logheadtxt">i9 Fitness</b>
		</div>

		<div class="innercontent">
			{#if !signUpForm}
				<Signin bind:signUp={signUpForm} bind:loading />
			{:else}
				<Signup bind:signUp={signUpForm} bind:merging {localToken} bind:loading />
			{/if}
		</div>

		<div class="footer">
			{#if merging}
				<button class="link-button" on:click={localLogin}>Back to i9 App</button>
			{:else}
				<button class="link-button" on:click={localLogin}>Use without account (anonymous)</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.centerpage {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		background-color: rgb(97, 97, 97);
		width: 100dvw;
		height: 100dvh;
	}

	.wholepage {
		height: 100dvh;
		width: min(100dvw, 960px);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: fixed;
		background: rgba(236, 241, 243, 0.85);
		box-shadow:
			rgba(0, 0, 0, 0.25) 0px 54px 55px,
			rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px,
			rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	@media (max-width: 960px) {
		.wholepage {
			background: rgba(236, 241, 243, 0.8);
		}
	}

	.centerpage::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgb(36, 4, 48) 0%,
			rgba(0, 0, 0, 1) 50%,
			rgb(1, 26, 24) 100%
		);
		z-index: -2;
	}

	.centerpage::after {
		content: '';
		position: absolute;
		top: -300%;
		left: -300%;
		width: 600%;
		height: 600%;
		background-image: url('/images/bgminitr2.png');
		background-repeat: repeat;
		background-size: 121px 51px;
		transform: rotate(45deg);
		transform-origin: center;
		z-index: -1;
	}

	.header,
	.footer {
		width: 100%;
	}

	.footer {
		padding-top: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(to top, white 67%, transparent);
	}

	.innercontent {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		width: 100%;
		align-items: center;
		margin-bottom: -20px;
		padding-bottom: 25px;
	}

	.link-button {
		background: transparent;
		border: none;
		color: rgb(59, 59, 59);
		text-decoration: underline;
		cursor: pointer;
		/* padding: 0; */
		font-family: inherit;
		/* position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%); */
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
		user-select: none;
	}

	.bouncer {
		padding: 10px;
		padding-top: 20px;
	}

	.bouncer img {
		height: auto;
		width: clamp(100px, 50dvw, 300px);
		animation: bounce 0.6s infinite;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(218, 229, 225, 0.85);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2000;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-25px);
			animation-timing-function: cubic-bezier(0.62, 0.1, 0.62, 1.21);
		}
	}

	.loader2 {
		width: 50px;
		aspect-ratio: 1;
		display: grid;
		border-radius: 50%;
		background:
			linear-gradient(0deg, rgb(0 0 0/50%) 30%, #0000 0 70%, rgb(0 0 0/100%) 0) 50%/8% 100%,
			linear-gradient(90deg, rgb(0 0 0/25%) 30%, #0000 0 70%, rgb(0 0 0/75%) 0) 50%/100% 8%;
		background-repeat: no-repeat;
		animation: l23 0.6s infinite steps(12);
	}
	.loader2::before,
	.loader2::after {
		content: '';
		grid-area: 1/1;
		border-radius: 50%;
		background: inherit;
		opacity: 0.915;
		transform: rotate(30deg);
	}
	.loader2::after {
		opacity: 0.83;
		transform: rotate(60deg);
	}
	@keyframes l23 {
		100% {
			transform: rotate(1turn);
		}
	}
</style>
