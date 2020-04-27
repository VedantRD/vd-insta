const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')

// Importing Post Model
const Post = mongoose.model('Post')
const User = mongoose.model('User')

// Create new Post
router.post('/createpost', requireLogin, async (req, res) => {
    const { title, body, photo, postedAt } = req.body
    console.log(req.body)
    if (!title || !body || !photo) {
        return res.json({
            status: 'failed',
            message: 'please fill all fields'
        })
    }
    req.user.password = undefined
    const post = new Post({ title, body, photo, postedBy: req.user, postedAt })
    await post.save()
        .then((post) => {
            return res.json({
                status: 'success',
                message: 'new post added successfully !',
                post
            })
        })
        .catch(err => console.log(err))
})

// Get ALl Posts
router.get('/allposts', requireLogin, async (req, res) => {
    await Post.find()
        .populate('postedBy comments.postedBy', { 'password': 0 })
        .sort('-postedAt')
        .then(posts => {
            res.json({
                status: 'success',
                message: 'all posts are fetched successfully',
                posts
            })
        })
        .catch(err => console.log(err))
})

// Get My Posts
router.get('/myposts', requireLogin, async (req, res) => {
    await Post.find({ postedBy: req.user._id })
        .populate('postedBy', { 'password': 0 })
        .sort('-postedAt')
        .then(posts => {
            res.json({
                status: 'success',
                message: 'my posts are fetched successfully',
                posts
            })
        })
        .catch(err => console.log(err))
})

// Get One Post
router.get('/getOnePost/:postId', requireLogin, async (req, res) => {
    await Post.findOne({ _id: req.params.postId })
        .populate('postedBy comments.postedBy', { 'password': 0 })
        .then(post => {
            res.json({
                status: 'success',
                message: 'one post is fetched successfully',
                post
            })
        })
        .catch(err => console.log(err))
})

// Like The Post
router.patch('/like', requireLogin, async (req, res) => {
    await Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $push: { likes: req.user._id } },
        { new: true }
    )
        .then(post => {
            // console.log(req.body.postedByID)
            if (req.user._id != req.body.postedByID) {
                const activity = {
                    text: `liked your post`,
                    createdAt: Date.now(),
                    doneBy: req.user,
                    postId: req.body.postId
                }
                User.findByIdAndUpdate(req.body.postedByID, { $push: { activity } }, { new: true })
                    .then((likedRes) => {
                        // console.log('liked saved success')
                        // console.log(likedRes)
                    })
                    .catch(err => console.log(err))
            }

            res.json({
                status: 'success',
                message: 'post liked',
                post
            })
        })
        .catch(err => { console.log(err) })
})

// Unlike The Post
router.patch('/unlike', requireLogin, async (req, res) => {
    await Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $pull: { likes: req.user._id } },
        { new: true }
    )
        .then(post => {
            res.json({
                status: 'success',
                message: 'post unliked',
                post
            })
        })
        .catch(err => { console.log(err) })
})

// Comment The Post
router.patch('/comment', requireLogin, async (req, res) => {
    const comment = {
        text: req.body.text,
        created: req.body.created,
        postedBy: req.user._id
    }
    await Post.findByIdAndUpdate(
        { _id: req.body.postId },
        { $push: { comments: comment } },
        { new: true }
    )
        .populate('comments.postedBy', '_id name')
        .exec((err, post) => {
            if (err) {
                return res.json({
                    status: 'failed',
                    message: 'Could not comment on this post'
                })
            }
            else {
                // console.log(req.body.postedByID)
                if (req.user._id != req.body.postedByID) {
                    const activity = {
                        text: `commented on your post`,
                        createdAt: Date.now(),
                        doneBy: req.user,
                        postId: req.body.postId
                    }
                    User.findByIdAndUpdate(req.body.postedByID, { $push: { activity } }, { new: true })
                        .then((commentedRes) => {
                            // console.log('liked saved success')
                            // console.log(commentedRes)
                        })
                        .catch(err => console.log(err))
                }

                res.json({
                    status: 'success',
                    message: 'Commented on post',
                    post
                })
            }
        })
})

// Delete the Post
router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    await Post.findOne({ _id: req.params.postId })
        .populate('postedBy', '_id')
        .exec((err, post) => {
            if (err || !post) {
                return res.json({
                    status: 'failed',
                    message: 'Could not delete this post'
                })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        return res.json({
                            status: 'success',
                            message: 'Successfully Deleted'
                        })
                    })
                    .catch(err => console.log(err))
            }
        })
})

// Get the posts whom user follow
router.get('/followposts', requireLogin, async (req, res) => {
    await Post.find({ 'postedBy': { $in: req.user.following } })
        .populate('postedBy comments.postedBy', { 'password': 0 })
        .sort('-postedAt')
        .then(posts => {
            res.json({
                status: 'success',
                message: 'all posts are fetched successfully',
                posts
            })
        })
        .catch(err => console.log(err))
})

module.exports = router