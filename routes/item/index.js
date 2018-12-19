const route = require('express').Router()
const {User, Item, Transaction} = require('../../models')
const cekLogin = require('../../helper/cekLogin')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

route.get('/' , (req, res) => {
    let msg = null
    let err = null

    if(req.query.err) {
        err = req.query.err
    } else if (req.query.msg) {
        msg = req.query.msg
    }

    Item.findAll({
        include: {
            model: User
        }
    })
        .then(data => {
            res.render('items.ejs', {data, err, msg})
        })
        .catch(err => {
            res.send(err)
        })
})

route.get('/add' , cekLogin, (req, res ) => {
    res.render('addItem.ejs')
})

route.post('/add' , cekLogin, upload.single('urlPic'), (req, res ) => { 
    // console.log(req.file)
    let path = `${req.file.path}.${req.file.mimetype.split('/')[1]}`
    // console.log(path)]
    console.log(req.session.user, '++++++')
    Item.create({name: req.body.name, urlPic: path, GiverId: req.session.user.id})
        .then(data => {
            res.redirect('/item')
        })
        .catch(err => {
            res.send(err)
        })
})

route.get('/:id/delete', cekLogin, (req, res ) => {
    Item.findOne( {
        include: {
            model:User
        }
    })
    .then(dataItem => {
        if(req.session.user.id !== dataItem.User.id) {
            res.redirect('/item?msg= You are not allowed to delete others item')
        } else {
            Item.destroy({where:{
                id: req.params.id
            }})
            .then(data => {
                res.redirect('/item?msg= Success delete item')
            })
            .catch(err => {
                res.send(err)
            })
        }
    })
    .catch(err => {
        res.send(err)
    })
})

module.exports = route