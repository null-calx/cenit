import { tables } from './db-structure';
import { makeQuery, checkTableName,
	 genQueryParams, formatValue,
	 genUpdateParams, formatUpdation } from './db-utils';

async function insertData(formData, tableName: string, permissions: Set<string> | void) {
  checkTableName(tableName);

  permissions = permissions || new Set();

  const table = tables[tableName];

  if (!permissions.has(table.writePermission))
    return { success: false, message: 'Not enough permissions.' };

  const primaryKey = table.columns.find(column => column.primaryKey)?.name;

  const keys = (table.columns
    .filter(column => !column.primaryKey && !column.isInternal)
    .map(column => column.name));

  for (const column of table.columns) {
    if (column.required && !formData.get(column.name))
      return { success: false, message: `${column.text} cannot be empty.` };
  }

  const values = formatValue(keys, table.columns, formData);

  const params = genQueryParams(keys, table.columns);

  const query = `insert into ${tableName} (${keys}) values (${params}) returning ${primaryKey};`;

  let results;
  try {
    results = await makeQuery(query, values);
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Internal error.' };
  }

  const id = results.rows[0][primaryKey];

  return { success: true, id };
}

async function deleteItem(tableName: string, rowId: string, permissions: Set<string> | void) {
  checkTableName(tableName);

  permissions = permissions || new Set();

  const table = tables[tableName];

  if (!permissions.has(table.writePermission))
    return { success: false, message: 'Not enough permissions.' };

  const pkeyColumn = table.columns.find(column => column.primaryKey);
  const primaryKey = pkeyColumn?.name;

  const query = `delete from ${tableName} where ${primaryKey} = $1`;

  try {
    await makeQuery(query, [ rowId ]);
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Internal error.' };
  }

  return { success: true, message: 'Item deleted.' };
}

async function updateItem(formData, tableName: string, rowId: string, permissions: Set<string> | void) {
  checkTableName(tableName);

  permissions = permissions || new Set();

  const table = tables[tableName];

  if (!permissions.has(table.writePermission))
    return { success: false, message: 'Not enough permissions.' };

  const primaryKey = table.columns.find(column => column.primaryKey)?.name;

  const keys = (table.columns
    .filter(column => !column.primaryKey && !column.isInternal)
    .map(column => column.name));

  for (const column of table.columns) {
    if (column.required && !formData.get(column.name))
      return { success: false, message: `${column.text} cannot be empty.` };
  }

  const values = formatUpdation(keys, table.columns, formData);

  const params = genUpdateParams(keys, table.columns);

  const query = `update ${tableName} set ${params} where ${primaryKey} = \$${keys.length + 1};`;
  values.push(rowId);

  let results;
  try {
    results = await makeQuery(query, values);
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Internal error.' };
  }

  return { success: true, rowId };
}

export { insertData, deleteItem, updateItem };
