const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../userSchema')
const authenticate = require('../Middelwares/authenticate')
const cookieParser =require("cookie-parser")


router.get('/' , (req, res)=>{
    res.send("Hello from the router Side")
})

                        //   Registertaion


router.post('/register' ,async (req, res)=>{

    const { name, email, phone, password } = req.body;

    if(!name || !email || !phone || !password  )
    {
        return res.status(422).json({ error: "Plzz fill all the field" })
    }

    try{
        const userExist = await User.findOne({email:email})
        if(userExist){
            return res.status(422).json({error:"Email already exist"})
        }
        else{
            const user = new User({ name, email, phone, password })
            await user.save()
            res.status(201).json({ message:"user registered successfully" })
        }

        
        
    }
    catch(err){
        console.log(err)
    }
        
})
        
//                                  LogIn

router.post('/login', async (req, res)=>{
    const { name, email, phone, password } = req.body;
    if( !email || !password  )
    {
        return res.status(422).json({ error: "Plzz fill the data properply!" })
    }

    const userLogin = await User.findOne({email: email})
    console.log(userLogin)

    if(userLogin){

        const isMatch = await bcrypt.compare(password, userLogin.password)

        const token = await userLogin.generateAuthToken()
        res.cookie('jwtoken', token, {
            expires:new Date(Date.now() + 25892000000),
            httpOnly:true
        })
        if( !isMatch){
            res.json({error:"Incorrect Password"})
            console.log(password)
            console.log(isMatch)
            console.log(userLogin.password)
        }
        else{
            res.json({message:"User Logged In"})
        }
    }
    else{
        res.status(422).json({messgae:"Email doesn't exist"})
    }


})


router.use(cookieParser())
//                                         Home Page


router.get('/about', authenticate, (req,res)=>{
    res.send(req.rootUser)
})

// for getting User Data
router.get('/dataRequest', authenticate, (req,res)=>{
    res.send(req.rootUser)
})

//                                          Contact
// router.post('/contact', authenticate, async (req,res)=>{
//     try{
//         const { name, email, phone, message} = req.body
//         if( !name || !email || !phone || !message){
//             console.log('erroe in contact form')
//             return res.json({error:'fill the form first'})
//         }

//         const userContact = await User.findOne({_id:req.userID})

//         if(userContact){
//             const userMessage = userContact.addMessage(name, email, phone, message)

//             await userContact.save();
//             res.status(201).json({message:"Message Sent Successfully"})
//         }

//     }catch(err){
//         console.log(err)
//     }
// })


//                                     People
router.post('/people', authenticate ,async (req,res) =>{
    // res.send(req.rootUser)
    console.log({_id:req.userID})
    try{
        const email = req.body
        if(!email){
            return res.json({error:'Email not Found'})
        }
        const newPersonExist = await User.findOne(email)
        console.log(newPersonExist.name)
        if(newPersonExist){
            const userContact = await User.findOne({_id:req.userID})
            if (userContact){
                const userPeople = await  userContact.addPeople(newPersonExist.name, newPersonExist.email, newPersonExist.phone)
                console.log(userPeople)
                await userContact.save();
                return res.status(201).json({message:'Person Added Successfully'})
            }
            
        }
    }catch(err){
        console.log(err)
    }
})





//Logout
router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken', {path:'/'})
    res.status(200).send('User Logged Out')
})

module.exports = router