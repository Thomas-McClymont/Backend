import mongoose from "mongoose";
import UsersDao from '../../../src/dao/users.dao.js'
import chai from "chai";

mongoose.connect(`mongodb://localhost:27017/clase39-adoptme-test?retryWrites=true&w=majority`);
//mongoose.connect(`mongodb+srv://Cluster59576:Coderhouse2023@cluster59576.pjeqams.mongodb.net/ecommerce?retryWrites=true&w=majority`);

const expect = chai.expect;

describe('Testing Users Dao', () => {
    before(function(){
        this.usersDao = new UsersDao();
    });

    beforeEach(function(){
        this.timeout(5000);
        mongoose.connection.collections.users.drop();
    });

    it('El dao debe devolver los usuarios en formato de arreglo.', async function(){
        //Given
        let emptyArray = [];
        //Then
        const result = await this.usersDao.get();
        console.log("Resultado con el Dao: get()");

        //Assert that
        console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    it('El Dao debe agregar el usuario correctamente a la BD.', async function(){
        //Given 
        let mockUser = {
            first_name: "Usuario de prueba 1",
            last_name: "Apellido de prueba 1",
            email : "correodeprueba1@gmail.com",
            password : "123456"
        };

        //Then
        const result = await this.usersDao.save(mockUser);
        //Assert that
        expect(result._id).to.be.ok;
    });
    
    afterEach(function(){
        mongoose.connection.collections.users.drop();
    });
});