<script>
	import { onMount } from 'svelte';

	// @ts-nocheck

	let isEnabled = false;

	function updateTrue() {
		isEnabled = true;
		localStorage.setItem('iDIzeJzvXq', 'dIGdXauHOI');
	}

	function updateFalse() {
		isEnabled = false;
		localStorage.setItem('iDIzeJzvXq', 'OpedNoCToS');
	}

	onMount(() => {
		isEnabled = localStorage.getItem('iDIzeJzvXq') === 'dIGdXauHOI';
	});
</script>

<div class="ask">Keep workout going in the background:</div>

<div class="options">
	<button on:click={updateTrue}
		>{#if isEnabled}<b>True</b>{:else}True{/if}</button
	>
	<button on:click={updateFalse}
		>{#if !isEnabled}<b>False</b>{:else}True{/if}</button
	>
</div>

<style>
	.ask{
		margin-left: 5px;
	}
	.options{
		display: flex;
		width: 100%;
		margin-bottom: 10px;
	}

	.options button{
		flex: 1;
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		margin: 5px;
		padding: 5px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}
</style>
