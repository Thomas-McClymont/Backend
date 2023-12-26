import fs from "fs";

class CartManager {
  constructor() {
    this.carts = [];
  }

  // NEW CART
  newCart() {
    this.carts.push({ id: this.generateId(), products: [] });
    this.saveCart();
    console.log("Cart created!");
    return true;
  }

  // GET CART
  getCart(id) {
    this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return this.carts.find((item) => item.id === id);
  }

  // GET CARTS
  getCarts() {
    let carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return carts;
  }

  // GENERATE ID
  generateId() {
    let max = 0;
    let carts = this.getCarts();
    carts.forEach((item) => {
      if (item.id > max) {
        max = item.id;
      }
    });
    return max + 1;
  }

  // SAVE CART
  saveCart() {
    fs.writeFileSync(this.path, JSON.stringify(this.carts));
  }

  // ADD TO CART
  addProductToCart(cid, pid) {
    this.carts = this.getCarts();
    const cart = this.carts.find((item) => item.id === cid);
    let product = cart.products.find((item) => item.product === pid);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    this.saveCart();
    console.log("Product added!");
    return true;
  }
}

export default CartManager;
