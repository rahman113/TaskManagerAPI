const express = require('express');
const path = require('path')
const sharp = require('sharp')
const router = new express.Router()
const User = require("../models/userModel");
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../Emails/account')

// Register a new user
router.post('/users', async (req, res) => {
    // creating the instance of User model
    const users = new User(req.body)
    try {
        const user = await users.save()
        sendWelcomeEmail(user.email, user.name, user.address, user.age)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})
// login 
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log("User", user)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    }   
    catch (e) {
        res.status(500).send(e.message)
    }
})
// logout for a particular user
router.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!== req.token
        })
        const user = await req.user.save()
        res.send(user)
    }
    catch (e) {
        res.status(500).send(e.message)
    }

})
// Logout of all users!
router.post('/users/logoutAll', auth, async (req, res) => {

    try {

        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }

})

// Reading profile
router.get('/users/me',auth, async (req, res) => { res.send(req.user) })


// File upload
const multer = require('multer');
const { appendFile } = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {

    if (file.mimetype !== 'image/png' || file.mimetype !== "image/jpg")
        console.log("only jpg and png file will we uploaded")
    callback(undefined, true)

}
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
})
//  const upload = multer({
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req,file,cb) {
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
//         {
//                 return cb(new Error('Please upload a jpg or jpeg or png'))
//         }
//         cb(undefined, true)
// }    
// })

// Router for file upload
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // The Buffer type should
    // Be used when storing binary data, which is exactly the type of data that multer provides.
    //  const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 350
    //  }).png().toBuffer()
    //  req.user.avatar = buffer
    const user = await User.findOneAndUpdate({ _id: req.user._id }, { avatar: req.file.path }, { new: true })
    /* req.user.avatar = req.file.path;
    await req.user.save() */
    res.json({
        message: 'Avatar saved succcesfully.',
        data: {
            user
        }
    })
},
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    })

router.delete('/users/me/avatar',auth, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(404).send(e.message)
    }
})
// Fetching a particular user by their specific id!
router.get('/users/:id', async (req, res) => {

    const _id = (req.params.id)

    try {

        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send(user)
    }
    catch (e) {
        res.status(500).send(e);
    }
})
// updating user document
router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'address', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            success: false,
            err: 'Invalid updates!'
        })

    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    }
    catch (e) {
        res.status(400).send(e)
    }
})
//  deleting a login user
router.delete('/users/me', auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.params.id)

        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router;