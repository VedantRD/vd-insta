const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../config.env' })
const requireLogin = require('../middlewares/requireLogin')
const { JWT_SECRET } = require('../config/keys')

// Importing User Model
const User = mongoose.model('User')

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password, profilePhoto } = req.body
    // console.log(req.body)

    if (!name || !email || !password) {
        return res.json({
            status: 'failed',
            message: 'please provide all fields'
        })
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.json({
            status: 'failed',
            message: 'invalid email'
        })
    }

    await User.findOne({ email })
        .then((savedUser) => {
            if (savedUser) {
                return res.json({
                    status: 'failed',
                    message: 'user with this email already exists'
                })
            }
            bcrypt.hash(password, 12)
                .then((hashedPassword) => {

                    const user = new User({ name, email, password: hashedPassword, profilePhoto })
                    user.save()
                        .then(() => {
                            res.json({
                                status: 'success',
                                message: 'signup succesful, new user created'
                            })
                        })
                        .catch(err => console.log(err))

                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

})

// Signin
router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    // console.log(req.body)

    if (!email || !password) {
        return res.status(422).json({
            status: 'failed',
            message: 'please provide email and password'
        })
    }

    await User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) {
                return res.json({
                    status: 'failed',
                    message: 'invalid email or password'
                })
            }
            bcrypt.compare(password, savedUser.password)
                .then(didMatch => {
                    if (didMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, following, followers, profilePhoto } = savedUser
                        return res.json({
                            status: 'success',
                            message: 'succesfully signed in !!',
                            user: { _id, name, email, following, followers, profilePhoto },
                            token
                        })
                    }
                    return res.json({
                        status: 'failed',
                        message: 'invalid email or password'
                    })
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
})

// Update Profile Photo
router.patch('/updateProfilePhoto', requireLogin, (req, res) => {
    console.log(req.body.newPhoto)
    User.findByIdAndUpdate(req.user._id, { $set: { profilePhoto: req.body.newPhoto } }, { new: true })
        .exec((err, result) => {

            if (err) {
                return res.json({
                    status: 'failed',
                    message: err
                })
            }

            res.json({
                status: 'success',
                message: 'Profile Picture Updated Successfully',
                result
            })
        })
})

module.exports = router