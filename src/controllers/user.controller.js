import UserService from "../services/user.service.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }
    getUsers = async (req, res) => {
        res.send({status:"ok", users:this.userService.getUsers()});
    }
    addUser = async (req, res) => {
        const {name, email} = req.body;
        let result = this.userService.addUser({name,email});

        if (result) {
            res.send({status:"ok", message:"El usuario se agrego correctamente!"});
        } else {
            res.status(401).send({status:"error", message:"Error! No se pudo agregar el usuario!"});
        }
    }
}

export default UserController;