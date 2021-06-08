const express = require('express')
const router =express.Router()
const mongoose =require('mongoose')
const User = mongoose.model("USER")
const Posts = mongoose.model("POSTS")
const requireLogin = require('../middleware/requireLogin')



router.post("/createPost",requireLogin,(req,res)=>{
    const {projectName,description,duration,difficulty}=req.body
    const {_id}=req.user
    const post = new Posts({projectName,description,duration,difficulty,postOwner:_id})
    post.save().then((savedPost)=>{
        res.json({_id:savedPost._id})
    }).catch(err=>{
        console.log(err)
        res.status(422).json({"error":"Did not create post"})
    })
})

router.get("/getPost/:id",requireLogin,(req,res)=>{
    const {id} = req.params
    Posts.findById(id).then(savedPost=>{
        if(savedPost)res.json({savedPost})
        else res.status(422).json({error:"Post does not exist"})
    }).catch(err=>{
        console.log(err)
        res.status(422).json({error:"There was a unexpected problem"})
    })
})
router.put("/updatePost",requireLogin,(req,res)=>{
    const {projectName,description,duration,difficulty,id}=req.body
    const {_id}=req.user
    Posts.findById(id).then(savedPost=>{
        if(savedPost.postOwner.equals(_id)){
            savedPost.projectName=projectName
            savedPost.description=description
            savedPost.duration=duration
            savedPost.difficulty=difficulty
            savedPost.save().then(post=>{
                res.json({id:post._id})
            }).catch(err=>{
                console.log(err)
                res.status(422).json({error:"Could not update post"})
            })
        }
        else{
            res.status(422).json({error:"You do not have authorization to update"})
        }
        
    }).catch(err=>{
        console.log(err)
        res.status(422).json({error:"There was a unexpected problem"})
    })
})

router.delete("/deletePost/:id",requireLogin,(req,res)=>{
    const {id}=req.params
    const {_id}=req.user
    Posts.findById(id).then(savedPost=>{
        if(savedPost){
            if(savedPost.postOwner.equals(_id)){
                Posts.findOneAndDelete(id).then(()=>{
                    res.json({message:"Deleted Successfully"})
                }).catch(err=>{
                    console.log(err)
                    res.status(422).json({error:"Could not delete"})
                })
            }
            else{
                res.status(422).json({error:"You do not have authorization to delete"})
            }
        }
        
    }).catch(err=>{
        console.log(err)
        res.status(422).json({error:"There was a unexpected problem"})
    })
})

module.exports=router