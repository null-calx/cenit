import { findUser } from './user-management';

function assertLoggedOut(uuid, redirect) {
  if (!uuid)
    return;

  const user = findUser(uuid);
  if (!user)
    return;

  throw redirect;
}

function assertLoggedIn(uuid, redirect) {
  if (uuid)
    return;

  throw redirect;
}

export { assertLoggedIn, assertLoggedOut };
