let cekLogin = function(req, res, next) {
    if(!req.session.user) {
        res.redirect('/user/login?msg=Login first!') //kenapa kalo send query error dia berulang"
    } else {
        res.locals.userId = req.session.user.id
        next()
    }
}
module.exports = cekLogin