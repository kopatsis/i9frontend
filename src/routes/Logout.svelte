<script>
	import { goto } from "$app/navigation";
	import { setLoginState } from "$lib/jshelp/localtoken";

    const logout = () => {
        setLoginState(false)
        goto('./login');
    }
</script>

<button on:click={logout}>Logout</button>