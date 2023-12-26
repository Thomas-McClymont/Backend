import ProductManager from "../dao/ProductManager.js";

class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  // ADD PRODUCT
  async addProduct(product) {
    if (await this.productManager.validateCode(product.code)) {
      console.log("Error! Code exists!");
      return null;  
    }
    return await this.productManager.addProduct(product);
  }

  // GET PRODUCTS
  async getProducts(params) {
    return await this.productManager.getProducts(params);
  }

  // GET BY ID
  async getProductById(id) {
    return await this.productManager.getProductById(id);
  }

  // UPDATE PRODUCT
  async updateProduct(id, product) {
    return await this.productManager.updateProduct(id, product);
  }

  // DELETE PRODUCT
  async deleteProduct(id) {
    return await this.productManager.deleteProduct(id);
  }
}

export default ProductService;