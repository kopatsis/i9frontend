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
				<div class="loading" id="loader" style="display: none">
					<div class="bouncer">
						<img src="/images/i9logotsp.png" alt="sdafa" />
					</div>
					<div class="loader2"></div>
				</div>
			{:else if error}
				<div>F: {error}</div>
			{:else}
				<h1>
					Full {#if current === 'Exercise'}Exercise{:else}Stretch{/if} List
				</h1>
				<div class="maincontent">
					{#if current === 'Exercise'}
						<ExerLib library={exers} bind:current />
					{:else}
						<StrLib library={strs} bind:current />
					{/if}
				</div>
			{/if}
		</div>

		<div class="footer">
			<MainFooter />
		</div>
	</div>
</div>

<style>
	.maincontent {
		width: 100%;
		place-items: center;
	}

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
		overflow-y: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		margin-top: 0px;
	}
</style>
