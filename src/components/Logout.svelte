<script>
	import { goto } from "$app/navigation";
	import { logout } from "$lib/jshelp/localtoken";

    const logoutBoth = () => {
        logout();
        goto('./login');
    }
</script>

<button on:click={logoutBoth}>Logout</button>