<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { setLocalLogout } from '$lib/jshelp/localtoken';
	import { postNewUser } from '$lib/jshelp/user';

	import { auth } from '../../auth/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';

	export let signUp = true;

	let password = '';
	let confirmPassword = '';

	let showPassword = false;
	let showConfirmPassword = false;

	let email = '';
	let emailValid = false;

	let error = '';
	let name = '';

	function validateEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	$: emailValid = validateEmail(email);
	$: emailMessage = emailValid ? 'Email is valid' : 'Please enter a valid email address';

	$: hasMinimumLength = password.length >= 10;
	$: containsLetter = /[a-zA-Z]/.test(password);
	$: containsNumber = /\d/.test(password);

	$: isValidPassword = hasMinimumLength && containsLetter && containsNumber;

	$: passwordsMatch = password === confirmPassword && password !== '';

	$: lengthMessage = hasMinimumLength
		? 'Length is sufficient.'
		: 'Password must be at least 10 characters.';
	$: letterMessage = containsLetter
		? 'Contains at least one letter.'
		: 'Password must contain at least one letter.';
	$: numberMessage = containsNumber
		? 'Contains at least one number.'
		: 'Password must contain at least one number.';
	$: matchMessage = passwordsMatch ? 'Passwords match.' : 'Passwords must match.';

	async function signupFirebase() {
		if (isValidPassword && passwordsMatch && emailValid) {
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				const token = await user.getIdToken();
				await postNewUser(token, name);
				setLocalLogout();
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
</script>

{#if error}
	<div>F: {error}</div>
{/if}

<div class="loginouter">
	<div class="logintxt">Sign up</div>
	<div class="signinopt">
		or <button class="link-button" type="button" on:click={() => (signUp = false)}
			>use an existing account</button
		>
	</div>
</div>

<form>
	<label class="hide" for="name">Name:</label>
	<input type="text" id="name" bind:value={name} placeholder="Name" required />

	<label class="hide" for="email">Email:</label>
	<input type="email" id="email" bind:value={email} placeholder="Email" required />
	<div class="verif">{emailMessage}</div>

	<label class="hide" for="password">Password:</label>
	<input type="password" id="password" bind:value={password} placeholder="Password" required />

	<label class="hide" for="confirmPassword">Confirm Password:</label>
	<input
		type="password"
		id="confirmPassword"
		bind:value={confirmPassword}
		placeholder="Confirm Password"
		required
	/>
	<div class="verif">{lengthMessage}</div>
	<div class="verif">{letterMessage}</div>
	<div class="verif">{numberMessage}</div>
	<div class="verif">{matchMessage}</div>

	{#if isValidPassword && passwordsMatch && emailValid}
		<button class="submit" on:click|preventDefault={signupFirebase}>Sign Up</button>
		<div>Password is valid and confirmed!</div>
	{:else}
		<button class="submit" type="button">Sign Up</button>
		<div class="verif">Please complete all required fields</div>
	{/if}
</form>

<style>
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
		background-color: transparent;
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
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.verif {
		font-size: 12px;
		color: red;
	}
</style>
