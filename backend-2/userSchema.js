const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    messages:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phone:{
                type:Number,
                required:true
            },
            message:{
                type:String,
                required:true
            }
        }
    ],
    People:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phone:{
                type:Number,
                required:true
            },
        }
    ],
    date:{
        type:Date,
        default:Date.now()
    },
    tokens:[{
            token:{
                type:String,
                required:true
            }
        }]
})

//hashing the password
    userSchema.pre('save',async function (next){
        if(this.isModified('password'))
        {
            this.password = await bcrypt.hash(this.password,12)
        }
        next()
    })


    //Generating Token 
    userSchema.methods.generateAuthToken = async function(){
        try{
            let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
            this.tokens = this.tokens.concat({token:token})
            await this.save()
            return token
        }
        catch(err){
            console.log(err)
        }
    }

    // adding contactPage Message to Database
    userSchema.methods.addMessage = async function( name, email, phone, message){
        try{
            this.messages = this.messages.concat({ name, email, phone, message})
            await this.save()
            return this.messages;
        }catch(err){
            console.log(err)
        }
    }
    // adding People to Database
    userSchema.methods.addPeople = async function( name, email, phone ){
        try{
            this.People = this.People.concat({ name, email, phone })
            await this.save()
            return this.People;
        }catch(err){
            console.log(err)
        }
    }


const User = mongoose.model('USERS',userSchema)

module.exports = User;

