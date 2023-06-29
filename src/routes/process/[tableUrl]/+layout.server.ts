import { error } from '@sveltejs/kit';

import { urlToTable } from '$lib/server/page-security';

export const load = ({ params }) => {
  const { tableUrl } = params;

  const table = urlToTable(tableUrl, error(404, { message: 'Not found' }));

  return { tableName: table.text, columns: table.columns, writePermission: table.writePermission };
};
