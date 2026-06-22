package com.sistema_inventario.Servicios;

import com.sistema_inventario.Entidades.Categoria;
import com.sistema_inventario.Entidades.Producto;
import com.sistema_inventario.Entidades.Proveedores;
import com.sistema_inventario.Entidades.Usuarios;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class InventarioServicios {

    private final List<Categoria> categorias = new ArrayList<>();
    private final List<Proveedores> proveedores = new ArrayList<>();
    private final List<Usuarios> usuarios = new ArrayList<>();
    private final List<Producto> productos = new ArrayList<>();

    private final AtomicLong productoIdCounter = new AtomicLong(3);

    public InventarioServicios() {
        categorias.add(new Categoria(1L, "Tecnología"));
        categorias.add(new Categoria(2L, "Oficina"));

        proveedores.add(new Proveedores(1L, "ASCOMSA", "0962514551"));
        proveedores.add(new Proveedores(2L, "IMPORTECO", "0985623145"));

        usuarios.add(new Usuarios(1L, "Juan Fernandez", "Administrador"));
        usuarios.add(new Usuarios(2L, "Pedro Cajas", "Asistente de Almacén"));

        productos.add(new Producto(1L, "Mouse Ergonómico RGB", 25.50, 30, 1L, 1L));
        productos.add(new Producto(2L, "Silla de Escritorio Ejecutiva", 145.00, 12, 2L, 2L));
    }

    // CRUD
    public List<Producto> obtenerTodosLosProductos() {
        return productos;
    }

    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productos.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    public Producto crearProducto(Producto nuevoProducto) {
        nuevoProducto.setId(productoIdCounter.getAndIncrement());
        productos.add(nuevoProducto);
        return nuevoProducto;
    }

    public Optional<Producto> actualizarProducto(Long id, Producto detalles) {
        for (int i = 0; i < productos.size(); i++) {
            Producto p = productos.get(i);
            if (p.getId().equals(id)) {
                p.setNombre(detalles.getNombre());
                p.setPrecio(detalles.getPrecio());
                p.setStock(detalles.getStock());
                p.setCategoriaId(detalles.getCategoriaId());
                p.setProveedorId(detalles.getProveedorId());
                return Optional.of(p);
            }
        }
        return Optional.empty();
    }

    public boolean eliminarProducto(Long id) {
        return productos.removeIf(p -> p.getId().equals(id));
    }

    //Obtener datos quemados
    public List<Usuarios> obtenerTodosLosUsuarios() {
        return usuarios;
    }
}
