const route = require('express').Router()
const {User, Item, Transaction} = require('../../models')
const cekLogin = require('../../helper/cekLogin')
const genPass = require('../../helper/hashpass')
const cekUser = require('../../helper/cekUser')
const OAuth = require('oauth');
var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    '1.0A',
    null,
    'HMAC-SHA1'
  );

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
            res.redirect('/user/login?err= Email not found')
        } else {
            if (!genPass.checkPass(req.body.password, data.password)) {
                res.redirect(`/user/login?err=Wrong password`)
            } else {
                req.session.user = {
                    id: data.id, 
                    email: data.email,
                    twitterUsername: data.twitterUsername
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

route.get('/tweet/post/:twit', cekLogin, cekUser, (req, res) => {
    oauth.post(
    'https://api.twitter.com/1.1/statuses/update.json' , 
        { status: `thriVt :
        Hello ${'@'+req.params.twit} , ${'@' + req.session.user.twitterUsername} want your item from thriVt` },
        function(err, data) {
            if(err) {
                // res.send(err.data)
                if (err.data == '{"errors":[{"code":187,"message":"Status is a duplicate."}]}') {
                      res.redirect(`/user/${req.session.user.id}?err= You already notify the giver via twitter`)
                } else {
                    res.redirect(`/user/${req.session.user.id}?err= Error notifying giver via twitter`)
                }
            } else {
                res.redirect('/item?msg= Success notifying giver via twitter')
                console.log('success tweet!!!!!!!!!!!!')
            }
        }
    )
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

route.get('/:id',cekLogin , (req, res ) => { //ingat cekLogin
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
        console.log("------> ", data)
        // res.send(data)
        User.genTrans(data.id)
            .then(dataOne => {
                let trans = null
                // res.send(dataOne)
                if(dataOne.length >=1) {
                    trans = `Success donation : ${dataOne.length}`
                } else {
                    trans = `You don't have donation yet`
                }
                res.render('user.ejs', {data, msg, err, trans})
            })
            .catch(err => {
                res.send(err)
            })
    })
    .catch(err => {
        // res.send(err)
        res.redirect(`/?err= ${err}`)
    })
})

module.exports = route