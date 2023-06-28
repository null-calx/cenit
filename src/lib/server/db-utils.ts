import client from './db-connector.ts';
import { tableNameList } from './db-structure';

function logQuery(query: string, data: string[]) {
  console.log(`[+] RUN QUERY:  ${query}`);
  if (data.length)
    console.log(`[+] USING DATA: ${JSON.stringify(data)}`);
  return query;
}

async function makeQuery(query: string, data: string[] = []) {
  logQuery(query, data);
  return await client.query(query, data);
}

function checkTableName(tableName: string) {
  if (!tableName || !tableNameList.includes(tableName))
    throw new Error(`Table '${tableName}' not found`);
}

function findNonInternalColumn(key, columns) {
  const column = columns.find(column => column.name === key);
  if (!column)
    throw new Error(`No column named '${key}'`);
  if (column.primaryKey || column.internal)
    throw new Error(`Cannot enter value in primaryKey/internal field '${key}'`);
  return column;
}

function genQueryParams(keys, columns) {
  let param = '', i = 0;
  for (const key of keys) {
    const column = findNonInternalColumn(key, columns);

    if (i)
      param += ', ';
    param += '$' + (++i);
    if (column.type === 'TEXT')
      param += '::text';
  }
  return param;
}

function formatValue(keys, columns, formData) {
  const values = [];
  for (const key of keys) {
    const column = findNonInternalColumn(key, columns);
    const value = formData.get(key);
    if (column.type === 'INTEGER') {
      values.push(+ value);
    } else if (column.type === 'TEXT-ARRAY') {
      values.push(value.split(','));
    } else {
      values.push(value);
    }
  }
  return values;
}

function genUpdateParams(keys, columns) {
  let param = '', i = 0;
  for (const key of keys) {
    const column = findNonInternalColumn(key, columns);

    if (i)
      param += ', ';
    param += key + ' = $' + (++i);
    if (column.type === 'TEXT')
      param += '::text';
  }
  return param;
}

function formatUpdation(keys, columns, formData) {
  const values = [];
  for (const key of keys) {
    const column = findNonInternalColumn(key, columns);
    const value = formData.get(key);
    if (column.type === 'INTEGER') {
      values.push(+ value);
    } else if (column.type === 'TEXT-ARRAY') {
      values.push(value.split(','));
    } else {
      values.push(value);
    }
  }
  return values;
}

export { makeQuery, checkTableName,
	 genQueryParams, formatValue,
	 genUpdateParams, formatUpdation };
