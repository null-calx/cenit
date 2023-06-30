import { error, redirect } from '@sveltejs/kit';

import { deleteItem } from '$lib/server/db-access';
import { getPermissions } from '$lib/server/user-management';
import { urlToTable } from '$lib/server/page-security';

export const load = ({ cookies, params }) => {
  const uuid = cookies.get('sessionid');
  const permissions = getPermissions(uuid);

  const { tableUrl } = params;
  const table = urlToTable(tableUrl, error(404, 'Not found.'));

  if (!permissions.has(table.writePermission)) throw redirect(303, '..');

  return { columns: table.columns, setTitle: 'Delete in ' + table.text };
};

export const actions = {
  default: (async ({ cookies, params }) => {
    const uuid = cookies.get('sessionid');
    const permissions = getPermissions(uuid);

    const { tableUrl, id } = params;
    const table = urlToTable(tableUrl, error(404, 'Not found.'));

    const results = await deleteItem(table.name, id, permissions);

    throw redirect(303, `/process/${tableUrl}/`);
  })
};
