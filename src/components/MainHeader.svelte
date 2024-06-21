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
    <Settings bind:dispSettings />
{/if}

<style>
    .loghead {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
        /* position: fixed; */
        z-index: 1000;
        top: 0;
        background: white;
        margin: 3px;
	}

	.logheadtxt {
		font-size: clamp(20px, 10dvw, 60px);
	}

    .link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
        margin-left: 10px;
        margin-right: 10px;
        font-family: inherit;
		font-size: clamp(20px, 10dvw, 60px);
        font-weight: bold;
	}
</style>