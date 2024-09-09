import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';

function ProveedorForm({ proveedorId, onClose, onSave }) {
  const [proveedor, setProveedor] = useState({
    nombre_proveedor: '',
    correo_proveedor: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingProveedor, setLoadingProveedor] = useState(false);

  useEffect(() => {
    const fetchProveedor = async () => {
      if (proveedorId) {
        setLoadingProveedor(true);
        try {
          const response = await fetch(
            `http://localhost:4000/proveedores/${proveedorId}`
          );
          const data = await response.json();
          setProveedor({ ...data });
          setLoadingProveedor(false);
        } catch (error) {
          console.error('Error al cargar proveedor:', error);
          setLoadingProveedor(false);
          alertify.error('Error al cargar el proveedor');
        }
      }
    };

    fetchProveedor();
  }, [proveedorId]);

  const validateForm = () => {
    const { nombre_proveedor, correo_proveedor, telefono } = proveedor;

    if (!nombre_proveedor.trim()) {
      alertify.error('El campo nombre del proveedor no debe estar vacío');
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(nombre_proveedor)) {
      alertify.error('El nombre del proveedor solo puede contener letras y números');
      return false;
    }

    if (!correo_proveedor.trim()) {
      alertify.error('El campo correo no debe estar vacío');
      return false;
    }

    if (!/^[a-z]+@[a-z]+\.[a-z]+(\.[a-z]+)*$/.test(correo_proveedor)) {
      alertify.error('El correo no tiene un formato válido');
      return false;
    }

    if (!telefono.trim()) {
      alertify.error('El campo teléfono no debe estar vacío');
      return false;
    }

    if (!/^\d{10}$/.test(telefono)) {
      alertify.error('El teléfono debe contener solo números y tener 10 dígitos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = proveedorId
        ? `http://localhost:4000/proveedores/${proveedorId}`
        : 'http://localhost:4000/proveedores';
      const method = proveedorId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
      });

      if (response.ok) {
        alertify.success(`Proveedor ${proveedorId ? 'editado' : 'creado'} correctamente`);
        await response.json();
        onSave();
        onClose();
      } else {
        const result = await response.json();
        const errorMessage = result.message || 'Error al guardar el proveedor';
        alertify.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alertify.error('Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none'
      }}
    >
      <CardContent>
        {loadingProveedor ? (
          <CircularProgress color="inherit" />
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  label="Nombre Proveedor"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="nombre_proveedor"
                  value={proveedor.nombre_proveedor || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="filled"
                  label="Correo Proveedor"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="correo_proveedor"
                  value={proveedor.correo_proveedor || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="filled"
                  label="Teléfono"
                  fullWidth
                  sx={{ marginBottom: '1rem' }}
                  name="telefono"
                  value={proveedor.telefono || ''}
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ marginTop: '1rem' }}
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

export default ProveedorForm;
