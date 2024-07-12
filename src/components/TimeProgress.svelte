<script>
	// @ts-nocheck

	export let current = 0;
	export let end = 1;

	// function formatTime(time) {
	// 	const minutes = Math.floor(Math.round(time) / 60);
	// 	let seconds = Math.floor(Math.round(time) % 60);
	// 	if (seconds < 10) {
	// 		seconds = `0${seconds}`;
	// 	}
	// 	return `${minutes}:${seconds}`;
	// }
</script>

<div class="outerbar">
	<!-- <div class="text">{formatTime(current)} / {formatTime(end)}</div> -->
	<div class="innerbar" style="height: {(current / end) * 100}%;"></div>
</div>

<style>
	.innerbar {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 208px;
		border-top-left-radius: 12px;
		border-top-right-radius: 12px;
		background: linear-gradient(
			to bottom,
			rgba(50, 222, 132, 0.2) 0%,
			rgba(54, 243, 79, 0.75) 50px,
			rgba(54, 243, 79, 0.75) 100%
		);
		z-index: -9;
	}

	/* .text {
		font-family: monospace;
		z-index: 2;
	} */

	.outerbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -10;
	}
</style>
