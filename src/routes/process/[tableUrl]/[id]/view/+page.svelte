<script lang='ts'>
  export let data;
</script>

<h1><a href='/process'>Process</a> / <a href='../..'>{data.tableName}</a> / <a href='..'>{data.rowName}</a> / view</h1>

{#if data.currentUser?.permissions?.includes(data.writePermission)}
  <p>
    <a href='../edit'>Edit</a>
    <a href='../delete'>Delete</a>
  </p>
{/if}

{#each data.columns as column}
  <div>
    {#if !column.readPermission || data?.currentUser?.permissions.includes(column.readPermission)}
      <h2>{column.text}</h2>
      {#if column.foreignKey}
	<a href={`/process/${column.foreignKey.table}/${data.rowData[column.name]}`}>
	  <p>{data.rowData[column.name]}</p>
	</a>
      {:else}
	<p>{data.rowData[column.name]}</p>
      {/if}
    {/if}
  </div>
{/each}
