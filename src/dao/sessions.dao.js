import sessionModel from "./models/session.js";

export default class Session {    
    get = (params) =>{
        return sessionModel.find(params);
    }
    getBy = (params) =>{
        return sessionModel.findOne(params);
    }
    save = (doc) =>{
        return sessionModel.create(doc);
    }
    update = (id,doc) =>{
        return sessionModel.findByIdAndUpdate(id,{$set:doc})
    }
    delete = (id) =>{
        return sessionModel.findByIdAndDelete(id);
    }
}