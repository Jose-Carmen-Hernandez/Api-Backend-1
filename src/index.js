import express from "express";
import { __dirname } from "./utils.js";
import homeRoute from "./routes/views.router.js";
import realTimeProducts from "./routes/views.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./class/productManager.js";
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import viewsRoute from "./routes/views.router.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { productModel } from "./data/models/Product.model.js";

//configuracion de variables de entorno:
dotenv.config();

const productManager = new ProductManager(__dirname + "/data/products.json");

const app = express();
const PORT = 8080;

//motor de plantillas y visualizaciones:
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use("/", viewsRoute);
//app.use("/carts", cartsRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);
//app.use("/home", homeRoute); //----
//app.use("/real-time-products", realTimeProducts); //----

//escucha del server:
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

//coneccion a la base de datos:
const main = async () => {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL, { dbName: "API-CODER" })
      .then(() => {
        console.log("Conectado a la base de datos");
      });

    //Agregar productos a la base de datos.

    //Los primeros 4 productos fueron agregados usando insomnia. El resto de productos se agregaron desde aqui, usando "insertMany":
    /* let products = await productModel.insertMany([
      {
        title: "blusa azul",
        description: "100% algodon, talla chica, color azul",
        code: "blu-1",
        price: 100,
        status: true,
        stock: 40,
        category: "damas",
      },
      {
        title: "blusa roja",
        description: "100% algodon, talla mediana, color rojo",
        code: "blu-2",
        price: 200,
        status: true,
        stock: 35,
        category: "damas",
      },
      {
        title: "blusa blanca",
        description: "100% algodon, talla grande, color blanco",
        code: "blu-3",
        price: 200,
        status: true,
        stock: 50,
        category: "damas",
      },
      {
        title: "blusa negra",
        description: "100% algodon, talla extra-grande, color negro",
        code: "blu-4",
        price: 220,
        status: true,
        stock: 30,
        category: "damas",
      },
      {
        title: "remera azul",
        description: "100% algodon, talla chica, color azul",
        code: "rem-1",
        price: 150,
        status: true,
        stock: 35,
        category: "caballeros",
      },
      {
        title: "remera blanca",
        description: "100% algodon, talla chica, color blanco",
        code: "rem-2",
        price: 230,
        status: true,
        stock: 30,
        category: "caballeros",
      },
  
      {
        title: "pantalon de vestir",
        description: "algodon, talla mediana, color negro",
        code: "pant-1",
        price: 380,
        status: true,
        stock: 17,
        category: "caballeros",
      },
      {
        title: "pantalon de mexclilla",
        description: "algodon, talla mediana, color azul",
        code: "pant-2",
        price: 450,
        status: true,
        stock: 20,
        category: "caballeros",
      },
      {
        title: "playera baby",
        description: "algodon, color verde, talla 6 meses",
        price: "458",
        code: "son-01",
        stock: 15,
        category: "bebes ",
      },
      {
        title: "bufanda unicornio",
        description: "Material: algodon Largo: 50cm, multicolor",
        price: 240,
        code: "buf-01",
        stock: "12",
        category: "bebes",
      },
      {
        title: "calcetines",
        description: "Material: algodon, varios colores",
        price: 220,
        code: "xcal-01",
        stock: "26",
        category: "bebes",
      },
    ]); */
    //console.log(products);
  } catch (error) {
    console.error("Error al insertar datos", error);
  }
};
main();
