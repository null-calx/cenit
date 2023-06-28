<script lang='ts'>
  type listAnchor = { poster: string, href: string };

  export let pages: listAnchor[];
  export let prefix = '';
  export let suffix = '';
</script>

<ul>
  {#each pages as {poster, href}}
    <li><a href={prefix + href + suffix}>{poster}</a></li>
  {/each}
</ul>
