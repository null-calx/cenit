<script lang='ts'>
  export let column;
  export let value;
  export let tableToUrl;

  const tableName = column.foreignKey?.table;
  const tableUrl = tableToUrl[tableName];
  const rowId = value;
</script>

<dt>{column.text}</dt>
<dd>
  {#if column.foreignKey}
    <a href={`/process/${tableUrl}/${rowId}`}>
      <p>{value}</p>
    </a>
  {:else}
    <p>{value}</p>
  {/if}
</dd>
