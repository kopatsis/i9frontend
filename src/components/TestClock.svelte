<script>
    import { onMount } from 'svelte';
    export let duration = 4000; // duration in milliseconds
  
    let width = 0;
    onMount(() => {
      const interval = setInterval(() => {
        width += 100 / (duration / 10);
        if (width >= 100) {
          clearInterval(interval);
        }
      }, 10);
    });
  </script>
  
  <div style="width: 400px; height: 10px; background-color: black; position: relative;">
    <div style="width: {width}%; height: 100%; background-color: green; position: absolute; left: 0; top: 0;"></div>
  </div>