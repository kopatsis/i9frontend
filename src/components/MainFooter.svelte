<script>

	import { goto } from "$app/navigation";
    import { page } from '$app/stores';

    function nav(path=''){
        if($page.url.pathname !== '/'+path){
            console.log($page.url.pathname);
            goto('./'+path)
        }
    }

</script>
<div>
    <button on:click={() => nav('history')} class={$page.url.pathname === '/history' ? 'bold' : 'normal'}>History</button>
    <button on:click={() => nav()} class={$page.url.pathname === '/' ? 'bold' : 'normal'}>Home</button>
    <button on:click={() => nav('library')} class={$page.url.pathname === '/library' ? 'bold' : 'normal'}>Library</button>
</div>

<style>
    .bold{
        font-weight: bolder;
    }
    .normal{
        font-weight: normal;
    }
</style>