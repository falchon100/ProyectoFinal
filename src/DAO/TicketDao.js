import { ticketModel } from "./model/ticket.model.js";



export default class TicketDao{
    constructor (){
       this.model= ticketModel;
    }

async createTicket(products){
    let ticket = await ticketModel.create(products)
    return ticket
}
   }
   
   

   
   