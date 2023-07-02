<script lang='ts'>
  export let pages;
  export let prefix = '';
  export let suffix = '';
</script>

<div class='pure-menu'>
  <ul class='pure-menu-list'>
    {#each pages as { poster, href }}
      <li class='pure-menu-item'>
	<a class='pure-menu-link' href={prefix + href + suffix}>{poster}</a>
      </li>
    {/each}
  </ul>
</div>
