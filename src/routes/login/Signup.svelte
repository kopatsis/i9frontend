<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { setLocalLogout } from '$lib/jshelp/localtoken';
	import { postNewUser } from '$lib/jshelp/user';
	import { onMount } from 'svelte';

	import { auth } from '../../auth/firebase';
	import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

	export let signUp = true;
	export let merging = false;
	export let localToken = '';
	export let loading = true;

	let password = '';
	let confirmPassword = '';

	let showPassword = false;
	let showConfirmPassword = false;

	let email = '';
	let emailValid = false;

	let error = '';
	let name = '';
	let passwordActive = false;

	function validateEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	$: emailValid = validateEmail(email);

	$: hasMinimumLength = password.length >= 10;
	$: containsLetter = /[a-zA-Z]/.test(password);
	$: containsNumber = /\d/.test(password);

	$: isValidPassword = hasMinimumLength && containsLetter && containsNumber;

	$: passwordsMatch = password === confirmPassword || password === '';

	async function signupFirebase() {
		if (isValidPassword && passwordsMatch && emailValid) {
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				const token = await user.getIdToken();

				if (merging) {
					await mergeLocalUser(token, localToken, name, user.refreshToken);
					merging = false;
				} else {
					await postNewUser(token, name, user.refreshToken);
				}
				setLocalLogout();
				await sendEmailVerification(user);
				goto('./');
			} catch (err) {
				if (err.code === 'auth/email-already-in-use') {
					error = 'Email already in use. Please login or use another email.';
				} else {
					error = err;
				}
			}
		}
	}

	onMount(() => {
		loading = false;
	})
</script>

{#if error}
	<div>F: {error}</div>
{/if}

<div class="loginouter">
	{#if merging}
		<div class="signinopt centerit">
			Creating account w/ Existing History<br />
			<button class="link-button centerit" type="button" on:click={() => (merging = false)}
				>Create Blank Account Instead</button
			>
		</div>
	{/if}
	<div class="logintxt">Sign up</div>

	{#if !merging}
	<div class="signinopt">
		or <button class="link-button" type="button" on:click={() => (signUp = false)}
			>use an existing account</button
		>
	</div>
	{/if}
</div>

<form>
	<label class="hide" for="name">Name:</label>
	<input type="text" id="name" bind:value={name} placeholder="Name" required />

	<label class="hide" for="email">Email:</label>
	<input type="email" id="email" bind:value={email} placeholder="Email" required />

	<label class="hide" for="password">Password:</label>
	<input
		type="password"
		id="password"
		bind:value={password}
		placeholder="Password"
		required
		on:focus={() => (passwordActive = true)}
		on:blur={() => (passwordActive = false)}
	/>

	<div class="verif" class:complete={hasMinimumLength}>
		{#if hasMinimumLength}&check;{:else}&times;{/if} Password must be at least 10 characters
	</div>
	<div class="verif" class:complete={containsLetter}>
		{#if containsLetter}&check;{:else}&times;{/if} Password must contain at least one letter
	</div>
	<div class="verif" class:complete={containsNumber}>
		{#if containsNumber}&check;{:else}&times;{/if} Password must contain at least one number
	</div>

	<label class="hide" for="confirmPassword">Confirm Password:</label>
	<input
		type="password"
		id="confirmPassword"
		bind:value={confirmPassword}
		placeholder="Confirm Password"
		required
	/>

	<div class="verif" class:invis={(passwordActive && !isValidPassword) || passwordsMatch}>
		Passwords do not match
	</div>

	{#if isValidPassword && passwordsMatch && emailValid && name !== ''}
		<button class="submit" on:click|preventDefault={signupFirebase}>Sign Up</button>
		<div class="verif complete">Ready to submit!</div>
	{:else}
		<button class="submit" type="button">Sign Up</button>
		{#if isValidPassword && passwordsMatch && name !== ''}
			<div class="verif">Please enter a valid email address</div>
		{:else}
			<div class="verif">Please complete all required fields</div>
		{/if}
	{/if}
</form>

<style>
	.centerit{
		text-align: center;
	}

	.verif.invis {
		visibility: hidden;
	}

	.link-button {
		background: none;
		border: none;
		color: rgb(59, 59, 59);
		text-decoration: underline;
		cursor: pointer;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
	}

	.link-button:hover,
	.link-button:focus {
		text-decoration: none;
	}

	.logintxt {
		font-size: 48px;
	}

	.loginouter {
		display: flex;
		min-height: 40dvh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	@media (max-height: 700px) {
		.loginouter {
			min-height: 34.2857dvh;
		}
	}

	@media (max-height: 600px) {
		.loginouter {
			min-height: 28.5714dvh;
		}
	}

	@media (max-height: 500px) {
		.loginouter {
			min-height: 25dvh;
		}
	}

	@media (max-height: 400px) {
		.loginouter {
			min-height: fit-content;
		}
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
		color: inherit;
		background-color: white;
		font-weight: normal;
	}

	.submit:hover {
		background-color: aliceblue;
	}

	button {
		cursor: pointer;
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

	input {
		border: 1px solid rgb(137, 151, 155);
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin: 4px;
		padding-left: 10px;
		padding-right: 10px;
		min-width: min(444px, calc(100dvw - 50px));
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.verif {
		font-size: 14px;
		margin-top: -1px;
		margin-bottom: -1px;
		color: red;
	}

	.verif.complete {
		color: green;
	}
</style>
