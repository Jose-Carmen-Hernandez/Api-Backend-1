import { __dirname } from "../utils.js";
import { Router } from "express";
import { productModel } from "../data/models/Product.model.js";
import { cartModel } from "../data/models/Cart.model.js";

const router = Router();
//const productList = new ProductManager(__dirname + '/data/databaseproducts.json');

//AQUI SE DECLARA LA PAGINACION, EL LIMITE Y EL ORDENAMIENTO:
router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  if (!page) {
    page = 1;
  }
  const sortOption = req.query.sort;
  const options = {
    sort:
      sortOption === "asc"
        ? { price: 1 }
        : sortOption === "desc"
        ? { price: -1 }
        : {},
    page,
    limit: 10,
    lean: true,
  };

  //uso del metodo paginate
  try {
    const result = await productModel.paginate({}, options);
    result.title = "Api-Coder";
    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/products?page=${result.prevPage}`
      : "";
    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/products?page=${result.nextPage}`
      : "";
    result.isValid = !(page <= 0 || page > result.totalPages);

    res.render("products", result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener productos");
  }
});

// GET para mostrar detalles de un producto:
router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const cid = "66b914f27e23c992fd2f089c"; // se requiere para el boton añadir al carrito
  try {
    const productFinded = await productModel.findById(pid).lean();

    if (productFinded) {
      res.render("productDetail", { productFinded, cid });
    } else {
      res.status(404).json({ message: "No se encontro el producto" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar el producto", error: error.message });
  }
});

//visualizar un carrito por id:
router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  console.log(`ID del carrito: ${cid}`);

  try {
    const cart = await cartModel
      .findById(cid)
      .populate("products.product")
      .lean();
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    } else {
      /* console.log(cart); */

      cart.total = cart.products.reduce((total, item) => {
        return total + (item.product.price || 0) * item.quantity;
      }, 0);

      res.render("cartDetail", { cart });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar el carrito", error: error.message });
  }
});

//visualizar todos los carritos:
router.get("/carts", async (req, res) => {
  const carts = await cartModel.find().populate("products.product").lean();
  carts.forEach((cart) => {
    cart.total = cart.products.reduce((total, item) => {
      return total + (item.product.price || 0) * item.quantity;
    }, 0);
  });

  res.render("carts", { carts });
});


export default router;
