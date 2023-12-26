import { ticketModel } from "../dao/models/ticket.model.js";
import TicketManager from "../dao/ticketManager.js";

class TicketService {
  constructor() {
    this.ticketManager = new TicketManager();
  }
  async createTicket(data) {
    console.log("Ticket data:", data);

    if (
      !data.code ||
      !data.purchase_datetime ||
      !data.amount ||
      !data.purchaser
    ) {
      console.error("Missing data:", data);
      throw new Error("Missing data to create ticket.");
    }
    const ticket = new ticketModel(data);
    await ticket.save();
    console.log("Ticket creado:", ticket);

    return ticket;
  }

  // GET TICKET BY CODE
  async getTicketByOnlyCode(code) {
    if (!code) {
      throw new Error("Ticket ID required");
    }
    const tickets = await this.ticketManager.getTicketByCode(code);
    return tickets;
  }

  // CREATE TICKETS
  async createTickets(data) {
    const { total, purchaser } = data;
    return this.ticketManager.createTicket({
      amount: total,
      purchaser: purchaser,
    });
  }

  // GET TICKET BY ID
  async getTicketById(tid) {
    if (!tid) throw new Error("Ticket ID is required.");
    const tickets = await this.ticketManager.getTicketById(tid);
    return tickets;
  }
}

export default TicketService;
