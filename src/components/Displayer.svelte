<script>
// @ts-nocheck

	import { preloadImages } from "$lib/jshelp/preloader";

// @ts-nocheck

import { obj } from "$lib/stores/exampletimes";
	import { onMount } from "svelte";

    export let time;
    let index = 0;
    let nextTime = 0;
    let url = '';

    $: if (time > nextTime && index < obj.length) {
        index++;
        if (index >= obj.length){
            url = '';
        } else {
            nextTime = obj[index].time;
            url = obj[index-1].url;
        }
    }

    // func here for button to set imaginary index2 to corresponding index & update URL like so url = obj[index-1].url[index2]

onMount(() => {
    let set = new Set();
    obj.forEach(item => {
        set.add(item.url);
    })
    preloadImages(Array.from(set));
});

</script>

{#if url !== ''}
    <img src="{url}" alt="random img"/>
    <!-- buttons here to change view -->
{:else}
    <div>No image</div>
{/if}