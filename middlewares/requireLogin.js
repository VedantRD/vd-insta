const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
// require('dotenv').config({ path: '../config.env' })
const { JWT_SECRET } = require('../config/keys')

// Importing User Model
const User = mongoose.model('User')

// require login middleware for protected routes
module.exports = (req, res, next) => {
    const { authorization } = req.headers
    // console.log(req.headers)
    if (!authorization) {
        return res.json({
            status: 'unauthorized access',
            message: 'you must be logged in'
        })
    }

    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({
                status: 'unauthorized access',
                message: 'you must be logged in'
            })
        }
        const { _id } = payload
        await User.findById({ _id })
            .then(userData => {
                req.user = userData
                next()
            })
            .catch(err => console.log(err))

    })
}