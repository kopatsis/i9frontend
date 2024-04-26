<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';

	import { auth } from '../../auth/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';

	let password = '';
	let confirmPassword = '';

	let showPassword = false;
	let showConfirmPassword = false;

	let email = '';
	let emailValid = false;

	let error = '';

	function validateEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	$: emailValid = validateEmail(email);
	$: emailMessage = emailValid ? 'Email is valid' : 'Please enter a valid email address';

	$: hasMinimumLength = password.length >= 10;
	$: containsLetter = /[a-zA-Z]/.test(password);
	$: containsNumber = /\d/.test(password);

	$: isValidPassword = hasMinimumLength && containsLetter && containsNumber;

	$: passwordsMatch = password === confirmPassword;

	$: lengthMessage = hasMinimumLength
		? 'Length is sufficient.'
		: 'Password must be at least 10 characters.';
	$: letterMessage = containsLetter
		? 'Contains at least one letter.'
		: 'Password must contain at least one letter.';
	$: numberMessage = containsNumber
		? 'Contains at least one number.'
		: 'Password must contain at least one number.';
	$: matchMessage = passwordsMatch ? 'Passwords match.' : 'Passwords do not match.';

	async function signupFirebase() {
		if (isValidPassword && passwordsMatch && emailValid) {
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				const name = user.email || 'New User Name';
				const token = await user.getIdToken();
				await postNewUser(token, name);
				goto('./');
			} catch (error) {
				if (error.code === 'auth/email-already-in-use') {
					error = 'Email already in use. Please login or use another email.';
				} else {
					error = error;
				}
			}
		}
	}
</script>

{#if error}
	<div>F: {error}</div>
{/if}

<form>
	<label for="email">Email:</label>
	<input type="email" id="email" bind:value={email} placeholder="Enter your email" />
	<p>{emailMessage}</p>

	<label for="password">Password:</label>
	<input
		type="password"
		id="password"
		bind:value={password}
		placeholder="Enter your password"
		class:hidden={showPassword}
	/>
	<input
		type="text"
		id="passwordText"
		bind:value={password}
		placeholder="Enter your password"
		class:hidden={!showPassword}
	/>
	<button on:click|preventDefault={() => (showPassword = !showPassword)}>
		{showPassword ? 'Hide' : 'Show'} Password
	</button>
	<p>{lengthMessage}</p>
	<p>{letterMessage}</p>
	<p>{numberMessage}</p>

	<label for="confirmPassword">Confirm Password:</label>
	<input
		type="password"
		id="confirmPassword"
		bind:value={confirmPassword}
		placeholder="Re-enter your password"
		class:hidden={showConfirmPassword}
	/>
	<input
		type="text"
		id="confirmPasswordText"
		bind:value={confirmPassword}
		placeholder="Re-enter your password"
		class:hidden={!showConfirmPassword}
	/>
	<button on:click|preventDefault={() => (showConfirmPassword = !showConfirmPassword)}>
		{showConfirmPassword ? 'Hide' : 'Show'} Password
	</button>
	<p>{matchMessage}</p>

	{#if isValidPassword && passwordsMatch && emailValid}
		<div>Password is valid and confirmed!</div>
		<button on:click|preventDefault={signupFirebase}>Sign Up</button>
	{:else}
		<div>Please complete all required fields</div>
		<button>Sign Up</button>
	{/if}
</form>

<style>
	.hidden {
		display: none;
	}
</style>
