<script>
	// @ts-nocheck

	import { exercises, getLibrary, stretches } from '$lib/stores/library';
	import { onDestroy, onMount } from 'svelte';
	import ExerLib from './ExerLib.svelte';
	import StrLib from './StrLib.svelte';
	import Logout from '../Logout.svelte';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import { goto } from '$app/navigation';

	let current = 'Exercise';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;
	let error = '';

	let exers;
	const unsubscribeEx = exercises.subscribe((exercises) => {
		exers = exercises;
	});

	let strs;
	const unsubscribeSt = stretches.subscribe((stretches) => {
		strs = stretches;
	});

	onDestroy(() => {
		unsubscribeEx();
		unsubscribeSt();
	});

	async function mountCall() {
		try {
			const token = await getLoginToken();
			await getLibrary(token);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	onMount( () => {
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
{:else}
<button on:click={() => goto('./')}>Home</button><button on:click={() => goto('./history')}>History</button><br>
	<button
		on:click={() => {
			if (current !== 'Exercise') {
				current = 'Exercise';
			}
		}}
		>{#if current === 'Exercise'}+{/if}Exercises</button
	>
	<button
		on:click={() => {
			if (current !== 'Stretch') {
				current = 'Stretch';
			}
		}}
		>{#if current === 'Stretch'}+{/if}Stretches</button
	>

	{#if current === 'Exercise'}
		<ExerLib library={exers} />
	{:else}
		<StrLib library={strs} />
	{/if}
{/if}
<Logout />
