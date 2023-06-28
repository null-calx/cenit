<script lang='ts'>
  export let form;
</script>

<h1>Signup</h1>

<form method='POST'>
  {#if form?.success === false}
    <p>{form?.message}</p>
  {/if}
  <label>
    Username:
    <input autofocus type='text' name='username' value={form?.username || ''}/>
  </label>
  <label>
    Email:
    <input type='text' name='emailid' value={form?.emailid || ''}/>
  </label>
  <label>
    Password:
    <input type='password' name='password' />
  </label>
  <button type='submit'>SignUp</button>
  <a href='/auth/login'>Login instead</a>
</form>
