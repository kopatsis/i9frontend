<script>
	import { goto } from '$app/navigation';
	import { logout } from '$lib/jshelp/localtoken';

	const logoutBoth = () => {
		logout();
		goto('./login');
	};
</script>

<button class="submit" on:click={logoutBoth}>Sign Out</button>

<style>
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
</style>
