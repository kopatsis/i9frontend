<script>
	// @ts-nocheck
	import {
		currenttimeSession,
		timescriptSt,
		scriptSt,
		strRoundsSt,
		genTimesSt,
		updateTime,
		workoutRoundsSt,
		timescriptStSession,
		scriptStSession,
		strRoundsStSession,
		genTimesStSession,
		workoutRoundsStSession,
		roundsSet,
		currenttime,
		woIdSession,
		name,
		afterWOMessage,
		nameSession
	} from '$lib/stores/workout.js';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import Sample from '../../popups/Sample.svelte';
	import Imgframe from '../../components/Imgframe.svelte';
	import { postIntroRating } from '$lib/jshelp/postwo';
	import Audio from '../../popups/Audio.svelte';
	import { get } from 'svelte/store';
	import { getLoginToken } from '$lib/jshelp/localtoken';
	import TimeProgress from '../../components/TimeProgress.svelte';
	import { isCreateForm } from '$lib/stores/creation';
	import Modal from '../../templates/Modal.svelte';

	export let size = 'mid';
	const cdn = import.meta.env.VITE_CDN_URL;
	let sampleExists = false;
	let worker;

	// Variables in presentation section
	let interval = null;
	let time = 0;
	let loading = true;
	let error = '';

	let status = 'Dynamic';
	let round = null;
	let roundIter = 0;

	let picIter = 0;
	let src = 'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
	let set = 0;
	let activeTitle = '';
	let picEndTime = 0;
	let angle = '02';

	let scriptIter = 0;
	let scriptStartTime = 0;
	let scriptEndTime = 0;
	let scriptRest = false;

	let lastCalled = 0;
	let exitMessage = false;
	let resetMessage = false;
	let paused = true;
	let timeMessage = false;
	let existingTime = 0;

	let audioDisp = false;

	let transitionTime = 3;
	let transitioning = false;
	let intervalCountdown;

	// Subscriptions section
	let timescript;
	const unsubscribeTimeScript = timescriptSt.subscribe((timescriptSt) => {
		timescript = timescriptSt;
	});

	let script;
	const unsubscribeScript = scriptSt.subscribe((scriptSt) => {
		script = scriptSt;
	});

	let strRounds;
	const unsubscribeSt = strRoundsSt.subscribe((strRoundsSt) => {
		strRounds = strRoundsSt;
	});

	let genTimes;
	const unsubscribeGen = genTimesSt.subscribe((genTimesSt) => {
		genTimes = genTimesSt;
	});

	let woRounds = [];
	const unsubscribeWO = workoutRoundsSt.subscribe((workoutRoundsSt) => {
		woRounds = workoutRoundsSt;
	});

	let nameWO = '';
	const unsubscribeName = name.subscribe((name) => {
		nameWO = name;
	});

	// Timing functions
	function startStopwatch() {
		clearInterval(interval);
		if (intervalCountdown) clearInterval(intervalCountdown);
		transitioning = true;
		intervalCountdown = setInterval(() => {
			transitionTime--;
			if (transitionTime === 0) {
				transitioning = false;
				clearInterval(intervalCountdown);

				if (worker) {
					console.log(time);
					worker.postMessage({ command: 'start', time: time });
				} else {
					if (interval === null) {
						interval = setInterval(() => {
							time += 0.01;
						}, 10);
					}
				}

				paused = false;
				transitionTime = 3;
			}
		}, 1000);
	}

	function pauseStopwatch() {
		paused = true;
		if (worker) {
			worker.postMessage({ command: 'pause' });
		} else {
			clearInterval(interval);
			interval = null;
		}
	}

	function resetStopwatch() {
		pauseStopwatch();
		time = 0;

		if (worker) {
			worker.postMessage({ command: 'reset' });
		}

		status = 'Dynamic';
		round = null;
		roundIter = 0;

		picIter = 0;
		src = 'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
		set = 0;
		activeTitle = '';
		picEndTime = 0;

		scriptIter = 0;
		scriptStartTime = 0;
		scriptEndTime = 0;
		scriptRest = false;

		lastCalled = 0;
		interval = null;

		timeMessage = false;
		resetMessage = false;
		startStopwatch();
	}

	function handleVisibilityChange() {
		if (document.visibilityState === 'visible') {
			startStopwatch();
		} else {
			pauseStopwatch();
		}
	}

	onDestroy(() => {
		unsubscribeTimeScript();
		unsubscribeScript();
		unsubscribeSt();
		unsubscribeGen();
		unsubscribeWO();
		unsubscribeName();
		clearInterval(interval);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		if (worker) {
			worker.terminate();
		}
	});

	function truncateString(str) {
		if (str.length > 40) {
			return str.slice(0, 37) + '...';
		}
		return str;
	}

	// Other interactive functions
	function changeAngle(newAngle) {
		if (angle !== newAngle) {
			angle = newAngle;
			src = cdn + '/' + script[picIter].position + angle + '-' + size + '.webp';
		}
	}

	let currentSampleID = '';
	const showCurrentSample = (sampleID) => {
		currentSampleID = sampleID;
		sampleExists = true;
	};

	async function quit(saveTime = false) {
		loading = true;
		if (saveTime) {
			await updateTime(time, '', 'Paused', true);
		} else {
			afterWOMessage.set(true);
		}
		goto('./');
		return;
	}

	async function pushRate() {
		let start = time - woRounds[roundIter].start;
		start -= roundIter < 1 ? strRounds.rest : woRounds[roundIter - 1].roundrest;
		const end = woRounds[roundIter + 1].start - time - woRounds[roundIter].roundrest;
		const finalRound = roundIter + Math.min(Math.max(start / end, 0), 1);
		try {
			const token = await getLoginToken();
			await postIntroRating(token, finalRound);
		} catch (err) {
			console.log(err);
		}
	}

	function resetQuestion() {
		pauseStopwatch();
		resetMessage = true;
	}

	function exitQuestion() {
		pauseStopwatch();
		exitMessage = true;
	}

	function returnNoReset() {
		resetMessage = false;
		startStopwatch();
	}

	function returnNoExit() {
		exitMessage = false;
		startStopwatch();
	}

	function startAnew() {
		timeMessage = false;
		time = 0;
		loading = false;
		updateTime(time, '', 'Progressing', true);
		startStopwatch();
	}

	function audioDisplay() {
		pauseStopwatch();
		audioDisp = true;
	}

	const audioUndisplay = () => {
		audioDisp = false;
		startStopwatch();
	};

	function goHome() {
		isCreateForm.set(true);
		goto('./');
	}

	async function moveToStatics() {
		loading = true;

		await pushRate();

		let workingTime = time;
		let workingStatus = status;
		let workingPicIter = picIter;
		let workingSrc = src;
		let workingSet = set;
		let workingActiveTitle = activeTitle;
		let workingPicEndTime = picEndTime;
		let workingScriptIter = scriptIter;
		let workingScriptStartTime = scriptStartTime;
		let workingScriptEndTime = scriptEndTime;
		let workingScriptRest = scriptRest;
		let workingRound = round;
		let workingRoundIter = roundIter;

		while (genTimes && woRounds && workingTime < (genTimes.static - woRounds[woRounds.length-2].roundrest - woRounds[woRounds.length-2].off)) {
			workingTime += 0.01;

			if (workingTime > workingScriptEndTime && workingScriptIter + 1 < timescript.length) {
				workingScriptStartTime = workingScriptEndTime;
				workingScriptRest = timescript[workingScriptIter].isrest;
				workingScriptIter++;
				workingScriptEndTime = timescript[workingScriptIter].time;
			}

			if (script && workingTime > workingPicEndTime && workingPicIter + 1 < script.length) {
				workingSrc = cdn + '/' + script[workingPicIter].position + angle + '-' + size + '.webp';
				workingActiveTitle = script[workingPicIter].names[0];
				workingSet = script[workingPicIter].set;
				workingPicIter++;
				workingPicEndTime = script[workingPicIter].time;
			}

			if (
				workingRoundIter + 1 < woRounds.length &&
				workingTime > woRounds[workingRoundIter].start
			) {
				workingRound = woRounds[workingRoundIter];
				roundsSet(workingRoundIter);
				workingRoundIter++;
			}

			if (genTimes && workingStatus === 'Dynamic' && workingTime > genTimes.exercises) {
				workingStatus = 'Exercise';
			} else if (genTimes && workingStatus === 'Exercise' && workingTime > genTimes.static) {
				workingStatus = 'Static';
			}
		}
		time = workingTime;
		status = workingStatus;
		picIter = workingPicIter;
		src = workingSrc;
		set = workingSet;
		activeTitle = workingActiveTitle;
		picEndTime = workingPicEndTime;
		scriptIter = workingScriptIter;
		scriptStartTime = workingScriptStartTime;
		scriptEndTime = workingScriptEndTime;
		scriptRest = workingScriptRest;
		round = workingRound;
		roundIter = workingRoundIter;

		exitMessage = false;
		loading = false;
		startStopwatch();
	}

	function startAtOld() {
		loading = true;

		let workingTime = 0;
		let workingStatus = 'Dynamic';
		let workingPicIter = 0;
		let workingSrc =
			'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
		let workingSet = 0;
		let workingActiveTitle = '';
		let workingPicEndTime = 0;
		let workingScriptIter = 0;
		let workingScriptStartTime = 0;
		let workingScriptEndTime = 0;
		let workingScriptRest = false;
		let workingRound = null;
		let workingRoundIter = 0;

		while (workingTime < existingTime) {
			workingTime += 0.01;

			if (workingTime > workingScriptEndTime && workingScriptIter + 1 < timescript.length) {
				workingScriptStartTime = workingScriptEndTime;
				workingScriptRest = timescript[workingScriptIter].isrest;
				workingScriptIter++;
				workingScriptEndTime = timescript[workingScriptIter].time;
			}

			if (script && workingTime > workingPicEndTime && workingPicIter + 1 < script.length) {
				workingSrc = cdn + '/' + script[workingPicIter].position + angle + '-' + size + '.webp';
				workingActiveTitle = script[workingPicIter].names[0];
				workingSet = script[workingPicIter].set;
				workingPicIter++;
				workingPicEndTime = script[workingPicIter].time;
			}

			if (
				workingRoundIter + 1 < woRounds.length &&
				workingTime > woRounds[workingRoundIter].start
			) {
				workingRound = woRounds[workingRoundIter];
				roundsSet(workingRoundIter);
				workingRoundIter++;
			}

			if (genTimes && workingStatus === 'Dynamic' && workingTime > genTimes.exercises) {
				workingStatus = 'Exercise';
			} else if (genTimes && workingStatus === 'Exercise' && workingTime > genTimes.static) {
				workingStatus = 'Static';
			}
		}
		time = workingTime;
		status = workingStatus;
		picIter = workingPicIter;
		src = workingSrc;
		set = workingSet;
		activeTitle = workingActiveTitle;
		picEndTime = workingPicEndTime;
		scriptIter = workingScriptIter;
		scriptStartTime = workingScriptStartTime;
		scriptEndTime = workingScriptEndTime;
		scriptRest = workingScriptRest;
		round = workingRound;
		roundIter = workingRoundIter;

		updateTime(time, '', 'Progressing', true);
		timeMessage = false;
		loading = false;
		startStopwatch();
	}

	// Start funcs
	onMount(() => {
		currenttimeSession();
		const oldTime = get(currenttime);

		if (localStorage.getItem('szsY0s') === 'DceYdZ') {
			worker = new Worker(new URL('/timeworker.js', import.meta.url));

			worker.onmessage = function (event) {
				time = parseFloat(event.data);
			};
		} else {
			document.addEventListener('visibilitychange', handleVisibilityChange);
		}

		let check = timescriptStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = scriptStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = strRoundsStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = genTimesStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = workoutRoundsStSession();
		if (check === null) {
			error = 'Error loading workout';
		}
		check = nameSession();
		if (check === null) {
			error = 'Error loading name';
		}

		woIdSession();

		if (!error && oldTime > 0 && genTimes && genTimes.end && oldTime < genTimes.end) {
			timeMessage = true;
			existingTime = oldTime;
		} else if (!error) {
			startStopwatch();
		}
		loading = false;
	});

	// Reactive statements on time change
	$: if (timescript && time > scriptEndTime && scriptIter + 1 < timescript.length) {
		scriptStartTime = scriptEndTime;
		scriptRest = timescript[scriptIter].isrest;
		scriptIter++;
		scriptEndTime = timescript[scriptIter].time;
	}

	$: if (script && time > picEndTime && picIter + 1 < script.length) {
		src = cdn + '/' + script[picIter].position + angle + '-' + size + '.webp';
		activeTitle = script[picIter].names[0]; // Have it so it's just one title in unravel lol
		set = script[picIter].set;
		picIter++;
		picEndTime = script[picIter].time;
	}

	$: if (woRounds && roundIter + 1 < woRounds.length && time > woRounds[roundIter].start) {
		round = woRounds[roundIter];
		roundsSet(roundIter);
		roundIter++;
	}

	$: if (genTimes && status === 'Dynamic' && time > genTimes.exercises) {
		status = 'Exercise';
	} else if (genTimes && status === 'Exercise' && time > genTimes.static) {
		status = 'Static';
	} else if (genTimes && status === 'Static' && time > genTimes.end) {
		quit();
	}

	$: if (
		Math.floor(time) !== lastCalled &&
		Math.floor(time) !== lastCalled + 1 &&
		!loading &&
		status !== 'Static'
	) {
		lastCalled = Math.floor(time);
		updateTime(time);
	}
