DATABASE_URL= 'mongodb+srv://jcarmen156:7C4YZgI60TxApqmf@coderback1.y27bllh.mongodb.net/?retryWrites=true&w=majority&appName=Coderback1'

#string de conexion a la BBDD

#rutas para visualizacion y operacion:
#http://localhost:8080/products  Visualiza todos los productos paginados. Cada producto tiene un enlace al detalle y en la vista de detalle se encuentra el boton "agregar al carrito" (el carrito predefinido para agregar productos es el cid: 66b914f27e23c992fd2f089c)
#http://localhost:8080/products?sort=asc/desc  Visualiza todos los productos ordenados por precio
#http://localhost:8080/products?sort=asc/desc&limit=n  Visualiza los productos ordenados por precio (limit=10 es el valor por defecto)
#http://localhost:8080/products?sort=asc/desc&limit=n&page=1  Visualiza los productos ordenados, limitando el numero de productos y seleccionando el numero de pagina.
#http://localhost:8080/carts   Muestra los dos carritos existentes, uno con productos y uno vacio. Se muestra el total a pagar por los productos
#http://localhost:8080/carts/66b914f27e23c992fd2f089c  Muestra el carrito que contiene productos, con un boton que permite eliminar cada producto

