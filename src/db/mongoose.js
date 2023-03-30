
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(res => {
    console.log(`MongoDB dataBase has connected with HOST: ${res.connection.host}`)
}).catch(err => {
    console.log('Error', err.message)

})
// const Task = mongoose.model('Tasks', {     //model
//         description: {
//         type: String,
//         required: true,
//         trim: trueco
//         },
//         completed : {
//         type: Boolean,
//         default: false
//         }
//         })