import { makeQuery } from './db-utils';

const rolesData = await makeQuery('select * from rolepermissions;');

const roleToPermissions = new Map();
const roleList = [];

rolesData.rows.forEach(({ role, permissions }) => {
  roleList.push(role);
  roleToPermissions.set(role, new Set(permissions));
});

export { roleList, roleToPermissions };
