import mongoose from "mongoose";
import CartDao from '../../../src/dao/cart.dao.js'
import Assert from 'assert';

mongoose.connect(`mongodb://localhost:27017/db-testing?retryWrites=true&w=majority`);

const assert = Assert.strict;

describe('Testing Carts Dao', () => {
    before(function(){
        this.cartsDao = new CartDao();
    });
    beforeEach(function(){
        this.timeout(5000);
        mongoose.connection.collections.carts.drop();
    });
/*
    it('El Dao debe agregar el cart correctamente a la BD.', async function(){
        //Given 
        let mockCart = {
            products: [],
            total: 1500
        };
        //Then
        const result = await this.cartsDao.save(mockCart);
        //Assert that
        assert.ok(result._id);
    });*/
    afterEach(function(){
        mongoose.connection.collections.carts.drop();
    });
});