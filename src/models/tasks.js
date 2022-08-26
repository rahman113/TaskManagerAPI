
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const taskSchema = new mongoose.Schema({

        description: {
                type: String,
                required: true,
                trim: true
        },
        completed: {
                type: Boolean,
                default: true,
        },
        owner: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
        }
}, {
        timestamps: true
})
const Tasks = mongoose.model('Tasks', taskSchema)
module.exports = Tasks;