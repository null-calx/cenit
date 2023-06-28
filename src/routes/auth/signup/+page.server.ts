import { fail, redirect } from '@sveltejs/kit';

import { signupUser } from '$lib/server/user-management';
import { assertLoggedOut } from '$lib/server/page-security';

export const load = ({ cookies }) => {
  const uuid = cookies.get('sessionid');
  assertLoggedOut(uuid, redirect(307, '/'));
}

export const actions = {
  default: (async ({ request, cookies }) => {
    const formData = await request.formData();

    const username = formData.get('username');
    const emailid = formData.get('emailid');
    const password = formData.get('password');

    const signup = await signupUser(username, emailid, password);

    if (!signup.success)
      return fail(400, { ...signup, username, emailid });

    cookies.set('sessionid', signup.uuid, { path: '/' });

    throw redirect(303, '/');
  })
};
