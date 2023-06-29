<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let data;
  export let form;
</script>

<h1><a href='/process'>Process</a> / <a href='../..'>{data.tableName}</a> / <a href='..'>{data.rowName}</a> / delete</h1>

<form method='POST'>
  <Message {form} />
  <button type='submit'>Delete</button>
</form>
