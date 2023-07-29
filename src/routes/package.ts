import { Request, Response } from "express";
import { getConnection } from "../database";
import { Package, createPackage, getPackages } from "../models/package";

const express = require('express');
const packageRouter = express.Router();

packageRouter.get("/getPackages", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    try {
      const packages = await getPackages(connection);
      console.log("packages", packages);
      return res.status(200).json(packages);
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  } catch (error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error');
  }
});

packageRouter.post("/addPackage", async (req: Request, res: Response) => {
  const packageData: Package = req.body;
  try {
    const connection = await getConnection();

    try {
      const insertId = await createPackage(connection, packageData);
      console.log("package", insertId);
      return res.status(200).json(insertId);
    } catch (error) {
      console.error('Error executing query:', error);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  } catch (error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error');
  }
});

export default packageRouter;
