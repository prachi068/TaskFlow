import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

    // Health-check root route
   app.get('/', (req, res) => {
     res.send('API WORKING');
    });

    // Global error handler (catches both known and unknown errors)
    app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
      });
    });

//  DB connect

 connectDB()
   .then(() => {
    console.log('✅ MongoDB connected');

    // Routes (only registered after DB connected)
    app.use('/api/user', userRouter);
    app.use('/api/tasks', taskRouter);



    // Start server
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1); // Exit process on db connect failure
  });
