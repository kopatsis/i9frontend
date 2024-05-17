<script>
	// @ts-nocheck
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { preloadImages } from '$lib/jshelp/preloader.js';
	import { unravelWO } from '$lib/jshelp/unravelwo';
	import { cloneWorkoutById, extractImageList, getWorkoutById } from '$lib/jshelp/fetchwo';
	import { adaptID, creationType, isCreateForm } from '$lib/stores/creation';
	import { goto } from '$app/navigation';

	export let entry = null;
	let loading = false;
	let error = '';
	let expanded = false;

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

	function averageRating() {
		let rating = 0;
		let i = 0;
		console.log('genuinely kys');
		console.log(entry);
		console.log(entry.Exercises);
		console.log(entry.Exercises[0]);
		console.log(entry.Exercises[0].Rating);
		if (entry) {
			entry.Exercises.forEach((element) => {
				if (element.Rating > 0) {
					rating += element.Rating;
					i++;
				}
			});
		}

		return rating / Math.max(1, i);
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

	function getFirstExers() {
		const uniqueStrings = [];
		loop: for (let round of entry.Exercises) {
			for (let str of round.ExerciseIDs) {
				if (!uniqueStrings.includes(str)) {
					uniqueStrings.push(str);
					if (uniqueStrings.length === 5) break loop;
				}
			}
		}
		return uniqueStrings.join(', ') + '...';
	}

	async function toReview() {
		loading = true;
		try {
			const token = await getLoginToken();
			const workout = await getWorkoutById(token, entry.ID);
			if (entry.IsIntro) {
				unravelWO(workout, 'Intro');
			} else {
				unravelWO(workout);
			}

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
			const workout = await cloneWorkoutById(token, entry.ID);
			unravelWO(workout);

			preloadImages(extractImageList(workout));
			loading = false;
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	function toAdapt() {
		loading = true;
		adaptID.set(entry.ID);
		creationType.set('Adapt');
		isCreateForm.set(true);
		goto('./');
	}

	const options = [
		'Intro',
		'Stretch',
		'Low Cortisol',
		'Simple',
		'Easy',
		'Medium',
		'Hard',
		'Extreme'
	];
</script>

<div class="entry">
	{#if loading}
		<div>loading...</div>
	{:else if error !== ''}
		<div>F: {error}</div>
	{:else}
		{#if entry.IsIntro}
			<div><b>Assessment Workout</b></div>
		{:else}
			<div><b>Workout</b></div>
		{/if}
		<div>Date: {formatDateString(entry.Date)}</div>
		<div>Name: {entry.Name}</div>
		<div>Status: {entry.Status}</div>
		<div>Difficulty: {options[entry.Difficulty + 1]}</div>
		<div>
			Time: {#if entry.Status !== 'Rated'}{timeString(entry.PausedTime)}{:else}{timeString(
					entry.Minutes
				)}{/if} / {timeString(entry.Minutes)}
		</div>
		{#if !expanded}
			{#if entry.Status === 'Rated' && averageRating() > 0}
				<div>Average Rating: {averageRating()}</div>
			{/if}
			<div>Dynamic Stretches: {getFirst3(entry.Dynamics)}</div>
			<div>Exercises: {getFirstExers()}</div>
			<div>Static Stretches: {getFirst3(entry.Statics)}</div>
			<button on:click={() => (expanded = true)}>Expand</button>
		{:else}
			<br>
			<div>Dynamic Warmup:</div>
			{#each entry.Dynamics as name, i (i)}
				<div>- {Math.round(entry.StretchTimes.DynamicPerSet[i])}s: {name}</div>
			{/each}

			<br>

			{#each entry.Exercises as round, i (i)}
				<div>Round {i + 1}: {round.Status}</div>
				<div>
					 - {Math.round(round.Times.ExercisePerSet)}s on / {Math.round(round.Times.RestPerSet)}s off
				</div>
				<div>
					 - {round.ExerciseIDs.join(', ')}
				</div>
				{#if round.Rating > 0}
					<div> - Rating: {Math.round(round.Rating)}</div>
				{/if}
			{/each}

			<br>

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
		{:else if !entry.IsIntro}
			<button on:click={toRestart}>Restart</button>
			<button on:click={toAdapt}>Adapt*</button>
			<div>
				*Adapt means the times and exercises/stretches will be the same, but the reps will be
				re-calculated to your current level.
			</div>
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
