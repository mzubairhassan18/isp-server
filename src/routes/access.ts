import express, {Request, Response} from "express"
import  jwt from "jsonwebtoken";
import { getConnection } from "../database";
import { getUser } from "../models/user";
import authenticateToken, { secretKey } from "../middleware/auth";
const accessRouter = express.Router();

// Authentication endpoint
accessRouter.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const connection = await getConnection();

    try {
      const userArray = await getUser(connection, username);
      if (userArray.length < 1) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // Find user by username and password
      const user = userArray[0];
      

      // Generate JWT token
      const token = jwt.sign({ userId: user.username, role: user.roleId }, secretKey);

      return res.status(200).json({ token });
    } catch (error) {
      
      console.error('Error executing query:', error);
    }

  }catch(error) {
    console.error('Error acquiring database connection:', error);
    return res.status(500).send('Internal server error');
  }

  
});


accessRouter.get('/protected', authenticateToken, (req: Request, res: Response) => {
//   const { role } = req.user as { role: string };
//   if (role !== 'admin') {
//     return res.status(403).json({ error: 'You are not authorized to access this resource' });
//   }
// //  console.log("req", req);
//   res.json({ message: 'Protected resource accessed successfully', ...req.user });
});

// Sample public route
accessRouter.get('/public', (req: Request, res: Response) => {
  res.json({ message: 'Public resource accessed successfully' });
});

export default accessRouter;