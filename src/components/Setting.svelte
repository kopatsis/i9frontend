<script>
	// @ts-nocheck

	export let key = 'theme';
	export let data = {
		theme: 'Dark Mode',
		sound: 'Regular',
		motion: 'Regular',
		data: 'Regular',
		back: 'Paused'
	};
	export let options = ['Dark Mode', 'Light Mode'];

	let labelMap = {
		theme: 'Theme',
		sound: 'Sounds',
		motion: 'Motion',
		data: 'Data Usage',
		back: 'In Background'
	};

	function updatePair(newvalue) {
		console.log(options);
		data = { ...data, [key]: newvalue };
		localStorage.setItem(key, newvalue);
		console.log(data);
	}

	console.log(key, options, data[key])
</script>

<div class="main">
	<div class="ask">
		{labelMap[key]}:
	</div>

	<div class="options">
		{#each options as option}
			<label>
				<input
					type="radio"
					name={key}
					value={option}
					checked={option === data[key]}
					on:change={() => updatePair(option)}
				/>
				{option}
			</label>
		{/each}
	</div>
</div>

<style>
	.main {
		display: flex;
	}

	.ask {
		margin-left: 5px;
		width: min(125px, 24dvw);
	}
	.options {
		display: flex;
		/* width: 100%; */
		margin-bottom: 10px;
	}

	label {
		width: min(200px, 38dvw);
	}

	/* .options button {
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
	} */
</style>
