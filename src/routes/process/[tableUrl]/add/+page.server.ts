import { fail, error, redirect } from '@sveltejs/kit';

import { insertData } from '$lib/server/db-access';
import { getPermissions } from '$lib/server/user-management';
import { urlToTable } from '$lib/server/page-security';

export const load = ({ cookies, params }) => {
  const uuid = cookies.get('sessionid');
  const permissions = getPermissions(uuid);

  const { tableUrl } = params;
  const table = urlToTable(tableUrl, error(404, 'Not found.'));

  if (!permissions.has(table.writePermission)) throw redirect(303, '..');

  return { columns: table.columns, setTitle: 'Add in ' + table.text };
};

export const actions = {
  default: (async ({ cookies, request, params }) => {
    const formData = await request.formData();

    const uuid = cookies.get('sessionid');
    const permissions = getPermissions(uuid);

    const { tableUrl } = params;
    const table = urlToTable(tableUrl, error(404, 'Not found.'));

    const results = await insertData(formData, table.name, permissions);

    if (!results.success) {
      for (const [ key, val ] of formData.entries())
	results[key] = val;
      return fail(400, results);
    }

    throw redirect(303, `/process/${tableUrl}/${results.id}`);
  })
};
