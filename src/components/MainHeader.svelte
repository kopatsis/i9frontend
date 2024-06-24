<script>
	import { fly } from 'svelte/transition';
	import Settings from '../popdowns/Settings.svelte';

	let dispSettings = false;
</script>

<div class="loghead">
	<button on:click={() => alert('soon... ;)')} class="link-button">&#9878;</button>
	<b class="logheadtxt">i9 Fitness</b>
	<button on:click={() => (dispSettings = !dispSettings)} class="link-button"
		>{#if dispSettings}&times;{:else}&#9881;{/if}</button
	>
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
		height: clamp(53px, 12dvw, 86px);
		position: relative;
	}

	.logheadtxt {
		font-size: clamp(20px, 10dvw, 54px);
		z-index: 1001;
		user-select: none;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		margin-left: 10px;
		margin-right: 10px;
		font-family: inherit;
		font-size: clamp(20px, 10dvw, 54px);
		font-weight: bold;
		z-index: 1001;
	}
</style>
