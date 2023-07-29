import mysql, { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

export interface Account {
  id: string;
  name: string;
  type: string;
}

export async function getAccounts(connection: mysql.PoolConnection): Promise<Account[]> {
  const [rows]  = await connection.query<RowDataPacket[]>('SELECT * FROM account');
  const accounts: Account[] = rows.map((row: RowDataPacket | Account) => ({
    id: row.id,
    name: row.name,
    type: row.type,
  }));
  return accounts;
}

export async function createAccount(connection: mysql.PoolConnection, accountData: Account): Promise<Account> {
  const uniqueId = uuidv4();

  const [result] = await connection.query(
    `INSERT INTO account 
    (id, name, type) 
    VALUES (?, ?, ?)`,
    [
      uniqueId,
      accountData.name,
      accountData.type,
    ]
  );

  return {...accountData, id: uniqueId};
}
