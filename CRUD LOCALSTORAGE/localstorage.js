// Variables globales
const d = document;
let clienteInput = document.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table tbody");
let buscadorInput = d.querySelector(".buscador");

// Agregar evento click al botón del formulario
btnGuardar.addEventListener("click", () => {
    let datos = validarFormulario();
    if (datos != null) {
        guardarDatos(datos);
    }
    borrarTabla();
    mostrarDatos();
});

// Agregar evento input al campo de búsqueda
buscadorInput.addEventListener("input", () => {
    buscarPedidos();
});

// Función para validar los campos del formulario
function validarFormulario() {
    let datosForm;
    if (clienteInput.value == "" || productoInput.value == "" || precioInput.value == "") {
        alert("Todos los campos del formulario son obligatorios");
        return null;
    } else {
        datosForm = {
            cliente: clienteInput.value,
            producto: productoInput.value,
            precio: precioInput.value,
            imagen: imagenInput.value,
            observacion: observacionInput.value
        };
        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        imagenInput.value = "";
        observacionInput.value = "";
        return datosForm;
    }
}

// Función guardar datos en localStorage
const listadoPedidos = "Pedidos";
function guardarDatos(datos) {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if (pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    pedidos.push(datos);
    localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
    alert("Datos guardados con éxito");
}

// Función para extraer los datos guardados en el localStorage
function mostrarDatos() {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if (pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    pedidos.forEach((p, i) => {
        let fila = d.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td><img src="${p.imagen}" width="120%"></td>
            <td>${p.observacion}</td>
            <td>
                <span onclick="actualizarPedido(${i})" class="btn-editar btn btn-warning">✍🏽</span>
                <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">✖️</span>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// Quitar los datos de la tabla
function borrarTabla() {
    let filas = d.querySelectorAll(".table tbody tr");
    filas.forEach((f) => {
        f.remove();
    });
}

// Función eliminar un pedido de la tabla
function eliminarPedido(pos) {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if (pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    let confirmar = confirm("¿Deseas cancelar el pedido " + pedidos[pos].cliente + "?");
    if (confirmar) {
        pedidos.splice(pos, 1);
        alert("Pedido cancelado con éxito");
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        borrarTabla();
        mostrarDatos();
    }
}

// Función actualizar un pedido de la tabla
function actualizarPedido(pos) {
    let pedidos = [];
    let pedidosPrevios = JSON.parse(localStorage.getItem(listadoPedidos));
    if (pedidosPrevios != null) {
        pedidos = pedidosPrevios;
    }
    clienteInput.value = pedidos[pos].cliente;
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    observacionInput.value = pedidos[pos].observacion;
    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");
    btnActualizar.addEventListener("click", function () {
        pedidos[pos].cliente = clienteInput.value;
        pedidos[pos].producto = productoInput.value;
        pedidos[pos].precio = precioInput.value;
        pedidos[pos].observacion = observacionInput.value;
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        alert("El dato fue actualizado con éxito!!");
        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        observacionInput.value = "";
        btnActualizar.classList.toggle("d-none");
        btnGuardar.classList.toggle("d-none");
        borrarTabla();
        mostrarDatos();
    });
}

// Función buscar pedidos
function buscarPedidos() {
    let filtro = buscadorInput.value.toLowerCase();
    let filas = d.querySelectorAll(".table tbody tr");
    let primerResultado = true;  // Bandera para seleccionar automáticamente el primer resultado coincidente
    filas.forEach((fila) => {
        let columnas = fila.querySelectorAll("td");
        let cliente = columnas[1].innerText.toLowerCase(); // Asumiendo que la columna del cliente es la segunda columna
        if (cliente.startsWith(filtro)) {
            fila.style.display = "";
            if (primerResultado) {
                fila.classList.add("seleccionado");
                primerResultado = false;
            } else {
                fila.classList.remove("seleccionado");
            }
        } else {
            fila.style.display = "none";
            fila.classList.remove("seleccionado");
        }
    });
}

// Mostrar los datos localStorage al recargar la página
d.addEventListener("DOMContentLoaded", function () {
    borrarTabla();
    mostrarDatos();
});