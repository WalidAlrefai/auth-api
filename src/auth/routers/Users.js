const express = require('express');
const router = express.Router();
const bearer = require('../middleware/bearer');
const {Users} =require('../models/index')

router.get('/users', bearer, async (req, res, next) => {
    const allUsers = await Users.findAll({});
    const list = allUsers.map(user => user.username);
    res.status(200).json(list);
});

module.exports = router