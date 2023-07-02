import { tables as _tables, tableNameList as _tableNameList } from './db-structure.json';

type tableName = string;
type columnName = string;

type poster = string;
type posterUrl = string;
type posterText = string;

type typeDesc = string | typeDec[];
type perm = string;

interface fkey {
  table: tableName,
  column: columnName,
  imports?: columnName[]
};

interface columnDesc {
  name: columnName,
  text: posterText,
  type: typeDesc,
  isRequired?: true,
  isInternal?: true,
  isImported?: true, /// TODO: remove ///
  isPoster?: true,
  primaryKey?: true,
  foreignKey?: fkey,
  readPermission?: perm
};

interface tableDesc {
  name: tableName,
  text: posterText,
  url: posterUrl,
  prev?: tableName[],
  next?: tableName[],
  columns: columnDesc[],
  isHidden?: true,
  writePermission?: perm
};

type tablesType = {
  [ k in tableName ]: tableDesc
};

const tables = _tables as tablesType;

const allTableNameList = _tableNameList as tableName[];

const tableNameList = (allTableNameList
  .filter(tableName => !tables[tableName].isHidden));

const tableUrlList = tableNameList.map(tableName => tables[tableName].url);

const urlToTableMap: Map<posterUrl, tableDesc> = new Map();

const tableToPrimaryKey: Map<tableName, columnDesc> = new Map();

const tableToPoster: Map<tableName, columnDesc> = new Map();

allTableNameList.forEach(tableName => {
  const table = tables[tableName];
  const primaryKey = table.columns.find(column => column.primaryKey);
  const poster = table.columns.find(column => column.isPoster);

  urlToTableMap.set(table.url, table);
  tableToPrimaryKey.set(table.name, primaryKey);
  tableToPoster.set(table.name, poster);
});

export { tables, tableNameList, urlToTableMap, tableToPrimaryKey, tableToPoster };
