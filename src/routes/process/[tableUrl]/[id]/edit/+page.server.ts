import { fail, redirect } from '@sveltejs/kit';

import { urlToTable } from '$lib/server/db-structure';
import { updateItem } from '$lib/server/db-mutate';
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

    const results = await updateItem(formData, table.name, id, permissions);

    if (!results.success) {
      for (const [ key, val ] of formData.entries())
	results[key] = val;
      return fail(400, results);
    }

    throw redirect(303, '..');
  })
};