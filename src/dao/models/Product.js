import mongoose from 'mongoose';

const collection = 'Products';

const schema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    subcategory:{
        type:String,
        required:false,
    },
    added:{
        type:Boolean,
        default:false
    },
    color:{
        type:String,
        required:false,
    },
    size:{
        type:Number,
        required:true,
    },
    image:String
})

const productModel = mongoose.model(collection,schema);

export default productModel;