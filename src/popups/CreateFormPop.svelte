<script>
	// @ts-nocheck

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
	<div class="whole">
		<div class="closeline">
			<button class="link-button" on:click={() => isCreateForm.set(false)}>&times;</button>
		</div>
		{#if loading}
			<div class="loading" id="loader" style="display: none">
				<div class="bouncer">
					<img src="/images/i9logotsp.png" alt="sdafa" />
				</div>
				<div class="loader2"></div>
			</div>
		{:else if error}
			<div>F: {error}</div>
		{:else}
			{#if type !== 'Adapt'}
				<div class="choices">
					{#if userData.Assessed}
						<button
							on:click={() => {
								if (type !== 'Regular') {
									creationType.set('Regular');
								}
							}}
							>{#if type === 'Regular'}<b>Regular</b>{:else}Regular{/if}</button
						>
					{/if}
					<button
						on:click={() => {
							if (type !== 'Stretch') {
								creationType.set('Stretch');
							}
						}}
						>{#if type === 'Stretch'}<b>Stretch</b>{:else}Stretch{/if}</button
					>
					<button
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
				<CreateForm formType={type} {userData} />
			{:else}
				<CreateForm formType={type} {userData} workoutID={adaptID} />
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
		width: 100%;
	}

	.choices button {
		flex: 1;
		margin: 6px;
		font-size: 16px;
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.whole {
		width: 80dvw;
		/* min-height: 35dvh; */
	}
</style>
