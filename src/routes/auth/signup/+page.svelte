<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let form;
</script>

<h2 class='content-subhead'>Create a new account</h2>

<form method='POST' class='pure-form pure-form-aligned'>
  <Message {form} />
  <div class='pure-control-group'>
    <label for='username'>Username:</label>
    <input type='text' id='username' name='username'
	   value={form?.username || ''} />
  </div>
  <div class='pure-control-group'>
    <label for='emailid'>Email ID:</label>
    <input type='email' id='emailid' name='emailid'
	   value={form?.emailid || ''} />
  </div>
  <div class='pure-control-group'>
    <label for='password'>Password:</label>
    <input type='password' id='password' name='password' />
  </div>
  <div class='pure-controls'>
    <button class='pure-button pure-button-primary' type='submit'>Signup</button>
    <a class='pure-button pure-button-secondary' href='/auth/login'>Login instead</a>
  </div>
</form>
