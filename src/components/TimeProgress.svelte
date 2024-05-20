<script>
	// @ts-nocheck

	export let current = 0;
	export let end = 1;

	function formatTime(time) {
    const minutes = Math.floor(Math.round(time) / 60);
    let seconds = Math.floor(Math.round(time) % 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
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
		box-sizing: border-box;
	}
</style>
