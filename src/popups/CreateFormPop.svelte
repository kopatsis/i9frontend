<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import CreateForm from '../components/CreateForm.svelte';
	import { user, getUser } from '$lib/stores/user.js';
	import { adaptID, creationType, isCreateForm } from '$lib/stores/creation';
	import Modal from '../templates/Modal.svelte';

	export let loading = false;
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
	}

	onMount(() => {
		mountCall();
	});
</script>

<Modal closerFunc={() => isCreateForm.set(false)}>
	<div class="whole">
		<div class="closeline">
			<button class="link-button" on:click={() => isCreateForm.set(false)}>&times;</button>
		</div>
		{#if error}
			<div>F: {error}</div>
		{:else}
			{#if type !== 'Adapt'}
				<div class="choices">
					{#if userData.Assessed}
						<button
							class:adjust-small-screen={userData.Assessed}
							on:click={() => {
								if (type !== 'Regular') {
									creationType.set('Regular');
								}
							}}
							>{#if type === 'Regular'}<b>Regular</b>{:else}Regular{/if}</button
						>
					{/if}
					<button
						class:adjust-small-screen={userData.Assessed}
						on:click={() => {
							if (type !== 'Stretch') {
								creationType.set('Stretch');
							}
						}}
						>{#if type === 'Stretch'}<b>Stretch</b>{:else}Stretch{/if}</button
					>
					<button
						class:adjust-small-screen={userData.Assessed}
						on:click={() => {
							if (type !== 'Intro') {
								creationType.set('Intro');
							}
						}}
						>{#if userData.Assessed}{#if type === 'Intro'}<b>Re-Assessment</b
								>{:else}Re-Assessment{/if}{:else if type === 'Intro'}<b>Assessment</b
							>{:else}Assessment{/if}</button
					>
				</div>
			{/if}

			{#if adaptID}
				<CreateForm formType={type} {userData} bind:loading />
			{:else}
				<CreateForm formType={type} {userData} workoutID={adaptID} bind:loading />
			{/if}
		{/if}
	</div>
</Modal>

<style>

	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		font-size: 24px;
	}

	.closeline {
		display: flex;
		justify-content: right;
		width: 100%;
	}

	.choices {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.choices button {
		flex: 1;
		margin: 6px;
		font-size: 16px;
		max-width: 500px;
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		border: 1px solid rgb(137, 151, 155);
		background-color: var(--main-color);
		color: white;
		font-weight: normal;
	}

	/* .whole  {
		min-width: 75dvw;
		min-height: 35dvh;
	} */

	@media (max-width: 500px) {
		.adjust-small-screen {
			margin: 3px;
			font-size: 14px;
		}
	}

	@media (max-width: 350px) {
		.adjust-small-screen {
			margin: 0;
			font-size: 12px;
		}
	}
</style>
