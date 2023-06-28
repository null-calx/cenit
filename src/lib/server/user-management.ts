import { makeQuery } from './db-utils.ts';
import { hashPassword, checkPassword } from './user-passwords';
import { roleToPermissions } from './user-roles';

const loggedInUsers = new Map();

const userRoles = new Map();

function randomUUID() {
  return crypto.randomUUID();
}

function findUser(uuid) {
  const user = loggedInUsers.get(uuid);
  if (!user)
    return null;
  const { username } = user;
  const currentRole = userRoles.get(username) || user.roles[0];
  const permissions = roleToPermissions.get(currentRole);
  return { ...user, currentRole, permissions };
}

async function loginUser(username, password) {
  if (!username)
    return { success: false, message: 'Username cannot be empty.' };

  if(!password)
    return { success: false, message: 'Password cannot be empty.' };

  const query = 'select * from users where username = $1::text';

  let results;

  try {
    results = await makeQuery(query, [ username ]);
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Internal error.' };
  }

  if (!results.rows.length)
    return { success: false, message: 'Username or password is incorrect' };

  const { emailid, roles, password: hash } = results.rows[0];

  const passCheck = await checkPassword(password, hash);

  if (!passCheck)
    return { success: false, message: 'Username or password is incorrect' };

  const uuid = randomUUID();
  loggedInUsers.set(uuid, { username, emailid, roles });

  if (!userRoles.has(username))
    userRoles.set(username, roles[0]);

  const role = userRoles.get(username);

  return { success: true, uuid, username, emailid, roles, role };
}

function logoutUser(uuid) {
  loggedInUsers.delete(uuid);
  return { success: true };
}

async function signupUser(username, emailid, password) {
  if (!username)
    return { success: false, message: 'Username cannot be empty.' };

  if (!emailid)
    return { success: false, message: 'Emailid cannot be empty.' };

  if(!password)
    return { success: false, message: 'Password cannot be empty.' };

  const hash = await hashPassword(password);

  const query = 'insert into users (username, emailid, password, roles) values ($1::text, $2::text, $3::text, $4);';

  try {
    await makeQuery(query, [ username, emailid, hash, [ 'user' ] ]);
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Internal error.' };
  }

  return await loginUser(username, password);
}

async function switchRoles(username, role) {
  const query = 'select roles from users where username = $1::text';

  let results;

  try {
    results = await makeQuery(query, [ username ]);
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Internal error.' };
  }

  const roles = results.rows[0].roles;

  if (!roles.includes(role))
    return { success: false, message: `User ${username} does not have ${role} role` };

  userRoles.set(username, role);
  return { success: true, username, role };
}

export { findUser, loginUser, logoutUser, signupUser, switchRoles };
