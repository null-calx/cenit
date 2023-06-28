<script lang='ts'>
  export let form;
  export let data;
</script>

<h1><a href='/process'>Process</a> / <a href='..'>{data.tableName}</a> / Add</h1>

<form method='POST'>
  {#if form?.success === false}
    <p>{form?.message}</p>
  {/if}
  {#each data.columns as column}
    {#if !column.primaryKey && !column.isInternal}
      <label>
	{column.text}:
	<input name={column.name} value={form?.[column.name] || ''}/>
      </label>
      <br />
    {/if}
  {/each}
  <button type='submit'>Submit</button>
</form>
