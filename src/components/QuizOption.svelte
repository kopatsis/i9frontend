<script>
	export let result = '2';
    export let text = 'How good is your stamina relative to the average person?';
    export let options = ["Low", "Average", "High", "Aburd"];
</script>

<form>
    <h2>{text}</h2>
	<label>
		<input type="radio" name="option" value="1" bind:group={result} />
		{options[0]}
	</label>
	<br />
	<label>
		<input type="radio" name="option" value="2" bind:group={result} />
		{options[1]}
	</label>
	<br />
	<label>
		<input type="radio" name="option" value="3" bind:group={result} />
		{options[2]}
	</label>
	<br />
	<label>
		<input type="radio" name="option" value="4" bind:group={result} />
		{options[3]}
	</label>
</form>
