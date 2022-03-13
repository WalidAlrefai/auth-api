'use strict'
const express = require('express');
const router = express.Router();
const models = require('../models');
const {img} = require('../models/index');

router.param('model', (req, res, next) => {
    console.log('555555',req.params.model);
    console.log('555555',models);
    const dataModel = req.params.model
    if (models[dataModel]) {
        
        req.model =models[dataModel];
        next();
    } else {
        next('model not found')
    }
})

router.get('/:model', getAllHandler);
router.get('/:model/:id', getOneHandler);
router.post('/:model', createHandler);
router.put('/:model/:id', updateHandler);
router.delete('/:model/:id', deleteHandler);

async function getAllHandler(req, res) {
    // console.log('556666666',img.model.img);
    // console.log('577777777',req.model);

    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
}

async function getOneHandler(req, res) {
    const id = req.params.id;
    let theRecord = await req.model.get(id)
    res.status(200).json(theRecord);
}

async function createHandler(req, res) {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
}

async function updateHandler(req, res) {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj)
    res.status(201).json(updatedRecord);
}

async function deleteHandler(req, res) {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(204).json(deletedRecord);
}


module.exports = router;