<script>
	// @ts-nocheck

	export let key = 'mode';
	export let data = { mode: 'Dark Mode', sound: 'Regular', motion: 'Regular', data: 'Regular' };
	export let options = ['Dark Mode', 'Light Mode'];

	let labelMap = {
		mode: 'Appearance Theme',
		sound: 'Sound Settings',
		motion: 'Motion Setings',
		data: 'Data Usage'
	};

	function updatePair(newvalue) {
		data = { ...data, [key]: newvalue };
		localStorage.setItem('yZgvPlBiFb', JSON.stringify(data));
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
	.ask{
		margin-left: 5px;
	}
	.options{
		display: flex;
		width: 100%;
		margin-bottom: 10px;
	}

	.options button{
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
