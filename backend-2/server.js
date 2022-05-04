const dotenv = require('dotenv')
const express = require('express')
const User = require('./userSchema')
const app = express()
 
dotenv.config({path:'./config.env'})
require('./conn')
app.use(express.json())

app.use(require('./router/auth'))

const PORT = process.env.PORT



app.get('/',(req,res)=>{
    res.send("Hello World")
})


app.listen(PORT, ()=>{
    console.log(`Server Running on Port ${PORT}`)
})