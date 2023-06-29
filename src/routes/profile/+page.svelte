<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let data;
  export let form;

  const { currentUser } = data;

  let currentRole = currentUser?.currentRole;
</script>

<h1>Profile</h1>

<form method='POST'>
  <Message {form} />
  {#each currentUser.roles as role}
    <label>
      <input type='radio' name='role' value={role} bind:group={currentRole} />
      {role}
    </label>
  {/each}
  <button type='submit'>Switch Role</button>
</form>
