<script lang='ts'>
  import PosterHref from '$lib/PosterHref.svelte';

  export let data;
</script>

<h2 class='content-subhead'><a href='/process'>Process</a> > {data.tableName}</h2>

{#if data.currentUser?.permissions?.includes(data.writePermission)}
  <p>
    <a class='pure-button pure-button-primary' href='add'>Add Item</a>
  </p>
{/if}

<PosterHref pages={data.pages} />
