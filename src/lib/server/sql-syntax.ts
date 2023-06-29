function paramType(type, i) {
  switch (type) {
    case 'TEXT':
      return `\$${i}::text`;
    default:
      return `\$${i}`;
  }
}

function formatType(type, key, formData) {
  const value = formData.get(key);
  switch (type) {
    case 'INTEGER':
      return + value;
    case 'TEXT':
      return value;
    default:
      return value;
  }
}

function insertSyntax(columns, formData) {
  let i = 1;
  const keys = [], params = [], values = [];
  for (const column of columns) {
    if (column.isInternal) continue;
    keys.push(column.name);
    params.push(paramType(column.type, i));
    values.push(formatType(column.type, column.name, formData));
    ++ i;
  }
  return [ keys, params, values ];
}

function updateSyntax(columns, formData) {
  let i = 1;
  const keyParams = [], values = [];
  for (const column of columns) {
    if (column.isInternal) continue;
    keyParams.push(`${column.name} = ${paramType(column.type, i)}`);
    values.push(formatType(column.type, column.name, formData));
    ++ i;
  }
  return [ keyParams, values ];
}

export { insertSyntax, updateSyntax };
