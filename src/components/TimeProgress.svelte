<script>
	// @ts-nocheck

	export let current = 0;
	export let end = 1;

	function formatTime(time) {
		return `${Math.floor(Math.round(time) / 60)}:${Math.floor(Math.round(time) % 60)}`;
	}
</script>

<div class="outerbar">
	<div class="text">{formatTime(current)} / {formatTime(end)}</div>
	<div class="innerbar" style="width: {(current / end) * 100}%;"></div>
</div>

<style>
	.innerbar {
		background-color: #32de84;
		height: 100%;
		position: absolute;
		left: 0;
	}

	.text {
		font-family: monospace;
		z-index: 2;
	}

	.outerbar {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 20px;
		width: 100%;
		border: 1px solid #000;
	}
</style>
