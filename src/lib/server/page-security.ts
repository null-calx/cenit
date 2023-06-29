// To be used by +page.server.ts and +layout.server.ts files

import { findUser } from './user-management';
import { urlToTableMap } from './db-structure';

function urlToTable(tableUrl, throwback) {
  const table = urlToTableMap.get(tableUrl);

  if (!table) throw throwback;

  return table;
}

function assertLoggedOut(uuid, throwback) {
  if (!uuid) return;

  const result = findUser(uuid);
  if (!result.success) return;

  throw throwback;
}

function assertLoggedIn(uuid, throwback) {
  if (uuid) return;

  throw throwback;
}

export { urlToTable, assertLoggedIn, assertLoggedOut };
