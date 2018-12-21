require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes')
const session = require('express-session')


app.set('view engine', 'ejs')

app.use('/', express.static('uploads')) 

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: process.env.secret
}))

app.use('/', route)

app.listen(port , () => {
    console.log(`App listening to port ${port}`)
})

// app.listen(process.env.PORT || '3000')