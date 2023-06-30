<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let form;
</script>

<h2 class='content-subhead'>Login using this device</h2>

<form method='POST' class='pure-form pure-form-aligned'>
  <Message {form} />
  <div class='pure-control-group'>
    <label for='username'>Username:</label>
    <input type='text' id='username' name='username'
	   value={form?.username || ''} />
  </div>
  <div class='pure-control-group'>
    <label for='password'>Password:</label>
    <input type='password' id='password' name='password' />
  </div>
  <div class='pure-controls'>
    <button class='pure-button pure-button-primary' type='submit'>
      Login
    </button>
    <a class='pure-button pure-button-secondary' href='/auth/signup'>
      Signup instead
    </a>
  </div>
</form>
