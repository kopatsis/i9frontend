<script>
	import Settings from "../popdowns/Settings.svelte";

    let dispSettings = false
</script>

<div class="loghead">
    <button on:click={() => alert('soon... ;)')} class="link-button">&#9878;</button>
    <b class="logheadtxt">i9 Fitness</b>
    <button on:click={() => dispSettings = !dispSettings} class="link-button">&#9881;</button>
</div>

{#if dispSettings}
    <button on:click={() => dispSettings = false}>&times;</button>
    <Settings />
{/if}

<style>
    .loghead {
		width: 100%;
        max-width: 600px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
        position: fixed;
        z-index: 1000;
        top: 0;
        background: white;
        height: 44px;
	}

	.logheadtxt {
		font-size: 28px;
	}

    .link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
        margin-left: 10px;
        margin-right: 10px;
        font-family: inherit;
		font-size: 28px;
        font-weight: bold;
	}
</style>