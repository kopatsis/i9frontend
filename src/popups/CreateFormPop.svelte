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
				<CreateForm formType={type} {userData} />
			{:else}
				<CreateForm formType={type} {userData} workoutID={adaptID} />
			{/if}
		{/if}
	</div>
</Modal>

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
		color: inherit;
		background-color: transparent;
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
