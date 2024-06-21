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

	let strplyo = '';

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
				minutes = Math.max(minutes, 20);
			}
			diff = String(Math.min(Math.max(1, userData.LastDifficulty), 6));

			plyo = userData.PlyoTolerance;
			strplyo = String(plyo);
			pushup = userData.PushupSetting;
			bannedParts = [...userData.BannedParts];
		}
		loading = false;
	});

	const validateTime = (minutes) => {
		if ((formType === 'Regular' && minutes < 8) || minutes > 240) {
			return false;
		} else if (formType === 'Stretch' && minutes < 1) {
			return false;
		} else if ((formType === 'Intro' && minutes < 20) || (formType === 'Intro' && minutes > 60)) {
			return false;
		}
		return true;
	};

	const calcTime = (minutes) => {
		return (
			Math.round(
				10 * (minutes - 2 * (minutes < 20 ? Math.max(1.5, minutes / 8) : Math.min(5, minutes / 12)))
			) / 10
		);
	};

	$: if (formType !== oldFormType) {
		oldFormType = formType;
		if (formType === 'Regular') {
			minutes = Math.min(Math.max(minutes, 8), 240);
		} else if (formType === 'Stretch') {
			minutes = Math.min(Math.max(minutes, 1), 240);
		} else if (formType === 'Intro') {
			minutes = Math.min(Math.max(minutes, 20), 60);
		}
	}

	$: validTime = validateTime(minutes);
	$: effectiveTime = calcTime(minutes);

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

	$: if (strplyo) {
		plyo = Number(strplyo);
		console.log(plyo);
	}
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
			<div class="editline">
				<div>
					<label for="length"
						>Length in minutes ({formType === 'Regular' ? 8 : formType === 'Intro' ? 20 : 1} - {formType ===
						'Intro'
							? 60
							: 240}):</label
					>
				</div>
				<div class="lengthin">
					<input
						type="range"
						min={formType === 'Regular' ? 8 : formType === 'Intro' ? 20 : 1}
						max={formType === 'Intro' ? 60 : 240}
						bind:value={minutes}
					/>
					<input
						type="number"
						id="length"
						name="length input"
						min="0.0"
						max="1000.0"
						step="0.01"
						bind:value={minutes}
					/>
				</div>
			</div>

			{#if formType !== 'Stretch'}
				<div>
					{#if validTime}
						Effective workout time: {Math.floor(effectiveTime)}m {Math.round(
							(effectiveTime * 60) % 60
						)}s
					{:else}
						<div class="verif">
							Please enter a time in the range of {formType === 'Regular'
								? 8
								: formType === 'Intro'
									? 20
									: 1} - {formType === 'Intro' ? 60 : 240} minutes
						</div>
					{/if}
				</div>
			{:else}
				<div class="verif" class:invis={validTime}>
					Please enter a time in the range of {formType === 'Regular'
						? 8
						: formType === 'Intro'
							? 20
							: 1} - {formType === 'Intro' ? 60 : 240} minutes
				</div>
			{/if}
		{/if}

		{#if formType == 'Adapt' || formType == 'Regular'}
			<div class="editline">
				<label for="difficulty">Difficulty Type:</label>
				<select id="difficulty" bind:value={diff}>
					<option value="1">Low Cortisol</option>
					<option value="2">Simple</option>
					<option value="3">Easy</option>
					<option value="4">Medium</option>
					<option value="5">Hard</option>
					<option value="6">Extreme</option>
				</select>
			</div>
		{/if}

		{#if formType == 'Adapt'}
			<div class="editline single">
				<label for="asNewCheckbox">Create as new workout:</label>
				<input type="checkbox" id="asNewCheckbox" bind:checked={asnew} />
			</div>
		{/if}

		{#if formType !== 'Adapt'}
			<div class="buttonhs">
				<button type="button" on:click={() => (showAdvanced = !showAdvanced)}>
					{#if showAdvanced}▲{:else}▼{/if} Advanced</button
				>
			</div>

			{#if showAdvanced}
				{#if formType !== 'Stretch'}
					<div class="editline row">
						<label for="plyo">Plyo Tolerability (0 - 5):</label>
						<select bind:value={strplyo}>
							<option value="0">None</option>
							<option value="1">Very Limited</option>
							<option value="2">Limited</option>
							<option value="3">Regular</option>
							<option value="4">Extra</option>
							<option value="5">Extra Extra</option>
						</select>
					</div>
				{/if}

				{#if formType === 'Regular'}
					<div class="editline row">
						<label for="pushup">Pushup Setting:</label>
						<select bind:value={pushup}>
							<option value="Regular">Regular</option>
							<option value="Knee">Knees</option>
							<option value="Wall">Wall</option>
						</select>
					</div>
				{/if}

				<BodyPInput bind:finalList={bannedParts} />
			{/if}
		{/if}

		<div class="buttonhs">
			<button type="submit" class="submit">Submit</button>
		</div>
	</form>
{/if}

<style>
	.verif.invis {
		visibility: hidden;
	}

	.verif {
		color: red;
		margin-bottom: 6px;
		font-size: 14px;
	}
	select {
		border-radius: 0;
		color: inherit;
		font-size: inherit;
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
	}
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

	.buttonhs button {
		font-size: 16px;
	}
	.submit {
		font-size: 16px;
		padding: 6px;
		padding-left: 12px;
		padding-right: 12px;
	}
	.lengthin {
		display: flex;
		width: 100%;
	}

	.lengthin input[type='number'] {
		margin-left: 6px;
	}

	.lengthin input[type='range'] {
		flex: 1;
	}

	.editline {
		margin-top: 8px;
	}

	.editline.row {
		display: flex;
		justify-content: space-between;
	}

	.single {
		justify-content: center;
	}
</style>
