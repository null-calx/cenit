// To be used by db-access.ts and user-management.ts

import client from './db-connector';
import { tableNameList } from './db-structure';

async function makeQuery(query, values) {
  console.log(`[+] query: ${query}`);
  if (values && values.length)
    console.log(`[+]  data: ${JSON.stringify(values)}`);

  let results;
  try {
    results = await client.query(query, values);
  } catch (e) {
    console.error(`[!] ERROR: Database error!`);
    console.error(e);
    return null;
  }

  return results;
}

function checkTableName(tableName) {
  return !!(tableName && tableNameList.includes(tableName));
}

export { makeQuery, checkTableName };
