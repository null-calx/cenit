<script lang='ts'>
  export let data;
  export let form;

  const { currentUser } = data;

  let currentRole = currentUser?.currentRole;
</script>

<h1>Profile</h1>

<p>{JSON.stringify(data)}</p>

<form method='POST'>
  {#if form?.success === false}
    <p>{form?.message}</p>
  {/if}
  {#each currentUser.roles as role}
    <label>
      <input type='radio' name='role' value={role} bind:group={currentRole} />
      {role}
    </label>
  {/each}
  <button type='submit'>Switch Role!</button>
</form>
