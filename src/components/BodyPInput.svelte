<script>
	// @ts-nocheck

	export let finalList = [];

	const allParts = {
		'Left Calf': 1,
		'Right Calf': 2,
		'Left Quad': 3,
		'Right Quad': 4,
		'Left Hamstring': 5,
		'Right Hamstring': 6,
		Glutes: 7,
		Abs: 8,
		'Lower Back': 9,
		'Upper Back': 10,
		'Left Bicep': 11,
		'Right Bicep': 12,
		'Left Tricep': 13,
		'Right Tricep': 14,
		'Left Shoulder': 15,
		'Right Shoulder': 16,
		Neck: 17,
		Chest: 18,
		'Left Hip': 19,
		'Right Hip': 20
	};

	let inlist = [];
	finalList.forEach((part) => {
		inlist.push(allParts[part]);
	});

	let outlist = [];
	for (const key in allParts) {
		if (!inlist.includes(key)) {
			outlist.push(key);
		}
	}

	const addItem = (key) => {
		finalList.push(allParts[key]);
		finalList = finalList;
		inlist.push(key);
		inlist.sort();
		inlist = inlist;
		outlist = outlist.filter((item) => item !== key);
		current = '';
	};

	const subItem = (key) => {
		finalList = finalList.filter((item) => item !== allParts[key]);
		finalList = finalList;
		outlist.push(key);
		outlist.sort();
		outlist = outlist;
		inlist = inlist.filter((item) => item !== key);
	};

	let current = '';
</script>

<div>
	<label for="inputWithList">Body Parts to avoid:</label>
</div>
<div class="editline">
	<input type="text" id="inputWithList" list="optionsList" bind:value={current} />
	<button
		type="button"
		on:click={() => {
			if (current !== '' && outlist.includes(current)) {
				addItem(current);
			}
		}}>+ Add</button
	>
</div>

<datalist id="optionsList">
	{#each outlist as item}
		<option value={item}>{item}</option>
	{/each}
</datalist>

<ul>
	{#each inlist as item}
		<li>
			<button
				type="button"
				on:click={() => {
					subItem(item);
				}}>&times;</button
			>&nbsp;{item}
		</li>
	{/each}
</ul>

<style>
	button {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 14px;
		padding: 6px;
		padding-top: 0px;
		padding-bottom: 0px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	}

	ul{
		list-style-type: none;
		padding-left: 0;
		margin-bottom: 0;
	}

	li{
		margin-left: 0;
	}

	.editline{
		display: flex;
		width: 100%;
	}

	.editline button{
		margin-left: 6px;
	}

	.editline input {
		flex: 1;
	}
</style>
