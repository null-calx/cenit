<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let form;
</script>

<h1>Signup</h1>

<form method='POST'>
  <Message {form} />
  <label>
    Username:
    <input type='text' name='username' value={form?.username || ''} />
  </label>
  <label>
    Email ID:
    <input type='text' name='emailid' value={form?.emailid || ''} />
  </label>
  <label>
    Password:
    <input type='password' name='password' />
  </label>
  <button type='submit'>Signup</button>
  <a href='/auth/login'>Login instead</a>
</form>
