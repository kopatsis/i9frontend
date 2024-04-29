<script>
	import { goto } from '$app/navigation';
	import { getLoginState } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import Logout from '../Logout.svelte';
	import CreateForm from './CreateForm.svelte';
	import { adaptID, creationType } from '$lib/stores/creation';

	let loading = true;

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
		if (!getLoginState()) {
			goto('./login');
		} else {
			loading = false;
		}
	});
</script>

<Logout />

{#if loading}
	<div>loading...</div>
{:else}
	<!-- <button
		on:click={() => {
			if (type !== 'Regular') {
				type = 'Regular';
			}
		}}>Regular</button
	>
	<button
		on:click={() => {
			if (type !== 'Stretch') {
				type = 'Stretch';
			}
		}}>Stretch</button
	>
	<button
		on:click={() => {
			if (type !== 'Intro') {
				type = 'Intro';
			}
		}}>Intro</button
	> -->

	{#if adaptID}
		<CreateForm formType={type} />
	{:else}
		<CreateForm formType={type} workoutID={adaptID} />
	{/if}
{/if}
