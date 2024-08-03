// const express = require ('express')
// const ConnectToMongo = require('./config/db')
// in package.json if we give script as "type":"module" we can use import instead of require
import express from 'express'
import dotenv from 'dotenv'
import ConnectToMongo from './config/db.js'
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'

dotenv.config()
const app = express()

// connecting database 
ConnectToMongo();

app.use(express.json())  // we use this to use req.body for json file i.e now we can recieve and send json by req.body (see also body-parser was used earlier when express.json() was not there we can also use bodyParser.json() )
// app.use(cors()); // for solving issue while connecting frontend and backend

// Available Routes
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter)


// server
app.listen(3000, ()=>{
    console.log("Server running on port 3000 !!")
})

// error handling 
app.use((err,req,res,next)=>{
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'

    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})