const bcrypt = require('bcryptjs')
let salt = bcrypt.genSaltSync(10)

class genPass {

  static genPassword(input){
    let hashPass = bcrypt.hashSync(input,salt)
    return hashPass
  }

  static checkPass(input ,pass ){
    let check = bcrypt.compareSync(input,pass)
    return check
  }
}
module.exports = genPass