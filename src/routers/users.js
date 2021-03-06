const express = require('express');
const sharp = require('sharp')
const router = new express.Router()
const User = require("../models/user.js");
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancellationEmail} = require('../Emails/account')


router.post('/users', async(req,res) =>
{ 
    const users = new User(req.body)

    try{
         
        const user = await users.save()
        sendWelcomeEmail(user.email,user.name, user.address, user.age)
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    }
    catch(e) {
        res.status(400).send(e)

    }
})

router.post('/users/login', async(req, res) => {
   try {
       const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
       res.send({user,token})
       
   }
   catch(e){
            res.status(400).send()
   }
})
   // logout for a particular user
router.post('/users/logout', auth, async(req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!== req.token
        })
      const user = await req.user.save()
        res.send(user)
    }
    catch(e){
        res.status(500).send()
    }

})
// Logout of all users!
router.post('/users/logoutAll', auth, async(req, res) => {

    try {

        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }

})


router.get('/users/me',auth, async(req, res) =>{res.send(req.user)})
    
    // try {

    //     const user = await User.find({})
    //     res.send(user)
    // }
    // catch(e){
    //     res.status(500).send(e)
    // }
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
                return cb(new Error('Please upload a jpg or jpeg or png'))
        }
        cb(undefined, true)
}

    
})
router.post('/users/me/avatar',auth, upload.single('avatar'), async(req,res) => {
    // The Buffer type should
    // Be used when storing binary data, which is exactly the type of data that multer provides.
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 350
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},
  (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth, async(req,res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send
    }
})

// Fetching a particular user by their specific id!
router.get('/users/:id', async(req, res) => {

    const _id = (req.params.id)
    
    try {

        const user = await User.findById(_id)

        if (!user)
        {
           return res.status(404).send()
        } 
         res.status(201).send(user)
    }
    catch(e){
        res.status(500).send(e);
    }
 })
 router.patch('/users/me',auth, async(req, res) =>{
    const updates = Object.keys(req.body)
    
    const allowedUpdates = ['name','age', 'address','email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
        
    }

  try{

      updates.forEach((update) => req.user[update] =req.body[update])

       await req.user.save() 

       res.send(req.user)

  }    
  catch(e){
          res.status(400).send(e)
  }
})
router.delete('/users/me',auth,  async(req,res) =>{

    try{
// const user = await User.findByIdAndDelete(req.params.id)

// if(!user){
//     return res.status(404).send()
// }
     await req.user.remove()
     sendCancellationEmail(req.user.email, req.user.name)
     res.send(req.user)
}
catch(e){
    res.status(500).send(e)
}
})   

module.exports = router;