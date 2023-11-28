import Users from "../dao/users.dao.js";
import Product from "../dao/products.dao.js";
import Cart from "../dao/cart.dao.js";

import UserRepository from "../repository/userRepository.js";
import ProductRepository from "../repository/productRepository.js";
import CartRepository from "../repository/cartRepository.js";

export const usersService = new UserRepository(new Users());
export const productsService = new ProductRepository(new Product());
export const cartsService = new CartRepository(new Cart());