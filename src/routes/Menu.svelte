<script lang='ts'>
  export let user;
  export let closeMenu;

  const pages = [
    { poster: 'Home Page', href: '/home' },
    { poster: 'Process', href: '/process' },
    { poster: 'About Us', href: '/about' }
  ];

  if (user) {
    pages.push({ poster: `${user.username} /  ${user.currentRole}`, href: '/profile', last: true });
    pages.push({ poster: 'Logout', href: '/auth/logout' });
  } else {
    pages.push({ poster: 'Login', href: '/auth/login', last: true });
  }
</script>

<div class='pure-menu'>
  <ul class='pure-menu-list'>
    <a class='pure-menu-heading' href='/' on:click={closeMenu}>Web App</a>
    {#each pages as { poster, href, last }}
      <li class='pure-menu-item' class:last>
	<a class='pure-menu-link' {href} on:click={closeMenu}>{poster}</a>
      </li>
    {/each}
  </ul>
</div>
