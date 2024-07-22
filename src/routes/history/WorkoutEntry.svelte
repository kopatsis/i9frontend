<script>
	// @ts-nocheck
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { preloadImages } from '$lib/jshelp/preloader.js';
	import { unravelWO } from '$lib/jshelp/unravelwo';
	import {
		extractImageList,
		getWorkoutById,
		restartIntroWorkoutByID,
		restartWorkoutByID
	} from '$lib/jshelp/fetchwo';
	import { goto } from '$app/navigation';
	import { getHistory, pinWorkout, rename, workouts } from '$lib/stores/history';

	export let entry = null;
	export let pinnable = true;
	let pinnerr = '';

	let loading = false;
	let error = '';
	let expanded = false;

	let editing = false;
	let newname = '';

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

	function isUnixEpochZero(isoDateString) {
		const date = new Date(isoDateString);
		return date.getTime() === 0;
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
			sessionStorage.removeItem('reqType');
			sessionStorage.removeItem('reqBody');
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
			let workout;
			if (entry.type === 'Intro') {
				workout = await restartIntroWorkoutByID(token, entry.id);
				unravelWO(workout, 'Intro');
			} else {
				workout = await restartWorkoutByID(token, entry.id);
				unravelWO(workout);
			}

			preloadImages(extractImageList(workout));
			loading = false;
			sessionStorage.removeItem('reqType');
			sessionStorage.removeItem('reqBody');
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
				await rename(token, entry.ID, newname, 'exercise');
				workouts.update((items) =>
					items.map((i) => (i.ID === entry.ID ? { ...i, Name: newname } : i))
				);
			} catch (err) {
				error = err;
			}
		}
		editing = false;
	}

	async function pin() {
		if (!entry.IsPinned && !pinnable) {
			pinnerr = 'A maximum of 3 workouts can be pinned. Please unpin another one first.';
		} else {
			try {
				let pinned = !entry.IsPinned;
				const token = await getLoginToken();
				await pinWorkout(token, entry.ID, pinned);
				await getHistory(token);
			} catch (err) {
				error = err;
			}
		}
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

<div class="entry" class:pinned={entry.IsPinned}>
	{#if loading}
		<div class="loading" >
			<div class="bouncer">
				<img src="/images/i9logotsp.png" alt="sdafa" />
			</div>
			<div class="loader2"></div>
		</div>
	{:else if error !== ''}
		<div>F: {error}</div>
	{:else}
		{#if entry.IsIntro}
			<div>
				<b>Assessment Workout &nbsp;</b><button on:click={pin}
					>{#if entry.IsPinned}Unpin{:else}Pin{/if}</button
				>
			</div>
		{:else}
			<div>
				<b>Workout &nbsp;</b><button on:click={pin}
					>{#if entry.IsPinned}Unpin{:else}Pin{/if}</button
				>
			</div>
		{/if}
		{#if pinnerr && !entry.IsPinned}
			{pinnerr}
		{/if}
		<div>Created On: {formatDateString(entry.Created)}</div>
		{#if !isUnixEpochZero(entry.LastStarted)}
			<div>Last Started: {formatDateString(entry.LastStarted)}</div>
		{/if}
		<div>Started: {entry.StartedCount} times || Finished: {entry.RatedCount} times</div>
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
				New Name:&nbsp;<input type="text" length="100" bind:value={newname} />
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
		<div>
			Status: {#if entry.Status === 'Progressing'}Paused{:else}{entry.Status}{/if}
		</div>
		<div>Difficulty: {options[entry.Difficulty + 1]}</div>
		<div>
			Time: {#if entry.Status !== 'Rated'}{timeString(entry.PausedTime)}{:else}{timeString(
					entry.Minutes
				)}{/if} / {timeString(entry.Minutes)}
		</div>
		{#if entry.AvgRating > 0}
			<div>- Rating: {Math.round(entry.AvgRating * 10) / 10}</div>
		{/if}
		{#if entry.AvgFaves > 0}
			<div>- Favoritism: {Math.round(entry.AvgFaves * 10) / 10}</div>
		{/if}
		{#if !expanded}
			<div>Dynamic Stretches: {getFirst3(entry.Dynamics)}</div>
			<div>Exercises: {getFirstExers()}</div>
			<div>Static Stretches: {getFirst3(entry.Statics)}</div>
			<button on:click={() => (expanded = true)}>Expand</button>
		{:else}
			<br />
			<div>Dynamic Warmup:</div>
			{#each entry.Dynamics as name, i (i)}
				<div>- {Math.round(entry.StretchTimes.DynamicPerSet[i])}s: {name}</div>
			{/each}

			<br />

			{#each entry.Exercises as round, i (i)}
				<div>Round {i + 1}: {round.Status}</div>
				<div>
					- {Math.round(round.Times.ExercisePerSet)}s on / {Math.round(round.Times.RestPerSet)}s off
				</div>
				<div>
					- {round.ExerciseIDs.join(', ')}
				</div>
				{#if round.AvgRating > 0}
					<div>- Rating: {Math.round(round.AvgRating * 10) / 10}</div>
				{/if}
				{#if round.AvgFaves > 0}
					<div>- Favoritism: {Math.round(round.AvgFaves * 10) / 10}</div>
				{/if}
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
		{:else if !entry.IsIntro}
			<button on:click={toRestart}>Restart</button>
			<!-- <button on:click={toAdapt}>Adapt*</button>
			<div>
				*Adapt means the times and exercises/stretches will be the same, but the reps will be
				re-calculated to your current level.
			</div> -->
		{/if}
	{/if}
</div>

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

	.entry {
		margin: 10px;
		margin-top: 20px;
		padding: 10px;
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
	}

	.entry.pinned {
		border: 3px solid rgb(72, 77, 79);
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
		background-color: white;
		font-weight: normal;
	}
</style>
