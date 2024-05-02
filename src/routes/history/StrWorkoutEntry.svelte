<script>
	// @ts-nocheck

	export let entry = null;
	let expanded = false;

	function formatDateString(isoDateString) {
		const date = new Date(isoDateString);
		return date.toLocaleString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
	}

	function timeString(time) {
		const secs =
			Math.floor((time % 1) * 60) < 10
				? '0' + Math.floor((time % 1) * 60)
				: Math.floor((time % 1) * 60);
		const mins = Math.floor(time);
		return mins + 'm' + secs + 's';
	}

	function getFirst3(strings) {
		const uniqueStrings = [];
		for (let str of strings) {
			if (!uniqueStrings.includes(str)) {
				uniqueStrings.push(str);
				if (uniqueStrings.length === 3) break;
			}
		}
		return uniqueStrings.join(', ') + '...';
	}

</script>

<div>Date: {formatDateString(entry.Date)}</div>
<div>Name: {entry.Name}</div>
<div>Status: {entry.Status}</div>
<div>
	Time: {#if entry.Status !== 'Rated'}{timeString(entry.PausedTime)}{:else}{timeString(
			entry.Minutes
		)}{/if} / {timeString(entry.Minutes)}
</div>
{#if !expanded}
	<div>Dynamic Stretches: {getFirst3(entry.Dynamics)}</div>
	<div>Static Stretches: {getFirst3(entry.Statics)}</div>
	<button on:click={() => (expanded = true)}>Expand</button>
{:else}
	<div>Dynamic Warmup:</div>
    {#each entry.Dynamics as name, i (i)}
        <div>- {Math.round(entry.StretchTimes.DynamicPerSet[i])}s: {name}</div>
    {/each}

    <div>Static Cooldown:</div>
    {#each entry.Statics as name, i (i)}
        <div>- {Math.round(entry.StretchTimes.StaticPerSet[i])}s: {name}</div>
    {/each}
	<button on:click={() => (expanded = false)}>Collapse</button>
{/if}

<br /><br />
