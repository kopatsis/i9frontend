<script>
	// @ts-nocheck

	import { onDestroy, onMount } from 'svelte';
	import { user, getUser } from '$lib/stores/user.js';
	import BodyPInput from './BodyPInput.svelte';
	import { patchUser } from '$lib/jshelp/fetchwo.js';
	import { getLoginToken } from '$lib/jshelp/localtoken';

	export let exists = true;

	let userData;
	const unsubscribe = user.subscribe((value) => {
		userData = value;
	});

	onDestroy(unsubscribe);

	let error = '';
	let minutes;
	let diff;
	let plyo;
	let pushup;
	let bannedParts;

	let loading = true;

	onMount(async () => {
		const token = await getLoginToken();
		error = await getUser(token);
		loading = false;

		if (userData) {
			minutes = Math.round(100 * userData.LastMinutes) / 100;
			diff = String(Math.max(1, userData.LastDifficulty));
			plyo = userData.PlyoTolerance;
			pushup = userData.PushupSetting;
			bannedParts = [...userData.BannedParts];
		}
	});

	const anyChanges = () => {
		return (
			plyo !== userData.PlyoTolerance ||
			pushup !== userData.PushupSetting ||
			diff !== String(Math.max(1, userData.LastDifficulty)) ||
			minutes !== Math.round(100 * userData.LastMinutes) / 100 ||
			arraysHaveSameItems(bannedParts, userData.BannedParts)
		);
	};

	const arraysHaveSameItems = (arr1, arr2) => {
		if (arr1.length !== arr2.length) {
			return false;
		}

		const sortedArr1 = [...arr1].sort();
		const sortedArr2 = [...arr2].sort();

		return sortedArr1.every((value, index) => value === sortedArr2[index]);
	};

	const submitWO = async () => {
		loading = true;
		let body = {};

		const token = await getLoginToken();

		if (plyo !== userData.PlyoTolerance) {
			body['plyo'] = plyo;
		}
		if (pushup !== userData.PushupSetting) {
			body['pushup'] = pushup;
		}
		if (!arraysHaveSameItems(bannedParts, userData.BannedParts)) {
			body['banned'] = bannedParts;
		}
		if (diff !== String(Math.max(1, userData.LastDifficulty))) {
			body['diff'] = Number(diff);
		}
		if (minutes !== Math.round(100 * userData.LastMinutes) / 100) {
			body['mins'] = minutes;
		}

		try {
			await patchUser(token, body);
			exists = false;
		} catch (error) {
			error = error;
			console.log(error);
		}
	};
</script>

<button on:click={() => (exists = false)}>Exit</button>
{#if loading}
	<div>loading...</div>
{:else if error || !userData}
	<div>F</div>
	<div>{error}</div>
{:else}
	<form on:submit|preventDefault={submitWO}>
		<div>{userData.Name}'s default workout settings:</div>
		<label for="length">Length in minutes (8-240):</label>
		<input
			type="number"
			id="length"
			name="length input"
			min="8.0"
			max="240.0"
			step="0.01"
			bind:value={minutes}
		/>

		<label for="difficulty">Difficulty Type:</label>
		<select id="difficulty" bind:value={diff}>
			<option value="1">Low Cortisol*</option>
			<option value="2">Simple**</option>
			<option value="3">Easy</option>
			<option value="4">Medium</option>
			<option value="5">Hard</option>
			<option value="6">Extreme</option>
		</select>
		<div>
			*: Low Cortisol is designed to minimize spikes in heart rate while still keeping you moving
		</div>
		<div>
			**: Simple is the same as Easy, except there are no Combo or Split rounds, just Regular ones
		</div>
		<br />

		<label for="plyo">Plyo Tolerability (0 - 5):</label>
		<input type="number" id="plyo" name="plyo setting" min="0" max="5" step="1" bind:value={plyo} />
		<br />

		<label for="pushup">Pushup Setting:</label>
		<select bind:value={pushup}>
			<option value="Regular">Regular</option>
			<option value="Knee">Knees</option>
			<option value="Wall">Wall</option>
		</select>
		<br />

		<BodyPInput bind:finalList={bannedParts} />
		<br />

		{#if anyChanges()}
			<button type="submit">Submit Changes</button>
		{/if}
	</form>
{/if}
