const socket = io();

const containerProduct = document.querySelector("#container-products");

socket.on("realtime", (data) => {
  containerProduct.innerHTML = "";
  data.forEach((product) => {
    const divCard = document.createElement("div");
    divCard.classList.add(
      "tile",
      "max-w-sm",
      "rounded",
      "overflow-hidden",
      "shadow-lg",
      "bg-white" //fondo blanco para mejor contraste
    );
    divCard.innerHTML = `<img class="w-full" src="https://th.bing.com/th/id/OIP.fIpHESGjwP3JdrzooEqnrgHaFj?w=216&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Globo aerostatico">
            <div class="px-6 py-4">
                <div class="font-bold text-xl mb-2">${product.title}</div>
                  <p class="text-gray-700 text-base">
                    ${product.description}
                  </p>
                <div class="flex flex wrap justify between">
                  <p class="text-gray-500 font-medium">ID: <span class="text-gray-700">${product.id}</span></p>
                  <p class="text-gray-500 font-medium">Código: <span class="text-gray-700">${product.code}</span></p>
                </div>

                <div class="flex flex-wrap justify-between">
                  <p class="text-gray-500 font-medium">Stock: <span class="text-gray-700">${product.stock}</span></p>
                  <p class="text-gray-500 font-medium">Categoría: <span class="text-gray-700">${product.category}</span></p>
                </div>
            </div>

            <div class="px-6 pt-4 pb-2">
                <span class="inline-block bg-gray-100 rounded-full px-3 py-2 text-xl font-semibold text-gray-800 mr-2 mb-2">
                    $${product.price}
                </span>
            </div>
        `;
    containerProduct.appendChild(divCard);
  });
});
