import { Request, Response } from "express";
import { getConnection } from "../database";
import { Role, createRole, getRoles, getRole, updateRole, deleteRole } from "../models/role";

const express = require('express');
const roleRouter = express.Router();

// Get all roles
roleRouter.get("/getRoles", async (req: Request, res: Response) => {
  try {
    const connection = await getConnection();
    const roles = await getRoles(connection);
    console.log("roles", roles);
    return res.status(200).json(roles);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).send('Internal server error');
  }
});

// Get a specific role by ID
roleRouter.get("/getRole/:id", async (req: Request, res: Response) => {
  const roleId = req.params.id;
  try {
    const connection = await getConnection();
    const role = await getRole(connection, Number(roleId));
    console.log("role", role);
    return res.status(200).json(role);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).send('Internal server error');
  }
});

// Create a new role
roleRouter.post("/addRole", async (req: Request, res: Response) => {
  const roleData: Role = req.body;
  try {
    const connection = await getConnection();
    const insertId = await createRole(connection, roleData);
    console.log("Created role with ID:", insertId);
    return res.status(200).json({ id: insertId, message: "Role created successfully" });
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).send('Internal server error');
  }
});

// Update an existing role
roleRouter.put("/updateRole/:id", async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const roleData: Role = req.body;
  try {
    const connection = await getConnection();
    await updateRole(connection, Number(roleId), roleData);
    console.log("Updated role with ID:", roleId);
    return res.status(200).json({ id: roleId, message: "Role updated successfully" });
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).send('Internal server error');
  }
});

// Delete a role
roleRouter.delete("/deleteRole/:id", async (req: Request, res: Response) => {
  const roleId = req.params.id;
  try {
    const connection = await getConnection();
    await deleteRole(connection, roleId);
    console.log("Deleted role with ID:", roleId);
    return res.status(200).json({ id: roleId, message: "Role deleted successfully" });
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).send('Internal server error');
  }
});

export default roleRouter;