</script>

<div class="page">
	{#if loading}
		<div>loading...</div>
	{:else if error}
		<Modal closerFunc={() => goto('./')}>
			<div>F: {error}</div>
			<button on:click={() => goto('./')}>Go Home</button>
		</Modal>
	{:else if !timescript || !script || !strRounds || !genTimes || !woRounds}
		<Modal closerFunc={() => goto('./')}>
			<div>No workout active</div>
			<button on:click={goHome}>Create one now</button>
		</Modal>
	{:else if timeMessage}
		<Modal>
			<div>
				Do you want to continue off of your previous saved time of: {Math.floor(existingTime / 60)} min
				{Math.floor(existingTime % 60)} sec?
			</div>
			<div class="anglerow controls">
				<button on:click={startAtOld}>Yes</button>
				<button on:click={startAnew}>No</button>
			</div>
		</Modal>
	{:else}
		{#if transitioning}
			<div class="transition">
				<div>{transitionTime}</div>
			</div>
		{/if}
		<div class="head full">
			{truncateString(nameWO)}:&nbsp;
			{#if status === 'Dynamic'}
				Dynamic Stretch Warmup
			{:else if status === 'Static'}
				Static Stretch Cooldown
			{:else}
				Workout Round #{round.round}
			{/if}
		</div>
		{#if exitMessage}
			<div class="full">Are you done with this workout or do you want to keep going?</div>
			<div class="anglerow controls full">
				<button on:click={returnNoExit}>Back to Workout</button>
				{#if status === 'Static'}
					<button on:click={quit}>Exit</button>
				{:else}
					<button on:click={() => quit(true)}>Pause and Exit</button>
					<button on:click={() => moveToStatics()}>Finish Assessment</button>
				{/if}
			</div>
		{:else if resetMessage}
			<div class="full">Are you sure you want restart?</div>
			<div class="anglerow controls full">
				<button on:click={returnNoReset}>No, go back</button>
				<button on:click={resetStopwatch}>Yes, restart</button>
			</div>
		{:else}
			<div class="anglerow controls full">
				{#if paused}
					<button on:click={startStopwatch}>Start</button>
				{:else}
					<button on:click={pauseStopwatch}>Pause</button>
				{/if}
				{#if status !== 'Static'}
					<button on:click={resetQuestion}>Restart</button>
				{/if}
				<button on:click={exitQuestion}>Quit</button>
				<button on:click={audioDisplay}>Show music</button>
			</div>
		{/if}
		<div class="full">
			<TimeProgress current={time} end={genTimes ? genTimes.end : 1} />
		</div>

		<div class="varied">
			{#if status === 'Dynamic'}
				{#if activeTitle}
					<div class="inner">
						<div class="grid">
							<div>
								{activeTitle === 'Round Rest'
									? Math.round(strRounds.rest)
									: Math.round(strRounds.dynamic.times[set - 1])}s
							</div>
							<div>{activeTitle}</div>
							<div>
								<button
									on:click={() => {
										showCurrentSample(strRounds.dynamic.samples[set - 1]);
									}}>&#x2139;</button
								>
							</div>
						</div>
						<div>Stretch Set {set} / {strRounds.dynamic.times.length}</div>
					</div>
				{/if}
			{:else if status === 'Static'}
				<div class="inner">
					<div class="grid">
						<div>{Math.round(strRounds.static.times[set - 1])}s</div>
						<div>{activeTitle}</div>
						<div>
							<button
								on:click={() => {
									showCurrentSample(strRounds.static.samples[set - 1]);
								}}>&#x2139;</button
							>
						</div>
					</div>
					<div>Stretch Set {set} / {strRounds.static.times.length}</div>
				</div>
			{:else}
				<div class="inner">
					{#if activeTitle === 'Round Rest' && round.round === 9}
						<div>Nice Job! That's it for the main workout!</div>
						<div>Up Next: Static Stretch Cooldown</div>
					{:else}
						<div>
							{#if activeTitle === 'Round Rest'}Up Next:{/if}
						</div>
						<div class="grid">
							{#if round.type !== 'Combo'}
								{#if round.reps.length < 2}
									<div>{round.reps[0]}x</div>
								{:else if activeTitle === 'Round Rest'}
									<div>{round.reps[0]}-{round.reps[1]}x</div>
								{:else if set % 2 == 1}
									<div>{round.reps[0]}x</div>
								{:else}
									<div>{round.reps[1]}x</div>
								{/if}
							{/if}
							{#each round.samples as sample, j}
								{#if round.type === 'Combo'}
									<div>{round.reps[j]}x</div>
								{:else if j !== 0}
									<div>&nbsp;</div>
								{/if}
								<div>{round.titles[j]}</div>
								<div>
									<button
										on:click={() => {
											showCurrentSample(sample);
										}}>&#x2139;</button
									>
								</div>
							{/each}
						</div>
						<div>
							Type: {round.type} || Set {activeTitle === 'Round Rest' ? 0 : set} / {round.sets}
						</div>
						<div>
							Exercise Per Set: {Math.round(round.on)}s / Rest Per Set: {Math.round(round.off)}s
						</div>
						<div>Rest before next round: {Math.round(round.roundrest + round.off)}</div>
					{/if}
				</div>
			{/if}
		</div>

		<div class="full">
			<Imgframe
				{time}
				endTime={scriptEndTime}
				startTime={scriptStartTime}
				reversed={scriptRest}
				{src}
				alt={activeTitle}
			/>
		</div>

		<div class="anglerow full">
			<button
				on:click={() => {
					changeAngle('01');
				}}
				>{#if angle === '01'}<b>Left</b>{:else}Left{/if}</button
			>
			<button
				on:click={() => {
					changeAngle('02');
				}}
				>{#if angle === '02'}<b>Half Left</b>{:else}Half Left{/if}</button
			>
			<button
				on:click={() => {
					changeAngle('03');
				}}
				>{#if angle === '03'}<b>Front</b>{:else}Front{/if}</button
			>
			<button
				on:click={() => {
					changeAngle('04');
				}}
				>{#if angle === '04'}<b>Half Right</b>{:else}Half Right{/if}</button
			>
			<button
				on:click={() => {
					changeAngle('05');
				}}
				>{#if angle === '05'}<b>Right</b>{:else}Right{/if}</button
			>
			<button
				on:click={() => {
					changeAngle('06');
				}}
				>{#if angle === '06'}<b>Top</b>{:else}Top{/if}</button
			>
		</div>

		{#if sampleExists}
			<Sample sampleID={currentSampleID} bind:exists={sampleExists} />
		{/if}

		<Audio bind:display={audioDisp} closer={audioUndisplay} />
	{/if}
</div>

<style>
	.anglerow {
		display: flex;
		width: 100%;
	}

	.anglerow button {
		flex: 1;
		margin-left: 3px;
		margin-right: 3px;
	}

	.controls > button {
		font-size: 16px;
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

	.page {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		width: 100dvw;
	}

	.page > .full {
		flex-shrink: 0;
	}

	.page > .varied {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-y: auto;
	}

	.varied > .inner {
		max-height: 100%;
		max-width: 100%;
	}

	.transition {
		height: 100dvh;
		width: 100dvw;
		z-index: 19;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.44);
		position: fixed;
		top: 0;
		left: 0;
	}

	.transition > div {
		font-size: 72px;
		color: white;
		z-index: 20;
	}
	.head {
		width: 100%;
		text-align: center;
	}
	.grid {
		display: grid;
		grid-template-columns: max-content 1fr max-content;
		gap: 1px;
		background-color: rgb(228, 228, 228);
	}
	.grid > div {
		padding: 6px;
		background: white;
	}
</style>
