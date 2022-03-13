const bcrypt = require('bcrypt');
const { Users } = require('../models/index')
const express = require('express');
const router = express.Router();

router.post('/signup', signupHangler);


async function signupHangler(req, res) {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 5);
        const user = await Users.create(req.body)
        res.status(201).json(user);
    } catch (error) {
        console.log(error)
    }
}

module.exports = router