import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
   code: String,
   purchase_datetime: {
    type: Date,
  },
   amount: Number,
   purchaser: String,
   
}
);

export const ticketModel = mongoose.model('ticket', ticketSchema)