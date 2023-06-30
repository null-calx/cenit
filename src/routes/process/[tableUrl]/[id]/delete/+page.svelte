<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let data;
  export let form;
</script>

<h2 class='content-subhead'><a href='/process'>Process</a> > <a href='../..'>{data.tableName}</a> > <a href='..'>{data.rowName}</a> / delete</h2>

<form method='POST' class='pure-form pure-form-aligned'>
  <button class='pure-button danger' type='submit'>Delete</button>
</form>
