<script>
	// @ts-nocheck

	export let key = 'theme';
	export let data = {
		theme: 'DceYdZ',
		sound: 'DceYdZ',
		motion: '3ojnKb',
		data: '3ojnKb',
		back: 'DceYdZ'
	};

	let labelMap = {
		theme: 'Dark Mode Theme',
		sound: 'In-App Sounds',
		motion: 'Motion Reduction',
		data: 'Data Saver Mode',
		back: 'Workouts Continue in Background'
	};

	let keyMap = {
		theme: 'bWEemu',
		sound: 'W8xMSC',
		motion: 'wJJgce',
		data: 'RMrC28',
		back: 'szsY0s'
	};

	let isChecked = data[key] === 'DceYdZ';

	$: if (isChecked) {
		data = { ...data, [key]: 'DceYdZ' };
		localStorage.setItem(keyMap[key], 'DceYdZ');
	} else {
		data = { ...data, [key]: '3ojnKb' };
		localStorage.setItem(keyMap[key], '3ojnKb');
	}
</script>

<div class="main">
	<div class="ask">
		{labelMap[key]}:
	</div>

	<div class="options">
		<input type="checkbox" id={key} bind:checked={isChecked} /><label for={key}>Toggle</label>
	</div>
</div>

<style>
	.main {
		display: flex;
		width: 100%;
		justify-content: space-between;
		border: 1px solid grey;
		margin-bottom: -1px;
	}

	.ask {
		margin-left: 5px;
		align-self: center;
	}
	.options {
		display: flex;
		margin: 6px;
		margin-left: 10px;
	}

	input[type='checkbox'] {
		height: 0;
		width: 0;
		visibility: hidden;
	}

	label {
		cursor: pointer;
		text-indent: -9999px;
		width: 50px;
		height: 25px;
		background: #dedcdc;
		display: block;
		border-radius: 25px;
		position: relative;
	}

	label:after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 19px;
		height: 19px;
		background: #fff;
		border-radius: 19px;
		transition: 0.2s;
	}

	input:checked + label {
		background: #bada55;
	}

	input:checked + label:after {
		left: calc(100% - 3px);
		transform: translateX(-100%);
	}

	label:active:after {
		width: 28px;
	}
	/* .options button {
		flex: 1;
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		margin: 5px;
		padding: 5px;
		border: 1px solid rgb(137, 151, 155);
		color: inherit;
		background-color: transparent;
		font-weight: normal;
	} */
</style>
