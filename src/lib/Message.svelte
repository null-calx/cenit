<script lang='ts'>
  export let form;
</script>

{#if form?.success === false}
  <p>{form?.message}</p>
{/if}
