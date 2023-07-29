import { Request, Response } from "express";
import { getConnection } from "../database";
import { User, createUser, deleteUser, getUser, getUsers } from "../models/user";

const express = require('express');
const userRouter = express.Router();

userRouter.get("/getUser", async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    const connection = await getConnection();

    try {
      const user = await getUser(connection, username);
      console.log("user", user);
      return res.status(200).json(user);
    } catch (error) {
      
      console.error('Error executing query:', error);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  }catch(error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error');
  }
});

userRouter.get("/getUsers", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();

    try {
      const usersList = await getUsers(connection);
      return res.status(200).json(usersList);
    } catch (error) {
      
      console.error('Error executing query:', error);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  }catch(error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error');
  }
});

userRouter.post("/addUser", async (req: Request, res: Response) => {
  const user: User = req.body;
  try {
    const connection = await getConnection();

    try {
      console.log(user)
      const insertedUser = await createUser(connection, user);
      console.log("user", insertedUser);
      return res.status(200).json({message: "User saved successfully", insertedUser});
    } catch (error: any) {
      const errorMessage = error as string;
      console.error('Error executing query:', error);
      return res.status(500).send('Error executing query '+ error.message);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  }catch(error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error '+ error);
  }

})

userRouter.delete("/deleteUser/:userId", async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  try {
    const connection = await getConnection();

    try {
      // Call the deleteUser function to delete the user
      await deleteUser(connection, userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      const errorMessage = error as string;
      console.error('Error executing query:', error);
      return res.status(500).send('Error executing query ' + error.message);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }

  } catch (error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error ' + error);
  }
});

export default userRouter;