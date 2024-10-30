// in package.json if we give script as "type":"module" we can use import instead of require
import express from 'express'
import dotenv from 'dotenv'
import ConnectToMongo from './config/db.js'
import path from 'path'
import cors from 'cors'

// importing routers -->
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'
import listingRouter from './routes/listingRoute.js'

import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()

app.use(cors({
    origin:'https://masum-estate.vercel.app',     // frontend url
    credentials: true
}))

const PORT = process.env.PORT || 3000;

// connecting database 
ConnectToMongo();

app.use(express.json())  // we use this to use req.body for json file i.e now we can recieve and send json by req.body (see also body-parser was used earlier when express.json() was not there we can also use bodyParser.json() )
// app.use(cors()); // for solving issue while connecting frontend and backend
app.use(cookieParser()) // for accessing value in cookie

app.get('/',(req,res)=>{
    res.send("Server Running")
})

// Available Routes
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter)
app.use('/api/listing',listingRouter)

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})
// server  //for deploying in vercel this not needed
app.listen(PORT, ()=>{
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
