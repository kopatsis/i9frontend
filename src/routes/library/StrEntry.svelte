<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { blockChange } from '$lib/jshelp/postuserpsec';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { stretches } from '$lib/stores/library';

	export let entry;
	// export let bodyP;
	export let sampleID;
	export let sampleType;
	export let sampleEx = false;
	let editstat = false;

	let blocked;
	let oldblocked;

	async function postChanges() {
		try {
			if (oldblocked !== blocked) {
				const token = await getLoginToken();
				if (blocked) {
					await blockChange(token, entry.ID, 'PATCH', 'strs');
				} else {
					await blockChange(token, entry.ID, 'DELETE', 'strs');
				}
				oldblocked = blocked;
				stretches.update((items) =>
					items.map((i) => (i.ID === entry.ID ? { ...i, Blocked: oldblocked } : i))
				);
			}
		} catch (error) {
			console.log(error);
		} finally {
			editstat = false;
		}
	}

	onMount(() => {
		oldblocked = entry.Blocked;
		blocked = entry.Blocked;
	});
</script>

<div class="strentry">
	<button
		class="sampleb"
		on:click={() => {
			sampleType = entry.Type === 'Static' ? 'static' : 'dynamic';
			sampleID = entry.ID;
			sampleEx = true;
		}}>&#x2139;</button
	>

	<div>Name: {entry.Name}</div>
	<div>Type: {entry.Type}</div>
	<!-- <div>
	Body Parts Used: {#each entry.BodyParts as p, i (p)}
		<span
			>{bodyP[p]}
			{#if i !== entry.BodyParts.length - 1},
			{/if}</span
		>
	{/each}
</div> -->

	<div>Blocked: {entry.Blocked}</div>
	<div class="editb">
		<button on:click={() => (editstat = !editstat)}>Edit</button>
	</div>
	{#if editstat}
		<div class="editstat">
			<div>
				<input type="checkbox" name="blocked" bind:value={blocked} />
				<label for="blocked">Block Stretch</label>
			</div>

			{#if oldblocked !== blocked}
				<button on:click={postChanges}>Submit Changes</button>
			{/if}
			<button on:click={() => (editstat = false)}>Discard</button>
		</div>
	{/if}
</div>

<style>
	.strentry {
		padding: 5px;
		margin: 5px;
		width: 175px;
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
	}

	.sampleb {
		float: right;
	}

	.editb {
		display: flex;
		justify-content: center;
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		padding: 4px;
		padding-left: 8px;
		padding-right: 8px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.editstat {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
