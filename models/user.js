const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        default: 'This user is too lazy to write even two lines'
    },
    resetToken: String,

    expireToken: Date,

    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    activity: [
        {
            text: String,
            createdAt: Date,
            doneBy: {
                type: ObjectId,
                ref: 'User'
            },
            postId: String
        }
    ]
})

mongoose.model('User', userSchema)