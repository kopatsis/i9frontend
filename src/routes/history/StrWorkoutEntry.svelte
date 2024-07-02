<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import {
		cloneStretchWorkoutById,
		extractImageList,
		getStretchWorkoutById,

		restartStretchWorkoutByID

	} from '$lib/jshelp/fetchwo';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { preloadImages } from '$lib/jshelp/preloader';
	import { unravelstretchWO } from '$lib/jshelp/unravelwo';

	export let entry = null;
	let expanded = false;
	let loading = false;
	let error = '';

	let editing = false;
	let newname = "";

	function formatDateString(isoDateString) {
		const date = new Date(isoDateString);
		return date.toLocaleString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
	}

	function timeString(time) {
		const secs =
			Math.floor((time % 1) * 60) < 10
				? '0' + Math.floor((time % 1) * 60)
				: Math.floor((time % 1) * 60);
		const mins = Math.floor(time);
		return mins + 'm' + secs + 's';
	}

	function getFirst3(strings) {
		const uniqueStrings = [];
		for (let str of strings) {
			if (!uniqueStrings.includes(str)) {
				uniqueStrings.push(str);
				if (uniqueStrings.length === 3) break;
			}
		}
		return uniqueStrings.join(', ') + '...';
	}

	async function toReview() {
		loading = true;
		try {
			const token = await getLoginToken();
			const workout = await getStretchWorkoutById(token, entry.ID);
			unravelstretchWO(workout);
			preloadImages(extractImageList(workout));
			loading = false;
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	async function toRestart() {
		loading = true;
		try {
			const token = await getLoginToken();
			const workout = await restartStretchWorkoutByID(token, entry.ID);
			unravelstretchWO(workout);
			preloadImages(extractImageList(workout));
			loading = false;
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	async function nameChange() {
		if (newname != entry.Name) {
			try {
				const token = await getLoginToken();
				await rename(token, entry.ID, newname, 'stretch');
				workouts.update((items) =>
					items.map((i) => (i.ID === entry.ID ? { ...i, Name: newname } : i))
				);
			} catch (err) {
				error = err;
			}
		}
		editing = false;
	}

</script>

<div class="entry">
	{#if loading}
		<div>loading...</div>
	{:else if error !== ''}
		<div>F: {error}</div>
	{:else}
		<div><b>Stretch Workout</b></div>
		<div>Date: {formatDateString(entry.Created)}</div>
		<div>
			{#if !editing}
				Name: {entry.Name}&nbsp; 
				<button
					on:click={() => {
						newname = entry.Name;
						editing = !editing;
					}}>Edit</button
				>
			{:else}
				New Name:&nbsp;<input type="text" length="100" bind:value={newname}/>
				<div>
					<button
						on:click={() => {
							newname = entry.Name;
							editing = false;
						}}>Discard</button
					>
					<button on:click={nameChange}>Save</button>
				</div>
			{/if}
		</div>
		<div>Status: {entry.Status}</div>
		<div>
			Time: {#if entry.Status !== 'Rated'}{timeString(entry.PausedTime)}{:else}{timeString(
					entry.Minutes
				)}{/if} / {timeString(entry.Minutes)}
		</div>
		{#if !expanded}
			<div>Dynamic Stretches: {getFirst3(entry.Dynamics)}</div>
			<div>Static Stretches: {getFirst3(entry.Statics)}</div>
			<button on:click={() => (expanded = true)}>Expand</button>
		{:else}
			<br />
			<div>Dynamic Warmup:</div>
			{#each entry.Dynamics as name, i (i)}
				<div>- {Math.round(entry.StretchTimes.DynamicPerSet[i])}s: {name}</div>
			{/each}

			<br />
			<div>Static Cooldown:</div>
			{#each entry.Statics as name, i (i)}
				<div>- {Math.round(entry.StretchTimes.StaticPerSet[i])}s: {name}</div>
			{/each}
			<button on:click={() => (expanded = false)}>Collapse</button>
		{/if}

		{#if (entry.Status === 'Unstarted' || entry.Status === 'Not Started') && entry.PausedTime < entry.Minutes}
			<button on:click={toReview}>Start</button>
		{:else if (entry.Status === 'Progressing' || entry.Status === 'Paused') && entry.PausedTime < entry.Minutes}
			<button on:click={toReview}>Resume</button>
			<button on:click={toRestart}>Restart</button>
		{:else}
			<button on:click={toRestart}>Restart</button>
		{/if}
	{/if}
</div>

<style>
	.entry{
		margin: 10px;
		margin-top: 20px;
		padding: 10px;
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
	}

	button {
		margin-top: 8px;
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin-left: 4px;
		margin-right: 4px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}
</style>
