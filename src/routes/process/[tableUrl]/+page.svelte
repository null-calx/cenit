<script lang='ts'>
  import ULLinks from '$lib/ULLinks.svelte';

  export let data;
</script>

<h1><a href='/process'>Process</a> / {data.tableName} /</h1>

{#if data.currentUser?.permissions?.includes(data.writePermission)}
  <p>
    <a href='add'>Add Item</a>
  </p>
{/if}

<ULLinks suffix='/view' pages={data.pages} />
