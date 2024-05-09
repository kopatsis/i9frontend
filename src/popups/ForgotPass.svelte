<script>
	// @ts-nocheck

	import { auth } from "../auth/firebase";
	import { sendPasswordResetEmail } from 'firebase/auth';

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

{#if success}
	<div>Successfully sent reset email to {email}</div>
{/if}

<form on:submit|preventDefault={sendReset}>
	<div>
		<label for="email">Email:</label>
		<input id="email" type="email" bind:value={email} placeholder="Enter your email" required />
	</div>
	<div>
		<button type="submit">Send Reset Email</button>
	</div>
	{#if errorMessage}
		<p style="color: red;">{errorMessage}</p>
	{/if}
</form>
