const connectDB = require('./db');
var cors = require('cors');
const dotenv = require('dotenv');

connectDB();
const express = require('express')
const app = express()
const port = 8000
app.use(cors())

app.use(express.json())

dotenv.config({path:'./config.env'});
const PORT = process.env.PORT || 8000;

//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
  