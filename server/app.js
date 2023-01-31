const mongoose = require('mongoose');
const express = require('express')
const app = express()
const dotenv = require('dotenv')


dotenv.config({ path: './config.env' })

require('./db/conn');
app.use(express.json());

app.use(require('./router/auth'))

const User = require('./models/userSchema')
const middleware = (req, res, next) => {
    console.log('Hello middle');
    next();
}

app.get('/', middleware, function(req, res) {
    console.log('Hello main');
    res.send('Hello World')
})


const PORT = process.env.PORT;
app.listen(process.env.PORT)