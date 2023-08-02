import { Request, Response } from "express";
import { getConnection } from "../database";
import { Connection, createConnection, getConnections } from "../models/connection";

const express = require('express');
const connectionRouter = express.Router();

connectionRouter.get("/getConnections", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    try {
      const connections = await getConnections(connection);
      console.log("connections", connections);
      return res.status(200).json(connections);
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

connectionRouter.post("/addConnection", async (req: Request, res: Response) => {
  const connectionData: Connection = req.body;
  try {
    const connection = await getConnection();

    try {
      const insertedConnection = await createConnection(connection, connectionData);
      console.log("connection", insertedConnection);
      return res.status(200).json(insertedConnection);
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

export default connectionRouter;
