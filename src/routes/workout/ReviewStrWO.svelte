<script>
	import { storedWorkout } from '$lib/stores/workout.js';
	import { onDestroy } from 'svelte';

	let workout;
	const unsubscribe = storedWorkout.subscribe((storedWO) => {
		workout = storedWO;
	});

	onDestroy(() => {
        unsubscribe();
    });

</script>
