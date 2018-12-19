const route = require('express').Router()
const {User, Item, Transaction} = require('../../models')
const cekLogin = require('../../helper/cekLogin')
const genPass = require('../../helper/hashpass')

route.get('/login' , (req, res ) => {
    let msg = null
    let err = null

    if(req.query.err) {
        err = req.query.err
    } else if (req.query.msg) {
        msg = req.query.msg
    }
    res.render('formLogin.ejs', {msg, err})
})

route.post('/login', (req, res ) => {
    User.findOne({where: {
        email: req.body.email
    }})
    .then(data => {
        if(!data) {
            res.redirect('/?err= Email not found')
        } else {
            if (!genPass.checkPass(req.body.password, data.password)) {
                res.redirect('/?err= Wrong password')
            } else {
                req.session.user = {
                    id: data.id, 
                    email: data.email,
                    role: data.role
                }
                res.redirect(`/user/${data.id}`)
            }
        }
    })
    .catch (err => {
        res.redirect(`/?err= ${err}`)
    })
})

route.get('/logout/:id', cekLogin, (req, res ) => {
    req.session.destroy((err) => {
        if(err) {
            res.send(err)
        } else {
            res.redirect('/login?= Success logout ') //belom bs diblng msg is not defined masih kebawa logout/idnya ==> gara" pake post harus pakai get
        }
    })
})

route.get('/register', (req, res) => {
    let msg = null
    let err = null
    if(req.query.msg) {
        msg = req.query.msg
    } else if (req.query.err) {
        err = req.query.err
    }
  res.render('formRegis.ejs', {msg, err})
})

route.post('/register', (req, res ) => {
 let obj = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
        address: req.body.address,
        twitterUsername: req.body.twitterUsername
    }
    User.create(obj)
        .then(data => {
            // console.log(data, '===============')
            res.redirect(`/user/login?msg= Success registering user your username is ${data.username}`)
        })
        .catch(err => {
            res.redirect(`/user/register?err= ${err}`)
        })
})

route.get('/:id/edit' , (req, res) => {
    User.findOne({where: {
        id: req.params.id
    }})
    .then(data => {
        res.render('editForm.ejs', {data})
    })
    .catch(err => {
        res.redirect(`/?err= ${err}`)
    })
})

route.post('/:id/edit', (req, res ) => { 
    let obj = {
        id: req.params.id,
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
        address: req.body.address,
        twitterUsername: req.body.twitterUsername
    }
    User.update(obj, {where: {
        id: req.params.id
    },  individualHooks: true})
        .then(data => {
            res.redirect(`/user/${req.params.id}`)
        })
        .catch(err => {
            res.send(err)
        })

})

route.get('/:id/delete' ,cekLogin, (req, res) => {
    User.destroy({where: {
        id: req.params.id
    }})
    .then(data => {
        res.redirect(`/?msg= Success delete user`)
    })
    .catch(err => {
        res.redirect(`/user/${req.params.id}?err= ${err}`)
    })
})

route.get('/:id/myItems' , cekLogin, (req, res ) => {
    let msg = null
    let err = null

    if(req.query.err) {
        err = req.query.err
    } else if (req.query.msg) {
        msg = req.query.msg
    }
    Item.findAll({where: {
        GiverId: req.params.id
    }})
    .then(data => {
        res.render('myItem.ejs', {data, err, msg})
    })
    .catch(err => {
        res.redirect(`/user/${req.params.id}?msg= Error getting my items`)
    })
})

route.get('/:id', cekLogin , (req, res ) => {
    let msg = null
    let err = null

    if(req.query.err) {
        err = req.query.err
    } else if (req.query.msg) {
        msg = req.query.msg
    }
    // console.log(req.params)
    User.findOne({where: {
        id: req.params.id
    }})
    .then(data => {
        res.render('user.ejs', {data, msg, err})
    })
    .catch(err => {
        res.send(err)
        // res.redirect(`/?err= ${err}`)
    })
})

module.exports = route