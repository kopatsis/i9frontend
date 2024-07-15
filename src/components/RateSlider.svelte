<script>
	// @ts-nocheck

	export let number = 0;

	let rangeInput;

	function updateBackground() {
		const value = ((number - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
		const offset = 1;
		let adjustedValue = value;

		if (value < 50) {
			adjustedValue = value + offset;
		} else {
			adjustedValue = value - offset;
		}

		rangeInput.style.background = `linear-gradient(to right, #bada55 0%, #bada55 ${adjustedValue}%, #dedcdc ${adjustedValue}%, #dedcdc 100%)`;
	}

</script>

<div class="options">
	<input
		type="range"
		min="0"
		max="10"
		bind:value={number}
		bind:this={rangeInput}
		on:input={updateBackground}
	/>
	<label for="range" class="sr-only">Toggle</label>
    <div class="updater">
        <button on:click={() => number = Math.max(Math.min(number+1, 10), 0)}>+</button>
        <pre>{number}</pre>
        <button on:click={() => number = Math.max(Math.min(number-1, 10), 0)}>-</button>
    </div>
    
</div>

<style>

    .updater {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    pre {
        font-family: 'Courier New', Courier, monospace;
    }

	.options {
		display: flex;
		align-items: center;
		margin: 6px 10px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 90%;
		height: 25px;
		background: #dedcdc;
		border-radius: 25px;
		position: relative;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 25px;
		height: 25px;
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
		position: relative;
		transition: 0.2s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	}

	input[type='range']::-moz-range-thumb {
		width: 25px;
		height: 25px;
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
		transition: 0.2s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	}

	input[type='range']:active::-webkit-slider-thumb,
	input[type='range']:active::-moz-range-thumb {
		width: 28px;
	}

	input[type='range']:active::-webkit-slider-thumb {
		width: 29px;
	}

	input[type='range']:active::-moz-range-thumb {
		width: 29px;
	}
</style>
