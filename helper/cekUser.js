let cekUser = function(req, res, next) {
    if(req.params.twit == req.session.user.twitterUsername) {
        res.redirect(`/item?err= Sorry, you can't notify yourself!`)
    } else if( req.params.twit == null || req.session.user.twitterUsername == null) {
        res.redirect(`/item?err= twitter username not valid`)
    } else {
        next()
    }
} 

module.exports = cekUser