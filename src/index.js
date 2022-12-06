const express = require('express');
require("./db/mongoose.js");
const userRouter = require('./routers/usersRouter');
const taskRouter = require('./routers/tasksRouter')


const app = express()
// app.use((req,res,next) => {
//     if(req.method ==='GET'){
//         res.status(503).send('GET request are disabled')
//     }  
//     else {
//         next()
//     }                        
// })
// app.use((req,res,next) =>  res.status(503).send('Site is currently down!. check back soon'))
app.use(express.json());
app.use(userRouter);
app.use(taskRouter)
app.use('/uploads', express.static('uploads'))

//  set port for listening  a request
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
        console.log(`Server is running on port:${PORT}`)
});

// const jwt = require('jsonwebtoken');

// const myFunction = async() =>{

// const token = jwt.sign({id: 'abc123'}, 'This is nodejs tutoriales', {expiresIn: '7 days'})
// console.log(token)

// const data = jwt.verify(token, 'This is nodejs tutoriales')
// console.log(data)
// }
// myFunction()

const multer = require('multer')
const upload = multer({
        dest: 'images',
        limits: {
                fileSize: 1000000
        },
        fileFilter(req, file, cb) {
                if (!file.originalname.match(/\.(jpg|jpg)$/)) {
                        return cb(new Error('Please upload jpg file'))
                }
                cb(undefined, true)
        }
})

app.post('/upload', upload.single('upload'), (req, res) => {
        res.send('files upload successfully')
}, (error, req, res, next) => {
        res.status(400).send({ error: error.message })
})

const Task = require('./models/tasksModel')
const User = require("./models/userModel")
// const main = async () => {


//         //  const tasks = await Task.findById('6215cfac62011e270a11aca7')  
//         //  await tasks.populate('owner').execPopulate()
//         //  console.log(tasks.owner)
//         // const user = await User.findById('6217341c8a9bf81e46cc97d7')
//         // await user.populate('tasks').execPopulate()
//         // console.log(user.tasks)
// }
// main()

