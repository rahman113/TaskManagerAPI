
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
// const Task = mongoose.model('Tasks', {     //model
//         description: {
//         type: String,
//         required: true,
//         trim: true
//         },
//         completed : {
//         type: Boolean,
//         default: false
//         }
//         })