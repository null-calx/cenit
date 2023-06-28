import { error } from '@sveltejs/kit';

import { tableUrlList, urlToTable } from '$lib/server/db-structure';

export const load = ({ params }) => {
  const { tableUrl } = params;
  if (!tableUrlList.includes(tableUrl))
    throw error(404, { message: 'Not found' });

  const table = urlToTable(tableUrl);

  const { writePermission } = table;

  return { tableName: table.text, writePermission };
};
