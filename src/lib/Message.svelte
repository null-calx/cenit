<script lang='ts'>
  export let form;
</script>

{#if form?.success === false}
  <p class='pure-form-message'>{form?.message}</p>
{/if}
