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
</script>

<Modal bind:display closeable={false}>
	<div class={display ? '' : 'hide'}>
		<button on:click={() => (display = false)}>Hide</button>
		<button on:click={() => (displayList = !displayList)}
			>{#if displayList}Back to Music{:else}All Playlists{/if}</button
		>

		<div class={!displayList ? '' : 'hide'}>{title}</div>
		<iframe
			class={!displayList ? '' : 'hide'}
			title="audioplayer"
			width="100%"
			height="300"
			scrolling="no"
			frameborder="no"
			allow="autoplay"
			{src}
		></iframe>

		<div class={displayList ? '' : 'hide'}>
			Playlist List
			{#each allSrc as pl}
				<button on:click={() => switchPlaylist(pl.src, pl.title)}>{pl.title}</button>
			{/each}
		</div>
	</div>
</Modal>

<style>
	.hide {
		display: none;
	}
</style>
