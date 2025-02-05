//import chai from 'chai'
import supertest from 'supertest'
import {use} from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);
const expect = chai.expect
const requester = supertest('http://localhost:8080')

// se ejecuta con: npx mocha test/dao/Users.dao.test.js

describe("Testing Adoptme App", () => {


    /* ========================================
     * Testing de las rutas de las mascotas
     * ========================================
     */
    describe("Testing Pets Api", () => {
        let petMock;
        before(async function () {
            petMock = {
                _id: "XXXXXXXXXXXXXXXXXXXXXXXX",
                name: "Firulais",
                specie: "Perro",
                birthDate: "10-10-2022"
            }
        });
     
        describe('GET /api/pets', () => {
            it("El endpoint GET /api/pets debe traer todas las mascotas", async () => {
                const { statusCode, ok, _body } = await requester.get('/api/pets')
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status','success');
                expect(_body).to.have.property('payload');
                expect(_body.payload).to.be.an('array')
            })
        })
        describe('POST /api/pets', ()=>{
            it("Crear Mascota: El API POST /api/pets debe crear una nueva mascota correctamente", async () => {
                const { statusCode, ok, _body } = await requester.post('/api/pets').send(petMock)
                petMock._id = _body.payload._id
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status', 'success');
                expect(_body).to.have.property('payload');
                expect(_body.payload).to.have.property('_id');
                expect(_body.payload).to.have.property('adopted').to.be.false;
            })
            it("Crear Mascota sin nombre: El API POST /api/pets debe retornar un estado HTTP 400 con error.", async () => {
                // Given
                const petMock = {
                    specie: "pez",
                    birthDate: "10-10-2022"
                }
                // Then
                const { statusCode, _body } = await requester.post('/api/pets').send(petMock)
                // Assert
                expect(statusCode).is.eqls(400)
                expect(_body).is.ok.and.to.have.property('error')
                expect(_body).to.have.property('status')
            })
        })
        describe('PUT /api/pets/:pid', ()=>{
            it("Modificar Mascota: El API PUT /api/pets/:pid debe modificar una mascota correctamente", async () => {
                petMock.name = "Firulais Modificado"
                const { statusCode, ok, _body } = await requester.put(`/api/pets/${petMock._id}`).send(petMock)
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status', 'success');
                expect(_body).to.have.property('message','pet updated');
                // const resp = await requester.get(`/api/pets/${petMock._id}`)
                // expect(resp._body.payload).to.have.property('name', 'Firulais Modificado');
            })
        })
        describe('DELETE /api/pets/:pid', ()=>{
            it("Eliminar Mascota: El API DELETE /api/pets/:pid debe eliminar una mascota correctamente", async () => {
                const { statusCode, ok, _body } = await requester.delete(`/api/pets/${petMock._id}`)
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status', 'success');
                expect(_body).to.have.property('message', 'pet deleted');
            })
        })
        describe('POST /api/pets/withimage', ()=>{
            it("Crear mascota con Avatar (Test con uploads): Debe poder crearse una mascota con la ruta de la imagen.", async () => {

                const result = await requester.post('/api/pets/withimage')
                    .field('name', petMock.name)
                    .field('specie', petMock.specie)
                    .field('birthDate', petMock.birthDate)
                    .attach('image', './test/files/dog.jpg')
                expect(result.statusCode).to.eql(200)
                expect(result._body.payload.image).to.be.ok;
            })
        })
    })

    // /* ==============================
    //  * Testing de las rutas de los sessions
    //  * ==============================
    //  */ 
    describe("Test de sessions", () => {
        let userMock;
        let cookie;
        before(async function () {
            const date = new Date()
            const time = date.getTime()
            userMock = {
                _id: 'XXXXX',
                first_name: "Usuario de prueba",
                last_name: "Apellido de prueba",
                email: time+"@gmail.com",
                password: "123456"
            };
            cookie={
                name:"name placeholder",
                value:"value placeholder"
            }
        });

        describe("POST /api/sessions/register", () => {
            it("Debe registrar un usuario", async () => {
                const { statusCode, ok, _body } = await requester.post('/api/sessions/register').send(userMock)
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status', 'success');
                //expect(_body).to.have.property('message', 'user registered');
                expect(_body).to.have.property('payload');
                expect(_body.payload).to.be.ok.and.an('string')
                userMock._id = _body.payload
            })
            it("Debe retornar error si el usuario ya existe", async () => {
                const { statusCode, ok, _body } = await requester.post('/api/sessions/register').send(userMock)
                expect(statusCode).to.equal(400)
                expect(ok).to.be.false
                expect(_body).to.have.property('status', 'error');
                expect(_body).to.have.property('error','User already exists');
            })
            it("Debe retornar error si faltan datos", async () => {
                const { statusCode, ok, _body } = await requester.post('/api/sessions/register').send({first_name: "Gustavo"})
                expect(statusCode).to.equal(400)
                expect(ok).to.be.false
                expect(_body).to.have.property('status', 'error');
                expect(_body).to.have.property('error','Incomplete values');
            })
        })

        describe("POST /api/sessions/login", () => {
            it("Debe loguearse y retornar una cookie", async () => {
                // const registerResp = await requester.post('/api/sessions/register').send(userMock)
                // userMock._id = registerResp._body.payload
                const loginResp = await requester.post('/api/sessions/login').send(userMock)
                expect(loginResp.statusCode).to.equal(200)
                const cookieResult = loginResp.headers['set-cookie'][0]
                expect(cookieResult).to.be.ok;
                expect(cookieResult.split('=')[0]).to.be.ok.and.eql('coderCookie')
                expect(cookieResult.split('=')[1]).to.be.ok
            })
            it("Debe retornar error si el usuario no existe y no retornar una cookie", async () => {
                const loginResp = await requester.post('/api/sessions/login').send({email:"example@gmail.com", password:userMock.password})
                expect(loginResp.statusCode).to.equal(404)
                expect(loginResp.ok).to.be.false
                expect(loginResp._body).to.have.property('status', 'error');
                expect(loginResp._body).to.have.property('error', "User doesn't exist");
                expect(loginResp.headers['set-cookie']).to.be.undefined;
            })
            it("Debe retornar error de password incorrecto y no retornar una cookie", async() =>{
                const loginResp = await requester.post('/api/sessions/login').send({email:userMock.email, password:"caca"})
                expect(loginResp.statusCode).to.equal(400)
                expect(loginResp.ok).to.be.false
                expect(loginResp._body).to.have.property('status', 'error');
                expect(loginResp._body).to.have.property('error', "Incorrect password");
                expect(loginResp.headers['set-cookie']).to.be.undefined;
            })
        })
        describe("GET /api/sessions/current", () => {
            it("Debe retornar la sesion del usuario", async () => {
                const registerResp = await requester.post('/api/sessions/register').send(userMock)
                userMock._id = registerResp._body.payload
                const loginResp = await requester.post('/api/sessions/login').send(userMock)
                const cookieResult = loginResp.headers['set-cookie'][0]
                const { _body } = await requester.get('/api/sessions/current')
                    .set('Cookie', [cookieResult])
                expect(_body.payload.email).to.be.eql(userMock.email)
            })
        })
    })
    
    // /* ==============================
    //  * Testing de las rutas de los usuarios
    //  * ==============================
    //  */ 
    describe("Test de usuarios", () => {
        let userMock;
        before(async function () {
            const date = new Date()
            const time = date.getTime()
            userMock = {
                _id: 'XXXXX',
                first_name: "Usuario de prueba 2",
                last_name: "Apellido de prueba 2",
                email: time+"correodeprueba2@gmail.com",
                password: "123456"
            };
        });
        describe("GET /api/users", () => {
            it("El endpoint GET /api/users debe traer todos los usuarios", async () => {
                const { statusCode, ok, _body } = await requester.get('/api/users')
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status','success');
                expect(_body).to.have.property('payload');
                expect(_body.payload).to.be.an('array')
            })
        })
        describe("GET /api/user/:uid",() => {
            it("Debe obtener un usuario especifico", async () => {
                const registerResp = await requester.post('/api/sessions/register').send(userMock)
                userMock._id = registerResp._body.payload
                const res = await requester.get(`/api/users/${userMock._id}`)
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status', 'success');
                expect(res.body.payload).to.have.property('_id', userMock._id);
            })
            it("Debe retornar 404 cuando no encuentra un usuario",
                async () => {
                    const uid = "679c1cbf8715460dfd5b3a98"
                    const res = await requester.get(`/api/users/${uid}`)
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('status', 'error');
                    expect(res.body).to.have.property('error', `User not found`);
                }
            )
        })
        describe("PUT /api/user/:uid",() => {
            it("Debe modificar un usuario especifico", async () => {
                userMock.first_name = "Usuario de prueba 2 Modificado"
                const res = await requester.put(`/api/users/${userMock._id}`).send(userMock)
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status', 'success');
                // expect(res.body).to.have.property('message', 'user updated');
            })
            it("Debe retornar error  404usuario no encontrado", async () => {
                const uid = "679c1cbf8715460dfd5b3a98"
                const res = await requester.put(`/api/users/${uid}`).send(userMock)
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('error', `User not found`);
            })
        })

        describe("POST /:uid/documents",() => {
            it("Debe subir un documento", async () => {
                const uid = userMock._id

                const res = await requester.post(`/api/users/${uid}/documents`)
                    .attach('files', './test/files/PDFTestDoc.pdf')
                    .attach('files', './test/files/WordTestDoc.docx')
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status', 'success');
                expect(res.body).to.have.property('message', 'Documents uploaded');            
                const res2 = await requester.get(`/api/users/${userMock._id}`)
                expect(res2.body.payload).to.have.property('documents');
                expect(res2.body.payload.documents).to.be.an('array')
                expect(res2.body.payload.documents).to.have.lengthOf(2)
                // expect(userMock.documents[0]).to.have.property('name', 'test-file1.txt');
                expect(res2.body.payload.documents[0]).to.have.property('name').contains('PDFTestDoc.pdf');
                expect(res2.body.payload.documents[1]).to.have.property('name').contains('WordTestDoc.docx');


            })
            it("Debe retornar 404 cuando no encuentra un usuario",
                async () => {
                    const uid = "679c1cbf8715460dfd5b3a98"
                    const res = await requester.post(`/api/users/${uid}/documents`)
                        .attach('files', './test/files/PDFTestDoc.pdf')
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('status', 'error');
                    expect(res.body).to.have.property('error', `User not found`);
                }
            )
        })

        describe("DELETE /api/user/:uid",() => {
            it("Debe eliminar un usuario especifico", async () => {
                const res = await requester.delete(`/api/users/${userMock._id}`)
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status', 'success');
                expect(res.body).to.have.property('message', 'User deleted');
                const res2 = await requester.get(`/api/users/${userMock._id}`)
                expect(res2).to.have.status(404);
                expect(res2.body).to.have.property('status', 'error');
                expect(res2.body).to.have.property('error', `User not found`);
            })
        })
    })
    /* ==============================
     * Testing de las rutas de las adopciones
     * ==============================
     */
    describe("Test de adopciones", () => {
        let userMock;
        let petMock;
        before(async function () {
            const date = new Date()
            const time = date.getTime()
            userMock = {
                _id: '',
                first_name: "Usuario de prueba 2",
                last_name: "Apellido de prueba 2",
                email: time+"correodeprueba2@gmail.com",
                password: "123456"
            };
            petMock = {
                _id: '',
                name: "Firulais",
                specie: "Perro",
                birthDate: "10-10-2022"
            }
        });

        describe('GET /api/adoptions', () => {
            // TEST 01 Get All
            it("El endpoint GET /api/adoption debe traer todas las adopciones", async () => {
                const { statusCode, ok, _body } = await requester.get('/api/adoptions')
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                //console.log(_body)
                expect(_body).to.have.property('status','success');
                //expect(_body.status).eqls('success')
                expect(_body).to.have.property('payload');
                expect(_body.payload).to.be.an('array')
            })
        })

        describe('GET /api/adoptions/:aid', () => {
            it("Debe retornar una adpcion espcifica", async () => {
                //la primera opcion es conociendo el adoption id:
                //const adoptionId = '679c1cbf8715460dfd5b3a98';
                //La segunda opcion es buscando un adoption id
                //me aseguro que haya una adopcion para obtner al menos un id valido
                //creo un usuario
                const registerResp = await requester.post('/api/sessions/register').send(userMock)
                userMock._id = registerResp._body.payload
                //creo una mascota
                const _bodyPet = (await requester.post('/api/pets').send(petMock))._body
                const pid = _bodyPet.payload._id
                //la adopto
                const { statusCode, ok,_body } = await requester.post('/api/adoptions/'+userMock._id+'/'+pid)
                //busco el id de esa adopcion
                const adoptionsResp = await requester.get('/api/adoptions')
                const adoption = adoptionsResp.body.payload.find(item => item.pet === pid);
                //pido esa adopcion espeficica
                const res = await requester.get(`/api/adoptions/${adoption._id}`)
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('status', 'success');
                expect(res.body.payload).to.have.property('_id', adoption._id);
                expect(res.body.payload).to.have.property('owner', userMock._id);       
                expect(res.body.payload).to.have.property('_id', pid);       
       
            })
            it('debe devolver 400 si no encuentrta la adopcion', async () => {
                const adoptionId = '679c1cbf8715460dfd5b3a90'; //invalido
                const res = await requester.get(`/api/adoptions/${adoptionId}`)
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('error', 'Adoption not found');
            });            
        })
        describe('POST /api/adoption/:uid/:pid', () => {
            
            it("El endpoint POST /api/adoption/:uid/:pid debe crear una adopcion", async () => {
     
                //const uid = "678c3bdf005e01c6d201e0f8"
                //const registerResp = await requester.post('/api/sessions/register').send(userMock)
                //userMock._id = registerResp._body.payload
                const _bodyPet = (await requester.post('/api/pets').send(petMock))._body
                const pid = _bodyPet.payload._id
                const { statusCode, ok,_body } = await requester.post('/api/adoptions/'+userMock._id+'/'+pid)
                
                expect(statusCode).to.equal(200)
                expect(ok).to.be.true
                expect(_body).to.have.property('status','success')
                expect(_body).to.have.property('message','Pet adopted')
                
            })
            it('Debe retorarn 404 si no encunetra el usuario', async () => {
                const uid = '678c3bdf005e01c6d221e0f8';//invalido
                //Given
                const _bodyPet = (await requester.post('/api/pets').send(petMock))._body
                const pid = _bodyPet.payload._id //valido               
                const res = await requester.post('/api/adoptions/'+uid+'/'+pid)
                
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('error', 'user Not found');
            });
    
            it('Debe retornar 404 si la mascota no fue encontrada', async () => {
                const uid = userMock._id // 678c3bdf005e01c6d201e0f8'; valido
                const pid = '678c3bdf005e01c6d221e0f9'; //invalido
                const res = await requester.post('/api/adoptions/'+uid+'/'+pid)

                expect(res).to.have.status(404);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('error', 'Pet not found');
            });
    
            it('Debe devolver 400 si la mascota esta adoptada', async () => {
                
                const uid = userMock._id //valido
                const _bodyPet = (await requester.post('/api/pets').send(petMock))._body
                const pid = _bodyPet.payload._id
                //2 veces porque asi se adopta en una
                const res1 = await requester.post('/api/adoptions/'+uid+'/'+pid) //la adopto primero
                const res = await requester.post('/api/adoptions/'+uid+'/'+pid) //la vuelvo a adpotar

                expect(res).to.have.status(400);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('error', 'Pet is already adopted');
            });            
        })
    })
})