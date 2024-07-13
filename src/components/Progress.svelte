<script>
    export let progress = 0;
    export let reverse = false;
    export let order = 1
    
</script>

<div class="outerbar cd{order.toString()} {(!reverse && (order < 3 || order === 5)) || (reverse && (order === 3 || order === 4)) ? "start" : "end"}">
    {#if order % 2 === 1}
        <div class="innerbar{reverse ? " reverse" : ""}" style="width: {progress*100}%; height: 100%"></div>
    {:else}
        <div class="innerbar{reverse ? " reverse" : ""}" style="height: {progress*100}%; width: 100%"></div>
    {/if}
    
</div>


<style>
    .innerbar.reverse{
        background-color: #d15dff;
    }

    .innerbar{
        background-color: #25dfd4;
    }

    .outerbar{
        display: flex;
        position: absolute;
    }

    .outerbar.start{
        justify-content: flex-start;
    }

    .outerbar.end{
        justify-content: flex-end;
    }

    .cd1 {
        flex-direction: row;
		top: 0;
		right: 0;
		width: 50%;
		height: 6px;
	}

	.cd5 {
		flex-direction: row;
		top: 0;
		left: 0;
		width: 50%;
		height: 6px;
	}

	.cd2 {
		flex-direction: column;
		right: 0;
		height: 100%;
		width: 6px;
	}

	.cd3 {
		flex-direction: row;
		bottom: 0;
		width: 100%;
		height: 6px;
	}

	.cd4 {
		flex-direction: column;
		left: 0;
		height: 100%;
		width: 6px;
	}
</style>