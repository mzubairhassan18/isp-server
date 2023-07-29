import mysql, { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';


export interface User {
  id: string, username: string, full_name: string, roleId: number, email: string, phone: number,
  address: string, cnic: number, password: string
}

export async function getUsers(connection: mysql.PoolConnection): Promise<User[]> {
  const [rows] = await connection.query('SELECT * FROM system_users');
  if (Array.isArray(rows)) {

    const users: User[] = rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      full_name: row.full_name,
      password: row.password,
      roleId: row.role_id,
      email: row.email,
      phone: row.phone,
      address: row.address,
      cnic: row.cnic,
    }));
    return users;
  }
  return [];
}
export async function getUser(connection: mysql.PoolConnection, username: string): Promise<User[]> {
  const [rows] = await connection.query('SELECT * FROM system_users where username = ?', [username]);
  if (Array.isArray(rows)) {

    const user: User[] = rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      full_name: row.full_name,
      password: row.password,
      roleId: row.role_id,
      email: row.email,
      phone: row.phone,
      address: row.address,
      cnic: row.cnic,
    }));
    return user;
  }
  return [];
}

export async function createUser(connection: mysql.PoolConnection, user: User): Promise<User> {
  console.log(user.roleId,);
  const uniqueId = uuidv4();
  const [result] = await connection.query(
    `INSERT INTO system_users 
    (id, username,full_name,password,email,phone,address,cnic, role_id) VALUES (?,?,?,?,?,?,?,?,?)`, [
    uniqueId,
    user.username,
    user.full_name,
    user.password,
    user.email,
    user.phone,
    user.address,
    user.cnic,
    user.roleId

  ]);
  return {...user, id: uniqueId};
}

export async function deleteUser(connection: mysql.PoolConnection, userId: string): Promise<void> {
  const result: any = await connection.query(
    `DELETE FROM system_users WHERE id = ?`,
    [userId]
  );
  // Check if any rows were affected by the delete query
  if (result[0].affectedRows === 0) {
    throw new Error(`User with ID ${userId} not found.`);
  }
}
