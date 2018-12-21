const route = require('express').Router()
const {User, Item, Transaction} = require('../../models')
const cekLogin = require('../../helper/cekLogin')
var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // console.log(file)
        let splitFile = file.originalname.split('.')[0]
        let type = file.mimetype.split('/')[1]
      cb(null, Date.now() + splitFile + '.' + type)
    }
})
   
var upload = multer({ storage: storage })

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

route.get('/add' , cekLogin , (req, res ) => { 
    res.render('addItem.ejs')
})

route.post('/add' ,cekLogin ,  upload.single('urlPic'), (req, res ) => {  
    // console.log(req.file, '=========')
    // let path = `${'uploads/' + req.file.getName}`
    let path = `${req.file.filename}`
    // console.log(req.session.user, '++++++')
    Item.create({name: req.body.name, urlPic: path, GiverId:req.session.user.id }) // ubah giver id => req.session.user.id
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
        }, where: {
            id: req.params.id
        }
    })
    .then(dataItem => {
        if(req.session.user.id !== dataItem.GiverId) {
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