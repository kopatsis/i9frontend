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

    function increment() {
        number = Math.max(Math.min(number + 1, 10), 0);
        updateBackground();
    }

    function decrement() {
        number = Math.max(Math.min(number - 1, 10), 0);
        updateBackground();
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
		<button on:click={increment}>-</button>
		<pre>{number}</pre>
		<button on:click={decrement}>+</button>
	</div>
</div>

<style>
	.updater {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	pre {
		font-family: 'Courier New', Courier, monospace;
		margin: 0;
		font-size: 16px;
		padding-left: 5px;
		padding-right: 5px;
		border-radius: 0px;
		background: #dedcdc;
		height: clamp(25px, min(5dvw, 5dvh), 35px);
		text-align: center;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: clamp(20px, min(4dvw, 4dvh), 30px);
	}

	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		padding-left: 5px;
		padding-right: 5px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
		height: clamp(25px, min(5dvw, 5dvh), 35px);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: clamp(20px, min(4dvw, 4dvh), 30px);
	}

	button:hover {
		background-color: aliceblue;
	}

	.options {
		display: flex;
		align-items: center;
		justify-content: center;
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
		min-width: 200px;
		max-width: 800px;
		flex: 1;
		height: clamp(25px, min(5dvw, 5dvh), 35px);
		background: #dedcdc;
		border-radius: clamp(25px, min(5dvw, 5dvh), 35px);
		position: relative;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: clamp(25px, min(5dvw, 5dvh), 35px);
		height: clamp(25px, min(5dvw, 5dvh), 35px);
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
		position: relative;
		transition: 0.2s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	}

	input[type='range']::-moz-range-thumb {
		width: clamp(25px, min(5dvw, 5dvh), 35px);
		height: clamp(25px, min(5dvw, 5dvh), 35px);
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
		transition: 0.2s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
	}

	input[type='range']:active::-webkit-slider-thumb,
	input[type='range']:active::-moz-range-thumb {
		width: clamp(28px, min(5.5dvw, 5.5dvh), 39px);
	}

	input[type='range']:active::-webkit-slider-thumb {
		width: clamp(28px, min(5.5dvw, 5.5dvh), 39px);
	}

	input[type='range']:active::-moz-range-thumb {
		width: clamp(28px, min(5.5dvw, 5.5dvh), 39px);
	}
</style>
