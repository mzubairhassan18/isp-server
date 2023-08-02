import mysql, { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

export interface Package {
  id: string;
  name: string;
  active: boolean;
  purchase_price: number;
  sale_price: number;
  details: string;
  last_edited: Date;
}

export async function getPackages(connection: mysql.PoolConnection): Promise<Package[]> {
  const [rows] = await connection.query('SELECT * FROM packages');
  if (Array.isArray(rows)) {
    const packages: Package[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      active:  row.active,
      purchase_price: row.purchase_price,
      sale_price: row.sale_price,
      details: row.details,
      last_edited: row.last_edited,
    }));
    console.log(packages, "packages");
    return packages;
  }
  return [];
}

export async function getPackageById(connection: mysql.PoolConnection, id: string): Promise<Package | null> {
  const [rows] = await connection.query('SELECT * FROM packages where id = ?' , [id]);
  if (Array.isArray(rows)) {
    const packages: Package[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      active:  row.active,
      purchase_price: row.purchase_price,
      sale_price: row.sale_price,
      details: row.details,
      last_edited: row.last_edited,
    }));
    console.log(packages, "packages");
    return packages[0];
  }
  return null;
}

export async function createPackage(connection: mysql.PoolConnection, packageData: Package): Promise<Package> {
  const uniqueId = uuidv4();
  const [result] = await connection.query(
    `INSERT INTO packages 
    (id, name, active, purchase_price, sale_price, details, last_edited) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      uniqueId,
      packageData.name,
      packageData.active,
      packageData.purchase_price,
      packageData.sale_price,
      packageData.details,
      packageData.last_edited,
    ]
  );
  return {...packageData, id: uniqueId};
}
