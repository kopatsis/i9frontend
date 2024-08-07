<script>
	// @ts-nocheck

	import { fetchSampleByExt, fetchSample } from '$lib/jshelp/fetchsample';
	import { preloadSampleImages } from '$lib/jshelp/preloader';
	import { onDestroy, onMount } from 'svelte';
	import Modal from '../templates/Modal.svelte';
	import ModalSpecial from '../templates/ModalSpecial.svelte';

	export let backendID = '';
	export let type = 'exercise';
	export let size = 'mid';
	export let sampleID = '';
	export let exists = true;
	const cdn = import.meta.env.VITE_CDN_URL;

	let interval = null;
	let time = 0;
	let startTime;

	export let loading = false;
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
		loading = true;
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

<ModalSpecial bind:open={exists}>
	<div class="closeline">
		<button class="link-button" on:click={() => (exists = false)}>&times;</button>
	</div>
	{#if error}
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
			<div class="anglerow">
				<button
					on:click={() => {
						changeAngle('01');
					}}
					><img src={angle === '01' ? '/small/Angle1T.png' : '/small/Angle1.png'} alt="Left" />
				</button>
				<button
					on:click={() => {
						changeAngle('02');
					}}
					><img
						src={angle === '02' ? '/small/Angle2T.png' : '/small/Angle2.png'}
						alt="Half Left"
					/></button
				>
				<button
					on:click={() => {
						changeAngle('03');
					}}
					><img
						src={angle === '03' ? '/small/Angle3T.png' : '/small/Angle3.png'}
						alt="Center"
					/></button
				>
				<button
					on:click={() => {
						changeAngle('04');
					}}
					><img
						src={angle === '04' ? '/small/Angle4T.png' : '/small/Angle4.png'}
						alt="Half Right"
					/></button
				>
				<button
					on:click={() => {
						changeAngle('05');
					}}
					><img
						src={angle === '05' ? '/small/Angle5T.png' : '/small/Angle5.png'}
						alt="Right"
					/></button
				>
				<button
					on:click={() => {
						changeAngle('06');
					}}
					><img
						src={angle === '06' ? '/small/Angle6T.png' : '/small/Angle6.png'}
						alt="Top"
					/></button
				>
			</div>
		</div>
	{/if}
</ModalSpecial>

<style>

	.sampleouter img {
		max-width: 100%;
	}
	.anglerow {
		display: flex;
		width: 100%;
		height: clamp(30px, 10dvw, 55px);
		border-top: 1px solid rgb(137, 151, 155);
		box-sizing: border-box;
		padding: 0;
		justify-content: space-between;
	}

	.anglerow button {
		padding: 2px;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		cursor: pointer;
		background-color: transparent;
	}

	.anglerow button img {
		height: calc(100% - 5px);
		aspect-ratio: 1/1;
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
		max-width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
