<script>
	import Progress from './Progress.svelte';

	export let time = 0;
	let startTime = 5;
	let endTime = 15;
	let reversed = false;

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
	} else if (time == 0) {
		progress1 = 0;
		progress2 = 0;
		progress3 = 0;
		progress4 = 0;
		progress5 = 0;
		startTime = 5;
		endTime = 15;
		reversed = false;
	}

	$: if (startTime === 5 && time > 15) {
		startTime = 15;
		endTime = 20;
		reversed = true;
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

	<img
		class="centerimg"
		src="https://fastly.picsum.photos/id/398/500/500.jpg?hmac=Uz9jAqx6NJza9-FM-mGl8N6eAvbfGnajh3wQA0Iml7U"
		alt="ree"
	/>
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
</style>
