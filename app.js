const express = require('express')
const app = express()
const port = 3000
const route = require('./routes')
const session = require('express-session')

app.set('view engine', 'ejs')

app.use('/uploads', express.static('uploads')) // gada filename di blakangnya

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret:'hahaha'
}))

app.use('/', route)
// app.use((req, res, next) => {
//     res.locals.
// })

app.listen(port , () => {
    console.log(`App listening to port ${port}`)
})