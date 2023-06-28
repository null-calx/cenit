<script lang='ts'>
  import ULLinks from '$lib/ULLinks.svelte';

  export let currentUser;

  const pages = [
    { poster: 'Home Page', href: '/home' },
    { poster: 'Process', href: '/process' },
    { poster: 'About Us', href: '/about' },
  ];

  if (currentUser) {
    pages.push({ poster: currentUser.username, href: '/profile' });
    pages.push({ poster: 'Logout', href: '/auth/logout' });
  } else {
    pages.push({ poster: 'Login', href: '/auth/login' });
  }
</script>

<p>{JSON.stringify(currentUser)}</p>

<header>
  <ULLinks {pages} />
</header>

<hr />
