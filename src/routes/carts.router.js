import { Router } from "express";
import { __dirname } from "../utils.js";
import { cartModel } from "../data/models/Cart.model.js";

const router = Router();

//crear un carrito:
router.post("/", async (req, res) => {
  try {
    const newCart = await cartModel.create({
      products: [],
    });
    res.status(201).json({ mensaje: "Carrito creado", carrito: newCart });
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

//agregar un producto a un carrito:
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;//se captura la cantidad seleccionada por el usuario
    const quantityAdd = Number(quantity);//convierte la cantidad en un  numero

    //encontrar el carrito por id:
    const cartFinded = await cartModel.findById(cid);
    if (!cartFinded) {
      res.status(404).json({ message: "carrito no encontrado" });
    }
    //encontrar el indice del producto:
    const indexProd = cartFinded.products.findIndex(
      (prod) => prod.product.toString() === pid
    );

    //actualizar cantidad de producto:
    if (indexProd !== -1) {
      cartFinded.products[indexProd].quantity += quantityAdd;//se ctualiza la cantidad 
    } else {
      cartFinded.products.push({ product: pid, quantity: quantityAdd });
    }
    //actualizar carrito y y poblar (populate) los detalles del producto:
    const updatedCart = await cartModel
      .findByIdAndUpdate(cid, cartFinded, {
        new: true,
      })
      .populate("products.product");
    res
      .status(201)
      .json({ mensaje: "Producto agregado", carrito: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//obtener un carrito por id:
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartFinded = await cartModel
      .findById(cid)
      .populate("products.product");
    if (!cartFinded) {
      res.status(404).json({ message: "carrito no encontrado" });
    }
    res.status(200).json({
      mensaje: "Carrito encontrado",
      productList: cartFinded.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});
//obtener todos los carritos:
router.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find().populate("products.product");
    res.status(200).json({ mensaje: "Carritos encontrados", carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

//actualizar los productos de un carrito:
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cartFinded = await cartModel.findById(cid);
    if (cartFinded) {
      cartFinded.products = products;
      const updatedCart = await cartModel
        .findByIdAndUpdate(cid, cartFinded, { new: true })
        .populate("products.product");
      res
        .status(201)
        .json({ mensaje: "Carrito actualizado", carrito: updatedCart });
    } else {
      res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

//Actualizar la cantidad de un producto dentro de un carrito:
router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    //validacion de cantidad:
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ mensaje: "Cantidad invalida" });
    }

    const cartFinded = await cartModel.findById(cid);
    if (!cartFinded) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    //buscar el indice del producto en el array 'products':
    const indexProd = cartFinded.products.findIndex(
      (prod) => prod.product.toString() === pid
    );
    if (indexProd === -1) {
      return res.status(404).json({
        mensaje: "Producto no encontrado en el carrito",
      });
    }

    //actualizar la cantidad:
    cartFinded.products[indexProd] = {
      ...cartFinded.products[indexProd],
      quantity,
    };

    //actualizar el carrito y devolver el resultado:
    const updatedCart = await cartModel
      .findByIdAndUpdate(cid, cartFinded, { new: true })
      .populate("products.product");

    res.status(201).json({
      mensaje: "Cantidad de producto actualizada",
      carrito: updatedCart,
    });
  } catch (error) {
    console.error("error");
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

//eliminar todos los productos de un carrito:
//no es necesario utilizar .lean() ni .populate()
//se utiliza save() en lugar de findByIdAndUpdate()
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cartFinded = await cartModel.findById(cid);
    if (cartFinded) {
      cartFinded.products = [];
      const updatedCart = await cartFinded.save();
      res.status(204).json({
        mensaje: "Productos eliminados",
        carrito: updatedCart,
      });
    } else {
      res.status(404).json({ mensaje: "carrito no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//eliminar un producto de un carrito:
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    //buscar el carrito:
    const cartFinded = await cartModel.findById(cid);
    if (!cartFinded) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    //buscar el producto que se va a eliminar:
    cartFinded.products = cartFinded.products.filter(
      (prod) => prod.product.toString() !== pid
    );

    //actualizar carrito y poblar los datos:
    const cartUpdated = await cartFinded.save();

    res
      .status(200)
      .json({ mensaje: "Producto eliminado", carrito: cartUpdated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

export default router;
