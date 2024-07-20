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
	let minutes = 8;
	let diff;
	let plyo;
	let pushup;
	let bannedParts;

	let asnew = true;
	let showAdvanced = false;
	let loading = true;
	let validTime;

	let strplyo = '';

	let timeMin = 8;
	let timeMax = 240;
	let displayTime;
	let inputTime;

	let inputHTML;
	let displayHrs;
	let displayMins;
	let displaySecs;

	let updated = false;
	let effectiveTime;

	onMount(async () => {
		if (!userData) {
			const token = await getLoginToken();
			error = await getUser(token);
		}

		if (userData) {
			console.log('1', minutes);
			formMinutesUpd();

			diff = String(Math.min(Math.max(1, userData.LastDifficulty), 6));

			plyo = userData.PlyoTolerance;
			strplyo = String(plyo);
			pushup = userData.PushupSetting;
			bannedParts = [...userData.BannedParts];
		}

		console.log('7', minutes, formType);
		loading = false;
	});

	const validateTime = () => {
		minutes = Math.min(Math.max(timeMin, minutes), timeMax);
		if ((formType === 'Regular' && minutes < 8) || minutes > 240) {
			return false;
		} else if (formType === 'Stretch' && minutes < 1) {
			return false;
		} else if ((formType === 'Intro' && minutes < 20) || (formType === 'Intro' && minutes > 60)) {
			return false;
		}
		return true;
	};

	const calcTime = () => {
		return (
			Math.round(
				10 * (minutes - 2 * (minutes < 20 ? Math.max(1.5, minutes / 8) : Math.min(5, minutes / 12)))
			) / 10
		);
	};

	const formMinutesUpd = () => {
		console.log('2', minutes);
		oldFormType = formType;
		if (formType === 'Regular') {
			timeMin = 8;
			timeMax = 240;
			minutes = userData ? userData.LastMinutes : 35;
			minuteUpdate();
		} else if (formType === 'Stretch') {
			timeMin = 1;
			timeMax = 240;
			minutes = userData ? userData.LastMinutes : 25;
			minuteUpdate();
		} else if (formType === 'Intro') {
			timeMin = 20;
			timeMax = 60;
			minutes = userData ? userData.LastMinutes : 45;
			console.log('3', minutes);
			minuteUpdate();
		}
	};

	$: if (formType !== oldFormType) {
		formMinutesUpd();
	}

	$: if (minutes) {
		validTime = validateTime();
		effectiveTime = calcTime();
	}

	const arraysHaveSameItems = (arr1, arr2) => {
		if (arr1.length !== arr2.length) {
			return false;
		}

		const sortedArr1 = [...arr1].sort();
		const sortedArr2 = [...arr2].sort();

		return sortedArr1.every((value, index) => value === sortedArr2[index]);
	};

	const onInputFunc = () => {
		if (!inputTime) {
			inputTime = 0;
		}
		if (inputTime > 99999) {
			inputTime = Math.floor(inputTime / 10);
		} else {
			inputTime = Math.floor(inputTime);
		}

		displayTime = inputTime.toString().padStart(5, '0');

		let hours = displayTime.slice(0, 1) + 'H';
		let mins = displayTime.slice(1, 3) + 'M';
		let secs = displayTime.slice(3, 5) + 'S';

		let unAdjMinutes =
			Math.floor(inputTime / 10000) * 60 +
			Math.floor((inputTime % 10000) / 100) +
			Math.floor(inputTime % 100) / 60;
		minutes = Math.min(Math.max(timeMin, unAdjMinutes), timeMax);

		displayHrs.textContent = hours;
		if (hours === '0H') {
			displayHrs.classList.add('greyed');
		} else {
			displayHrs.classList.remove('greyed');
		}

		displayMins.textContent = mins;
		if (mins === '00M' && hours === '0H') {
			displayMins.classList.add('greyed');
		} else {
			displayMins.classList.remove('greyed');
		}

		displaySecs.textContent = secs;
	};

	const minuteUpdate = () => {
		if (!displayHrs) {
			return;
		}

		console.log('4', minutes);

		minutes = Math.min(Math.max(timeMin, minutes), timeMax);

		const totalSeconds = Math.round(minutes * 60);

		const tempHours = Math.floor(totalSeconds / 3600);
		const tempMinutes = Math.floor((totalSeconds % 3600) / 60);
		const tempSeconds = totalSeconds % 60;

		inputTime = tempHours * 10000 + tempMinutes * 100 + tempSeconds;

		displayTime = inputTime.toString().padStart(5, '0');

		let hours = displayTime.slice(0, 1) + 'H';
		let mins = displayTime.slice(1, 3) + 'M';
		let secs = displayTime.slice(3, 5) + 'S';

		displayHrs.textContent = hours;
		if (hours === '0H') {
			displayHrs.classList.add('greyed');
		} else {
			displayHrs.classList.remove('greyed');
		}

		displayMins.textContent = mins;
		if (mins === '00M' && hours === '0H') {
			displayMins.classList.add('greyed');
		} else {
			displayMins.classList.remove('greyed');
		}

		displaySecs.textContent = secs;

		console.log('5', minutes);
	};

	let isFocused = false;
	const onUnfocus = () => {
		isFocused = false;
		let unAdjMinutes =
			Math.floor(inputTime / 10000) * 60 +
			Math.floor((inputTime % 10000) / 100) +
			Math.floor(inputTime % 100) / 60;
		minutes = Math.min(Math.max(timeMin, unAdjMinutes), timeMax);

		minuteUpdate();
	};

	const doneButton = () => {
		inputHTML.blur();
		onUnfocus();
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

			minutes = Math.round(100 * minutes) / 100;

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
	}

	$: if (displayHrs && displayMins && displaySecs && !updated) {
		minuteUpdate();
		updated = true;
	}
