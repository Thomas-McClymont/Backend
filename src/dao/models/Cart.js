import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Users'
    },
    pet:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Products'
    }
})

const cartModel = mongoose.model(collection,schema);

export default cartModel;