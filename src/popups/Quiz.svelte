<script>
	// @ts-nocheck

	import { getLoginToken } from '$lib/jshelp/localtoken';
	import { postQuiz } from '$lib/jshelp/user';
	import { getUser } from '$lib/stores/user';
	import QuizOption from '../components/QuizOption.svelte';
	import Modal from '../templates/Modal.svelte';

	export let exists = true;
	let exiting = false;
	let secondsLeft = 4;

	let incrementor = 1;
	let error = '';

	let stamina = '2';
	let endurance = '2';
	let lowerSt = '2';
	let upperSt = '2';
	let plyo = '2';

	let staminaQuestion = 'How good is your stamina relative to the average person?';
	let enduranceQuestion = 'How good is your endurance relative to the average person?';
	let lowerStQuestion = 'How good is your lower body strength relative to the average person?';
	let upperStQuestion = 'How good is your upper body strength relative to the average person?';
	let plyoQuestion = 'How much impact/plyometric exercise would you like in your workouts?';

	let mostOptions = ['Low', 'Average', 'High', 'Aburd'];
	let plyoOptions = ['NONE', 'Limited', 'Regular', 'Extra'];

	async function submit() {
		try {
			const token = await getLoginToken();
			const body = {
				stamina: Number(stamina),
				endurance: Number(endurance),
				lowerstrength: Number(lowerSt),
				upperstrength: Number(upperSt),
				plyo: Number(plyo)
			};
			await postQuiz(token, body);
			await getUser(token, true);
            exitMessage();
		} catch (err) {
			error = err;
		}
	}

	function exitMessage() {
		exiting = false;
		etInterval(() => {
			if (secondsLeft > 0) {
				secondsLeft--;
			} else {
				exists = false;
				clearInterval(interval);
			}
		}, 1000);
	}
</script>

<Modal bind:open={exists}>
	<div class="closeline">
		<button class="link-button" on:click={() => (exists = false)}>&times;</button>
	</div>

	{#if error}
		F: {error}
	{:else if exiting}
		<h1>Your submission has successfully been received! Closing in {secondsLeft} seconds...</h1>
	{:else}
		<h1>Fill out this quiz if you don't want to do an assessment workout</h1>

		{#if incrementor == 1}
			<QuizOption text={staminaQuestion} options={mostOptions} bind:result={stamina} />
		{:else if incrementor == 2}
			<QuizOption text={enduranceQuestion} options={mostOptions} bind:result={endurance} />
		{:else if incrementor == 3}
			<QuizOption text={lowerStQuestion} options={mostOptions} bind:result={lowerSt} />
		{:else if incrementor == 4}
			<QuizOption text={upperStQuestion} options={mostOptions} bind:result={upperSt} />
		{:else}
			<QuizOption text={plyoQuestion} options={plyoOptions} bind:result={plyo} />
		{/if}

		<div>
			{#if incrementor > 1}
				<button class="submit" on:click={() => incrementor--}>Back</button>
			{:else}
				<button class="submit nochange">Back</button>
			{/if}

			{#if incrementor < 5}
				<button class="submit" on:click={() => incrementor++}>Next</button>
			{:else}
				<button class="submit nochange">Next</button>
			{/if}
		</div>

		<div>
			{#if incrementor == 5}
				<button class="submit" on:click={submit}>Submit</button>
			{:else}
				<button class="submit nochange">Submit</button>
			{/if}
		</div>
	{/if}
</Modal>

<style>
	.nochange {
		cursor: default;
		background-color: rgb(211, 211, 211);
	}

	.submit {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}
</style>
