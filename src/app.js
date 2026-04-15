const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Kich hoat doc file .env
dotenv.config();
const app = express();

// Middlewares
app.use(cors()); // Cho phep cac domain khac truy cap vao API
app.use(express.json()); // Cho phep server doc du lieu duoi dang JSON

//Route
app.get('/',(req,res) => {
    res.send('✧ LumiStay API is shining! ✧');
});
module.exports = app;