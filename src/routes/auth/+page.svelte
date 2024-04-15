<script>
// @ts-nocheck

	import { postNewUser } from '$lib/jshelp/user';

    import { auth } from '../../auth/firebase';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
  
    let email = '';
    let password = '';
    let errorMessage = '';
  
    const signUp = async () => {
      try {
        console.log("em", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const name = userCredential.user.email ? userCredential.user.email : "New User Name";
        const result = await postNewUser(userCredential.user.accessToken, name);
        console.log(result);
      } catch (error) {
        errorMessage = error.message;
      }
    };
  
    const signIn = async () => {
      try {
        console.log("em", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Signed in:', userCredential);
        console.log(userCredential.user.accessToken);
      } catch (error) {
        errorMessage = error.message;
      }
    };
  </script>
  
  <h1>Login or Sign Up</h1>
  <input type="email" bind:value={email} placeholder="Email">
  <input type="password" bind:value={password} placeholder="Password">
  <button on:click={signUp}>Sign Up</button>
  <button on:click={signIn}>Sign In</button>
  {#if errorMessage}
    <p style="color: red;">{errorMessage}</p>
  {/if}