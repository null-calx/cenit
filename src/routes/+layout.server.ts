import { findUser } from '$lib/server/user-management';

export const trailingSlash = 'always';

export const load = ({ cookies }) => {
  const uuid = cookies.get('sessionid');
  const currentUser = findUser(uuid);
  if (!currentUser) {
    cookies.delete('sessionid');
    return { currentUser };
  }

  const { permissions } = currentUser;

  return {
    currentUser: {
      ...currentUser,
      permissions: [ ...permissions ]
    }
  };
}
