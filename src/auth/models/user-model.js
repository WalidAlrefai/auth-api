'use strict';
require('dotenv').config();
const { sequelize, DataTypes } = require('./index');
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET || 'walid';

const Users = (sequelize, DataTypes) => sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'writer', 'editor', 'user'),
        defaultValue: 'user'
    },
    token: {
        type: DataTypes.VIRTUAL,
        get() {
            return jwt.sign({ username: this.username }, SECRET);
        }
    },
    actions: {
        type: DataTypes.VIRTUAL,
        get() {
            const acl = {
                user: ['read'],
                writer: ['read', 'create'],
                editor: ['read', 'create', 'update'],
                admin: ['read', 'create', 'update', 'delete'],
            }
            return acl[this.role];
        }
    }
});
// Users.authenticateBasic = async function (username,password){
//     const user = await this.findOne({ where: { username } });
//     const valid = await bcrypt.compare(password, user.password);
//     if (valid) {
//         let newToken = jwt.sign({ username: user.username }, SECRET);
//         user.token = newToken;
//         return user;
//     } else {
//         throw new Error('Invalid User');
//     }
// }

// Users.authenticateBearer = async function (token) {
//     const parsedToken = jwt.verify(token, SECRET);
//     const user = await this.findOne({ where: { username: parsedToken.username } });
//     if (user) {
//         return user;
//     } else {
//         throw new Error('Invalid Token');
//     }
// }
module.exports = Users;