import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

function ProductoForm({ productoId, onClose, onSave }) {
  const [producto, setProducto] = useState({
    id_categoria: '',
    nombre_producto: '',
    precio_producto: '',
    fecha_expiracion_producto: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducto, setLoadingProducto] = useState(false);

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

    const fetchProducto = async () => {
      if (productoId) {
        setLoadingProducto(true);
        try {
          const response = await fetch(
            `http://localhost:4000/productos/${productoId}`
          );
          const data = await response.json();
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            setProducto(data); // Establece el producto a editar
          } else {
            console.error('Los datos de productos no son un array:', data);
          }
          setLoadingProducto(false);
        } catch (error) {
          console.error('Error al cargar producto:', error);
          setLoadingProducto(false);
        }
      }
    };

    fetchCategorias();
    fetchProducto();
  }, [productoId]);

  const validateForm = () => {
    const { id_categoria, nombre_producto, precio_producto, fecha_expiracion_producto } = producto;

    if (!id_categoria) {
      alertify.error('Debe seleccionar una categoría');
      return false;
    }

    if (!nombre_producto.trim()) {
      alertify.error('El campo nombre del producto no debe estar vacío');
      return false;
    }

    if (!precio_producto.trim()) {
      alertify.error('El campo precio no debe estar vacío');
      return false;
    }

    if (!/^\d+(\.\d+)?$/.test(precio_producto)) {
      alertify.error('El campo precio solo admite números y números flotantes con punto decimal');
      return false;
    }

    if (!fecha_expiracion_producto) {
      alertify.error('El campo fecha de expiración no debe estar vacío');
      return false;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    if (fecha_expiracion_producto <= currentDate) {
      alertify.error('La fecha de expiración no puede ser la fecha actual o una fecha pasada');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = productoId
        ? `http://localhost:4000/productos/${productoId}`
        : 'http://localhost:4000/productos';
      const method = productoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });

      if (response.ok) {
        alertify.success(`Producto ${productoId ? 'editado' : 'creado'} correctamente`);
        await response.json();
        onSave();
        onClose();
      } else {
        const result = await response.json();
        const errorMessage = result.message || 'Error al guardar el producto';
        alertify.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alertify.error('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none',
        padding: '1rem' // Añadido para mejorar el espacio en el formulario
      }}
    >
      <CardContent>
        {loadingProducto ? (
          <CircularProgress color="inherit" />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl variant="filled" fullWidth>
                  <InputLabel htmlFor="categoria-label" sx={{ color: 'black' }}>
                    Categoría
                  </InputLabel>
                  <Select
                    labelId="categoria-label"
                    variant="filled"
                    fullWidth
                    sx={{ marginBottom: '1rem' }}
                    name="id_categoria"
                    value={producto.id_categoria || ''}
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
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  label="Nombre Producto"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="nombre_producto"
                  value={producto.nombre_producto || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
              </Grid>
            </Grid>
            <TextField
              variant="filled"
              label="Precio"
              fullWidth
              sx={{ marginBottom: '1rem' }}
              name="precio_producto"
              value={producto.precio_producto || ''}
              onChange={handleChange}
              inputProps={{ style: { color: 'black' } }}
            />
            <TextField
              variant="filled"
              label="Fecha de Expiración"
              fullWidth
              sx={{ marginBottom: '1rem' }}
              name="fecha_expiracion_producto"
              type="date"
              value={producto.fecha_expiracion_producto || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { color: 'black' } }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                'Guardar'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductoForm;
