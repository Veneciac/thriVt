'use strict';
const Sequelize = require('sequelize')
const genPass = require('../helper/hashpass')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isUnique: function(value) {
          const Op = Sequelize.Op
          return User.findOne({where: {
            email: value,
            id: {
              [Op.ne]: this.id
            }
          }})
          .then(data => {
            if(data) {
              throw new Error(`Email has been used`)
            }
          })
          .catch(err => {
            throw new Error(err)
          })
        },
        isEmail: {
          args: true,
          msg: `Email is not valid`
        }
      }
    },
    address: DataTypes.STRING,
    username: DataTypes.STRING,
    twitterUsername: DataTypes.STRING
  }, {});
  
  User.associate = function(models) {
    User.belongsToMany(models.Item, {through: models.Transaction})
    User.hasMany(models.Item, {foreignKey: 'GiverId'})
  };

  User.beforeCreate((user) => {
    user.password = genPass.genPassword(user.password)
    user.username = user.genUname()
  });
  
  User.beforeUpdate((user) => { // => individual hooks
    user.password = genPass.genPassword(user.password)
  });

  User.prototype.genUname = function() {
    return this.name + '_' + this.email.slice(0,1) + Math.floor(Math.random() * 1000)
  }

  return User;
};