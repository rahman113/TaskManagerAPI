
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Tasks = require('./tasksModel')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide a userName"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please add an email"],
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid try to insert a valid email')
            }

        }
    },
    age: {
        type: Number,
        required: [true, "please provide a Age in Numbers only not acceptable in string"],
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be positive number', value);
            }
        }
    },
    address: {
        type: String,
        required: [true, "please provide an address"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        trim: true,
        minlength: [7, "Password should be atleast 7 character long"],
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw Error('Password can not conatin "password"');

        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: String
    }
}, {
    timestamps: true
})
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    // delete userObject.avatar
    return userObject;
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    const data = jwt.verify(token, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    console.log(user)
    if (!user)  throw new Error('Invalid email')
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if (!isMatch) throw new Error('Unable to login')
    return user
    }
// Hash the plaintext password before save the user
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next();

})
// Delete user tasks when user is remove
userSchema.pre('remove', async function (next) {
    // this refers to the user document
    const user = this
    await Tasks.deleteMany({ owner: user._id })
    next()
})
const User = mongoose.model('User', userSchema)
module.exports = User;              