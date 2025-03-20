import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Item from "../models/items-model";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getItems = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const key = "items";
    const cachedItems = cache.get(key);
    if (cachedItems) {
      res.status(200).json(cachedItems);
      return;
    }
    const items = await Item.find();
    cache.set(key, items);
    res.status(200).json(items);
  }
);

export const getItemById = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const key = `item_${req.params.id}`;
    const cachedItem = cache.get(key);
    if (cachedItem) {
      res.status(200).json(cachedItem);
      return;
    }

    const item =
      (await Item.findById(req.params.id)) ||
      res.status(404).json({ message: "Item not found" });

    cache.set(key, item);
    res.status(200).json(item);
  }
);

export const createItem = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, image, category, stock } = req.body;
    const item = new Item({
      user: req.user ? req.user._id : null,
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    const newItem = await item.save();
    cache.del("items");
    res.status(201).json(newItem);
  }
);

export const updateItem = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, description, price, image, category, stock } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.image = image || item.image;
    item.category = category || item.category;
    item.stock = stock || item.stock;

    const updatedItem = await item.save();
    cache.del("items");
    cache.del(`item_${req.params.id}`);
    res.status(200).json(updatedItem);
  }
);

export const deleteItem = expressAsyncHandler(
  async (req: Request, res: Response) => {
    await Item.findByIdAndDelete(req.params.id);

    cache.del("items");
    cache.del(`item_${req.params.id}`);

    res.status(200).json({ message: "Item deleted successfully" });
  }
);
