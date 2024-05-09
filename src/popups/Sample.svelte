<script>
	// @ts-nocheck

	import { fetchSampleByExt, fetchSample } from '$lib/jshelp/fetchsample';
	import { preloadSampleImages } from '$lib/jshelp/preloader';
	import { onMount } from 'svelte';
	import Modal from '../templates/Modal.svelte';

	export let backendID = '';
	export let type = 'exercise';
	export let size = 'mid';
	export let sampleID = '';
	export let exists = true;
	const cdn = import.meta.env.VITE_CDN_URL;

	let interval = null;
	let time = 0;
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

	function startStopwatch() {
		if (interval === null) {
			interval = setInterval(() => {
				time += 0.05;
			}, 50);
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
		i = -1;
		setImg();
	} else if (time > nextTime && sampleObj) {
		setImg();
	}
</script>

<Modal bind:open={exists}>
	<button on:click={() => (exists = false)}>Exit</button>
	{#if loading}
		<div>loading...</div>
	{:else if error}
		<div>F: {error}</div>
	{:else}
		<h1>{title}</h1>
		<br />
		<img {src} alt={title} />
		<br />
		<div>
			{@html desc}
		</div>
		<button
			on:click={() => {
				changeAngle('01');
			}}>Left</button
		>
		<button
			on:click={() => {
				changeAngle('02');
			}}>Half Left</button
		>
		<button
			on:click={() => {
				changeAngle('03');
			}}>Front</button
		>
		<button
			on:click={() => {
				changeAngle('04');
			}}>Half Right</button
		>
		<button
			on:click={() => {
				changeAngle('05');
			}}>Right</button
		>
		<button
			on:click={() => {
				changeAngle('06');
			}}>Top</button
		>
	{/if}
</Modal>
