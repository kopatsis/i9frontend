<script>
	export let current = 0;
	export let end = 1;
</script>

<div class="outerbar">
	<div class="innerbar" style="width: {(current / end) * 100}%;"></div>
</div>

<style>
	.innerbar {
		background-color: green;
		height: 100%;
	}

	.outerbar {
		display: flex;
		justify-content: flex-start;
		height: 10px;
		width: 512px;
	}
</style>
