let cekUser = function(req, res, next) {
    if(req.params.twit == req.session.user.twitterUsername) {
        res.redirect(`/item?err= You cannot request your own item`)
    } else {
        next()
    }
} 

module.exports = cekUser