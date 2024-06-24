<script>
	// @ts-nocheck

	import { exercises, getLibrary, stretches } from '$lib/stores/library';
	import { onDestroy, onMount } from 'svelte';
	import ExerLib from './ExerLib.svelte';
	import StrLib from './StrLib.svelte';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import { goto } from '$app/navigation';
	import MainFooter from '../../components/MainFooter.svelte';
	import MainHeader from '../../components/MainHeader.svelte';

	let current = 'Exercise';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;
	let error = '';

	let exers;
	const unsubscribeEx = exercises.subscribe((exercises) => {
		exers = exercises;
	});

	let strs;
	const unsubscribeSt = stretches.subscribe((stretches) => {
		strs = stretches;
	});

	function switchType(type) {
		if (current !== type) {
			current = type;
		}
	}

	onDestroy(() => {
		unsubscribeEx();
		unsubscribeSt();
	});

	async function mountCall() {
		try {
			const token = await getLoginToken();
			await getLibrary(token);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			local = value;
			if (local && !firebaseUser) {
				mountCall();
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
			firebaseUser = value;
			if (firebaseUser === undefined && !local) {
				loading = true;
			} else if (firebaseUser === null && !local) {
				goto('./login');
			} else if (firebaseUser) {
				mountCall();
			}
		});

		return () => {
			unsubLocalLogin();
			unsubFirebase();
		};
	});
</script>

<div class="centerpage">
	<div class="wholepage">
		<div class="header">
			<MainHeader />
		</div>

		<div class="headerstupid">
			{#if loading}
				<div>loading...</div>
			{:else if error}
				<div>F: {error}</div>
			{:else}
				<button class="changebutton" on:click={() => switchType('Exercise')}>
					{#if current === 'Exercise'}<b>Exercises</b>{:else}Exercises{/if}
				</button>
				<button class="changebutton" on:click={() => switchType('Stretch')}>
					{#if current === 'Stretch'}<b>Stretches</b>{:else}Stretches{/if}
				</button>

				{#if current === 'Exercise'}
					<ExerLib library={exers} />
				{:else}
					<StrLib library={strs} />
				{/if}
			{/if}
		</div>

		<div class="footer">
			<MainFooter />
		</div>
	</div>
</div>

<style>
	.centerpage {
		display: flex;
		align-items: center;
		justify-content: center;
		display: flex;
		position: fixed;
		background-color: rgb(97, 97, 97);
		width: 100dvw;
		height: 100dvh;
	}

	.wholepage {
		height: 100dvh;
		width: min(100dvw, 960px);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: fixed;
		background-color: white;
	}
	
	.header,
	.footer {
		width: 100%;
	}

	.headerstupid {
		margin-top: 5px;
		margin-bottom: 5px;
		margin-left: 5px;
		margin-right: 5px;
		height: 100%;
		box-sizing: border-box;
		overflow-y: scroll;
		flex: 1;
	}

	.changebutton {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin-left: 4px;
		margin-right: 4px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}
</style>
