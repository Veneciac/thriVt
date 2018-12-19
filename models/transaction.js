'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    GiverId: DataTypes.INTEGER,
    TakerId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    // Transaction.hasMany(models.User, { as: 'Giver', foreignKey : 'GiverId'})
    // Transaction.hasMany(models.User, { as: 'Taker', foreignKey : 'TakerId'})
    // Transaction.hasMany(models.Item, { as: 'Item', foreignKey : 'ItemId'})

  };

  Transaction.delete = function(id) {
    Transaction.destroy({where: {
      id
    }})
    .then(data => {

    })
    .catch(err => {
      throw new Error(err)
    })
  }
  return Transaction;
};