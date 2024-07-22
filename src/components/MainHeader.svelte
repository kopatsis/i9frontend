<script>
	import { fly } from 'svelte/transition';
	import Settings from '../popdowns/Settings.svelte';
	import { onMount } from 'svelte';

	let dispSettings = false;
	let fontSize = 20;
	let headerHeight = 26;

	function updateSizes() {
		const size = Math.min(window.innerWidth, window.innerHeight);
		fontSize = Math.max(20, Math.min(50, size * 0.09));
		headerHeight = fontSize + 6;
	}

	onMount(() => {
		updateSizes();
		window.addEventListener('resize', updateSizes);
	});
</script>

<div class="loghead" style="height: {headerHeight}px;">
	<button on:click={() => alert('soon... ;)')} class="link-button" style="font-size: {fontSize}px;"
		>&#9878;</button
	>
	<div class="logheadtxt" style="font-size: {fontSize}px;">i9 Fitness</div>
	<button
		on:click={() => (dispSettings = !dispSettings)}
		class="link-button"
		style="font-size: {fontSize}px;"
	>
		{#if dispSettings}&times;{:else}&#9881;{/if}
	</button>
</div>

{#if dispSettings}
	<div transition:fly={{ y: -200, duration: 300 }}>
		<Settings bind:dispSettings />
	</div>
{/if}

<style>
	.loghead {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		z-index: 1000;
		background: white;
		position: relative;
	}

	.logheadtxt {
		font-family: 'Fira Code', Courier, monospace;
		z-index: 1001;
		user-select: none;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-weight: bold;
	}

	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		margin-left: 10px;
		margin-right: 10px;
		font-family: inherit;
		font-weight: bold;
		z-index: 1001;
	}
</style>
