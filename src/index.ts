import express, { Request, Response } from 'express';
import ballroomRouter from './api/ballroom/ballroomRouter';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.use('/ballroom', ballroomRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

