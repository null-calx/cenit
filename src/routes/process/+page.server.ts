import { tables, tableNameList } from '$lib/server/db-structure';

const pages = {
  pages: tableNameList.map(tableName => ({
    poster: tables[tableName].text,
    href: tables[tableName].url
  }))
};

export const load = () => pages;

export const prerender = true;
