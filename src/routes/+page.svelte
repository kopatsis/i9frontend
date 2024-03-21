<script>
// @ts-nocheck

	import Displayer from "../components/Displayer.svelte";
import Stopwatch from "../components/Stopwatch.svelte";

    let time;

</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Stopwatch bind:time={time}/>
<Displayer time={time} />
