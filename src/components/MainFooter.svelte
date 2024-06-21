<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	function nav(path = '') {
		if ($page.url.pathname !== '/' + path) {
			console.log($page.url.pathname);
			goto('./' + path);
		}
	}
</script>

<div class="footer">
	<button
		on:click={() => nav('history')}
		class={$page.url.pathname === '/history' ? 'bold' : 'normal'}>History</button
	>
	<button on:click={() => nav()} class={$page.url.pathname === '/' ? 'bold' : 'normal'}>Home</button
	>
	<button
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
		/* position: fixed;
		bottom: 0; */
		width: 100%;
        display: flex;
	}

    button{
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