</script>

{#if loading}
	<div class="loading" id="loader" style="display: none">
		<div class="bouncer">
			<img src="/images/i9logotsp.png" alt="sdafa" />
		</div>
		<div class="loader2"></div>
	</div>
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
						bind:this={inputHTML}
						type="number"
						id="length"
						name="length input"
						inputmode="numeric"
						min="0"
						max="99999"
						step="1"
						bind:value={inputTime}
						on:blur={onUnfocus}
						on:input={onInputFunc}
						on:focus={() => (isFocused = true)}
					/>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="timedisp" class:active={isFocused} on:click={() => inputHTML.focus()}>
						<pre class="hours greyed" bind:this={displayHrs}>0H</pre>
						<pre class="minutes greyed" bind:this={displayMins}>08M</pre>
						<pre class="seconds" bind:this={displaySecs}>00S</pre>
						{#if isFocused}
							<span class="blinking-cursor"></span>
						{/if}
					</div>
					{#if isFocused}
						<button type="button" on:click={doneButton}>&#x2713;</button>
					{/if}
				</div>
			</div>

			{#if formType !== 'Stretch'}
				<div>
					Effective workout time: {Math.floor(effectiveTime)}m {Math.round(
						(effectiveTime * 60) % 60
					)}s
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
	/* .verif.invis {
		visibility: hidden;
	}

	.verif {
		color: red;
		margin-bottom: 6px;
		font-size: 14px;
	} */
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

	.lengthin {
		display: flex;
		width: 100%;
	}

	.lengthin > input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
		border: none;
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
		overflow: hidden;
		white-space: nowrap;
		caret-color: transparent;
	}

	.lengthin > .timedisp {
		display: flex;
		border: 1px solid #ccc;
		padding: 0.5em;
		font-family: monospace;
		cursor: text;
		width: fit-content;
		user-select: none;
	}

	.lengthin > .timedisp > pre {
		margin: 0;
		padding: 0 0.2em;
	}

	.lengthin > .timedisp:focus-within {
		border-color: blue;
		outline: none;
	}

	pre {
		font-size: 1.25em;
		font-family: 'Courier New', Courier, monospace;
	}

	.active {
		background-color: aliceblue;
	}

	.greyed {
		color: #737373;
	}

	.blinking-cursor {
		display: inline-block;
		width: 2px;
		height: 100%;
		background-color: black;
		animation: blink 1.5s steps(1) infinite;
		vertical-align: bottom;
	}

	@keyframes blink {
		0% {
			visibility: visible;
		}
		50% {
			visibility: hidden;
		}
		100% {
			visibility: visible;
		}
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
