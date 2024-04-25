<script>
    import ExerLib from "./ExerLib.svelte";
    import StrLib from "./StrLib.svelte";
	let current = 'Exercise';
</script>

<button
	on:click={() => {
		if (current !== 'Exercise') {
			current = 'Exercise';
		}
	}}>{#if current === 'Exercise'}+{/if}Exercises</button
>
<button
	on:click={() => {
		if (current !== 'Stretch') {
			current = 'Stretch';
		}
	}}
	>{#if current === 'Stretch'}+{/if}Stretches</button
>

{#if current === "Exercise"}
    <ExerLib />
{:else}
    <StrLib />
{/if}
