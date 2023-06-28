<script lang='ts'>
  export let form;
</script>

<h1>Login</h1>

<form method='POST'>
  {#if form?.success === false}
    <p>{form?.message}</p>
  {/if}
  <label>
    Username:
    <input autofocus type='text' name='username' value={form?.username || ''} />
  </label>
  <label>
    Password:
    <input type='password' name='password' />
  </label>
  <button type='submit'>Login</button>
  <a href='/auth/signup'>Signup instead</a>
</form>
