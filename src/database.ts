import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'billing',
  connectionLimit: 10 // Set the desired connection limit
});

export async function getConnection() {
  return await pool.getConnection();
}

export function releaseConnection(connection: mysql.PoolConnection) {
  connection.release();
}