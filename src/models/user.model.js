class UserModel {
    constructor(){
        this.users = [];
    }
    getUsers = () => {
        return this.users;
    }
    addUser = (user) => {
        return this.users.push(user);
    }
}

export default UserModel;
//si depues quiero usar mongoose, habria que hacer cambios aca