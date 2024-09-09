import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

function ExistenciaForm({ onClose, onSave }) {
  const [existencia, setExistencia] = useState({
    id_categoria: '',
    id_producto: '',
    id_proveedor: '',
    stockinicial_existencia: '',
    preciocompra_existencia: '',
    precioventa_existencia: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const usuarioId = localStorage.getItem('usuarioId'); // Obtener el ID del usuario

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:4000/categorias');
        const data = await response.json();
        if (Array.isArray(data.categorias)) {
          setCategorias(data.categorias);
        } else {
          console.error('Los datos del proveedor no son un array:', data);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (existencia.id_categoria) {
      const fetchProductos = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/productos/categoria/${existencia.id_categoria}`
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setProductos(data);
          } else {
            console.error('Los datos de productos no son un array:', data);
          }
        } catch (error) {
          console.error('Error al cargar productos:', error);
        }
      };

      fetchProductos();
    }
  }, [existencia.id_categoria]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://localhost:4000/proveedores');
        const data = await response.json();
        if (Array.isArray(data.proveedores)) {
          setProveedores(data.proveedores);
        } else {
          console.error('Los datos del proveedor no son un array:', data);
        }
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  const validateForm = () => {
    const {
      id_categoria,
      id_proveedor,
      id_producto,
      stockinicial_existencia,
      preciocompra_existencia,
      precioventa_existencia
    } = existencia;

    if (!id_categoria) {
      alertify.error('Debe seleccionar una categoría');
      return false;
    }
    if (!id_producto) {
      alertify.error('Debe seleccionar un producto');
      return false;
    }
    if (!id_proveedor) {
      alertify.error('Debe seleccionar un proveedor');
      return false;
    }

    if (!/^\d+$/.test(stockinicial_existencia)) {
      alertify.error('El campo stock inicial solo admite números enteros y no debe estar vacío');
      return false;
    }

    if (!/^\d+(\.\d+)?$/.test(preciocompra_existencia)) {
      alertify.error('El campo precio compra solo admite números y números flotantes con punto decimal y no debe estar vacío');
      return false;
    }

    if (!/^\d+(\.\d+)?$/.test(precioventa_existencia)) {
      alertify.error('El campo precio venta solo admite números y números flotantes con punto decimal y no debe estar vacío');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/existencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...existencia,
          stockactual_existencia: existencia.stockinicial_existencia, // Set stockactual to stockinicial
          id_usuario: usuarioId // Incluir el ID del usuario en el cuerpo de la solicitud
        })
      });
      if (response.ok) {
        alertify.success('Existencia creada correctamente');
        await response.json();
        onSave();
        onClose();
      } else {
        const result = await response.json();
        const errorMessage = result.message || 'Error al guardar la existencia';
        alertify.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alertify.error('Error al guardar la existencia');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setExistencia({ ...existencia, [e.target.name]: e.target.value });
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="filled"
                label="Categoría"
                fullWidth
                select
                sx={{ marginBottom: '1rem' }}
                name="id_categoria"
                value={existencia.id_categoria}
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
              >
                {categorias.map((categoria) => (
                  <MenuItem
                    key={categoria.id_categoria}
                    value={categoria.id_categoria}
                  >
                    {categoria.nombre_categoria}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Producto"
                fullWidth
                select
                sx={{ marginBottom: '1rem' }}
                name="id_producto"
                value={existencia.id_producto}
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
                disabled={!existencia.id_categoria}
              >
                {productos.map((producto) => (
                  <MenuItem
                    key={producto.id_producto}
                    value={producto.id_producto}
                  >
                    {producto.nombre_producto}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Proveedor"
                fullWidth
                select
                sx={{ marginBottom: '1rem' }}
                name="id_proveedor"
                value={existencia.id_proveedor}
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
              >
                {proveedores.map((proveedor) => (
                  <MenuItem
                    key={proveedor.id_proveedor}
                    value={proveedor.id_proveedor}
                  >
                    {proveedor.nombre_proveedor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Stock Inicial"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="stockinicial_existencia"
                value={existencia.stockinicial_existencia}
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Precio Compra"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="preciocompra_existencia"
                value={existencia.preciocompra_existencia}
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="filled"
                label="Precio Venta"
                fullWidth
                sx={{ marginBottom: '1rem' }}
                name="precioventa_existencia"
                value={existencia.precioventa_existencia}
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
              />
            </Grid>
          </Grid>
          <Button variant="contained" fullWidth color="primary" type="submit">
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              'Guardar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ExistenciaForm;
