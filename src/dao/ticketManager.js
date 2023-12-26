
import { ticketModel } from "./models/ticket.model.js";

export default class TicketManager {

    // GET ALL TICKETS
    async getAll(){
        try {
            const tickets = await ticketModel.find()
            return tickets
        } catch (error) {
            console.log(error);
        }
    }

    // CREATE
    async create(obj){
        try {
            console.log("Information to create new ticket: ", obj);
            if(!obj.code || !obj.purchase_datetime || !obj.amount || !obj.purchaser){
                console.log("Insuficient information: ", obj);
                throw new error ('Insuficient information')
            }
            const newTicket = await ticketModel.create(obj)
            return newTicket
        } catch (error) {
            console.log(error);
        }
    }

    // GET BY CODE
    async getTicketByCode(code) {
        return await ticketModel.findOne(code).lean();
    };

    // GET BY CART CODE
    async getTicketByCartCode(code) {
        return await this.cartController.ticketModel.findOne(code).lean();
    };

    // CREATE TICKET
    async createTicket(ticket) {
        const newTicket = await ticketModel.create(ticket);
        return newTicket;
    };

    // GET BY ID
    async getTicketById(tid) {
        return await ticketModel.findById(tid).lean();
    };
}