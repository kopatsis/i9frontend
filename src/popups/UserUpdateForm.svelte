<script>
	// @ts-nocheck

	import { onDestroy, onMount } from 'svelte';
	import { user, getUser } from '$lib/stores/user.js';
	import BodyPInput from '../components/BodyPInput.svelte';
	import { patchUser } from '$lib/jshelp/fetchwo.js';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import Modal from '../templates/Modal.svelte';

	export let exists = true;

	let strplyo = '';
	let strdiff = '';

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

	let timeMin = 8;
	let timeMax = 240;
	let displayTime;
	let inputTime;

	let inputHTML;
	let displayHrs;
	let displayMins;
	let displaySecs;

	let updated = false;

	onMount(async () => {
		const token = await getLoginToken();
		error = await getUser(token);
		loading = false;

		if (userData) {
			console.log(displayHrs, displayMins, displaySecs);
			minutes = Math.min(Math.max(Math.round(100 * userData.LastMinutes) / 100, timeMin), timeMax);
			minuteUpdate();

			diff = Math.max(1, userData.LastDifficulty);
			strdiff = String(diff);
			plyo = userData.PlyoTolerance;
			strplyo = String(plyo);
			pushup = userData.PushupSetting;
			bannedParts = [...userData.BannedParts];
		}
	});

	const anyChanges = (plyo, pushup, diff, minutes, bannedParts) => {
		return (
			plyo !== userData.PlyoTolerance ||
			pushup !== userData.PushupSetting ||
			diff !== Math.max(1, userData.LastDifficulty) ||
			minutes !== Math.round(100 * userData.LastMinutes) / 100 ||
			!arraysHaveSameItems(bannedParts, userData.BannedParts)
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
		let body = {};

		const token = await getLoginToken();

		minutes = Math.round(100 * minutes) / 100;

		if (plyo !== userData.PlyoTolerance) {
			body['plyo'] = plyo;
		}
		if (pushup !== userData.PushupSetting) {
			body['pushup'] = pushup;
		}
		if (!arraysHaveSameItems(bannedParts, userData.BannedParts)) {
			body['banned'] = bannedParts;
		}
		if (diff !== Math.max(1, userData.LastDifficulty)) {
			body['diff'] = diff;
		}
		if (minutes !== Math.round(100 * userData.LastMinutes) / 100) {
			body['mins'] = minutes;
		}

		try {
			await patchUser(token, body);
			await getUser(token, true);
			exists = false;
		} catch (err) {
			error = err;
			console.error(err);
		}
	};

	$: if (strplyo) {
		plyo = Number(strplyo);
	}
	$: if (strdiff) {
		diff = Number(strdiff);
	}
	$: if (displayHrs && displayMins && displaySecs && !updated) {
		minuteUpdate();
		updated = true;
	}
</script>

<Modal bind:open={exists}>
	<div class="closeline">
		<button class="link-button" on:click={() => (exists = false)}>&times;</button>
	</div>
	{#if loading}
		<div class="loading" id="loader" style="display: none">
			<div class="bouncer">
				<img src="/images/i9logotsp.png" alt="sdafa" />
			</div>
			<div class="loader2"></div>
		</div>
	{:else if error || !userData}
		<div>F</div>
		<div>{error}</div>
	{:else}
		<form on:submit|preventDefault={submitWO}>
			<div>
				<b>
					{#if userData.Name && userData.Name !== 'local'}{userData.Name}'s default workout
						settings:
					{:else}Your default workout settings:{/if}
				</b>
			</div>
			<div class="editline">
				<div>
					<label for="length">Length in minutes (8-240):</label>
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

			<div class="editline row">
				<label for="difficulty">Difficulty Type:</label>
				<select id="difficulty" bind:value={strdiff}>
					<option value="1">Low Cortisol</option>
					<option value="2">Simple</option>
					<option value="3">Easy</option>
					<option value="4">Medium</option>
					<option value="5">Hard</option>
					<option value="6">Extreme</option>
				</select>
			</div>

			<!-- <div>
				*: Low Cortisol is designed to minimize spikes in heart rate while still keeping you moving
			</div>
			<div>
				**: Simple is the same as Easy, except there are no Combo or Split rounds, just Regular ones
			</div>
			<br /> -->

			<div class="editline row">
				<label for="plyo">Plyo Tolerability:</label>
				<select bind:value={strplyo}>
					<option value="0">None</option>
					<option value="1">Very Limited</option>
					<option value="2">Limited</option>
					<option value="3">Regular</option>
					<option value="4">Extra</option>
					<option value="5">Extra Extra</option>
				</select>
			</div>

			<div class="editline row">
				<label for="pushup">Pushup Setting:</label>
				<select bind:value={pushup} id="pushup">
					<option value="Regular">Regular</option>
					<option value="Knee">Knees</option>
					<option value="Wall">Wall</option>
				</select>
			</div>

			<div class="editline">
				<BodyPInput bind:finalList={bannedParts} />
			</div>

			<div class="submit">
				{#if anyChanges(plyo, pushup, diff, minutes, bannedParts)}
					<button type="submit">Submit Changes</button>
				{:else}
					<button class="nochange" type="submit">Submit Changes</button>
				{/if}
			</div>
		</form>
	{/if}
</Modal>

<style>
	.nochange {
		cursor: default;
		background-color: rgb(211, 211, 211);
	}

	.submit {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
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
	/* 
	.verif.invis {
		visibility: hidden;
	}

	.verif {
		color: red;
		margin-bottom: 6px;
		font-size: 14px;
	} */

	.editline {
		margin-top: 8px;
	}

	.editline.row {
		display: flex;
		justify-content: space-between;
	}

	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		font-size: 24px;
	}

	.closeline {
		display: flex;
		justify-content: right;
		width: 100%;
	}

	button {
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
	select {
		border-radius: 0;
		color: inherit;
		font-size: inherit;
		border-radius: 0px;
		border: 1px solid rgb(137, 151, 155);
	}
</style>
