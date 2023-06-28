import bcrypt from 'bcrypt';

const saltRounds = 10;

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Hash of '${password}' = '${hash}'`);
  return hash;
}

async function checkPassword(password, hash) {
  const result = await bcrypt.compare(password, hash);
  console.log(`Is '${hash}' an hash of '${password}'? ${result ? 'Yes.' : 'No.'}`);
  return result;
}

export { hashPassword, checkPassword };
