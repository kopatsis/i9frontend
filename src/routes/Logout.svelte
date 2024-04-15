<script>
	import { goto } from '$app/navigation';
	import { setLoginState } from '$lib/jshelp/localtoken';
	import { auth } from '../auth/firebase';
	import { signOut } from 'firebase/auth';

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error('Unexpected error during logout:', error);
		} finally {
			setLoginState(false);
			goto('./login');
		}
	};
</script>

<button on:click={logout}>Logout</button>
