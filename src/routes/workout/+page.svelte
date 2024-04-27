<script>
	// @ts-nocheck
	import { workoutType } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
    import ActiveStrWo from './ActiveStrWO.svelte';
    import ActiveIntroWo from './ActiveIntroWO.svelte';
    import ActiveWo from './ActiveWO.svelte';

	let type;
	const unsubscribe = workoutType.subscribe((woType) => {
		type = woType;
	});
	onDestroy(unsubscribe);

	onMount(() => {
		if(!getLoginState()){
			goto('./login');
		}
	})

</script>

{#if type === 'Stretch'}
	<ActiveStrWo />
{:else if type === 'Intro'}
	<ActiveIntroWo />
{:else}
    <ActiveWo />
{/if}