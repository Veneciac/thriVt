'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    GiverId: DataTypes.INTEGER,
    TakerId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // Transaction.hasMany(models.User, { as: 'Giver', foreignKey : 'GiverId'})
    // Transaction.hasMany(models.User, { as: 'Taker', foreignKey : 'TakerId'})
    // Transaction.hasMany(models.Item, { as: 'Item', foreignKey : 'ItemId'})
  };

  Transaction.afterCreate((trans) => {
    sequelize.models.Item.update( {available: 0}, {where: {id: trans.ItemId}})
      .then(data => {
      })
      .catch(err => {
        throw new Error(err)
      })

  });

  return Transaction;
};