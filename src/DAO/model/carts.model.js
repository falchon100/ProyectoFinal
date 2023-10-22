import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  carts: {
    type: [
      {
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

// Configuro el middware pre para que cuando se genere el metodo find no hace falta agregarle el populate a cada consulta
cartsSchema.pre(`find`, function () {
  this.populate(`carts.products`);
});

export const cartModel = mongoose.model(cartsCollection, cartsSchema);
