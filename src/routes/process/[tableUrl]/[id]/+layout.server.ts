import { error } from '@sveltejs/kit';

import { tableNameList, tables, tableToPoster } from '$lib/server/db-structure';
import { urlToTable } from '$lib/server/page-security';
import { queryItem } from '$lib/server/db-access';
import { getPermissions } from '$lib/server/user-management';

const tableToUrl = {};
tableNameList.forEach(tableName => tableToUrl[tableName] = tables[tableName].url);

export const load = (async ({ cookies, params }) => {
  const { id, tableUrl } = params;

  const table = urlToTable(tableUrl);

  const uuid = cookies.get('sessionid');
  const permissions = getPermissions(uuid);

  const results = await queryItem(table.name, id, permissions);
  if (!results.success) throw new error(404, 'Not found');
  const { row } = results;

  const rowName = row[tableToPoster.get(table.name).name]

  return { rowName, rowData: row, tableToUrl, setTitle: rowName };
});
