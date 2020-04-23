const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require('dotenv').config({ path: '../config.env' })
const requireLogin = require('../middlewares/requireLogin')
const { JWT_SECRET, SENDGRID_API, EMAIL } = require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

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

                            const mymail = {
                                to: user.email,
                                from: 'vedant.debadwar@gmail.com',
                                subject: 'signup successful',
                                html: "<h1>Welcome to vd-insta !</h1>"
                            }
                            console.log(mymail)
                            transporter.sendMail(mymail)
                                .then(result => console.log(result))
                                .catch(err => console.log(err))

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

// Send Reset Password Link
router.post('/reset', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString('hex')

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    return res.json({
                        status: 'failed',
                        message: 'User account with this email does not exist'
                    })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save()
                    .then(() => {
                        const mymail = {
                            to: user.email,
                            from: 'vedant.debadwar@gmail.com',
                            subject: 'reset password link for your account on vd-insta',
                            html: `
                            <h2>Reset Password</h2>
                            <big>Click <a href='${EMAIL}/reset-password/${token}'>here</a> to reset password. This link will expire in 1 hour</big>
                            `
                        }
                        transporter.sendMail(mymail)
                            .then(result => {
                                if (result) {
                                    return res.json({
                                        status: 'success',
                                        message: 'Email successfully sent, Check your email'
                                    })
                                }
                                else {
                                    return res.json({
                                        status: 'failed',
                                        message: 'Could not send email, please re-enter email'
                                    })
                                }
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    })
})

// Reset Password
router.post('/reset-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.resetToken
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.json({
                    status: 'failed',
                    message: 'Sorry your reset password link expired'
                })
            }
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().
                        then(savedUser => {
                            return res.json({
                                status: 'success',
                                message: 'password updated successufully'
                            })
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})


router.post('/search', (req, res) => {
    // console.log(req.body)
    let pattern = new RegExp('^' + req.body.query, 'i')
    User.find({ name: { $regex: pattern } })
        .select('name _id profilePhoto')
        .then(users => {
            res.json({
                status: 'success',
                message: `${users.length} results found`,
                users
            })
        })
})

module.exports = router