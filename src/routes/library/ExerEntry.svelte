<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { blockChange, favChange } from '$lib/jshelp/postuserpsec';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { exercises } from '$lib/stores/library';

	export let entry;
	export let bodyP;
	let editstat = false;

	let blocked;
	let fav;

	let oldblocked;
	let oldfav;

	function faveDisp(value) {
		if (value <= 0.5) {
			return 'Hate';
		} else if (value <= 0.85) {
			return 'Dislike';
		} else if (value <= 1.333) {
			return 'Neutral';
		} else if (value <= 2) {
			return 'Like';
		}
		return 'Love';
	}

	function dispToFave(word) {
		switch (word) {
			case 'Hate':
				return 0.4;
			case 'Dislike':
				return 0.7;
			case 'Like':
				return 1.7;
			case 'Love':
				return 2.2;
		}
		return 1;
	}

	async function postChanges() {
		try {
			const token = getLoginToken();
			if (oldblocked !== blocked) {
				if (blocked) {
					await blockChange(token, entry.ID, 'PATCH');
				} else {
					await blockChange(token, entry.ID, 'DELETE');
				}
				oldblocked = blocked;
			}
			if (oldfav !== fav) {
				await favChange(token, entry.ID, dispToFave(fav));
				oldfav = fav;
			}
			editstat = false;
			exercises.update((items) =>
				items.map((i) => (i.ID === entry.ID ? { ...i, Blocked: blocked, Favoritism: fav } : i))
			);
		} catch (error) {
			console.log(error);
		}
	}

	onMount(() => {
		oldblocked = faveDisp(entry.Blocked);
		oldfav = entry.Favoritism;
		blocked = faveDisp(entry.Blocked);
		fav = entry.Favoritism;
	});
</script>

<div>Name: {entry.Name}</div>
<div>Parent: {entry.Parent}</div>
{#each entry.BodyParts as p, i (p)}
	<span
		>{bodyP[p]}
		{#if i !== entry.BodyParts.length - 1},{/if}</span
	>
{/each}
<div>Blocked: {entry.Blocked}</div>
<div>Favoritism Value: {Math.round(entry.Favoritism * 100) / 100}</div>
<button on:click={() => (editstat = true)}>Edit</button>
{#if editstat}
	<input type="checkbox" name="blocked" bind:value={blocked} />
	<label for="blocked">Block Exercise</label><br />

	<div>Favoritism Value:</div>
	<select bind:value={fav}>
		<option value="Hate">Hate</option>
		<option value="Dislike">Dislike</option>
		<option value="Neutral">Neutral</option>
		<option value="Like">Like</option>
		<option value="Love">Love</option>
	</select>

	{#if oldblocked !== blocked || oldfav !== fav}
		<button on:click={postChanges}>Submit Changes</button>
	{/if}
	<button on:click={() => (editstat = false)}>Discard</button>
{/if}
