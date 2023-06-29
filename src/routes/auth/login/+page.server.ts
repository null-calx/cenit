import { fail, redirect } from '@sveltejs/kit';

import { loginUser } from '$lib/server/user-management';
import { assertLoggedOut } from '$lib/server/page-security';

export const load = ({ cookies }) => {
  const uuid = cookies.get('sessionid');
  assertLoggedOut(uuid, redirect(303, '/'));
};

export const actions = {
  default: (async ({ request, cookies }) => {
    const formData = await request.formData();

    const username = formData.get('username');
    const password = formData.get('password');

    const login = await loginUser(username, password);

    if (!login.success) return fail(400, { ...login, username });

    // finally after all the checks

    cookies.set('sessionid', login.uuid, { path: '/', secure: false });
    /// TODO: DO NOT SET SECURE TO FALSE, ONLY FOR TESTING PURPOSES ///

    throw redirect(303, '/');
  })
};
