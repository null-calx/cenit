<script lang='ts'>
  import PosterHref from '$lib/PosterHref.svelte';

  export let user;

  const pages = [
    { poster: 'Home Page', href: '/home' },
    { poster: 'Process', href: '/process' },
    { poster: 'About Us', href: '/about' }
  ];

  if (user) {
    pages.push({ poster: `${user.username} /  ${user.currentRole}`,
		 href: '/profile' });
    pages.push({ poster: 'Logout', href: '/auth/logout' });
  } else {
    pages.push({ poster: 'Login', href: '/auth/login' });
  }
</script>

<header>
  <PosterHref {pages} />
</header>

<i>{JSON.stringify(user)}</i>

<hr />
