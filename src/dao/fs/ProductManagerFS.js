import fs from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "Productos.json";
    this.loadProducts();
  }

  // VALIDATE REQUIRED FIELDS
  validateRequiredFields(fields) {
    for (const field of fields) {
      if (!field.value) {
        throw new Error(`${field.name} required`);
      }
    }
  }

  // GET PRODUCTS
  getProducts = async () => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.products = JSON.parse(data);
    return this.products;
  };

  // GET ID
  getId() {
    let max = 0;
    this.products.forEach((item) => {
      if (item.id > max) {
        max = item.id;
      }
    });
    return max + 1;
  }

  //LOAD PRODUCT
  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error loading products:", error.message);
      this.products = [];
    }
  }

  //ADD PRODUCT
  async addProduct(newProduct) {
    const fields = [
      { name: "title", value: newProduct.title },
      { name: "description", value: newProduct.description },
      { name: "price", value: newProduct.price },
      { name: "code", value: newProduct.code },
      { name: "stock", value: newProduct.stock },
      { name: "category", value: newProduct.category },
    ];
    try {
      this.validateRequiredFields(fields);
    } catch (error) {
      console.error("Error validating required fields:", error.message);
      throw error;
    }
    const productExists = this.products.find(
      (product) => product.code === newProduct.code
    );
    if (productExists) {
      console.error("Code already exists", productExists.code);
      throw new Error("COde already exists");
    }
    const id = this.getId();
    if (newProduct.status === undefined) {
      newProduct.status = true;
    }
    const product = {
      title: newProduct.title,
      description: newProduct.description,
      price: newProduct.price,
      thumbnail: `https://picsum.photos/200/300?random=${id}`,
      code: newProduct.code,
      stock: newProduct.stock,
      category: newProduct.category,
      status: newProduct.status,
      id: id,
    };
    this.products.push(product);
    await this.saveProducts();
    console.log("Product added", product);
    return product;
  }

  // GET BY ID
  async getProductsById(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      const existentProduct = this.products.find((prod) => prod.id === id);
      if (!existentProduct) {
        console.log(`Product ${id} doesnt exist`);
      } else {
        console.log(`Product ${id} found`);
        return existentProduct;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // DELETE PRODUCT
  async deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      const deletedProduct = this.products[productIndex];
      this.products.splice(productIndex, 1);
      await this.saveProducts();
      return deletedProduct;
    } else {
      console.log("Product not found: ", id);
      return null;
    }
  }

  // UPDATE PRODUCT
  async updateProduct(id, updatedFields) {
    const data = await fs.promises.readFile(this.path, "utf-8");
    this.products = JSON.parse(data);
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex > -1) {
      Object.assign(this.products[productIndex], updatedFields);
      this.saveProducts();
      console.log("Product updated", this.products[productIndex]);
    } else {
      console.log("Product not found: ", id);
      throw new Error("Product not found");
    }
  }

  // SAVE PRODUCT
  async saveProducts() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );
  }
}

export default ProductManager;
