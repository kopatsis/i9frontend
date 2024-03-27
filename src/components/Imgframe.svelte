<script>
    export let time = 0;
    const totalTime = 10;

    let progress1 = 0;
    let progress2 = 0;
    let progress3 = 0;
    let progress4 = 0;
    let progress5 = 0;


    function updateProgBars(){
        let currentProgress = time/totalTime;
        
        
    }


</script>


<div class="parent-container">
	<div class="cd1"></div>
	<div class="cd2"></div>
	<div class="cd3"></div>
	<div class="cd4"></div>
	<div class="cd5"></div>
	<img
		class="centerimg"
		src="https://fastly.picsum.photos/id/398/500/500.jpg?hmac=Uz9jAqx6NJza9-FM-mGl8N6eAvbfGnajh3wQA0Iml7U"
		alt="ree"
	/>
</div>

<style>
	.centerimg {
		width: 500px;
		height: 500px;
	}

	.parent-container {
		display: flex;
		justify-content: center;
		align-items: center;
        position: relative;
		width: 512px;
		height: 512px;
		color: aliceblue;
	}

	.cd1 {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 6px;
		background-color: #333;
	}

	.cd5 {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 6px;
		background-color: blueviolet; /* just to make it visible */
	}

	.cd2 {
		position: absolute;
		right: 0;
		height: 100%;
		width: 6px;
		background-color: lightpink; /* just to make it visible */
	}

	.cd3 {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 6px;
		background-color: peru; /* just to make it visible */
	}

	.cd4 {
		position: absolute;
		left: 0;
		height: 100%;
		width: 6px;
		background-color: rgb(193, 35, 61); /* just to make it visible */
	}
</style>
