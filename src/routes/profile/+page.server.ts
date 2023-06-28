import { redirect, fail } from '@sveltejs/kit';

import { findUser, switchRoles } from '$lib/server/user-management';
import { assertLoggedIn } from '$lib/server/page-security';

export const load = (async ({ cookies }) => {
  const uuid = cookies.get('sessionid');
  assertLoggedIn(uuid, redirect(307, '/auth/login'));
});

export const actions = {
  default: (async ({ cookies, request }) => {
    const uuid = cookies.get('sessionid');
    const currentUser = findUser(uuid);

    const formData = await request.formData();
    const role = formData.get('role');

    const status = await switchRoles(currentUser.username, role);

    if (!status.success)
      return fail(400, status);

    return status;
  })
};
