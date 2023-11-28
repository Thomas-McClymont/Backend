import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    // owner:{
    //     type:mongoose.SchemaTypes.ObjectId,
    //     ref:'Users'
    // },
    products:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Products',
    },
    total:{
        type:Number,
        required:true,
        default:0,
    }
})

const cartModel = mongoose.model(collection,schema);

export default cartModel;