const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    likes: [{
        type: ObjectId,
        ref: 'User',
    }],
    comments: [{
        text: String,
        created: String,
        postedBy: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    photo: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    postedAt: {
        type: String,
        required: true
    }
})

mongoose.model('Post', postSchema)