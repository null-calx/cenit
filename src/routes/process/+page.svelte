<script lang='ts'>
  import PosterHref from '$lib/PosterHref.svelte';

  export let data;
</script>

<h1>Process</h1>

<PosterHref pages={data.pages} />
