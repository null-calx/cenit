import { tables, tableNameList } from '$lib/server/db-structure';

const data = {
  pages: tableNameList.map(tableName => ({
    poster: tables[tableName].text,
    href: tables[tableName].url
  }))
};

export const load = () => data;

export const prerender = true;
