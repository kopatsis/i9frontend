<script>
// @ts-nocheck

	import { exercises, getLibrary, stretches } from '$lib/stores/library';
	import { onDestroy, onMount } from 'svelte';
	import ExerLib from './ExerLib.svelte';
	import StrLib from './StrLib.svelte';
	import Logout from '../Logout.svelte';
	import { getLoginToken } from '$lib/jshelp/localtoken';

	let current = 'Exercise';
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

	onMount(async () => {
		try {
			const token = getLoginToken();
			await getLibrary(token)
			loading = false
		} catch (err){
			error = err
		}
	});
</script>

{#if loading}
	<div>loading...</div>
{:else if error}
	<div>F: {error}</div>
{:else}
	<button
		on:click={() => {
			if (current !== 'Exercise') {
				current = 'Exercise';
			}
		}}
		>{#if current === 'Exercise'}+{/if}Exercises</button
	>
	<button
		on:click={() => {
			if (current !== 'Stretch') {
				current = 'Stretch';
			}
		}}
		>{#if current === 'Stretch'}+{/if}Stretches</button
	>

	{#if current === 'Exercise'}
		<ExerLib library={exers}/>
	{:else}
		<StrLib library={strs} />
	{/if}
{/if}
<Logout />
