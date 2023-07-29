import mysql, { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

export interface Role {
  id: string;
  name: string;
  permissions: string;
}


export async function getRoles(connection: mysql.PoolConnection): Promise<Role[]> {
  const [rows] = await connection.query('SELECT * FROM roles');
  if (Array.isArray(rows)) {
    const roles: Role[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      permissions: row.permissions,
    }));
    return roles;
  }
  return [];
}

export async function getRole(connection: mysql.PoolConnection, roleId: number): Promise<Role | null> {
  const [res] = await connection.query('SELECT * FROM roles WHERE id = ?', [roleId]);
  const rows = res as Role[];
  if (Array.isArray(rows) && rows.length > 0) {
    const role = {
      id: rows[0].id,
      name: rows[0].name,
      permissions: rows[0].permissions,
    };
    return role;
  }
  return null;
}

export async function createRole(connection: mysql.PoolConnection, roleData: Role): Promise<number> {
  const uniqueId = uuidv4();
  const [result] = await connection.query(
    `INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)`,
    [uniqueId, roleData.name, roleData.permissions]
  );
  return (result as mysql.OkPacket).insertId;
}

export async function updateRole(connection: mysql.PoolConnection, roleId: number, roleData: Role): Promise<void> {
  await connection.query(
    `UPDATE roles SET name = ?, permissions = ? WHERE id = ?`,
    [roleData.name, roleData.permissions, roleId]
  );
}

export async function deleteRole(connection: mysql.PoolConnection, roleId: string): Promise<void> {
  await connection.query(`DELETE FROM roles WHERE id = ?`, [roleId]);
}
