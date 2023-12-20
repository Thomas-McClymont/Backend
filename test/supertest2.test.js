//import mongoose from "mongoose";
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;

const requester = supertest("http://localhost:9090");

describe("Testing WebApp", () => {
    describe("Testing Api", () => {
        it("Crear Product: El API POST /api/products debe crear un nuevo producto correctamente", async ()=>{
            //Given:
            const productMock = {
                product_name: "product name",
                price: 1500,
                category: "tshirts",
                subcategory: "oversize",
                added: false,
                color:"black",
                size:42
            };
            //Then:
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/products').send(productMock);
            //Assert that:
            expect(statusCode).is.eqls(201);
            expect(_body.payload).is.ok.and.to.have.property('_id');
            expect(_body.payload).to.have.property('added').and.to.be.deep.equal(false);
        });
        /*it("Crear Producto sin nombre: El API POST /api/products debe retornar un estado HTTP 400 con error.", async ()=>{
            //Given:
            const productMock = {
                price: 1000,
                category: "tshirts",
                subcategory: "oversize",
                added: false,
                color:"black",
                size:42
            };
            //Then:
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/api/products').send(productMock);
            //Assert that:
            expect(statusCode).is.eqls(400);
            expect(_body).is.ok.and.to.have.property('error');
            expect(_body).to.have.property('status');
        });*/
    });
    //
    describe("Testing login y session API", () => {
        before(function(){
            this.cookie;
            this.mockUser = {
                first_name: "name test user",
                last_name: "last name test user",
                email : "testmailuser@gmail.com",
                password : "123456"
            };
        });
        it("Test registro de usuario", async function(){
            //Given
            console.log(this.mockUser)
            //Then
            const {
                statusCode,
                ok,
                _body
            }
            = await requester.post("/api/sessions/register").send(this.mockUser);
            //Assert that
            expect(statusCode).is.eqls(200);
        });
        it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function(){
            //Given:
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password
            };
            //Then:
            const result = (await requester.post("/api/sessions/login").send(mockLogin));
            //Assert that:
            expect(result.statusCode).is.equal(200);
            const cookieResult = result.headers['set-cookie'][0];
            const cookieData = cookieResult.split('=');
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            };
            expect(this.cookie.name).to.be.ok.and.eql('coderCookie');
            expect(this.cookie.value).to.be.ok
        });
    });
});
//npx mocha test/supertest.test.js
//node src/app.js --mode test