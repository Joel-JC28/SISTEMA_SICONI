package com.sistema_inventario.RestController;

import com.sistema_inventario.Entidades.Producto;
import com.sistema_inventario.Entidades.Usuarios;
import com.sistema_inventario.Servicios.InventarioServicios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoControlador {

    @Autowired
    private InventarioServicios inventarioServicios;

    @GetMapping
    public List<Producto> obtenerTodos() {
        return inventarioServicios.obtenerTodosLosProductos();
    }

    @GetMapping("/usuarios")
    public List<Usuarios> obtenerUsuarios() {
        return inventarioServicios.obtenerTodosLosUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return inventarioServicios.obtenerProductoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        return inventarioServicios.crearProducto(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        return inventarioServicios.actualizarProducto(id, producto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (inventarioServicios.eliminarProducto(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
