'use strict';
process.env.SECRET = 'walid' || process.env.SECRET;
const supertest = require('supertest');
const server  = require('../src/server').app;
const { db } = require('../src/auth/models/index.js');
const mockRequest = supertest(server);
let users = {
    user: { username: 'user', password: 'password', role: 'user' },
    writer: { username: 'writer', password: 'password', role: 'writer' },
    editor: { username: 'editor', password: 'password', role: 'editor' },
    admin: { username: 'admin', password: 'password', role: 'admin' },
};
beforeAll(async () => {
    await db.sync();
});
afterAll(async () => {
    await db.drop();
});

describe('V2 Test', () => {
    Object.keys(users).forEach(userRole => {
        describe(`${userRole} users`, () => {
            it.skip('create new record', async () => {
                const register = await mockRequest.post('/signup').send(users[userRole]);
                const token = register.body.token;
                const response = await mockRequest.post('/api/v2/img').send({
                    "imgUrl": "www.example.com/img",
                    "imgName": "floara"
                }).set("Authorization", `Bearer ${token}`);
                console.log("111111111111111",userRole);
                
                if (userRole === 'user') {
                    expect(response.status).not.toBe(201);
                } else {
                    console.log('22222222',response);
                    expect(response.status).toBe(201);
                }
            });
            it('get all records', async () => {
                const register = await mockRequest.post('/signin').auth(users[userRole].username, users[userRole].password);
                const token = register.body.token;
                await mockRequest.put('/api/v2/img').send({
                    "imgUrl": "www.example.com/img",
                    "imgName": "floara"
                }).set('Authorization', `Bearer admin`);
                const response = await mockRequest.get('/api/v2/img').set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
            it('get one record', async () => {
                const register = await mockRequest.post('/signin').auth(users[userRole].username, users[userRole].password);
                const token = register.body.token;
                const response = await mockRequest.get('/api/v2/img/1').set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
            it.skip('update record', async () => {
                const register = await mockRequest.post('/signin').auth(users[userRole].username, users[userRole].password);
                const token = register.body.token;
                const response = await mockRequest.put('/api/v2/img/1').send({
                    "imgUrl": "www.example.com/img",
                    "imgName": "flora"
                }).set('Authorization', `Bearer ${token}`);
                if (users[userRole].role === 'user' || users[userRole].role === 'writer') {
                    expect(response.status).not.toBe(201);
                } else {
                    expect(response.status).toBe(201);
                }
            });
            if ('delete record', async () => {
                const register = await mockRequest.post('/signin').auth(users[userRole].username, users[userRole].password);
                const token = register.body.token;
                const response = await mockRequest.delete('/api/v2/img/1').set('Authorization', `Bearer ${token}`);
                if (users[userRole].role === 'admin') {
                    expect(response.status).toBe(204);
                } else {
                    expect(response.status).not.toBe(204);
                }
            });
        });
    });
});