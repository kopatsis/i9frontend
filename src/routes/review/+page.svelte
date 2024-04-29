<script>
	// @ts-nocheck
	import { workoutType, workoutTypeSession } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { goto } from '$app/navigation';
	import { getLoginState, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';

	let local = false;
	let firebaseUser = undefined;

	let type;
	let error = '';
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});
	onDestroy(unsubscribe);

	function mountCall() {
		workoutTypeSession();
			if (!type) {
				error = 'No workout type existing';
			}
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

{#if error}
	<div>F: {error}</div>
	<button on:click={() => goto('./')}>Go Home</button>
{:else if type === 'Stretch'}
	<ReviewStrWo />
{:else}
	<ReviewWo />
{/if}

<button on:click={() => goto('./workout')}>Proceed</button>
<button on:click={() => goto('./')}>Discard</button>
