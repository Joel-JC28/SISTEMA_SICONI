const API_URL = "http://localhost:8080/api/productos";

document.addEventListener("DOMContentLoaded", () => {
    listarProductos();
    listarUsuarios();
    document.getElementById("formularioProducto").addEventListener("submit", procesarFormulario);
});


// LEER
function listarProductos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("tablaProductosBody");
            tbody.innerHTML = "";

            if (!data || data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay productos en inventario.</td></tr>`;
                return;
            }

            data.forEach(p => {
                // STOCK
                const claseStock = p.stock > 10 ? 'badge-azul' : 'badge-rojo';

                tbody.innerHTML += `
                    <tr>
                        <td class="col-id">${p.id}</td>
                        <td><span style="font-weight: 500;">${p.nombre}</span></td>
                        <td style="font-weight: bold; color: var(--color-exito);">$${p.price?.toFixed(2) || p.precio?.toFixed(2)}</td>
                        <td>
                            <span class="badge-custom ${claseStock}">
                                ${p.stock} uds
                            </span>
                        </td>
                        <td><span class="badge-custom badge-gris">ID: ${p.categoriaId}</span></td>
                        <td><span class="badge-custom badge-gris">ID: ${p.proveedorId}</span></td>
                        <td class="col-acciones">
                            <div class="grupo-botones-accion">
                                <button type="button" class="btn-accion-editar" onclick="prepararEdicion(${p.id}, '${p.nombre}', ${p.precio}, ${p.stock}, ${p.categoriaId}, ${p.proveedorId})">
                                    Editar
                                </button>
                                <button type="button" class="btn-accion-eliminar" onclick="eliminarProducto(${p.id})">
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }).catch(err => {
            console.error("Error conectando con la API SICONI:", err);
            document.getElementById("tablaProductosBody").innerHTML = `<tr><td colspan="7" class="text-center py-4" style="color: var(--color-peligro);">Error: Asegúrate de encender el Backend en IntelliJ.</td></tr>`;
        });
}


// LEER USUARIOS (para mostrar en el panel lateral)
function listarUsuarios() {
    fetch(`${API_URL}/usuarios`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("tablaUsuariosBody");
            tbody.innerHTML = "";
            data.forEach(u => {
                tbody.innerHTML += `
                    <tr>
                        <td class="col-id">${u.id}</td>
                        <td><i class="bi bi-person-circle me-2"></i><strong>${u.username}</strong></td>
                        <td><span class="badge bg-secondary">${u.rol}</span></td>
                    </tr>
                `;
            });
        }).catch(err => console.error("Error cargando usuarios:", err));
}

// Create / Update
function procesarFormulario(e) {
    e.preventDefault();
    const id = document.getElementById("productoId").value;
    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const categoriaId = parseInt(document.getElementById("categoriaId").value);
    const proveedorId = parseInt(document.getElementById("proveedorId").value);

    const dataPayload = { id: id ? parseInt(id) : null, nombre, precio, stock, categoriaId, proveedorId };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPayload)
    })
        .then(() => {
            limpiarFormulario();
            listarProductos();
        }).catch(err => console.error("Error al procesar la operación:", err));
}

function prepararEdicion(id, nombre, precio, stock, catId, provId) {
    document.getElementById("productoId").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("precio").value = precio;
    document.getElementById("stock").value = stock;
    document.getElementById("categoriaId").value = catId;
    document.getElementById("proveedorId").value = provId;

    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.className = "boton-siconi boton-primario";
    btnGuardar.innerText = "Actualizar Producto";

    document.getElementById("btnLimpiar").classList.remove("oculto");
}

function limpiarFormulario() {
    document.getElementById("formularioProducto").reset();
    document.getElementById("productoId").value = "";

    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.className = "boton-siconi boton-exito";
    btnGuardar.innerText = "Guardar Producto";

    document.getElementById("btnLimpiar").classList.add("oculto");
}

// DELETE
function eliminarProducto(id) {
    if (confirm("¿Seguro que desea remover este registro de SICONI?")) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(() => listarProductos())
            .catch(err => console.error("Error al eliminar:", err));
    }
}
