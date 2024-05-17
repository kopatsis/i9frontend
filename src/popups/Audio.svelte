<script>
	import Modal from '../templates/Modal.svelte';

	export let display = false;

	let displayList = false;
	let src =
		'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/40040861&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
	let title = 'Default Playlist';

	const allSrc = [
		{
			src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/40040861&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
			title: 'Default Playlist'
		},
		{
			src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/255837157&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
			title: 'Num 2 Playlist'
		}
	];

	/**
	 * @param {string} srcNew
	 * @param {string} titleNew
	 */
	function switchPlaylist(srcNew, titleNew) {
		src = srcNew;
		title = titleNew;
		displayList = false;
	}

	function close() {
		display = false;
		displayList = false;
	}
</script>

<Modal bind:display closeable={false}>
	<div class="whole {display ? '' : 'hide'}">
		<div class="controls">
			<button on:click={() => (displayList = !displayList)}
			>{#if displayList}Back to Music{:else}All Playlists{/if}</button
		>
		<button on:click={close}>Hide</button>
		</div>
		

		<div class={!displayList ? '' : 'hide'}>{title}</div>
		<iframe
			class={!displayList ? '' : 'hide'}
			title="audioplayer"
			width="100%"
			height="500"
			scrolling="yes"
			frameborder="no"
			allow="autoplay"
			{src}
		></iframe>

		<div class={displayList ? '' : 'hide'}>
			<div class="playlisth">Playlist List</div>
			{#each allSrc as pl}
				<div class="choicerow">
					<button on:click={() => switchPlaylist(pl.src, pl.title)}>{pl.title}</button>
				</div>
			{/each}
		</div>
	</div>
</Modal>

<style>
	.hide {
		display: none;
	}

	.controls{
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.whole{
		min-width: 80dvw;
		min-height: 65dvh;
	}

	button{
		flex: 1;
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		margin: 6px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	.choicerow{
		width: 100%;
		display: flex;
	}

	.playlisth{
		font-weight: bold;
		margin: 6px;
	}

</style>
