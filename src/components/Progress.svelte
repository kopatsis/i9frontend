<script>
    export let progress = 0;
</script>

<div class="outerbar">
    <div class="innerbar" style="width: {progress*100}%;"></div>
</div>

<style>
    .innerbar{
        color: green;
        height: 100%;
    }

    .outerbar{
        display:flex;
        flex-direction: row;
        align-items: baseline;
    }
</style>