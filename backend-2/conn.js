const mongoose = require('mongoose')



const DbLink = process.env.DATABASE

mongoose.connect(DbLink)
.then(()=>{console.log("DB connection successfull")})
.catch((err)=>{console.log(err)})