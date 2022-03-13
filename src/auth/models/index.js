'use srtict';
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const Users = require('./user-model');
const Image =require('./img/img');
const Collection = require('./collection');

const POSTGRES_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

let sequelizeOptions = process.env.NODE_ENV === 'production' ? {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
} : {};

let sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);
let imageModel = Image(sequelize,DataTypes);
// let imgCollection = new Collection(imageModel);
module.exports = {
    db: sequelize,
    Users: Users(sequelize, DataTypes),
    img:  new Collection(imageModel),
}