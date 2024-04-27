<script>
// @ts-nocheck

    import { auth } from '../../auth/firebase';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    let email = '';
    let password = '';
    let errorMessage = '';
    let isUserLoggedIn = false;
  
    async function signIn() {
      try {
        await auth.signInWithEmailAndPassword(email, password);
        goto('/');
      } catch (error) {
        errorMessage = error.message;
        console.error('Login error:', error);
      }
    }
  
    onMount(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          isUserLoggedIn = true;
        }
      });
    });
  
    function proceed() {
      goto('/');
    }
  </script>
  
  {#if isUserLoggedIn}
    <div>
      <p>You are already logged in. Would you like to stay signed in?</p>
      <button on:click={proceed}>Proceed</button>
    </div>
  {:else}
    <form on:submit|preventDefault={signIn}>
      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} placeholder="Enter your email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" type="password" bind:value={password} placeholder="Enter your password" required>
      </div>
      <div>
        <button type="submit">Sign In</button>
      </div>
      {#if errorMessage}
        <p style="color: red;">{errorMessage}</p>
      {/if}
    </form>
  {/if}
  