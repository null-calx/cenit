<script lang='ts'>
  import '../menu.css';
  import Menu from './Menu.svelte';
  import Footer from './Footer.svelte';

  import { page } from '$app/stores';

  let active = false;

  const toggleMenu = () => active = !active;
  const closeMenu = () => active = false;

  export let data;
</script>

<svelte:head>
  <link rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css"
	integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls"
	crossorigin="anonymous" />
  <meta name="viewport"
	content="width=device-width, initial-scale=1" />
  <title>WebApp | {$page.data.setTitle}</title>
</svelte:head>

<div id='layout' class:active={active}>
  <a href='#menu' id='menuLink' class='menu-link' on:click={toggleMenu}>
    <span></span>
  </a>

  <div id='menu'>
    <Menu user={data.currentUser} {closeMenu} />
  </div>

  <div id='main'>
    <div class='header'>
      <h1>WebApp Name</h1>
      <h2>{$page.data.setTitle}</h2>
      <i>{JSON.stringify(data)}</i>
    </div>
    <div>
    <div class='content'>
      <slot />
    </div>
    </div>
    <div class='footer'>
      <Footer />
    </div>
  </div>
</div>

<style>
  #main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  #main .footer {
    margin-top: auto;
  }
</style>
