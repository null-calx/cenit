<script lang='ts'>
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

  export let data;
</script>

<Header user={data.currentUser} />

<main>
  <slot />
</main>

<Footer />
