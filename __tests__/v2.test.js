'use strict';
process.env.SECRET = 'walid' || process.env.SECRET;
const supertest = require('supertest');
const server = require('../src/server');
const { db } = require('../src/auth/models/index.js');
const mockRequest = supertest(server.app);
console.log(mockRequest);
// const request = supertest(server);
let id;
let users = {
    admin: { username: 'admin', password: 'password', role: 'admin' },
    editor: { username: 'editor', password: 'password', role: 'editor' },
    writer: { username: 'writer', password: 'password', role: 'writer' },
    user: { username: 'user', password: 'password', role: 'user' },
};
beforeAll(async () => {
    await db.sync();
});
afterAll(async () => {
    await db.drop();
});

describe('V2 Test', () => {
    Object.keys(users).forEach(user => {
        describe(`${user} users`, () => {
            it.skip('create new record', async () => {
                const register = await mockRequest.post('/signup').send(users[user]);
                const token = register.body.token;
                // console.log("11111111111111111111",token);
                const response = await mockRequest.post('/api/v2/img').send({
                    imgUrl: "test",
                    imgName: "test"
                }).set("Authorization", `Bearer ${token}`);
                // console.log("2222222222222222",response);
                id = response.body.id
                console.log(response.body.id);

                
            if (user === 'writer' || user === 'editor'||user === 'admin') {
                expect(response.status).toBe(201);
            } else {
                expect(response.status).toBe(500);
            } 
            });
            it('get all records', async () => {
                let Auth = await mockRequest.post('/signin').auth(users[user].username,users[user].password);
                let  token = Auth.body.token;
                const response = await mockRequest.get('/api/v2/img').set('Authorization', `Bearer ${token}`)
                expect(response.status).toEqual(200)
            });
            it('get one record', async () => {
                const register = await mockRequest.post('/signin').auth(users[user].username, users[user].password);
                const token = register.body.token;
                const response = await mockRequest.get(`/api/v2/img/${id}`).set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
            it.skip('update record', async () => {
                const register = await mockRequest.post('/signin').auth(users[user].username, users[user].password);
                const token = register.body.token;

                
                const response = await mockRequest.put(`/api/v2/img/${id}`).send({
                    imgUrl: "test1",
                    imgName: "test2"
                }).set("Authorization", `Bearer ${token}`);
                if (user == 'editor'||user == 'admin') {
                    expect(response.status).toBe(201);
                } else {
                    expect(response.status).toBe(500);
                }
            });
            if ('delete record', async () => {
                const register = await mockRequest.post('/signin').auth(users[user].username, users[user].password);
                const token = register.body.token;
                const response = await mockRequest.delete('/api/v2/img/1').set('Authorization', `Bearer ${token}`);
                if (users[user].role === 'admin') {
                    expect(response.status).toBe(204);
                } else {
                    expect(response.status).not.toBe(204);
                }
            });
        });
    });
});


// let Users = {
//     admin: { username: 'admin', password: 'password', role: 'admin' },
//     editor: { username: 'editor', password: 'password', role: 'editor' },
//     writer: { username: 'writer', password: 'password', role: 'writer' },
//     user: { username: 'user', password: 'password', role: 'user' },
// };
// beforeAll(async () => {
//     await db.sync();
// })
// afterAll(async () => {
//     await db.drop();
// })
// Object.keys(Users).forEach(element => {
//     describe('testing sport model for v2 route', () => {

//         it('post new sport', async () => {
//             let Auth = await request.post('/signup').send(Users[element]);
//             let userToken = Auth.body.token;
//             const response = await request.post('/api/v2/img').send({
//                 imgUrl: "test",
//                 imgName: "test"
//             }).set("Authorization", `Bearer ${userToken}`);
//             id = response.body.id
//             if (element === 'writer' || element === 'editor' || element === 'admin') {
//                 expect(response.status).toBe(201);
//             } else {
//                 expect(response.status).toBe(500);
//             }
//         });
//         it('testing get all sport', async () => {
//             let Auth = await request.post('/signin').auth(Users[element].username, Users[element].password);
//             let userToken = Auth.body.token;
//             const response = await request.get('/api/v2/img').set('Authorization', `Bearer ${userToken}`)
//             expect(response.status).toEqual(200)
//         })
//         it('testing get one sport by id', async () => {
//             let Auth = await request.post('/signin').auth(Users[element].username, Users[element].password);
//             let userToken = Auth.body.token;
//             const response = await request.get(`/api/v2/img/${id}`).set('Authorization', `Bearer ${userToken}`)
//             expect(response.status).toEqual(200)
//         })


//         it('update new sport', async () => {
//             let Auth = await request.post('/signin').auth(Users[element].username, Users[element].password);
//             let userToken = Auth.body.token;
//             const response = await request.put(`/api/v2/img/${id}`).send({
//                 imgUrl: "test1",
//                 imgName: "test2"
//             }).set("Authorization", `Bearer ${userToken}`);
//             if (element == 'editor' || element == 'admin') {
//                 expect(response.status).toBe(201);
//             } else {
//                 expect(response.status).toBe(500);
//             }
//         });

//         it('deleting sport by id', async () => {
//             let Auth = await request.post('/signin').auth(Users[element].username, Users[element].password);
//             let userToken = Auth.body.token;
//             const response = await request.delete(`/api/v2/img/${id}`).set("Authorization", `Bearer ${userToken}`);

//             if (Users[element].role === 'admin') {
//                 expect(response.status).toBe(204);
//             } else {
//                 expect(response.status).toBe(500);
//             }
//         })

//     })
// });
