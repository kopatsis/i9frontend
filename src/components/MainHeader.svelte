<script>
	import Settings from "../popdowns/Settings.svelte";

    let dispSettings = false
</script>

<div>
    <button on:click={() => alert('soon... ;)')}>Shop</button>
    <b>i9 Fitness</b>
    <button on:click={() => dispSettings = !dispSettings}>⚙️</button>
</div>

{#if dispSettings}
    <button on:click={() => dispSettings = false}>Close</button>
    <Settings />
{/if}