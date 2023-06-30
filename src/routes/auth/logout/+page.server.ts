import { fail, redirect } from '@sveltejs/kit';

import { logoutUser } from '$lib/server/user-management';
import { assertLoggedIn } from '$lib/server/page-security';

export const load = ({ cookies }) => {
  const uuid = cookies.get('sessionid');
  assertLoggedIn(uuid, redirect(303, '/'));
  return { setTitle: 'Logout' };
};

export const actions = {
  default: (async ({ cookies }) => {
    const uuid = cookies.get('sessionid');

    logoutUser(uuid);

    throw redirect(303, '/');
  })
};
