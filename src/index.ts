import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/user';
import AuthMiddleware from './middleware/auth';
import accessRouter from './routes/access';
import packageRouter from './routes/package';
import roleRouter from './routes/role';
import accountRouter from './routes/account';
import { corsMiddleware } from './cors';
import connectionRouter from './routes/connection';




const app = express();
const port = 3000;
// Middleware
app.use(corsMiddleware);
app.use(bodyParser.json());

// routes
app.use("/access", accessRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/user", userRouter)
app.use("/api/package", packageRouter)
app.use("/api/role", roleRouter)
app.use("/api/account" , accountRouter)

// Sample user data (you can replace this with your database)





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
