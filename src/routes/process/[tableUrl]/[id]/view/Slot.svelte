<script lang='ts'>
  export let column;
  export let tableToUrl;
  export let rowData;

  const value = rowData[column.name];

  const tableName = column.foreignKey?.table;
  const tableUrl = tableToUrl[tableName];
  const rowId = value;

  /// TODO: rewrite ///
</script>

<div class='box'>
<dt>{column.text}</dt>
<dd>
  {#if column.foreignKey}
    <a href={`/process/${tableUrl}/${rowId}`}>
      <p>{value}</p>
    </a>
    <dl>
      {#each column.foreignKey.imports as foreignColumn (foreignColumn)}
	<svelte:self column={foreignColumn} {rowData} {tableToUrl} />
      {/each}
    </dl>
  {:else}
    <p>{value}</p>
  {/if}
</dd>
</div>

<style>
  .box {
    padding: 0 1em;
    border-left: 3px solid #34e;
  }
  dt {
    text-transform: uppercase;
    color: #aaa;
  }
</style>
