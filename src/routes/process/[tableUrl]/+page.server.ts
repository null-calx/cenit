import { error } from '@sveltejs/kit';

import { urlToTable } from '$lib/server/page-security';
import { queryPosterAndHref } from '$lib/server/db-access';

export const load = (async ({ params }) => {
  const { tableUrl } = params;

  const table = urlToTable(tableUrl, error(404, 'Not found.'));

  const results = await queryPosterAndHref(table.name);

  return { pages: results.rows };
});
