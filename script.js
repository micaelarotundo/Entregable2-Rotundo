let productos = JSON.parse(localStorage.getItem("productos")) || [
    { nombre: "Toallón", precio: 2500 },
    { nombre: "Manta", precio: 5000 },
    { nombre: "Pijama", precio: 7000 },
    { nombre: "Medias", precio: 1200 }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = carrito.reduce((acc, prod) => acc + prod.precio, 0);

const productosContainer = document.getElementById("productos");
const carritoContainer = document.getElementById("carrito");
const totalContainer = document.getElementById("total");
const mensajeContainer = document.getElementById("mensaje");
const btnFinalizar = document.getElementById("finalizarCompra");
const btnVaciar = document.getElementById("vaciarCarrito");
const formProducto = document.getElementById("formProducto");
const nombreProducto = document.getElementById("nombreProducto");
const precioProducto = document.getElementById("precioProducto");

function mostrarProductos() {
    productosContainer.innerHTML = "";
    productos.forEach((producto, index) => {
        const card = document.createElement("div");
        card.classList.add("col-md-3", "mb-3");
        card.innerHTML = `
            <div class="card p-3">
                <h5>${producto.nombre}</h5>
                <p>Precio: $${producto.precio}</p>
                <button class="btn btn-primary" onclick="agregarAlCarrito(${index})">Agregar</button>
            </div>
        `;
        productosContainer.appendChild(card);
    });
}

function agregarAlCarrito(index) {
    carrito.push(productos[index]);
    total += productos[index].precio;
    actualizarCarrito();
    mostrarMensaje("Producto agregado al carrito", "success");
}

function actualizarCarrito() {
    carritoContainer.innerHTML = "";
    carrito.forEach((producto, index) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        item.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">X</button>
        `;
        carritoContainer.appendChild(item);
    });

    totalContainer.textContent = `Total: $${total}`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(index) {
    total -= carrito[index].precio;
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarMensaje("Producto eliminado del carrito", "danger");
}

btnVaciar.addEventListener("click", () => {
    carrito = [];
    total = 0;
    actualizarCarrito();
    localStorage.removeItem("carrito");
    mostrarMensaje("Carrito vaciado", "warning");
});

btnFinalizar.addEventListener("click", () => {
    if (carrito.length > 0) {
        mostrarMensaje(`Gracias por tu compra! Total: $${total}`, "success");
        carrito = [];
        total = 0;
        actualizarCarrito();
        localStorage.removeItem("carrito");
    } else {
        mostrarMensaje("El carrito está vacío.", "warning");
    }
});

formProducto.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevoProducto = {
        nombre: nombreProducto.value,
        precio: parseFloat(precioProducto.value),
    };

    if (nuevoProducto.nombre && nuevoProducto.precio > 0) {
        productos.push(nuevoProducto);
        localStorage.setItem("productos", JSON.stringify(productos));
        mostrarProductos();
        formProducto.reset();
        mostrarMensaje("Producto agregado correctamente", "success");
    } else {
        mostrarMensaje("Ingrese un nombre y precio válidos", "danger");
    }
});

function mostrarMensaje(texto, tipo) {
    mensajeContainer.textContent = texto;
    mensajeContainer.className = `alert alert-${tipo}`;
    mensajeContainer.classList.remove("d-none");
    setTimeout(() => {
        mensajeContainer.classList.add("d-none");
    }, 3000);
}

mostrarProductos();
actualizarCarrito();