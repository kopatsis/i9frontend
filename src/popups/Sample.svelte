<script>
	// @ts-nocheck

	import { fetchSampleByExt, fetchSample } from '$lib/jshelp/fetchsample';
	import { preloadSampleImages } from '$lib/jshelp/preloader';
	import { onDestroy, onMount } from 'svelte';
	import Modal from '../templates/Modal.svelte';

	export let backendID = '';
	export let type = 'exercise';
	export let size = 'mid';
	export let sampleID = '';
	export let exists = true;
	const cdn = import.meta.env.VITE_CDN_URL;

	let interval = null;
	let time = 0;
	let startTime;

	let loading = true;
	let error = false;

	let sampleObj = null;
	let i = 0;
	let nextTime = 0;
	let fullTime = 10;

	let src = '';
	let title = '';
	let desc = '';
	let angle = '02';
	let realTimes = [];

	function step() {
		let now = performance.now();
		let dt = now - startTime;

		time = dt / 1000;

		interval = setTimeout(step, Math.max(0, 10 - (dt % 10)));
	}

	function startStopwatch() {
		if (interval === null) {
			startTime = performance.now() - time * 1000;
			interval = setTimeout(step, 10);
		}
	}

	function setImg() {
		i++;
		src = cdn + '/' + sampleObj.Reps.Positions[i] + angle + '-' + size + '.webp';
		if (i + 1 >= realTimes.length) {
			nextTime = sampleObj.Reps.FullTime + 0.1;
		} else {
			nextTime = realTimes[i];
		}
	}

	function setImgInit() {
		if (sampleObj) {
			fullTime = sampleObj.Reps.FullTime;
			i = -1;
			setImg();
			loading = false;
		}
	}

	function changeAngle(newAngle) {
		if (angle !== newAngle) {
			angle = newAngle;
			src = cdn + '/' + sampleObj.Reps.Positions[i] + angle + '-' + size + '.webp';
		}
	}

	function processTimes() {
		if (sampleObj) {
			for (let i = 0; i < sampleObj.Reps.Times.length; i++) {
				if (i == 0) {
					realTimes.push(sampleObj.Reps.Times[i]);
				} else {
					realTimes.push(sampleObj.Reps.Times[i] + realTimes[i - 1]);
				}
			}
		}
	}

	onDestroy(() => {
		clearInterval(interval);
		interval = null;
	});

	onMount(async () => {
		try {
			if (sampleID === '') {
				sampleObj = await fetchSampleByExt(backendID, type);
			} else {
				sampleObj = await fetchSample(sampleID);
			}

			preloadSampleImages(sampleObj.Reps.Positions, size);
			processTimes();
			title = sampleObj.Name;
			desc = sampleObj.Description;
			setImgInit();
			startStopwatch();
		} catch (err) {
			error = err;
			loading = false;
		}
	});

	$: if (time > fullTime) {
		time = 0;
		startTime = null;
		clearInterval(interval);
		interval = null;
		i = -1;
		setImg();
		startStopwatch();
	} else if (time > nextTime && sampleObj) {
		setImg();
	}

	$: if (desc) {
		desc = desc.replace(/<br>/g, '<br><br>');
	}
</script>

<Modal bind:open={exists}>
	<div class="closeline">
		<button class="link-button" on:click={() => (exists = false)}>&times;</button>
	</div>
	{#if loading}
		<div>loading...</div>
	{:else if error}
		<div>F: {error}</div>
	{:else}
		<div class="sampleouter">
			<h1>{title}</h1>
			<img {src} alt={title} />
			<br />
			<div class="desc">
				{@html desc}
			</div>
			<br />
			<div>Viewing Angle:</div>
			<div class="viewbuttons">
				<button
					class="view"
					on:click={() => {
						changeAngle('01');
					}}
				>
					{#if angle === '01'}
						<b>Left</b>
					{:else}
						Left
					{/if}</button
				>
				<button
					class="view"
					on:click={() => {
						changeAngle('02');
					}}
					>{#if angle === '02'}
						<b>Half Left</b>
					{:else}
						Half Left
					{/if}</button
				>
				<button
					class="view"
					on:click={() => {
						changeAngle('03');
					}}
					>{#if angle === '03'}
						<b>Front</b>
					{:else}
						Front
					{/if}</button
				>
				<button
					class="view"
					on:click={() => {
						changeAngle('04');
					}}
					>{#if angle === '04'}
						<b>Half Right</b>
					{:else}
						Half Right
					{/if}</button
				>
				<button
					class="view"
					on:click={() => {
						changeAngle('05');
					}}
					>{#if angle === '05'}
						<b>Right</b>
					{:else}
						Right
					{/if}</button
				>
				<button
					class="view"
					on:click={() => {
						changeAngle('06');
					}}
					>{#if angle === '06'}
						<b>Top</b>
					{:else}
						Top
					{/if}</button
				>
			</div>
		</div>
	{/if}
</Modal>

<style>
	img {
		max-width: 100%;
	}
	.viewbuttons {
		display: flex;
		width: 100%;
	}
	.view {
		flex: 1;
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
		margin: 4px;
	}
	h1 {
		margin-bottom: 0px;
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
	.sampleouter {
		max-width: min(100dvw, 960px);
	}
</style>
