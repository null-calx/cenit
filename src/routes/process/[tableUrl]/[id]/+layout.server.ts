import { error } from '@sveltejs/kit';

import { urlToTable } from '$lib/server/db-structure';
import { queryItem } from '$lib/server/db-query';
import { findUser } from '$lib/server/user-management';

export const load = (async ({ cookies, params }) => {
  const { id, tableUrl } = params;

  const table = urlToTable(tableUrl);

  const uuid = cookies.get('sessionid');
  const permissions = findUser(uuid)?.permissions;

  const rowData = await queryItem(table.name, id, permissions);

  if (!rowData)
    throw new error(404, 'Not found');
  
  return { rowName: id, rowData, columns: table.columns };
});
