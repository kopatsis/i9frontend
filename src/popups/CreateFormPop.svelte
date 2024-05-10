<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import CreateForm from '../components/CreateForm.svelte';
	import { user, getUser } from '$lib/stores/user.js';
	import { adaptID, creationType, isCreateForm } from '$lib/stores/creation';
	import Modal from '../templates/Modal.svelte';

	let loading = true;
	let error = '';

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
		mountCall();
	});
</script>

<Modal closerFunc={() => isCreateForm.set(false)}>
	<button on:click={() => isCreateForm.set(false)}>Close</button>
	{#if loading}
		<div>loading...</div>
	{:else if error}
		<div>F: {error}</div>
	{:else}
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
				}}
				>{#if userData.Assessed}Re-Assessment{:else}Assessment{/if}</button
			>
		{/if}

		{#if adaptID}
			<CreateForm formType={type} {userData} />
		{:else}
			<CreateForm formType={type} {userData} workoutID={adaptID} />
		{/if}
	{/if}
</Modal>
