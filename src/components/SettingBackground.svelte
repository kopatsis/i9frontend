<script>
	import { onMount } from 'svelte';

	// @ts-nocheck

	let isEnabled = false;

	function updateTrue() {
		isEnabled = true
		localStorage.setItem('iDIzeJzvXq', 'dIGdXauHOI');
	}

	function updateFalse() {
		isEnabled = false
		localStorage.setItem('iDIzeJzvXq', 'OpedNoCToS');
	}

	onMount(() => {
		isEnabled = localStorage.getItem('iDIzeJzvXq') === 'dIGdXauHOI';
	});
</script>

<div>Keep workout going in the background:</div>

<button on:click={updateTrue}
	>{#if isEnabled}<b>True</b>{:else}True{/if}</button
>
<button on:click={updateFalse}
	>{#if !isEnabled}<b>False</b>{:else}True{/if}</button
>
