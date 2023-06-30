<script lang='ts'>
  import Message from '$lib/Message.svelte';

  export let data;
  export let form;

  const { currentUser } = data;

  let currentRole = currentUser.currentRole;
</script>

<h2 class='content-subhead'>Switch Role</h2>

<form method='POST' class='pure-form'>
  <Message {form} />
  {#each currentUser.roles as role}
    <label class='pure-radio'>
      <input type='radio' name='role' value={role} bind:group={currentRole} />
      {role}
    </label>
  {/each}
  {#if currentRole !== currentUser.currentRole}
    <button class='pure-button pure-button-primary' type='submit'>Switch Role</button>
  {/if}
</form>
