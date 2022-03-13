'use strict';


process.env.SECRET = "walid" || process.env.SECRET;
const supertest = require('supertest');
const server = require('../src/server.js').app;
const { db } = require('../src/auth/models/index.js');
const mockRequest = supertest(server);

beforeAll(async()=>{
    await db.sync();
});
afterAll(async()=>{
    await db.sync();
});

describe('Testing vi router',()=>{
    it('add new record',async()=>{
        const response = await  mockRequest.post('/api/v1/img').send({
            "imgUrl":"www.example.com/img",
            "imgName":"floara"
        });
        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
    });
    it('get all records',async ()=>{
        const response = await  mockRequest.get('/api/v1/img');
        expect(response.status).toBe(200);
    })
    it('update record',async()=>{
        const response = await mockRequest.put('/api/v1/img/1').send({
            "imgUrl":"www.example.com/img",
            "imgName":"floar"
        });
        expect(response.status).toBe(201);
    });
    it('delete  record',async ()=>{
        const response = await mockRequest.delete('/api/v1/img/1');
        expect(response.status).toBe(204);
    })
})

