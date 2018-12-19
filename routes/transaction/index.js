const route = require('express').Router()
const {User, Item, Transaction} = require('../../models')
const cekLogin = require('../../helper/cekLogin')

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'gamecowo12345@gmail.com',
    pass: 'gamecowo54321'
    }
});

route.get('/:GiveId/:ItemId',cekLogin,  (req, res ) => {
    if(req.session.user.id == req.params.GiveId) {
        res.redirect(`/?msg= You can't request your own item`)
    } else {
        let obj = {
            GiverId: req.params.GiveId,
            TakerId: req.session.user.id,
            ItemId: req.params.ItemId
        }
        Transaction.create(obj)
            .then(data => {
                // Transaction.findOne({where: {
                //     id: data.id
                // }, include: [
                //     {model: User}, {model: Item}
                // ]})
                //     .then(dataTrans => {
                //         res.send(dataTrans)
                //     })
                //     .catch(err => {
                //         res.send(err)
                //     })

                User.findOne({where: {
                    id: req.params.GiveId
                }})
                    .then(dataGive => {

                        //send email ke giver
                        var mailGiver = {
                            from: 'gamecowo12345@gmail.com',
                            to: dataGive.email ,
                            subject: 'Request Item from thriVt',
                            text: `Hello ${req.session.user.email} want your item from thriVt`
                        };
                        transporter.sendMail(mailGiver, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });

                        //send email ke taker
                        var mailTaker = {
                            from: 'gamecowo12345@gmail.com',
                            to: req.session.user.email ,
                            subject: 'Your request Item from thriVt',
                            text: `Hello , thriVt already send your request for item to ${dataGive.dataValues.email}`
                        };
                        transporter.sendMail(mailTaker, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });
                        res.redirect('/item?msg= Success request Items')
                    })
                    .catch(err => {
                        res.send(err)
                    })
            })
            .catch(err => {
                res.redirect('/?msg= Error requesting item !')
            })
    }
})

module.exports = route