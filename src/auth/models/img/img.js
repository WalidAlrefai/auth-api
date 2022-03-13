'use strict';


const Img =  (sequelize, DataTypes) => sequelize.define('img', {
            imgUrl:{
                type: DataTypes.STRING
            },
            imgName:{
                type: DataTypes.STRING,
            }
});

module.exports = Img ;
