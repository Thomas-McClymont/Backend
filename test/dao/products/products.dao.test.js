import mongoose from "mongoose";
import ProductDao from '../../../src/dao/products.dao.js'
import Assert from 'assert';

//mongoose.connect(`mongodb+srv://Cluster59576:Coderhouse2023@cluster59576.pjeqams.mongodb.net/ecommerce?retryWrites=true&w=majority`);
mongoose.connect(`mongodb://localhost:27017/db-testing?retryWrites=true&w=majority`);

const assert = Assert.strict;

describe('Testing Products Dao', () => {
    before(function(){
        this.productsDao = new ProductDao();
    });

    beforeEach(function(){
        this.timeout(5000);
        mongoose.connection.collections.products.drop();
    });

    it('El dao debe devolver los products en formato de arreglo.', async function(){
        //Given
        console.log(this.productsDao);
        const isArray = true;
        //Then
        const result = await this.productsDao.get();
        console.log(`El resultado es un array? : ${Array.isArray(result)}`);
        //Assert that
        assert.strictEqual(Array.isArray(result), isArray);
    });

    it('El Dao debe agregar el producto correctamente a la BD.', async function(){
        //Given 
        let mockProduct = {
            product_name: "product name",
            price: 1500,
            category: "tshirts",
            subcategory: "oversize",
            added: false,
            color:"black",
            size:42
        };

        //Then
        const result = await this.productsDao.save(mockProduct);
        //Assert that
        assert.ok(result._id);
    });
    
    afterEach(function(){
        mongoose.connection.collections.products.drop();
    });
});