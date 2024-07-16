<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	function nav(path = '') {
		if ($page.url.pathname !== '/' + path) {
			console.log($page.url.pathname);
			goto('./' + path);
		}
	}

	let padding = '6px';
	let fontSize = '16px';

	function updateStyles() {
		const height = window.innerHeight;
		const width = window.innerWidth;

		if (height < 500) {
			padding = '3px';
			fontSize = '14px';
		} else if (height > 900 && width > 900) {
			padding = '7px';
			fontSize = '18px';
		} else {
			padding = '6px';
			fontSize = '16px';
		}
	}

	onMount(() => {
		updateStyles();
		window.addEventListener('resize', updateStyles);
	});
</script>

<div class="footer">
	<button
		style="padding: {padding}; font-size: {fontSize};"
		on:click={() => nav('history')}
		class={$page.url.pathname === '/history' ? 'bold' : 'normal'}>History</button
	>
	<button
		style="padding: {padding}; font-size: {fontSize};"
		on:click={() => nav()}
		class={$page.url.pathname === '/' ? 'bold' : 'normal'}>Home</button
	>
	<button
		style="padding: {padding}; font-size: {fontSize};"
		on:click={() => nav('library')}
		class={$page.url.pathname === '/library' ? 'bold' : 'normal'}>Library</button
	>
</div>

<style>
	.bold {
		font-weight: bolder;
	}
	.normal {
		font-weight: normal;
	}

	.footer {
		width: 100%;
		display: flex;
	}

	button {
		flex: 1;
		margin: 0;
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		padding: 6px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: white;
		font-weight: normal;
		cursor: pointer;
	}

	button:hover {
		background-color: aliceblue;
	}
</style>
