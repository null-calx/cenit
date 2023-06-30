<script lang='ts'>
  import PosterHref from '$lib/PosterHref.svelte';

  export let data;
</script>

<div class='pure-menu'>
  <ul class='pure-menu-list'>
    {#each data.pages as { poster, href }}
      <li class='pure-menu-item'>
	<a class='pure-menu-link' {href}>{poster}</a>
      </li>
    {/each}
  </ul>
</div>
