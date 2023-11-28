import mongoose from 'mongoose';

const collection = 'Products';

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    added:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Users'
    },
    image:String
})

const productModel = mongoose.model(collection,schema);

export default productModel;