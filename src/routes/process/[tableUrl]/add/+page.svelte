<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let data;
  export let form;
</script>

<h2 class='content-subhead'><a href='/process'>Process</a> / <a href='..'>{data.tableName}</a> / add</h2>

<form method='POST' class='pure-form pure-form-aligned'>
  <Message {form} />
  {#each data.columns as column}
    {#if !column.isInternal}
      <div class='pure-control-group'>
	<label for={column.name}>{column.text}:</label>
	<input type='text' id={column.name} name={column.name}
	       value={form?.[column.name] || ''} />
      </div>
    {/if}
  {/each}
  <div class='pure-controls'>
    <button class='pure-button pure-button-primary' type='submit'>Add</button>
  </div>
</form>
