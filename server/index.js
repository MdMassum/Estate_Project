// const express = require ('express')
// const ConnectToMongo = require('./config/db')
// in package.json if we give script as "type":"module" we can use import instead of require
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// console.log(process.env.MONGO_URL);

await mongoose.connect(process.env.MONGO_URL)
    .then((data)=>console.log(`Mongodb Connected Successfully on ${data.connection.host}`))
    .catch(err => console.log(err)) 


app.listen(3000, ()=>{
    console.log("Server running on port 3000 !!")
})
