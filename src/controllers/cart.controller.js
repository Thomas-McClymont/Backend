import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../dao/models/cart.model.js";
import CartServices from "../services/cart.service.js";
import TicketController from "./ticket.controller.js";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "./messages.controller.js";
import { ADMIN_EMAIL } from "../config/config.js";

const ticketController = new TicketController();

class CartController {
  constructor() {
    this.cartService = new CartServices();
  }

  // CREATE CART
  async createCart(req, res) {
    try {
      const newCart = await this.cartService.createCart();
      res.status(201).json({
        status: "success",
        message: "Cart created",
        cartId: newCart._id,
        payload: newCart,
      });
      req.logger.info("Cart created: ", newCart);
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: error.message,
      });
      req.logger.error("Error creating cart", error);
    }
  }

  // GET CART
  async getCart(req, res) {
    try {
      const cart = await this.cartService.getCart(req.params.cid);
      res.json({
        status: "success",
        cart: cart,
      });
      req.logger.info("Cart: ", cart);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
      req.logger.error("Error getting cart ", error);
    }
  }

  //ADD TO CART
  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.addProductToCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error.message,
      });
    }
  }

  //UPDATE QUANTITY
  async updateQuantityProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await this.cartService.updateQuantityProductFromCart(
        cid,
        pid,
        quantity
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  // UPDATE CART
  async updateCart(req, res) {
    try {
      const cid = req.params.cid;
      const products = req.body.products;
      await this.cartService.updateCart(cid, products);
      res.send({
        status: "ok",
        message: "Product added",
      });
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  // DELETE FROM CART
  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartService.deleteProductFromCart(cid, pid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  // DELETE PRODUCTS FROM CART
  async deleteProductsFromCart(req, res) {
    try {
      const cid = req.params.cid;
      const result = await this.cartService.deleteProductsFromCart(cid);
      res.send(result);
    } catch (error) {
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  // CREATE PURCHASE TICKET
  async createPurchaseTicket(req, res) {
    req.logger.info("Ruta /carts/:cid/purchase accedida");
    try {
      if (!req.user || !req.user.id) {
        req.logger.error("req.user undefined");
        return res.status(400).json({ error: "User undefined" });
      }
      const cart = await this.cartService.getCart(req.params.cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      req.logger.info("Cart:", cart.products);
      const productManager = new ProductManager();
      const failedProducts = [];
      const successfulProducts = [];
      for (const item of cart.products) {
        const product = await productManager.getProductById(item.product);
        if (!product) {
          req.logger.error(`Product ${item.product} not found`);
          failedProducts.push(item);
          continue;
        }
        if (product.stock < item.quantity) {
          req.logger.error(`Not enough stock ${JSON.stringify(item.product)}`);
          failedProducts.push(item);
        } else {
          successfulProducts.push(item);
          const newStock = product.stock - item.quantity;
          await productManager.updateProduct(item.product, { stock: newStock });
        }
      }
      await cartModel.updateOne(
        { _id: req.params.cid },
        { products: failedProducts }
      );
      if (successfulProducts.length === 0) {
        return res.status(400).json({
          error: "Purchase failed",
          failedProducts,
        });
      }
      const totalAmount = successfulProducts.reduce((total, product) => {
        return total + product.product.price * product.quantity;
      }, 0);
      const ticketData = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email,
      };
      const ticketCreated = await ticketController.createTicket({
        body: ticketData,
      });
      const ticketCode = ticketData.code;
      console.log(ticketCode);
      const ticketOwner = ticketData.purchaser;
      console.log(ticketOwner);
      if (ticketCode) {
        console.log("Notice sent to owner: ", ticketOwner);
        const email = ticketOwner;
        const result = transporter.sendMail({
          from: ADMIN_EMAIL,
          to: email,
          subject: `Thanks for your purchase`,
          html: `<div style="display: flex; flex-direction: column; justify-content: center;  align-items: center;">
          Thank you for your purchase.
          <br>
          <br>
          Ticket: <br> <br>
          Amount:\n${ticketData.amount}\n <br> <br>
          Ticket code:\n${ticketData.code}\n <br> <br>
          Ticket datetime:\n${ticketData.purchase_datetime}\n <br> <br>
          Greetings
          </div>`,
        });
      }
      res.json({
        status: "success",
        message: "Successful purchase",
        ticket: ticketCreated,
        failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
      });
    } catch (error) {
      req.logger.error("Error creating purchase ticket:", error);
      res.status(500).json({ error: "Error creating purchase ticket" });
    }
  }

  // GET PURCHASE
  async getPurchase(req, res) {
    try {
      const cid = req.params.cid;
      const purchase = await this.cartService.getCart(cid);
      if (purchase) {
        res.json({ status: "success", data: purchase });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Purchase not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Server error" });
    }
  }
}

export default new CartController();
