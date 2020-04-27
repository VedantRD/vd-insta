const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')

// Importing User,Post Model
const User = mongoose.model('User')
const Post = mongoose.model('Post')

// Watch profile of user
router.get('/user/:id', requireLogin, async (req, res) => {
    // console.log(req.params.id)
    //"5e944b4e0f76f910ac77fab1"
    await User.findOne({ _id: req.params.id })
        .select('-password')
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate('postedBy', '_id name')
                .exec((err, posts) => {
                    if (err) {
                        return res.json({
                            status: 'failed',
                            messsage: 'posts not found',
                        })
                    }
                    res.json({
                        status: 'success',
                        messsage: 'routing to other users profile',
                        user,
                        posts
                    })
                })
        })
        .catch(err => {
            res.json({
                status: 'failed',
                messsage: 'user not found',
            })
        })
})

// Follow the User
router.patch('/follow', requireLogin, async (req, res) => {
    await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.user._id } }, { new: true }, (err, result) => {
        if (err) {
            return res.json({
                status: 'failed',
                messsage: 'could not follow the user'
            })
        }
        User.findByIdAndUpdate(req.user._id, { $push: { following: req.body.followId } }, { new: true })
            .select('-password')
            .then(result => {

                const activity = {
                    text: `started following you`,
                    createdAt: Date.now(),
                    doneBy: req.user,
                }
                User.findByIdAndUpdate(req.body.followId, { $push: { activity } }, { new: true })
                    .then((followedRes) => {
                        // console.log('liked saved success')
                        console.log(followedRes)
                    })
                    .catch(err => console.log(err))

                res.json({
                    status: 'success',
                    messsage: 'successfully followed the user',
                    result
                })
            })
            .catch(err => console.log(err))
    })
})

// Unfollow the User
router.patch('/unfollow', requireLogin, async (req, res) => {
    await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.user._id } }, { new: true }, (err, result) => {
        if (err) {
            return res.json({
                status: 'failed',
                messsage: 'could not unfollow the user'
            })
        }
        User.findByIdAndUpdate(req.user._id, { $pull: { following: req.body.unfollowId } }, { new: true })
            .select('-password')
            .then(result => {
                res.json({
                    status: 'success',
                    messsage: 'successfully unfollowed the user',
                    result
                })
            })
            .catch(err => console.log(err))
    })
})

// Get all activities 
router.get('/activities', requireLogin, async (req, res) => {
    await User.findOne({ _id: req.user._id })
        .populate('activity.doneBy')
        .then(user => {
            res.json({
                status: 'success',
                message: 'fetched all activities successfully',
                activity: user.activity.reverse()
            })
        })
        .catch(err => console.log(err))
})

// Get all following
router.get('/getfollowing/:userId', requireLogin, async (req, res) => {
    await User.findOne({ _id: req.params.userId })
        .then(user => {
            if (user) {
                User.find({ _id: { $in: user.following } })
                    .then(following => {
                        res.json({
                            status: 'success',
                            message: 'fetched user following successfully',
                            following
                        })
                    })
                    .catch(err => console.log(err))
            }
            else {
                return res.json({
                    status: 'failed',
                    message: 'user not found',
                })
            }
        })
        .catch(err => console.log(err))
})

// Get all followers
router.get('/getfollowers/:userId', requireLogin, async (req, res) => {
    await User.findOne({ _id: req.params.userId })
        .then(user => {
            if (user) {
                User.find({ _id: { $in: user.followers } })
                    .then(followers => {
                        res.json({
                            status: 'success',
                            message: 'fetched user followers successfully',
                            followers
                        })
                    })
                    .catch(err => console.log(err))
            }
            else {
                return res.json({
                    status: 'failed',
                    message: 'user not found',
                })
            }
        })
        .catch(err => console.log(err))
})

// Update Bio
router.patch('/updateBio', requireLogin, async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { bio: req.body.newBio } }, { new: true })
        .exec((err, result) => {

            if (err) {
                return res.json({
                    status: 'failed',
                    message: err
                })
            }

            res.json({
                status: 'success',
                message: 'Bio Updated Successfully',
                result
            })
        })
})

module.exports = router