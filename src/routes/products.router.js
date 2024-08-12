import { Router } from "express";
import { __dirname } from "../utils.js";
import { productModel } from "../data/models/Product.model.js";

const router = Router();

//** */
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category } =
      req.body;
    //validar datos recibidos:
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return res.status(400).json({ mensaje: "Faltan datos" });
    }
    //crear nuevo producto:
    const newProduct = new productModel({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    });

    //almacenar el producto en la base de datos:
    const result = await newProduct.save();
    res.status(201).json({ payload: result });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al agregar producto" });
  }
}); //** */

//** */
//obtener todos los productos:
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", ...query } = req.query;
    const sortManager = {
      asc: 1,
      desc: -1,
    };
    const products = await productModel.paginate(
      { ...query },
      { limit, page, ...(sort && { sort: { price: sortManager[sort] } }) }
    );
    res.status(200).json({ ...products, mensaje: "Solicitud exitosa" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los productos" });
  }
}); //** */

//** */
router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const productFinded = await productModel.findById(pid);
    if (productFinded) {
      res.status(200).json({ payload: productFinded });
    } else {
      res.status(404).json({ mensaje: "Producto no encontrado" });
    }
  } catch {
    res.status(500).json({ mensaje: "Error al obtener producto" });
  }
}); //** */

//** */
//actualizar un producto:
router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const body = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(pid, body, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res
      .status(200)
      .json({ mensaje: "Producto actualizado", payload: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
}); //** */
//**eliminar un producto */
router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await productModel.findByIdAndDelete(pid);
    if (!deletedProduct) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res
      .status(200)
      .json({ mensaje: "Producto eliminado", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
}); //** */

export default router;
