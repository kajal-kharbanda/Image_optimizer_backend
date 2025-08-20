const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const routes = require('./routes');
const cors=require('cors')
const mongoose = require('mongoose');
const connectDB = require('./config/connectDb');
const Port=process.env.PORT || 3000 ;

const app = express();

app.use(express.json());
app.use('/uploads', cors(),express.static(path.join(__dirname, 'uploads')));
app.use('/processed', cors(), express.static(path.join(__dirname, 'processed')));
app.use('/compressed', cors(),express.static(path.join(__dirname, 'compressed')));
const allowedOrigins = [
  "http://localhost:5173", 
  "https://resilient-gecko-d90af3.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
// mongoose.connect(process.env.MONGO_URL)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error(err));
connectDB();

app.use('/api', routes);


app.listen(Port, () => console.log(`Server running on port ${Port}`));
