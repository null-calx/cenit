import { Client } from 'pg';
import { USER, HOST, DATABASE, PORT } from '$env/static/private';

const client = new Client({
  user: USER,
  host: HOST,
  database: DATABASE,
  port: + PORT
});

await client.connect();

export default client;
