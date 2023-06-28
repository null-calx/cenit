import { tables } from './db-structure';
import { makeQuery, checkTableName } from './db-utils';

async function queryPosterAndHref(tableName: string) {
  checkTableName(tableName);

  const table = tables[tableName];

  const primaryKey = table.columns.find(column => column.primaryKey)?.name;
  const poster = table.columns.find(column => column.isPoster)?.name;

  const query = `select ${primaryKey} as href, ${poster} as poster from ${tableName};`;

  try {
    const results = await makeQuery(query);
    return results.rows;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function queryItem(tableName: string, rowId: string, permissions: Set<string> | void) {
  checkTableName(tableName);

  permissions = permissions || new Set();

  const table = tables[tableName];
  const columnList = (table.columns
    .filter(column => !column.readPermission || permissions.has(column.readPermission))
    .map(column => column.name)
    .join(', '));

  const pkeyColumn = table.columns.find(column => column.primaryKey);
  const primaryKey = pkeyColumn?.name;

  const query = `select ${columnList} from ${tableName} where ${primaryKey} = $1;`;

  try {
    const results = await makeQuery(query, [ rowId ]);
    return results.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

export { queryPosterAndHref, queryItem };
