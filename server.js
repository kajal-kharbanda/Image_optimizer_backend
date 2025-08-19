const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./routes');
const cors=require('cors')
dotenv.config();
const Port=process.env.PORT || 3000 ;

const app = express();

app.use(express.json());
app.use('/uploads', cors(),express.static(path.join(__dirname, 'uploads')));
app.use('/processed', cors(), express.static(path.join(__dirname, 'processed')));
app.use('/compressed', cors(),express.static(path.join(__dirname, 'compressed')));
app.use(cors({
    origin: 'http://localhost:5173', // your frontend origin
    credentials: true // if you're sending cookies or auth headers
}));
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true  
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api', routes);


app.listen(Port, () => console.log(`Server running on port ${Port}`));
