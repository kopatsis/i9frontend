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
		data = { ...data, [key]: newvalue };
		localStorage.setItem(key, newvalue);
	}
</script>

<div class="ask">
	{labelMap[key]}:
</div>

<div class="options">
	{#each options as option}
		<button on:click={() => updatePair(option)}
			>{#if option === data[key]}<b>{option}</b>{:else}{option}{/if}</button
		>
	{/each}
</div>

<style>
	.ask {
		margin-left: 5px;
	}
	.options {
		display: flex;
		width: 100%;
		margin-bottom: 10px;
	}

	.options button {
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
