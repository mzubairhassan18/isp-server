import { Request, Response } from "express";
import { getConnection } from "../database";
import { Account, createAccount, getAccounts } from "../models/account";

const express = require('express');
const accountRouter = express.Router();

accountRouter.get("/getAccounts", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    try {
      const accounts = await getAccounts(connection);
      console.log("accounts", accounts);
      return res.status(200).json(accounts);
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

accountRouter.post("/addAccount", async (req: Request, res: Response) => {
  const accountData: Account = req.body;
  try {
    const connection = await getConnection();

    try {
      const insertId = await createAccount(connection, accountData);
      console.log("account", insertId);
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

export default accountRouter;
