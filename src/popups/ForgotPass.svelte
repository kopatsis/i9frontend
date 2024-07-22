<script>
	// @ts-nocheck

	import { auth } from '../auth/firebase';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import Modal from '../templates/Modal.svelte';

	export let open = true;
	export let email = '';
	let errorMessage = '';
	let success = false;

	function successMess() {
		success = true;
		setTimeout(() => {
			open = false;
		}, 999);
	}

	async function sendReset() {
		try {
			await sendPasswordResetEmail(auth, email);
			successMess();
		} catch (error) {
			if (error.code === 'auth/user-not-found') {
				errorMessage = 'No account found with that email address.';
			} else {
				errorMessage = error.message;
			}
			console.error('Login error:', error);
		}
	}
</script>

<Modal bind:open>
	{#if success}
		<div>Successfully sent reset email to {email}</div>
	{/if}

	<div class="closeline"><button class="link-button" on:click={() => (open = false)}>&times;</button></div>

	<form on:submit|preventDefault={sendReset}>
        <div class="resethead">Reset Password</div>
		<div>
			<label class="hide" for="email">Email:</label>
			<input id="email" type="email" bind:value={email} placeholder="Email" required />
		</div>
		<div>
			<button class="submit" type="submit">Send Reset Email</button>
		</div>
		{#if errorMessage}
			<p style="color: red;">{errorMessage}</p>
		{/if}
	</form>
	<br />
</Modal>

<style>
    .resethead{
        font-size: 24px;
    }
	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
        font-size: 24px;
	}

	.closeline {
		display: flex;
		justify-content: right;
		width: 100%;
	}

	input {
		border: 1px solid rgb(137, 151, 155);
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin: 4px;
		padding-left: 10px;
		padding-right: 10px;
	}

	.hide {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		border: 0;
		clip: rect(0, 0, 0, 0);
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.submit {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		background-color: var(--main-color);
		color: white;
		font-weight: normal;
	}

	.submit:hover {
		background-color: aliceblue;
	}

	button {
		cursor: pointer;
	}
	
</style>
