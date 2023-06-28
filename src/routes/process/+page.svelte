<script lang='ts'>
  import ULLinks from '$lib/ULLinks.svelte';

  export let data;
</script>

<h1>Process</h1>

<ULLinks pages={data.pages} />
