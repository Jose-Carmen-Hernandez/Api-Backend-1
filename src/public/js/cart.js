/* const goToCart = () => {
  window.location = "/carts/66b914f27e23c992fd2f089c";
};

const volver = () => {
  window.history.back();
  return false;
};

const delProdToCarts = async (idProduct) => {
  const result = await Swal.fire({
    title: "Usted esta seguro?",
    text: "Eliminar el producto del carrito",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
  });

  if (result.isConfirmed) {
    await fetch(`/api/carts/66b914f27e23c992fd2f089c/product/${idProduct}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        return data.data;
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al eliminar producto del carrito!",
          footer: '<a href="">Consultar al administrador!</a>',
        });
      });

    await Swal.fire({
      title: "Eliminado!",
      text: "Producto eliminado correctamente",
      icon: "success",
    });

    window.location.reload();
  }
};
 */