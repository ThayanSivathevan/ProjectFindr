const express = require('express')
const router =express.Router()
const mongoose =require('mongoose')
const User = mongoose.model("USER")

const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')

const {jwtsecret}= require('../config/key')



router.post('/signup',(req,res)=>{
    const {firstName,lastName,email,password,program}=req.body

    if(!firstName||!lastName||!email||!password){
        return res.status(422).json({error:"please fill out all fields"})
    }


    User.findOne({email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"There is a user with this email already"})
        }

        bcrypt.hash(password,12).then(hashedPassword=>{
            const user=new User({
                email,
                password:hashedPassword,
                firstName,
                lastName,
                program
            })

            user.save().then(user=>{
                res.json({message:"Signed up successfully"})
            }).catch(err=>{
                console.log(err)
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})


router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(422).json({error:"please fill out all fields"})
    }
    User.findOne({email}).then((savedUser)=>{
        if(!savedUser)return res.status(422).json({error:"User does not exist"})

        bcrypt.compare(password,savedUser.password).then(domatch=>{
            if(domatch){
                const token = jwt.sign({_id:savedUser._id},jwtsecret)
                const {_id,email,program,firstName,lastName}=savedUser
                res.json({token,user:{_id,email,program,firstName,lastName}})
            }
            else{
                return res.status(422).json({error:"Passwords do not match"})
            }
        })
    })

})


router.get('/check',requireLogin,(req,res)=>{
    res.json({user:req.user})
})

module.exports = router