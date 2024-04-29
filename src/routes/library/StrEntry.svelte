<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { blockChange } from '$lib/jshelp/postuserpsec';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { stretches } from '$lib/stores/library';

	export let entry;
	export let bodyP;
	export let sampleID;
	export let sampleType;
	let editstat = false;

	let blocked;
	let oldblocked;

	async function postChanges() {
		try {
			const token = await getLoginToken();
			if (oldblocked !== blocked) {
				if (blocked) {
					await blockChange(token, entry.ID, 'PATCH', 'strs');
				} else {
					await blockChange(token, entry.ID, 'DELETE', 'strs');
				}
				oldblocked = blocked;
			}
			stretches.update((items) =>
				items.map((i) => (i.ID === entry.ID ? { ...i, Blocked: blocked } : i))
			);
		} catch (error) {
			console.log(error);
		}
	}

	onMount(() => {
		oldblocked = entry.Blocked;
		blocked = entry.Blocked;
	});
</script>

<div>Name: {entry.Name}</div>
<div>Type: {entry.Type}</div>
<div>
	Body Parts Used: {#each entry.BodyParts as p, i (p)}
		<span
			>{bodyP[p]}
			{#if i !== entry.BodyParts.length - 1}, {/if}</span
		>
	{/each}
</div>

<button
	on:click={() => {
		sampleID = entry.ID;
		sampleType = entry.Status === "Static" ? "static" : "dynamic"
	}}>&#x2139;</button
>

<div>Blocked: {entry.Blocked}</div>
<button on:click={() => (editstat = true)}>Edit</button>
{#if editstat}
	<input type="checkbox" name="blocked" bind:value={blocked} />
	<label for="blocked">Block Exercise</label><br />

	{#if oldblocked !== blocked}
		<button on:click={postChanges}>Submit Changes</button>
	{/if}
	<button on:click={() => (editstat = false)}>Discard</button>
{/if}
