import { redirect, error } from '@sveltejs/kit';

import { urlToTable } from '$lib/server/db-structure';
import { queryPosterAndHref } from '$lib/server/db-query';

export const load = (async ({ params }) => {
  const { tableUrl } = params;

  const table = urlToTable(tableUrl);

  const tableData = await queryPosterAndHref(table.name);

  if (!tableData)
    throw redirect(404, 'Not found');

  return { pages: tableData };
});
