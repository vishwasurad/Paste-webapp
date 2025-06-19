const express = require('express')
const app = express()
const path = require('path');
const dotenv=require("dotenv");
const userRoutes = require('./routes/user-routes');
const notesRoutes = require('./routes/notes-routes');
const connectDB = require('./config/db');
const cors = require('cors');
const {checkAuth,authorize} = require('./middlewares/checkAuth');
dotenv.config();
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
const port = process.env.PORT

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));



// app.use('/api/auth', userRoutes);
// app.use('/api/',checkAuth,authorize(["NORMAL","ADMIN"]), notesRoutes);
 app.use('/api/', notesRoutes);

app.get('/', (req, res) => {
  res.send("Welcome to the backend server!")
})

app.listen(port, () => {
  console.log("Server is up")
})