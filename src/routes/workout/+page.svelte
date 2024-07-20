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
