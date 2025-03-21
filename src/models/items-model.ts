import mongoose, { Document, Schema } from "mongoose";

export interface IItem extends Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
}

const itemSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const Item = mongoose.model<IItem>("Item", itemSchema);

export default Item;
