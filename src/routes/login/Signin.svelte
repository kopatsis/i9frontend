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

	let exUser = null;

	async function signIn() {
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			const name = '';
			const token = await user.getIdToken();
			await postNewUser(token, name, user.refreshToken);
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
				exUser = user.email;
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
	<div class="isloggedin">
		<div>
			You are already logged in{#if exUser}&nbsp;as {exUser}{/if}.
		</div>
		<div>Would you like to stay signed in?</div>
		<div class="isloggedbuttons">
			<button class="submit" on:click={proceed}>Sign In</button>
			<Logout />
		</div>
	</div>
{:else}
	<div class="loginouter">
		<div class="logintxt">Sign in</div>
		<div class="signinopt">
			or <button class="link-button" type="button" on:click={() => (signUp = true)}
				>create an account</button
			>
		</div>
	</div>
	<form on:submit|preventDefault={signIn}>
		{#if errorMessage}
			<p style="color: red;">{errorMessage}</p>
		{/if}
		<div></div>
		<div>
			<label class="hide" for="email">Email:</label>
			<input id="email" type="email" bind:value={email} placeholder="Email" required />
		</div>
		<div>
			<label class="hide" for="password">Password:</label>
			<input id="password" type="password" bind:value={password} placeholder="Password" required />
		</div>
		<div>
			<button class="submit" type="submit">Sign In</button>
		</div>
		<div>
			<button class="link-button" type="button" on:click={() => (forgotPass = true)}
				>Forgot Password?</button
			>
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
		min-width: min(444px, calc(100dvw - 50px));
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.isloggedin {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.isloggedbuttons {
		display: flex;
	}
</style>
