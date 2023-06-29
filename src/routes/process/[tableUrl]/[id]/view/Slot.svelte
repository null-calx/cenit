<script lang='ts'>
  export let column;
  export let value;
  export let tableToUrl;

  const tableName = column.foreignKey?.table;
  const tableUrl = tableToUrl[tableName];
  const rowId = value;
</script>

<div>
  <h2>{column.text}</h2>
  {#if column.foreignKey}
    <a href={`/process/${tableUrl}/${rowId}`}>
      <p>{value}</p>
    </a>
  {:else}
    <p>{value}</p>
  {/if}
</div>
