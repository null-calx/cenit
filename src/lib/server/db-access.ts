import { makeQuery, checkTableName } from './db-utils';
import { tables, tableToPrimaryKey, tableToPoster } from './db-structure';
import { insertSyntax, updateSyntax } from './sql-syntax';

const success = data => ({ success: true, ...data });
const fail = message => ({ success: false, message });

async function queryPosterAndHref(tableName) {
  if (!checkTableName(tableName)) return fail('No such table.');

  const primaryKey = tableToPrimaryKey.get(tableName).name;
  const poster = tableToPoster.get(tableName).name;

  const query = `select ${primaryKey} as href, ${poster} as poster from ${tableName};`;
  const results = await makeQuery(query);
  if (!results) return fail('Internal error.');

  // finally after all the checks

  return success({ rows: results.rows });
}

async function queryItem(tableName, rowId, permissions) {
  return await queryItemRecursive(tableName, rowId, permissions, null, null, false);
}

/// TODO: rewrite using SQL JOINS ///
async function queryItemRecursive(tableName, rowId, permissions, useKey=null, filterColumns=null, usePoster=false) {
  if (!checkTableName(tableName)) return fail('No such table.');

  const table = tables[tableName];
  const columnList = (table.columns
    .filter(column => !column.readPermission || permissions.has(column.readPermission))
    .map(column => column.name)
    .filter(columnName => filterColumns?.length ? filterColumns.map(column => column.name).includes(columnName) : true)
    .join(', '));

  const primaryKey = useKey || tableToPrimaryKey.get(tableName).name;

  const foreignData = {};

  const query = `select ${columnList} from ${tableName} where ${primaryKey} = $1;`;
  const results = await makeQuery(query, [ rowId ]);
  if (!results) return fail('Internal error.');
  if (!results.rows.length) return fail('No such item.');

  for (const column of table.columns) {
    if (column.foreignKey) {
      const { table: tableName, column: useKey, imports: filterColumns } = column.foreignKey;
      const foreign = await queryItemRecursive(tableName, results.rows[0][column.name], permissions, useKey, filterColumns, true);
      if (foreign.success)
	Object.assign(foreignData, foreign.row);
    }
  }

  // finally after all the checks

  return success({ row: Object.assign(foreignData, results.rows[0]) });
}

async function queryItemOld(tableName, rowId, permissions) {
  if (!checkTableName(tableName)) return fail('No such table.');

  const table = tables[tableName];
  const columnList = (table.columns
    .filter(column => !column.readPermission || permissions.has(column.readPermission))
    .map(column => column.name)
    .join(', '));

  const primaryKey = tableToPrimaryKey.get(tableName).name;

  const query = `select ${columnList} from ${tableName} where ${primaryKey} = $1;`;
  const results = await makeQuery(query, [ rowId ]);
  if (!results) return fail('Internal error.');
  if(!results.rows.length) return fail('No such item.');

  // finally after all the checks

  return success({ row: results.rows[0] });
}

async function insertData(formData, tableName, permissions) {
  if (!checkTableName(tableName)) return fail('No such table.');

  const table = tables[tableName];

  if (!permissions.has(table.writePermission)) return fail('Not enough permission.');

  for (const column of table.columns) {
    if (column.isRequired && !formData.get(column.name))
      return fail(`${column.text} cannot be empty.`);
  }

  const primaryKey = tableToPrimaryKey.get(tableName).name;

  const [ insertKeys, insertParams, insertValues ] = insertSyntax(table.columns, formData);

  const query = `insert into ${tableName} (${insertKeys}) values (${insertParams}) returning ${primaryKey};`;
  const results = await makeQuery(query, insertValues);
  if (!results) return fail('Internal error.');

  const id = results.rows[0][primaryKey];

  return success({ id });
}

async function updateData(formData, tableName, rowId, permissions) {
  if (!checkTableName(tableName)) return fail('No such table.');

  const table = tables[tableName];

  if (!permissions.has(table.writePermission)) return fail('Not enough permission.');

  for (const column of table.columns) {
    if (column.isRequired && !formData.get(column.name))
      return fail(`${column.text} cannot be empty.`);
  }

  const primaryKey = tableToPrimaryKey.get(tableName).name;

  const [ updateKeyParams, updateValues ] = updateSyntax(table.columns, formData);

  const query = `update ${tableName} set ${updateKeyParams} where ${primaryKey} = \$${updateValues.length + 1};`;
  const results = await makeQuery(query, [ ...updateValues, rowId ]);
  if (!results) return fail('Internal error.');

  return success({ id: rowId });
}

async function deleteItem(tableName, rowId, permissions) {
  if (!checkTableName(tableName)) return fail('No such table.');

  const table = tables[tableName];

  if (!permissions.has(table.writePermission)) return fail('Not enough permission.');

  const primaryKey = tableToPrimaryKey.get(tableName).name;

  const query = `delete from ${tableName} where ${primaryKey} = $1;`;
  const results = await makeQuery(query, [ rowId ]);
  if (!results) return fail('Internal error.');

  return success({});
}

export { queryPosterAndHref, queryItem,
	 insertData, updateData, deleteItem };
