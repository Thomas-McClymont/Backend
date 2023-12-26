import CartManager from "../dao/cartManager.js";

class CartService {
  constructor() {
    this.cartManager = new CartManager();
  }

  // CREATE CART
  async createCart() {
    return await this.cartManager.newCart();
  }

  // GET CART
  async getCart(id) {
    return await this.cartManager.getCart(id);
  }

  // ADD PRODUCT TO CART
  async addProductToCart(cid, pid) {
    const result = await this.cartManager.addProductToCart(cid, pid);
    if (result) {
      return { status: "ok", message: "Product added" };
    } else {
      throw new Error("Error adding product to cart");
    }
  }

  // UPDATE QUANTITY
  async updateQuantityProductFromCart(cartId, productId, quantity) {
    const result = await this.cartManager.updateQuantityProductFromCart(
      cartId,
      productId,
      quantity
    );
    if (result) {
      return {
        status: "ok",
        message: "Product updated",
      };
    } else {
      throw new Error("Error updating product from cart");
    }
  }

  // DELETE PRODUCT FROM CART
  async deleteProductFromCart(cartId, productId) {
    const result = await this.cartManager.deleteProductFromCart(
      cartId,
      productId
    );
    if (result) {
      return { status: "ok", message: "Product deleted" };
    } else {
      throw new Error("Error deleting product from cart");
    }
  }

  // DELETE CART
  async deleteCart(cartId) {
    const result = await this.cartManager.deleteProductFromCart(cid, pid);
    if (result) {
      res.send({
        status: "ok",
        message: "Product deleted",
      });
    } else {
      res.status(400).send({
        status: "error",
        message: "Error deleting product form cart",
      });
    }
    return await this.cartManager.deleteProductFromCart(cid, pid);
  }

  // UPDATE CART
  async updateCart(cartId, products) {
    const result = await this.cartManager.updateProducts(cartId, products);
    if (result) {
      return { status: "ok", message: "Cart updated" };
    } else {
      throw new Error("Error updating cart");
    }
  }

  // DELETE PRODUCT FROM CART
  async deleteProductsFromCart(cartId) {
    const result = await this.cartManager.deleteProductsFromCart(cartId);
    if (result) {
      return { status: "ok", message: "Cart emtied" };
    } else {
      throw new Error("Error emptying cart");
    }
  }
}

export default CartService;
