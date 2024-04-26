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
		localStorage.setItem('yZgvPlBiFb', data);
	}
</script>

<div>
	{labelMap[key]}:
</div>

{#each options as option}
	<button on:click={() => updatePair(option)}
		>{#if option === data[key]}<b>{option}</b>{:else}{option}{/if}</button
	>
{/each}
