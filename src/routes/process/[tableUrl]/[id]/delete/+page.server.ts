import { redirect } from '@sveltejs/kit';

import { urlToTable } from '$lib/server/db-structure';
import { deleteItem } from '$lib/server/db-mutate';
import { findUser } from '$lib/server/user-management';

export const load = ({ cookies, params }) => {
  const uuid = cookies.get('sessionid');
  const permissions = findUser(uuid)?.permissions || new Set();

  const { tableUrl } = params;
  const table = urlToTable(tableUrl);

  if (!permissions.has(table.writePermission))
    throw redirect(307, '..');
};

export const actions = {
  default: (async ({ cookies, request, params }) => {
    const { id, tableUrl } = params;

    const table = urlToTable(tableUrl);

    const formData = await request.formData();

    const uuid = cookies.get('sessionid');
    const permissions = findUser(uuid)?.permissions;

    await deleteItem(table.name, id, permissions);

    throw redirect(303, '../..');
  })
};
