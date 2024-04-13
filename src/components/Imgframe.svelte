<script>
	import Progress from './Progress.svelte';

	export let time = 0;
	export let startTime = time + 0;
	export let endTime = time + 20;
	export let reversed = false;
	export let src =
		'https://i9imgs.sfo3.cdn.digitaloceanspaces.com/standing-thumbs-up-wink03-mid.webp';
	export let alt = 'Congrats';

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

	<img class="centerimg" {src} {alt} />

	<div class="timepres">{Math.floor(endTime - time)}</div>
</div>

<style>
	.centerimg {
		width: 500px;
		height: 500px;
	}

	.parent-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 512px;
		height: 512px;
		color: aliceblue;
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
</style>
