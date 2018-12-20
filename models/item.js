'use strict';
// const Transaction = require('./index').Transaction
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    time: DataTypes.TIME,
    urlPic: DataTypes.STRING ,
    GiverId: DataTypes.INTEGER,
    available: DataTypes.INTEGER
  }, {});
  Item.associate = function(models) {
    // associations can be defined here
    Item.belongsTo(models.User, {foreignKey: 'GiverId'})
    Item.belongsToMany(models.User , {through: models.Transaction})
    
  };


  // Item.beforeDelete((item) => {
  //   Transaction.destro
  // })

  return Item;
};