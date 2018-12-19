function genUname(name, email) {
    return name + '_' + email.slice(0,1) + Math.floor(Math.random() * 1000)
}
module.exports = genUname