<script lang='ts'>
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

  export let data;

  const { currentUser } = data;
</script>

<Header { currentUser } />

<main>
  <slot />
</main>

<Footer />
