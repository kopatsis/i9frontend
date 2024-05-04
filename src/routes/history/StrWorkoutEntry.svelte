<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import {
		cloneStretchWorkoutById,
		extractImageList,
		getStretchWorkoutById
	} from '$lib/jshelp/fetchwo';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { preloadImages } from '$lib/jshelp/preloader';
	import { unravelstretchWO } from '$lib/jshelp/unravelwo';

	export let entry = null;
	let expanded = false;
	let loading = false;
	let error = '';

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
			const workout = await cloneStretchWorkoutById(token, entry.ID);
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
</script>

{#if loading}
	<div>loading...</div>
{:else if error !== ''}
	<div>F: {error}</div>
{:else}
	<div>Date: {formatDateString(entry.Date)}</div>
	<div>Name: {entry.Name}</div>
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
		<div>Dynamic Warmup:</div>
		{#each entry.Dynamics as name, i (i)}
			<div>- {Math.round(entry.StretchTimes.DynamicPerSet[i])}s: {name}</div>
		{/each}

		<div>Static Cooldown:</div>
		{#each entry.Statics as name, i (i)}
			<div>- {Math.round(entry.StretchTimes.StaticPerSet[i])}s: {name}</div>
		{/each}
		<button on:click={() => (expanded = false)}>Collapse</button>
	{/if}

	{#if entry.Status === 'Unstarted' && entry.PausedTime < entry.Minutes}
		<button on:click={toReview}>Start</button>
	{:else if (entry.Status === 'Progressing' || entry.Status === 'Paused') && entry.PausedTime < entry.Minutes}
		<button on:click={toReview}>Resume</button>
	{:else}
		<button on:click={toRestart}>Restart</button>
	{/if}
{/if}

<br /><br />
