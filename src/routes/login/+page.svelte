<script>
// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLocalToken, setLoginState, setLoginToken } from '$lib/jshelp/localtoken';

	async function createLocalUser() {
		const url = `${import.meta.env.VITE_BACKEND_URL}/users/local`;

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: 'local' })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			throw new Error('Error creating local user:' + error);
		}
	}

	const login = async () => {
		if (getLocalToken() === '') {
            try{
                const token = await createLocalUser();
				console.log(token.Token);
                setLoginToken(token.Token);
            } catch(error){
                setLoginToken("")
            }
		}
		setLoginState(true);
		goto('./');
	};
</script>

<button on:click={login}>Login</button>
