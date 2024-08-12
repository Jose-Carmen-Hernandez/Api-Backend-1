import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        quantity: {
          type: Number,
          default: 0,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
      },
    ],
    default: [],
  },
});

export const cartModel = model("carts", cartSchema);
