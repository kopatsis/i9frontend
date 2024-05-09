<script>
	// @ts-nocheck

	import { auth } from '../../auth/firebase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { setLocalLogout } from '$lib/jshelp/localtoken';
	import { postNewUser } from '$lib/jshelp/user';
	import Logout from '../../components/Logout.svelte';
	import ForgotPass from '../../popups/ForgotPass.svelte';

	export let signUp = false;
	let email = '';
	let password = '';
	let errorMessage = '';
	let isUserLoggedIn = false;
	let forgotPass = false;

	async function signIn() {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			const name = '';
			const token = await user.getIdToken();
			await postNewUser(token, name);
			setLocalLogout();
			goto('./');
		} catch (error) {
			if (error.code === 'auth/user-not-found') {
				errorMessage = 'No user with this email exists';
			} else if (error.code === 'auth/wrong-password') {
				errorMessage = 'Incorrect password for this user';
			} else {
				errorMessage = error.message;
			}
			console.error('Login error:', error);
		}
	}

	onMount(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				isUserLoggedIn = true;
			} else {
				isUserLoggedIn = false;
			}
		});
	});

	function proceed() {
		goto('./');
	}
</script>

{#if isUserLoggedIn}
	<div>
		<p>You are already logged in. Would you like to stay signed in?</p>
		<button on:click={proceed}>Proceed</button>
		<Logout />
	</div>
{:else}
	<div>Login</div>
	<form on:submit|preventDefault={signIn}>
		{#if errorMessage}
			<p style="color: red;">{errorMessage}</p>
		{/if}
		<div>
			<label for="email">Email:</label>
			<input id="email" type="email" bind:value={email} placeholder="Enter your email" required />
		</div>
		<div>
			<label for="password">Password:</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				placeholder="Enter your password"
				required
			/>
		</div>
		<div>
			<button type="submit">Sign In</button>
		</div>
		<div>
			<button class="link-button" type="button" on:click={() => (forgotPass = true)}>Forgot Password?</button>
		</div>
		<div>
			<button class="link-button" type="button" on:click={() => (signUp = true)}>Don't have an account? Sign up here</button>
		</div>
		{#if forgotPass}
			<ForgotPass {email} bind:open={forgotPass} />
		{/if}
	</form>
{/if}

<style>
	.link-button {
	  background: none;
	  border: none;
	  color: rgb(59, 59, 59);
	  text-decoration: underline;
	  cursor: pointer;
	  padding: 0;
	  font-family: inherit;
	}
  
	.link-button:hover,
	.link-button:focus {
	  text-decoration: none;
	}
  </style>