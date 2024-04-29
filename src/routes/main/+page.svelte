<script>
	import { goto } from '$app/navigation';
	import { setLocalLoginState } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../Logout.svelte';
	import CreateForm from './CreateForm.svelte';
	import { adaptID, creationType } from '$lib/stores/creation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';

	let loading = true;
	let local = false;
	// @ts-ignore
	let firebaseUser = undefined;

	let type = 'Regular';
	const unsubscribeType = creationType.subscribe((creationType) => {
		type = creationType;
	});

	let id;
	const unsubscribeID = adaptID.subscribe((adaptID) => {
		id = adaptID;
	});

	onDestroy(() => {
		unsubscribeType();
		unsubscribeID();
	});

	onMount(() => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			local = value;
			// @ts-ignore
			if (local && !firebaseUser) {
				loading = false;
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
			firebaseUser = value;
			if (firebaseUser === undefined && !local) {
				loading = true;
			} else if (firebaseUser === null && !local) {
				goto('./login');
			} else if (firebaseUser) {
				loading = false;
			}
		});

		return () => {
			unsubLocalLogin();
			unsubFirebase();
		};
	});
</script>

<Logout />

{#if loading}
	<div>loading...</div>
{:else}
	{#if type !== 'Adapt'}
		<button
			on:click={() => {
				if (type !== 'Regular') {
					creationType.set('Regular');
				}
			}}>Regular</button
		>
		<button
			on:click={() => {
				if (type !== 'Stretch') {
					creationType.set('Stretch');
				}
			}}>Stretch</button
		>
		<button
			on:click={() => {
				if (type !== 'Intro') {
					creationType.set('Intro');
				}
			}}>Intro</button
		>
	{/if}

	{#if adaptID}
		<CreateForm formType={type} />
	{:else}
		<CreateForm formType={type} workoutID={adaptID} />
	{/if}
{/if}
