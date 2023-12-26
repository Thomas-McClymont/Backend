import ProductsServices from "../services/products.service.js";
import { socketServer } from "../../app.js";
import mongoose from "mongoose";
import CustomeError from "../services/errors/customeError.js";
import { productError } from "../services/errors/errorMessages/product.error.js";
import { transporter } from "./messages.controller.js";
import { userModel } from "../dao/models/user.model.js";

class ProductController {
  constructor() {
    this.productService = new ProductsServices();
  }

  // GET PRODUCTS
  async getProducts(req, res) {
    try {
      const products = await this.productService.getProducts(req.query);
      res.send(products);
    } catch (error) {
      const productErr = new CustomeError({
        name: "Product Fetch Error",
        message: "Error getting products",
        code: 500,
        cause: error.message,
      });
      req.logger.error(productErr);
      res
        .status(productErr.code)
        .send({ status: "error", message: "Error getting products" });
    }
  }

  async getProductById(req, res, next) {
    try {
      const pid = req.params.pid;
      req.logger.info("Product ID:", pid);
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new CustomeError({
          name: "Invalid ID",
          message: "Invalid ID",
          code: 400,
          cause: productError(pid),
        });
      }
      const product = await this.productService.getProductById(pid);
      if (!product) {
        throw new CustomeError({
          name: "Product not found",
          message: "Product not found",
          code: 404,
        });
      }
      res.status(200).json({ status: "success", data: product });
      return;
    } catch (error) {
      next(error);
    }
  }

  // ADD PRODUCT
  async addProduct(req, res) {
    let {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const owner = req.user._id;
    if (!title) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Title!",
      });
      return false;
    }
    if (!description) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Description!",
      });
      return false;
    }
    if (!code) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Code!!",
      });
      return false;
    }
    if (!price) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Price!!",
      });
      return false;
    }
    status = !status && true;
    if (!stock) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Stock!!",
      });
      return false;
    }
    if (!category) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Category!!",
      });
      return false;
    }
    if (!thumbnail) {
      res.status(400).send({
        status: "error",
        message: "Error, missing Thumbnail!!",
      });
      return false;
    }
    try {
      const wasAdded = await this.productService.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
        owner,
      });
      if (wasAdded && wasAdded._id) {
        req.logger.info("Product added:", wasAdded);
        res.send({
          status: "ok",
          message: "Product added",
          productId: wasAdded._id,
        });
        socketServer.emit("product_created", {
          _id: wasAdded._id,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
          owner,
        });
        return;
      } else {
        req.logger.error("Error adding product, wasAdded:", wasAdded);
        res.status(500).send({
          status: "error",
          message: "Error adding product!",
        });
        return;
      }
    } catch (error) {
      req.logger.error("Error addProduct:", error, "Stack:", error.stack);
      res
        .status(500)
        .send({ status: "error", message: "Internal server error." });
      return;
    }
  }

  // UPDATE PRODUCT
  async updateProduct(req, res) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      } = req.body;
      const pid = req.params.pid;

      const wasUpdated = await this.productService.updateProduct(pid, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });
      if (wasUpdated) {
        res.send({
          status: "ok",
          message: "Product updated",
        });
        socketServer.emit("product_updated");
      } else {
        res.status(500).send({
          status: "error",
          message: "Error updating product",
        });
      }
    } catch (error) {
      req.logger.error(error);
      res.status(500).send({ status: "error", message: "Server error." });
    }
  }

  // DELETE PRODUCT
  async deleteProduct(req, res) {
    try {
      const pid = req.params.pid;
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        req.logger.error("ID invalid");
        res.status(400).send({
          status: "error",
          message: "ID del producto no válido",
        });
        return;
      }
      const product = await this.productService.getProductById(pid);
      if (!product) {
        console.log("Product not found");
        res.status(404).send({
          status: "error",
          message: "Product not found",
        });
        return;
      }
      if (
        !req.user ||
        (req.user.role !== "admin" &&
          (!product.owner ||
            req.user._id.toString() !== product.owner.toString()))
      ) {
        req.logger.error(
          "User without rights to delete product or product without owner"
        );
        res.status(403).send({
          status: "error",
          message:
            "User without rights to delete product or product without owner",
        });
        return;
      }
      const wasDeleted = await this.productService.deleteProduct(pid);
      if (wasDeleted) {
        console.log("Product deleted");
        res.send({
          status: "ok",
          message: "Product deleted",
        });
        socketServer.emit("product_deleted", { _id: pid });
      } else {
        console.log("Error deleting product");
        res.status(500).send({
          status: "error",
          message: "Error deleting product",
        });
      }
    } catch (error) {
      req.logger.error("Error en deleteProduct:", error);
      res
        .status(500)
        .send({ status: "error", message: "Server error" });
    }
  }
}
export default new ProductController();
