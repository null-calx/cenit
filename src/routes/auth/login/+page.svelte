<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let form;
</script>

<h1>Login</h1>

<form method='POST'>
  <Message {form} />
  <label>
    Username:
    <input type='text' name='username' value={form?.username || ''} />
  </label>
  <label>
    Password:
    <input type='password' name='password' />
  </label>
  <button type='submit'>Login</button>
  <a href='/auth/signup'>Signup instead</a>
</form>
