'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const signinRouter = require('./auth/routers/signin')
const signupRouter = require('./auth/routers/signup')
const secretRouter = require('./auth/routers/secret')
const usersRouter = require('./auth/routers/Users')
const V1 =require('./auth/routers/V1')
const V2 =require('./auth/routers/V2')
const notFoundHandler = require('./error-handler/404');
const errorHandler = require('./error-handler/500');

app.use(express.json());
app.use(cors());
app.use(signinRouter);
app.use(signupRouter);
app.use(secretRouter);
app.use(usersRouter);
app.use('/api/v1',V1);
app.use('/api/v2',V2);



function start(port) {
    app.listen(port,()=> console.log(`Running on Port ${port}`))
}

app.get('/',(req,res)=>{
    res.send('server is alive')
})

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports ={
    app : app ,
    start : start
}