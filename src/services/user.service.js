import UserModel from "../models/user.model.js";

class UserService {
    constructor() {
        this.userModel = new UserModel();
    }
    getUsers = () => {
        this.userModel.getUsers();
    }
    addUser = (user) => {
        return this.userModel.addUser(user);
    }
}

export default UserService;