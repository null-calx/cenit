<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let data;
  export let form;
</script>

<h1><a href='/process'>Process</a> / <a href='..'>{data.tableName}</a> / add</h1>

<form method='POST'>
  <Message {form} />
  {#each data.columns as column}
    {#if !column.isInternal}
      <label>
	{column.text}:
	<input name={column.name} value={form?.[column.name] || ''} />
      </label>
      <br />
    {/if}
  {/each}
  <button type='submit'>Add</button>
</form>
