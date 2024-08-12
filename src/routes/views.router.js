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

//-------------------------------------------------
//visualizar un carrito por id:
/* router.get("/carts/:cid", (req, res) => {
  const { cid } = req.params;
    
  res.render("carts", {
    cid,
  });
}); */

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel
      .findById(cid)
      .populate("products.productId")
      .lean();
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    let total = 0;
    for (const item of cart.products) {
      total += item.quantity * item.product.price;
    }
    res.render("carts", { cart, total });
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
      const productPrice = item.product.price || 0;
      return total + productPrice * item.quantity;
    }, 0);
  });
  res.render("carts", { carts });
});

/* router.get("/products", (req, res) => {
  res.render("products");
}); */
router.get("/realtimeproducts", async (req, res) => {
  const list = await productList.getAllProducts();

  res.render("realTimeProducts", { list });
});

router.get("/home", (req, res) => {
  res.render("home");
});

export default router;
