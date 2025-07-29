const productos = [
  { id: 1, nombre: "Remera", precio: 3000 },
  { id: 2, nombre: "Pantalón", precio: 7000 },
  { id: 3, nombre: "Zapatillas", precio: 15000 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalSpan = document.getElementById("total");
const btnVaciar = document.getElementById("vaciar");
const btnComprar = document.getElementById("comprar");

function mostrarProductos() {
  contenedor.innerHTML = "<h2>Productos</h2>";
  productos.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  try {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarToast(`${producto.nombre} agregado al carrito`);
    renderizarCarrito();
  } catch (error) {
    console.error("Error al agregar al carrito:", error.message);
  }
}

function renderizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    listaCarrito.appendChild(li);
    total += item.precio;
  });
  totalSpan.textContent = total;
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  renderizarCarrito();
  mostrarToast("Carrito vaciado");
}

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "Agrega al menos un producto antes de comprar.",
    });
    return;
  }

  const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
  localStorage.removeItem("carrito");
  carrito = [];
  renderizarCarrito();

  Swal.fire({
    icon: "success",
    title: "Compra realizada",
    text: `Gracias por tu compra. Total: $${total}`,
    confirmButtonText: "Aceptar",
  });
}

function mostrarToast(mensaje) {
  Toastify({
    text: mensaje,
    duration: 2500,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

btnVaciar.addEventListener("click", vaciarCarrito);
btnComprar.addEventListener("click", finalizarCompra);

mostrarProductos();
renderizarCarrito();