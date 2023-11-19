import Users from "../dao/users.dao.js";

import UserRepository from "../repository/userRepository.js";

export const usersService = new UserRepository(new Users());