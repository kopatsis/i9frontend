<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { blockChange, favChange } from '$lib/jshelp/postuserpsec';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { exercises } from '$lib/stores/library';

	export let entry;
	// export let bodyP;
	export let sampleID;
	export let sampleEx = false;
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
			const token = await getLoginToken();
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
				oldfav = dispToFave(fav);
			}
			exercises.update((items) =>
				items.map((i) =>
					i.ID === entry.ID ? { ...i, Blocked: oldblocked, Favoritism: oldfav } : i
				)
			);
		} catch (error) {
			console.log(error);
		} finally {
			editstat = false;
		}
	}

	onMount(() => {
		oldblocked = entry.Blocked;
		oldfav = faveDisp(entry.Favoritism);
		blocked = entry.Blocked;
		fav = faveDisp(entry.Favoritism);
	});
</script>

<div class="exentry">
	<button
		class="sampleb"
		on:click={() => {
			sampleEx = true;
			sampleID = entry.ID;
		}}>&#x2139;</button
	>
	<div>Name: {entry.Name}</div>
	<div>Type: {entry.Parent}</div>

	<div class="uservals">
		<div class="usercontain">
			<div>Blocked:</div>
			<div>{entry.Blocked}</div>
		</div>
		<div class="usercontain">
			<div>Favoritism:</div>
			<div>{faveDisp(entry.Favoritism)}</div>
		</div>
	</div>

	<div class="editb">
		<button on:click={() => (editstat = !editstat)}>Edit</button>
	</div>

	{#if editstat}
		<div class="editstat">
			<div>
				<input type="checkbox" name="blocked" bind:checked={blocked} />
				<label for="blocked">Block Exercise</label>
			</div>

			<div>Favoritism Value:</div>
			<select bind:value={fav}>
				<option value="Hate">Hate</option>
				<option value="Dislike">Dislike</option>
				<option value="Neutral">Neutral</option>
				<option value="Like">Like</option>
				<option value="Love">Love</option>
			</select>

			<div class="editb">
				{#if oldblocked !== blocked || oldfav !== fav}
					<button on:click={postChanges}>Submit</button>
				{/if}
				<button on:click={() => (editstat = false)}>Discard</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.uservals {
		display: flex;
	}

	.usercontain {
		flex: 1;
	}

	.exentry {
		padding: 5px;
		/* margin-left: -1px;
		margin-bottom: -1px; */
		/* width: 175px; */
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
		background-color: white;
		font-weight: normal;
	}

	.editstat {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	select {
		margin-bottom: 5px;
		border-radius: 0;
		color: inherit;
		font-size: inherit;
		/* background-color: inherit; */
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
	}
</style>
