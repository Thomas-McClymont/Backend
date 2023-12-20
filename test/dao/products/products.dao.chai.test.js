import mongoose from "mongoose";
import ProductsDao from '../../../src/dao/products.dao.js'
import chai from "chai";

mongoose.connect(`mongodb://localhost:27017/clase39-adoptme-test?retryWrites=true&w=majority`);
//mongoose.connect(`mongodb+srv://Cluster59576:Coderhouse2023@cluster59576.pjeqams.mongodb.net/ecommerce?retryWrites=true&w=majority`);

const expect = chai.expect;

describe('Testing Products Dao', () => {
    before(function(){
        this.productsDao = new ProductsDao();
    });

    beforeEach(function(){
        this.timeout(5000);
        mongoose.connection.collections.products.drop();
    });

    it('El dao debe devolver los productos en formato de arreglo.', async function(){
        //Given
        let emptyArray = [];
        //Then
        const result = await this.productsDao.get();
        console.log("Resultado obtenido con el Dao: get()");
        //Assert that
        console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    it('El Dao debe agregar el producto correctamente a la BD.', async function(){
        //Given 
        let mockProduct = {
            product_name: "Producto de prueba 1",
            price: 1000,
            category : "tshirt",
            subcategory : "oversize",
            added : false,
            color : "white",
            size : 42
        };
        //Then
        const result = await this.productsDao.save(mockProduct);
        //Assert that
        expect(result._id).to.be.ok;
    });
    
    afterEach(function(){
        mongoose.connection.collections.products.drop();
    });
});