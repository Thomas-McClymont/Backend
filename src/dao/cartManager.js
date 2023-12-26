import { cartModel } from "./models/cart.model.js";
import mongoose from "mongoose";
import ProductManager from "./ProductManager.js";

class CartManager {
  constructor() {
    this.productManager = new ProductManager();
  }

  // NEW CART
  async newCart() {
    let cart = await cartModel.create({ products: [] });
    console.log("Cart created:", cart);
    return {
      status: "ok",
      message: "Cart created",
      id: cart._id,
    };
  }

  // GET CART
  async getCart(id) {
    console.log('Getting cart with ID:', id);  
    if (this.validateId(id)) {
      const cart = await cartModel.findOne({ _id: id }).lean();
      console.log("Cart: ", cart);
      return cart || null;
    } else {
      console.log("Not found!");
      return null;
    }
  }

  // GET CARTS
  async getCarts() {
    return await cartModel.find().lean();
  }

  // ADD TO CART
  async addProductToCart(cid, pid, quantity) {
    try {
      console.log(`Adding product ${pid} to cart ${cid}`);
      if (
        mongoose.Types.ObjectId.isValid(cid) &&
        mongoose.Types.ObjectId.isValid(pid)
      ) {
        const product = await this.productManager.getProductById(pid);
        console.log("Stock before adding to cart", product.stock);
        if (!product) {
          console.log("Product not found");
          return {
            status: "error",
            message: "Product not found",
          };
        }
        if (product.stock < quantity) { 
          return { status: "error", message: "Insuficient stock" };
      }
        const updateResult = await cartModel.updateOne(
          { _id: cid, "products.product": pid },
          { $inc: { "products.$.quantity": 1 } }
        );
        console.log("Update result:", updateResult);
        if (updateResult.matchedCount === 0) {
          const pushResult = await cartModel.updateOne(
            { _id: cid },
            { $push: { products: { product: pid, quantity: 1 } } }
          );
          console.log("Push result:", pushResult);
        }
        return {
          status: "ok",
          message: "Product added",
        };
      } else {
        return {
          status: "error",
          message: "Invalid ID",
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error adding product to cart",
      };
    }
  }

  // UPDATE QUANTITY 
  async updateQuantityProductFromCart(cid, pid, quantity) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        if (!cart) {
          console.log("Cart not found!");
          return false;
        }
        console.log("PID:", pid);
        console.log(
          "Cart products:",
          cart.products.map((item) =>
            item.product._id
              ? item.product._id.toString()
              : item.product.toString()
          )
        );
        const product = cart.products.find(
          (item) =>
            (item.product._id
              ? item.product._id.toString()
              : item.product.toString()) === pid.toString()
        );
        if (product) {
          product.quantity = quantity;
          await cartModel.updateOne({ _id: cid }, { products: cart.products });
          console.log("Product updated!");
          return true;
        } else {
          console.log("Product not found in cart");
          return false;
        }
      } else {
        console.log("Invalid cart ID!");
        return false;
      }
    } catch (error) {
      console.error("Error while updating product:", error);
      return false;
    }
  }

  // UPDATE PRODUCTS
  async updateProducts(cid, products) {
    try {
      await cartModel.updateOne(
        { _id: cid },
        { products: products },
        { new: true, upsert: true }
      );
      console.log("Product updated!");
      return true;
    } catch (error) {
      console.log("Not found!");
      return false;
    }
  }

  // DELETE FROM CART
  async deleteProductFromCart(cid, pid) {
    try {
      if (mongoose.Types.ObjectId.isValid(cid)) {
        const updateResult = await cartModel.updateOne(
          { _id: cid },
          { $pull: { products: { product: pid } } }
        );
        if (updateResult.matchedCount > 0) {
          console.log("Product deleted!");
          return true;
        }
      } else {
        console.log("Invalid cart ID!");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // DELETE FROM CART
  async deleteProductsFromCart(cid) {
    try {
      if (this.validateId(cid)) {
        const cart = await this.getCart(cid);
        await cartModel.updateOne({ _id: cid }, { products: [] });
        console.log("Products deleted!");
        return true;
      } else {
        console.log("Not found!");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // VALIDATE ID
  validateId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}

export default CartManager;
