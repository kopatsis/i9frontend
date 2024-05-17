<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getUser } from '$lib/stores/user.js';
	import BodyPInput from './BodyPInput.svelte';
	import {
		extractImageList,
		fetchAdaptWorkout,
		fetchIntroWorkout,
		fetchStretchWorkout,
		fetchWorkout,
		patchUser
	} from '$lib/jshelp/fetchwo.js';
	import { goto } from '$app/navigation';
	import { preloadImages } from '$lib/jshelp/preloader.js';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { unravelWO, unravelstretchWO } from '$lib/jshelp/unravelwo';
	import { isCreateForm } from '$lib/stores/creation';

	export let formType = 'Regular';
	export let workoutID = '';
	export let userData;

	let oldFormType = formType;

	let error = '';
	let minutes;
	let diff;
	let plyo;
	let pushup;
	let bannedParts;

	let asnew = true;
	let showAdvanced = false;
	let loading = true;
	let validTime;

	onMount(async () => {
		if (!userData) {
			const token = await getLoginToken();
			error = await getUser(token);
		}

		if (userData) {
			minutes = Math.round(100 * userData.LastMinutes) / 100;
			if (formType === 'Regular') {
				minutes = Math.max(minutes, 8);
			} else if (formType === 'Stretch') {
				minutes = Math.max(minutes, 1);
			} else if (formType === 'Intro') {
				minutes = Math.max(minutes, 25);
			}
			diff = String(Math.min(Math.max(1, userData.LastDifficulty), 6));

			plyo = userData.PlyoTolerance;
			pushup = userData.PushupSetting;
			bannedParts = [...userData.BannedParts];
		}
		loading = false;
	});

	const validateTime = (minutes) => {
		if ((formType === 'Regular' && minutes < 8) || minutes > 240) {
			return false;
		} else if ((formType === 'Stretch' && minutes < 1) || minutes > 240) {
			return false;
		} else if ((formType === 'Intro' && minutes < 25) || minutes > 60) {
			return false;
		}
		return true;
	};

	$: if (formType !== oldFormType) {
		oldFormType = formType;
		if (formType === 'Regular') {
			minutes = Math.min(Math.max(minutes, 8), 240);
		} else if (formType === 'Stretch') {
			minutes = Math.min(Math.max(minutes, 1), 240);
		} else if (formType === 'Intro') {
			minutes = Math.min(Math.max(minutes, 25), 60);
		}
	}

	$: validTime = validateTime(minutes);

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
		const token = await getLoginToken();
		if (
			showAdvanced &&
			(plyo !== userData.PlyoTolerance ||
				pushup !== userData.PushupSetting ||
				arraysHaveSameItems(bannedParts, userData.BannedParts))
		) {
			let body = {};

			if (plyo !== userData.PlyoTolerance) {
				body['plyo'] = plyo;
			}
			if (pushup !== userData.PushupSetting) {
				body['pushup'] = pushup;
			}
			if (!arraysHaveSameItems(bannedParts, userData.BannedParts)) {
				body['banned'] = bannedParts;
			}

			try {
				await patchUser(token, body);
			} catch (err) {
				error = err;
				console.log(err);
			}
		}
		try {
			let workout;

			if (formType === 'Regular') {
				workout = await fetchWorkout(token, minutes, Number(diff));
				unravelWO(workout);
			} else if (formType === 'Stretch') {
				workout = await fetchStretchWorkout(token, minutes);
				unravelstretchWO(workout);
			} else if (formType === 'Adapt') {
				workout = await fetchAdaptWorkout(token, Number(diff), asnew, workoutID);
				unravelWO(workout);
			} else {
				workout = await fetchIntroWorkout(token, minutes);
				unravelWO(workout, 'Intro');
			}

			preloadImages(extractImageList(workout));
			setTimeout(() => {
				loading = false;
				isCreateForm.set(false);
				goto('./review');
			}, 1000);
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	};
</script>

{#if loading}
	<div>loading...</div>
{:else if error || !userData}
	<div>F: {error}</div>
{:else}
	<form
		on:submit|preventDefault={() => {
			if (validTime) {
				submitWO();
			}
		}}
	>
		<div>
			{#if userData.Name && userData.Name !== 'local'}{userData.Name}'s workout{:else}Your workout{/if}:
			{formType}
		</div>
		{#if formType !== 'Adapt'}
			<label for="length"
				>Length in minutes ({formType === 'Regular' ? 8 : formType === 'Intro' ? 25 : 1} - {formType ===
				'Intro'
					? 60
					: 240}):</label
			>
			<input
				type="number"
				id="length"
				name="length input"
				min="0.0"
				max="1000.0"
				step="0.01"
				bind:value={minutes}
			/>
			{#if !validTime}
				<div>
					Please enter a time within the range of {formType === 'Regular'
						? 8
						: formType === 'Intro'
							? 25
							: 1} - {formType === 'Intro' ? 60 : 240} minutes
				</div>
			{/if}
			<br />
		{/if}

		{#if formType == 'Adapt' || formType == 'Regular'}
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
		{/if}

		{#if formType == 'Adapt'}
			<label for="asNewCheckbox">Create as new workout:</label>
			<input type="checkbox" id="asNewCheckbox" bind:checked={asnew} />
		{/if}

		<br />

		{#if formType !== 'Adapt'}
			<div class="buttonhs">
				<button type="button" on:click={() => (showAdvanced = !showAdvanced)}>
					{#if showAdvanced}▲{:else}▼{/if} Advanced</button
				>
			</div>

			{#if showAdvanced}
				{#if formType !== 'Stretch'}
					<label for="plyo">Plyo Tolerability (0 - 5):</label>
					<input
						type="number"
						id="plyo"
						name="plyo setting"
						min="0"
						max="5"
						step="1"
						bind:value={plyo}
					/>
					<br />
				{/if}

				{#if formType === 'Regular'}
					<label for="pushup">Pushup Setting:</label>
					<select bind:value={pushup}>
						<option value="Regular">Regular</option>
						<option value="Knee">Knees</option>
						<option value="Wall">Wall</option>
					</select>
					<br />
				{/if}

				<BodyPInput bind:finalList={bannedParts} />
				<br />
			{/if}
		{/if}

		<div class="buttonhs">
			<button type="submit" class="submit">Submit</button>
		</div>
	</form>
{/if}

<style>
	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.buttonhs {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 10px;
	}
	.submit {
		font-size: 16px;
		padding: 6px;
		padding-left: 12px;
		padding-right: 12px;
	}
</style>
