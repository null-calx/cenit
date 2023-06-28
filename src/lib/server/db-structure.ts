import { tables as _tables, tableNameList as _tableNameList }
  from './db-structure.json';

type tableName = string;
type columnName = string;

type poster = string;
type posterUrl = poster;
type posterText = poster;

type typeString = string;
type perm = string;

interface fkey {
  table: tableName,
  column: columnName
};

interface columnDesc {
  name: columnName,
  text: posterText,
  type: typeString,
  primaryKey?: true,
  foreignKey?: fkey,
  isPoster?: true,
  required?: true,
  isInternal?: true,
  readPermission?: perm
};

interface tableDesc {
  name: tableName,
  text: posterText,
  url: posterUrl,
  prev?: tableName[],
  next?: tableName[],
  columns: columnDesc[],
  writePermission?: perm,
  hidden?: true
};

type tablesType = {
  [ k in tableName ]: tableDesc
};

const tables = _tables as tablesType;
const allTableNameList = _tableNameList as tableName[];
const tableNameList = (allTableNameList
  .filter(tableName => !tables[tableName].hidden));

const tableUrlList = tableNameList.map(tableName => tables[tableName].url);

const urlToTableMap: Map<posterUrl, tableDesc> = new Map();
const tableToPrimaryKey: Map<tableName, columnDesc> = new Map();
const tableToPoster: Map<tableName, columnDesc> = new Map();
tableNameList.forEach(tableName => {
  const table = tables[tableName];
  const primaryKey = table.columns.find(column => column.primaryKey);
  const poster = table.columns.find(column => column.isPoster);
  urlToTableMap.set(table.url, table);
  tableToPrimaryKey.set(table.name, primaryKey);
  tableToPoster.set(table.name, poster);
});

function urlToTable(tableUrl: posterUrl) {
  const table = urlToTableMap.get(tableUrl);
  if (!table)
    throw new Error(`Table with url: '${tableUrl}' not found`);

  return table;
}

export { tables, allTableNameList, tableNameList,
	 tableUrlList, urlToTable,
	 tableToPrimaryKey, tableToPoster };
