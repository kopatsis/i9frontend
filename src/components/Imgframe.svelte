<script>
	// @ts-nocheck

	import Progress from './Progress.svelte';

	export let time = 0;
	export let startTime = time + 0;
	export let endTime = time + 20;
	export let reversed = false;
	export let src =
		'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
	export let alt = 'Congrats';
	export let pauseStopwatch = () => {};

	function handleKeyDown(event) {
		if (event.key === ' ' || event.key === 'Enter') {
			pauseStopwatch();
		}
	}

	let progress1 = 0;
	let progress2 = 0;
	let progress3 = 0;
	let progress4 = 0;
	let progress5 = 0;

	$: if (time >= startTime && time <= endTime) {
		let pct = (time - startTime) / (endTime - startTime);
		progress1 = Math.max(Math.min(1, pct / 0.125), 0);
		progress2 = Math.max(Math.min(1, (pct - 0.125) / 0.25), 0);
		progress3 = Math.max(Math.min(1, (pct - 0.375) / 0.25), 0);
		progress4 = Math.max(Math.min(1, (pct - 0.625) / 0.25), 0);
		progress5 = Math.max(Math.min(1, (pct - 0.875) / 0.125), 0);
	} else if (time === startTime) {
		progress1 = 0;
		progress2 = 0;
		progress3 = 0;
		progress4 = 0;
		progress5 = 0;
	}
</script>

<div
	class="outermost"
	on:click={pauseStopwatch}
	on:touchstart={pauseStopwatch}
	on:keydown={handleKeyDown}
	tabindex="0"
	role="button"
>
	<div class="buffer"></div>
	<div class="parent-container">
		{#if !reversed}
			<Progress progress={progress1} reverse={reversed} order={1} />
			<Progress progress={progress2} reverse={reversed} order={2} />
			<Progress progress={progress3} reverse={reversed} order={3} />
			<Progress progress={progress4} reverse={reversed} order={4} />
			<Progress progress={progress5} reverse={reversed} order={5} />
		{:else}
			<Progress progress={progress5} reverse={reversed} order={1} />
			<Progress progress={progress4} reverse={reversed} order={2} />
			<Progress progress={progress3} reverse={reversed} order={3} />
			<Progress progress={progress2} reverse={reversed} order={4} />
			<Progress progress={progress1} reverse={reversed} order={5} />
		{/if}

		{#if src === ''}
			<div class="centerimg"></div>
		{:else}
			<img class="centerimg" {src} {alt} />
		{/if}
	</div>
	<div class="buffer"></div>
	<div class="timepres">{Math.floor(endTime - time)}</div>
</div>

<style>
	.centerimg {
		width: calc(100% - 12px);
		height: calc(100% - 12px);
	}

	.parent-container {
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1/1;
		position: relative;
		height: 100%;
		color: aliceblue;
		flex-shrink: 0;
		background-color: transparent;
	}

	.timepres {
		background-color: white;
		color: black;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid black;
		position: absolute;
		top: 6px;
		right: 6px;
	}

	.outermost {
		height: min(100dvw, calc(70dvh - clamp(30px, 10dvw, 60px)));
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		flex-direction: row;
		background-color: transparent;
	}

	.buffer {
		flex: 1;
		background-color: rgb(97, 97, 97);
	}

	.buffer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgb(36, 4, 48) 0%,
			rgba(0, 0, 0, 1) 50%,
			rgb(1, 26, 24) 100%
		);
	}

	.buffer::after {
		content: '';
		position: absolute;
		top: -300%;
		left: -300%;
		width: 600%;
		height: 600%;
		background-image: url('/images/bgminitr2.png');
		background-repeat: repeat;
		background-size: 121px 51px;
		transform: rotate(45deg);
		transform-origin: center;
	}

	@media (min-aspect-ratio: 1.2/1) {
		.outermost {
			width: min(100dvh, calc(70dvw - clamp(30px, 10dvh, 60px)));
			height: 100%;
			flex-direction: column;
		}

		.parent-container {
			width: 100%;
			height: auto;
			aspect-ratio: 1/1;
		}
	}
</style>
