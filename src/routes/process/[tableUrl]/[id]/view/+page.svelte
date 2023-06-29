<script lang='ts'>
  import Slot from './Slot.svelte';

  export let data;

  const { tableToUrl } = data;
</script>

<h1><a href='/process'>Process</a> / <a href='../..'>{data.tableName}</a> / <a href='..'>{data.rowName}</a> / view</h1>

{#if data.currentUser?.permissions?.includes(data.writePermission)}
  <p>
    <a href='../edit'>Edit</a>
    <a href='../delete'>Delete</a>
  </p>
{/if}

{#each data.columns as column}
  {#if !column.readPermission || data.currentUser?.permissions.includes(column.readPermission)}
    <Slot column={column} value={data.rowData[column.name]} {tableToUrl}/>
  {/if}
{/each}
