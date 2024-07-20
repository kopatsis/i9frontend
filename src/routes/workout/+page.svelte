<script>
	// @ts-nocheck
	import { workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ActiveStrWo from './ActiveStrWO.svelte';
	import ActiveIntroWo from './ActiveIntroWO.svelte';
	import ActiveWo from './ActiveWO.svelte';
	import { goto } from '$app/navigation';
	import { setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;

	let type = '';
	let error;
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});
	onDestroy(unsubscribe);

	function mountCall() {
		let check = workoutTypeSession();
		if (check === null) {
			error = 'No workout type existing';
		}

		sessionStorage.removeItem('reqType');
		sessionStorage.removeItem('reqBody');

		loading = false;
	}

	onMount(() => {
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
	<div class="loading" id="loader" style="display: none">
		<div class="bouncer">
			<img src="/images/i9logotsp.png" alt="sdafa" />
		</div>
		<div class="loader2"></div>
	</div>
{:else if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else if type === 'Stretch'}
	<ActiveStrWo />
{:else if type === 'Intro'}
	<ActiveIntroWo />
{:else}
	<ActiveWo />
{/if}

<style>
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
