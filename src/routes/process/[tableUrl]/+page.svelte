<script lang='ts'>
  import PosterHref from '$lib/PosterHref.svelte';

  export let data;
</script>

<h1><a href='/process'>Process</a> / {data.tableName}</h1>

{#if data.currentUser?.permissions?.includes(data.writePermission)}
  <p>
    <a href='add'>Add Item</a>
  </p>
{/if}

<PosterHref pages={data.pages} />
