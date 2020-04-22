const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
// require('dotenv').config({ path: 'config.env' })
const { MONGODB_URI } = require('./config/keys')

// Middlewares
app.use(express.json())

// Connecting MongoDB
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, (err) => {
    if (err) {
        return console.error('Something went wrong')
    }
    console.log('DB connection Successful')
})

// Importing Models
require('./models/user')
require('./models/post')

// Importing Routes
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV == 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// Starting Server
app.listen(PORT, () => {
    console.log('Server is running on PORT', PORT)
})