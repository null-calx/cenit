import { findUser } from '$lib/server/user-management';

export const trailingSlash = 'always';

export const load = ({ cookies }) => {
  const uuid = cookies.get('sessionid');
  const result = findUser(uuid);

  if (!result.success) {
    cookies.delete('sessionid');
    return { currentUser: null };
  }

  const { currentUser } = result;

  currentUser.permissions = [ ...currentUser.permissions ];

  return { currentUser };
};
