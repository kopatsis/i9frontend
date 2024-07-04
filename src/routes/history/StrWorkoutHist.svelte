<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { creationType, isCreateForm } from '$lib/stores/creation';

	import StrWorkoutEntry from './StrWorkoutEntry.svelte';

	export let history = null;
	let pinnable = true;

	function startOne() {
		isCreateForm.set(true);
		creationType.set('Stretch');
		goto('./');
	}

	onMount(() => {
		let ct = 0;
		if (history && history.length < 1) {
			for (const entry of history) {
				if (entry.IsPinned) ct++;
			}
		}
		if (ct > 2) {
			pinnable = false;
		}
	});
</script>

{#if !history || history.length < 1}
	<div class="none">
		<div class="nonemess">No stretch workouts in your history (yet)</div>
		<button on:click={startOne}>Start one now</button>
	</div>
{:else}
	{#each history as entry (entry.ID)}
		<StrWorkoutEntry {entry} {pinnable} />
	{/each}
{/if}

<style>
	.none {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.nonemess {
		margin: 4px;
		margin-bottom: 8px;
		margin-top: 8px;
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin-left: 4px;
		margin-right: 4px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}
</style>
