<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	export let open = true;
	export let closeable = true;
	export let display = true;
	export let closerFunc = null;

	function closerAny() {
		if (closerFunc) {
			closerFunc();
		}
		if (closeable) {
			open = false;
		} else {
			display = false;
		}
	}

	/**
	 * @param {{ key: string; }} event
	 */
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closerAny()
		}
	}

	/**
	 * @param {{ key: string; }} event
	 */
	function handleKeydownOuter(event) {
		if (event.key === 'Enter') {
			closerAny()
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div
	class="backdrop"
	class:none={!display}
	on:click={closerAny}
	tabindex="0"
	on:keydown={handleKeydownOuter}
	role="button"
	aria-label="Close modal"
>
	<div class="modal" on:click|stopPropagation aria-hidden="true">
		<slot />
	</div>
</div>

<style>
	.backdrop.none {
		display: none;
	}

	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.44);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
		cursor: pointer;
	}

	.modal {
		padding: 20px;
		background: white;
		border-radius: 5px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 2001;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 90%;
		max-height: 90%;
		overflow-y: auto;
		cursor: default;
		max-height: 80dvh;
		max-width: 87.5dvw;
	}
</style>
