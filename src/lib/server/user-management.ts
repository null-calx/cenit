import { makeQuery } from './db-utils';
import { hashPassword, checkPassword } from './user-passwords';
import { roleToPermissions } from './user-roles';

const loggedInUsers = new Map();

const userRoles = new Map();

const randomUUID = () => crypto.randomUUID();
const success = data => ({ success: true, ...data });
const fail = message => ({ success: false, message });

/// TODO: improve repoting internal errors ///

function findUser(uuid) {
  const user = loggedInUsers.get(uuid);
  if (!user) return fail('Session ID expired.');

  // finally after all the checks

  const { username } = user;
  const currentRole = userRoles.get(username);
  const permissions = roleToPermissions.get(currentRole);

  const currentUser = { ...user, currentRole, permissions };

  return success({ currentUser });
}

function getPermissions(uuid) {
  const user = loggedInUsers.get(uuid);
  if (!user) return new Set();

  const { username } = user;
  const currentRole = userRoles.get(username);
  const permissions = roleToPermissions.get(currentRole);
  return permissions;
}

async function loginUser(username, password) {
  if (!username) return fail('Username cannot be empty.');
  if (!password) return fail('Password cannot be empty.');

  const query = `select emailid, roles, password as hash from users where username = $1::text;`;
  const results = await makeQuery(query, [ username ]);
  if (!results) return fail('Internal error.');

  if (!results.rows.length) return fail('Username or password is incorrect.');

  const { emailid, roles, hash } = results.rows[0];
  const passCheck = await checkPassword(password, hash);
  if (!passCheck) return fail('Username or password is incorrect.');

  // finally after all the checks

  const uuid = randomUUID();
  loggedInUsers.set(uuid, { username, emailid, roles });
  if (!userRoles.has(username)) userRoles.set(username, roles[0]);
  const role = userRoles.get(username);

  return success({ uuid });
}

async function logoutUser(uuid) {
  loggedInUsers.delete(uuid);
  return success({});
}

async function signupUser(username, emailid, password) {
  if (!username) return fail('Username cannot be empty.');
  if (!emailid) return fail('Email cannot be empty.');
  if (!password) return fail('Password cannot be empty.');

  const hash = await hashPassword(password);

  const query = `insert into users (username, emailid, password, roles) values ($1::text, $2::text, $3::text, $4);`;
  const results = await makeQuery(query, [ username, emailid, hash, [ 'user' ] ]);
  if (!results) return fail('Internal error.');

  // finally after all the checks

  return loginUser(username, password); // login on signup
}

async function switchRoles(username, role) {
  const currentRole = userRoles.get(username);
  if (currentRole === role) return fail('No change required.');
  const query = `select roles from users where username = $1::text`;
  const results = await makeQuery(query, [ username ]);
  if (!results) return fail('Internal error.');
  if (!results.rows.length) return fail('No such user.');

  const { roles } = results.rows[0];
  if (!roles.includes(role)) return fail('Cannot switch to the role you do not have.');

  // finally after all the checks

  userRoles.set(username, role);
  return success({ username, role });
}

export { loginUser, getPermissions, findUser, logoutUser, signupUser, switchRoles };
