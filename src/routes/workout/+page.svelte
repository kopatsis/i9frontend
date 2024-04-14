<script>
	// @ts-nocheck
	import { workoutType } from '$lib/stores/workout.js';
	import { onDestroy, onMount } from 'svelte';
	import ReviewWo from './ReviewWO.svelte';
	import ReviewStrWo from './ReviewStrWO.svelte';
	import { fetchAllSamples } from '$lib/jshelp/fetchsample';
	import Sample from '../Sample.svelte';

	// let type;
	// const unsubscribe = workoutType.subscribe((woType) => {
	// 	type = woType;
	// });
	// onDestroy(unsubscribe);

	// Del later
	let samples;
	let displ = false;
	let i = 0;
	const tempQuery = async () => {
		try {
			samples = await fetchAllSamples();
		} catch (error) {
			console.error(error);
		}
		displ = true
		console.log(samples[i].ID);
	};

	onMount(async () => {
		await tempQuery();
	});
</script>

<!-- {#if type === 'Stretch'} -->
<!-- <ReviewStrWo /> -->
<!-- {:else} -->
<!-- <ReviewWo /> -->
<!-- {/if} -->

<!-- Del later -->
<div>TEMP:</div>
{#if displ}
	{#key i }
	<Sample sampleID={samples[i].ID} />
	{/key}
	<br />
	<br />
	<button
		on:click={() => {
			displ = false
			if (i +1 < samples.length){
				i++;
			}
			displ = true
			console.log(samples[i].ID);
		}}>i++</button
	>
	<button
		on:click={() => {
			displ = false
			if (i > 0){
				i--;
			}
			displ = true
			console.log(samples[i].ID);
		}}>i--</button
	>
	<iframe title="embed" width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/321372435&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/kingtenny" title="KingTenny" target="_blank" style="color: #cccccc; text-decoration: none;">KingTenny</a> · <a href="https://soundcloud.com/kingtenny/sets/adderall-music-vol-ii" title="Adderall Music Vol. II" target="_blank" style="color: #cccccc; text-decoration: none;">Adderall Music Vol. II</a></div>
{/if}
