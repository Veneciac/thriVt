const route = require('express').Router()
const user = require('./user')
const item = require('./item')
const transaction = require('./transaction')

route.use(function(req, res, next) {
    if (req.session.user) {
        res.locals.userId = req.session.user.id
        
    } else {
        res.locals.userId = null
    }
    next()
})

route.get('/' , (req, res) => {
    let msg = null
    let err = null

    if(req.query.err) {
        err = req.query.err
    } else if (req.query.msg) {
        msg = req.query.msg
    }
    res.render('home.ejs', {err, msg}) 
})


route.use('/user', user )
route.use('/item', item )
route.use('/transaction', transaction )

route.get('/*' , (req, res ) => {
    let msg = null
    let err = null

    if(req.query.err) {
        err = req.query.err
    } else if (req.query.msg) {
        msg = req.query.msg
    }
    res.render('home.ejs', {msg, err})
})

module.exports = route 