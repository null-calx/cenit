<script lang='ts'>
  import Slot from './Slot.svelte';

  export let data;

  const { tableToUrl } = data;
</script>

<h2 class='content-subhead'><a href='/process'>Process</a> > <a href='../..'>{data.tableName}</a> > <a href='..'>{data.rowName}</a> / view</h2>

<!-- <p><i>{JSON.stringify(data)}</i></p> -->

{#if data.currentUser?.permissions?.includes(data.writePermission)}
  <p>
    <a class='pure-button pure-button-primary' href='../edit'>Edit Item</a>
    <a class='pure-button danger' href='../delete'>Delete Item</a>
  </p>
{/if}

<dl>
{#each data.columns as column (column)}
  {#if !column.readPermission || data.currentUser?.permissions.includes(column.readPermission)}
    <Slot column={column} rowData={data.rowData} {tableToUrl}/>
  {/if}
{/each}
</dl>
