import mysql, { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { User, getUserById } from './user';
import { Package, getPackageById } from './package';


export interface Connection {
  id: string;
  user_id: string;
  initial_charges: number;
  status: string;
  date: Date;
  package_id: number;
}
export interface ConnectionFull extends Omit<Connection, 'user_id' | 'package_id'> {
  username: string ,
  packageName: string 
}
export interface ConnectionFull1 extends Omit<Connection, 'user_id' | 'package_id'> {
  user: User | null ,
  package: Package | null 
}


export async function getConnections(connection: mysql.PoolConnection): Promise<ConnectionFull[]> {
  const [rows] = await connection.query(`SELECT c.id, su.username, p.name AS "package_name", c.initial_charges, c.status, c.date FROM connections c
  INNER JOIN packages p ON c.package_id = p.id 
  INNER JOIN system_users su ON c.user_id = su.id;`);
  if (Array.isArray(rows)) {
    const connections = rows.map(async (row: any) => {

      return {
        id: row.id,
        username: row.username,
        initial_charges: row.initial_charges,
        status: row.status,
        date: row.date,
        packageName: row.package_name,
      };
    });
    return Promise.all(connections);
  }
  return [];
}

export async function createConnection(connection: mysql.PoolConnection, connectionData: Connection): Promise<Connection> {
  const uniqueId = uuidv4();
  const [result] = await connection.query(
    `INSERT INTO connections 
    (id, user_id, initial_charges, status, date, package_id) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      uniqueId,
      connectionData.user_id,
      connectionData.initial_charges,
      connectionData.status,
      connectionData.date,
      connectionData.package_id,
    ]
  );
  return { ...connectionData, id: uniqueId };
}