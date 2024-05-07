<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import CreateForm from './CreateForm.svelte';
	import { user, getUser } from '$lib/stores/user.js';
	import { adaptID, creationType } from '$lib/stores/creation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';

	let loading = true;
	let local = false;
	let error = '';
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

	let userData;
	const unsubscribeUser = user.subscribe((value) => {
		userData = value;
	});

	onDestroy(() => {
		unsubscribeType();
		unsubscribeID();
		unsubscribeUser();
	});

	async function mountCall() {
		const token = await getLoginToken();
		error = await getUser(token);
		loading = false;
	}

	onMount(() => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			local = value;
			// @ts-ignore
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
	<button on:click={() => goto('./')}>Discard</button><br />
	{#if type !== 'Adapt'}
		{#if userData.Assessed}
			<button
				on:click={() => {
					if (type !== 'Regular') {
						creationType.set('Regular');
					}
				}}>Regular</button
			>
		{/if}
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
		<CreateForm formType={type} {userData} />
	{:else}
		<CreateForm formType={type} {userData} workoutID={adaptID} />
	{/if}
{/if}
